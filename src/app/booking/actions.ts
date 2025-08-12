"use server";

import {
  verifyPaymentProof,
  type VerifyPaymentProofInput,
} from "@/ai/flows/verify-payment-proof";
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
