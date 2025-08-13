
"use server";

import {
  verifyPaymentProof,
} from "@/ai/flows/verify-payment-proof";
import { db } from "@/lib/db";
import { bookings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";


const CreateBookingInputSchema = z.object({
  ownerFullName: z.string().min(1, "Full name is required"),
  ownerMobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  ownerEmail: z.string().email("Invalid email address"),
  ownerAadhaar: z.string().regex(/^\d{12}$/, "Invalid Aadhaar number"),
  ownerAddress: z.string().min(1, "Address is required"),
  ownerState: z.string().min(1, "State is required"),
  ownerPincode: z.string().regex(/^\d{6}$/, "Invalid PIN code"),
  vehicleRegistrationNumber: z.string().min(1, "Vehicle registration number is required"),
  engineNumber: z.string().min(1, "Engine number is required"),
  chassisNumber: z.string().min(1, "Chassis number is required"),
  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  manufacturingYear: z.string().min(1, "Manufacturing year is required"),
  selectedCategory: z.string(),
  totalAmount: z.number(),
});


export async function createBooking(input: z.infer<typeof CreateBookingInputSchema>) {
  const validation = CreateBookingInputSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input data.",
      issues: validation.error.issues,
    };
  }
  
  const { selectedCategory, totalAmount, ...bookingData } = validation.data;
  const newOrderId = `HSRP-${Date.now()}`;
  
  try {
    const newBookingData = {
      orderId: newOrderId,
      ...bookingData,
      vehicleCategory: selectedCategory,
      amount: totalAmount,
      status: 'pending',
      verificationReason: 'Awaiting payment proof upload.'
    };
    
    // Insert the booking without returning
    await db.insert(bookings).values(newBookingData);
    
    // Fetch the booking we just created using the unique orderId
    const newBooking = await db.query.bookings.findFirst({
        where: eq(bookings.orderId, newOrderId),
    });

    if (!newBooking) {
      throw new Error("Booking creation failed, could not find newly created booking.");
    }

    return { success: true, orderId: newBooking.orderId, bookingId: newBooking.id };

  } catch (error) {
     console.error("Booking creation failed:", error);
     const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
     return {
       success: false,
       error: `An unexpected error occurred during booking creation. ${errorMessage}`,
     };
  }
}

const UpdateBookingWithPaymentInputSchema = z.object({
    paymentProofUrl: z.string(),
    orderId: z.string(),
    bookingId: z.number(),
    totalAmount: z.number(),
});

// Separate async function to handle the AI verification in the background.
async function triggerAiVerification(bookingId: number, paymentProofUrl: string, totalAmount: number, orderId: string) {
    try {
        const verificationResult = await verifyPaymentProof({
            paymentProofDataUri: paymentProofUrl,
            expectedAmount: totalAmount,
            orderId: orderId,
        });

        const finalStatus = verificationResult.isVerified ? "payment_verified" : "payment_rejected";
        await db.update(bookings).set({
            status: finalStatus,
            verificationReason: verificationResult.reason,
            updatedAt: new Date(),
        }).where(eq(bookings.id, bookingId));

        console.log(`AI verification completed for order ${orderId}. Status: ${finalStatus}`);
    } catch (aiError) {
        console.error(`AI verification failed for order ${orderId}:`, aiError);
        // Update the status to indicate a failure in the AI verification process
        await db.update(bookings).set({
            status: 'payment_verification_failed',
            verificationReason: 'The AI verification process encountered an error.',
            updatedAt: new Date(),
        }).where(eq(bookings.id, bookingId));
    }
}

export async function updateBookingWithPayment(input: z.infer<typeof UpdateBookingWithPaymentInputSchema>) {
    const { paymentProofUrl, orderId, bookingId, totalAmount } = UpdateBookingWithPaymentInputSchema.parse(input);
    
    try {
        // First, update the booking with the proof and set status to pending verification
        await db.update(bookings).set({
            paymentProof: paymentProofUrl,
            status: 'payment_pending_verification',
            verificationReason: 'Payment proof uploaded. Awaiting AI verification.',
            updatedAt: new Date(),
        }).where(eq(bookings.id, bookingId));

        // Trigger AI verification in the background (fire and forget)
        triggerAiVerification(bookingId, paymentProofUrl, totalAmount, orderId);

        return { success: true };

    } catch (error) {
        console.error("Error during booking update:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: `Failed to update booking. ${errorMessage}` };
    }
}
