
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
  paymentProofDataUri: z.string(),
});

export async function createBookingAndVerifyPayment(input: z.infer<typeof CreateBookingInputSchema>) {
  const { bookingData, selectedCategory, totalAmount, paymentProofDataUri } =
    CreateBookingInputSchema.parse(input);

  const newOrderId = `HSRP-${Date.now()}`;

  try {
    // 1. Save booking data to Firestore immediately
    const newBooking = {
      orderId: newOrderId,
      ...bookingData,
      vehicleCategory: selectedCategory,
      amount: totalAmount,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      paymentProof: '', 
      verificationReason: 'Awaiting AI verification'
    };

    const docRef = await addDoc(collection(db, "bookings"), newBooking);

    // 2. Start background tasks: upload payment proof and trigger AI verification
    const uploadAndUpdate = async () => {
      try {
        const storageRef = ref(storage, `payment_proofs/${newOrderId}.png`);
        const uploadResult = await uploadString(storageRef, paymentProofDataUri, 'data_url');
        const paymentProofUrl = await getDownloadURL(uploadResult.ref);

        // Update the document with the storage URL
        const bookingDocRef = doc(db, "bookings", docRef.id);
        await updateDoc(bookingDocRef, {
            paymentProof: paymentProofUrl,
            updatedAt: serverTimestamp(),
        });
        
        // 3. Trigger AI verification in the background
        handlePaymentVerification({
          paymentProofDataUri,
          expectedAmount: totalAmount,
          orderId: newOrderId,
        });

      } catch (uploadError) {
        console.error("Error during background upload/verification:", uploadError);
        // Optionally, update the booking status to indicate an error
        const bookingDocRef = doc(db, "bookings", docRef.id);
        await updateDoc(bookingDocRef, {
            status: "upload_failed",
            verificationReason: "Failed to upload or verify payment proof.",
            updatedAt: serverTimestamp(),
        });
      }
    };
    
    uploadAndUpdate(); // Fire and forget, don't await

    return { success: true, orderId: newOrderId };

  } catch (error) {
    console.error("Booking creation failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      error: `An unexpected error occurred during booking creation. ${errorMessage}`,
    };
  }
}
