
"use server";

import {
  verifyPaymentProof,
  type VerifyPaymentProofInput,
} from "@/ai/flows/verify-payment-proof";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, updateDoc, doc, query, where, getDocs } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { z } from "zod";

const ActionInputSchema = z.object({
  paymentProofDataUri: z.string(),
  expectedAmount: z.number(),
  orderId: z.string(),
});

export async function handlePaymentVerification(
  input: VerifyPaymentProofInput
) {
  try {
    console.log("Starting AI Verification for order:", input.orderId);
    const validatedInput = ActionInputSchema.parse(input);
    const result = await verifyPaymentProof(validatedInput);
    console.log("AI Verification Result:", result);

    if (result.isVerified) {
      console.log(`Payment verified for ${input.orderId}. Updating status.`);
      const q = query(collection(db, "bookings"), where("orderId", "==", input.orderId));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { 
            status: "payment_verified", 
            updatedAt: serverTimestamp(),
            verificationReason: result.reason 
        });
        console.log(`Status updated for ${input.orderId}`);
      } else {
         console.log(`Order ${input.orderId} not found in database.`);
      }
    } else {
        console.log(`Payment not verified for ${input.orderId}. Reason: ${result.reason}`);
        const q = query(collection(db, "bookings"), where("orderId", "==", input.orderId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            await updateDoc(docRef, { 
                verificationReason: `Verification failed: ${result.reason}`,
                updatedAt: serverTimestamp(),
            });
        }
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Verification background process failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      error: `An unexpected error occurred during verification. ${errorMessage}`,
    };
  }
}

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

const UploadVerificationInputSchema = z.object({
    paymentProofDataUri: z.string(),
    totalAmount: z.number(),
    orderId: z.string(),
    bookingId: z.string()
});

export async function handlePaymentUploadAndVerification(input: z.infer<typeof UploadVerificationInputSchema>) {
    const { paymentProofDataUri, totalAmount, orderId, bookingId } = UploadVerificationInputSchema.parse(input);
    try {
        const storageRef = ref(storage, `payment_proofs/${orderId}.png`);
        const uploadResult = await uploadString(storageRef, paymentProofDataUri, 'data_url');
        const paymentProofUrl = await getDownloadURL(uploadResult.ref);

        const bookingDocRef = doc(db, "bookings", bookingId);
        await updateDoc(bookingDocRef, {
            paymentProof: paymentProofUrl,
            updatedAt: serverTimestamp(),
            verificationReason: 'Awaiting AI verification'
        });

        // This can still be fire-and-forget as it doesn't block the main thread
        // of this server action, and the action itself is short-lived.
        handlePaymentVerification({
            paymentProofDataUri,
            expectedAmount: totalAmount,
            orderId: orderId,
        });

        return { success: true };

    } catch (uploadError) {
        console.error("Error during upload/verification:", uploadError);
        try {
            const bookingDocRef = doc(db, "bookings", bookingId);
            await updateDoc(bookingDocRef, {
                status: "upload_failed",
                verificationReason: "Failed to upload or verify payment proof.",
                updatedAt: serverTimestamp(),
            });
        } catch(docError) {
            console.error("Error updating document status to failed:", docError);
        }
        
        const errorMessage = uploadError instanceof Error ? uploadError.message : "An unknown error occurred.";
        return {
          success: false,
          error: `Failed to upload payment proof. ${errorMessage}`,
        };
    }
}
