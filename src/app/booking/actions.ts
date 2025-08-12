
"use server";

import {
  verifyPaymentProof,
  type VerifyPaymentProofInput,
} from "@/ai/flows/verify-payment-proof";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
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
    const validatedInput = ActionInputSchema.parse(input);
    const result = await verifyPaymentProof(validatedInput);

    // This part runs in the background and doesn't block the user.
    // Here you could update the order status in Firestore based on verification.
    // For now, we'll just log the result.
    console.log("AI Verification Result:", result);

    // Example of updating Firestore (optional, can be done here or in another process)
    // if (result.isVerified) {
    //   const q = query(collection(db, "bookings"), where("orderId", "==", input.orderId));
    //   const querySnapshot = await getDocs(q);
    //   if (!querySnapshot.empty) {
    //     const docRef = querySnapshot.docs[0].ref;
    //     await updateDoc(docRef, { status: "payment_verified", updatedAt: serverTimestamp() });
    //   }
    // }

    return { success: true, data: result };
  } catch (error) {
    console.error("Verification failed:", error);
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
      status: 'pending', // Status is pending until AI verification
      createdAt: new Date(), // Use current date, Firestore will convert it
      updatedAt: new Date(), // Use current date
      paymentProof: '', // Will be updated after upload
    };

    const docRef = await addDoc(collection(db, "bookings"), newBooking);

    // 2. Upload payment proof to Firebase Storage in the background (don't await)
    const uploadAndUpdate = async () => {
      try {
        const storageRef = ref(storage, `payment_proofs/${newOrderId}_${Date.now()}`);
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
        console.error("Error during upload/verification:", uploadError);
      }
    };
    
    uploadAndUpdate(); // Fire and forget

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
