
"use server";

import {
  verifyPaymentProof,
} from "@/ai/flows/verify-payment-proof";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { z } from "zod";


const CreateBookingInputSchema = z.object({
  bookingData: z.any(),
  selectedCategory: z.string(),
  totalAmount: z.number(),
});


export async function createBooking(input: z.infer<typeof CreateBookingInputSchema>) {
  const { bookingData, selectedCategory, totalAmount } = CreateBookingInputSchema.parse(input);
  const newOrderId = `HSRP-${Date.now()}`;
  try {
    const newBooking = {
      orderId: newOrderId,
      ...bookingData,
      vehicleCategory: selectedCategory,
      amount: totalAmount,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      paymentProof: '',
      verificationReason: 'Awaiting payment proof upload.'
    };
    const docRef = await addDoc(collection(db, "bookings"), newBooking);
    return { success: true, orderId: newOrderId, bookingId: docRef.id };
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
    bookingId: z.string(),
    totalAmount: z.number(),
});

// Separate async function to handle the AI verification in the background.
async function triggerAiVerification(bookingId: string, paymentProofUrl: string, totalAmount: number, orderId: string) {
    const bookingDocRef = doc(db, "bookings", bookingId);
    try {
        const verificationResult = await verifyPaymentProof({
            paymentProofDataUri: paymentProofUrl,
            expectedAmount: totalAmount,
            orderId: orderId,
        });

        const finalStatus = verificationResult.isVerified ? "payment_verified" : "payment_rejected";
        await updateDoc(bookingDocRef, {
            status: finalStatus,
            verificationReason: verificationResult.reason,
            updatedAt: serverTimestamp(),
        });
        console.log(`AI verification completed for order ${orderId}. Status: ${finalStatus}`);
    } catch (aiError) {
        console.error(`AI verification failed for order ${orderId}:`, aiError);
        // Update the status to indicate a failure in the AI verification process
        await updateDoc(bookingDocRef, {
            status: 'payment_verification_failed',
            verificationReason: 'The AI verification process encountered an error.',
            updatedAt: serverTimestamp(),
        });
    }
}

export async function updateBookingWithPayment(input: z.infer<typeof UpdateBookingWithPaymentInputSchema>) {
    const { paymentProofUrl, orderId, bookingId, totalAmount } = UpdateBookingWithPaymentInputSchema.parse(input);
    
    try {
        const bookingDocRef = doc(db, "bookings", bookingId);
        // First, update the booking with the proof and set status to pending verification
        await updateDoc(bookingDocRef, {
            paymentProof: paymentProofUrl,
            status: 'payment_pending_verification',
            verificationReason: 'Payment proof uploaded. Awaiting AI verification.',
            updatedAt: serverTimestamp(),
        });

        // Trigger AI verification in the background (fire and forget)
        // This won't be awaited, so the user gets a fast response.
        triggerAiVerification(bookingId, paymentProofUrl, totalAmount, orderId);

        return { success: true };

    } catch (error) {
        console.error("Error during booking update:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: `Failed to update booking. ${errorMessage}` };
    }
}
