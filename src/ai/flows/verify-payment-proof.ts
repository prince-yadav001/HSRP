'use server';

/**
 * @fileOverview AI flow for automatically verifying payment proofs uploaded by users.
 *
 * - verifyPaymentProof - A function that handles the payment proof verification process.
 * - VerifyPaymentProofInput - The input type for the verifyPaymentProof function.
 * - VerifyPaymentProofOutput - The return type for the verifyPaymentProof function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyPaymentProofInputSchema = z.object({
  paymentProofDataUri: z
    .string()
    .describe(
      "The payment proof image, which can be a public URL or a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  expectedAmount: z.number().describe('The expected payment amount.'),
  orderId: z.string().describe('The ID of the order associated with the payment.'),
});
export type VerifyPaymentProofInput = z.infer<typeof VerifyPaymentProofInputSchema>;

const VerifyPaymentProofOutputSchema = z.object({
  isVerified: z.boolean().describe('Whether the payment proof is verified or not.'),
  reason: z.string().describe('The reason for the verification result.'),
});
export type VerifyPaymentProofOutput = z.infer<typeof VerifyPaymentProofOutputSchema>;

export async function verifyPaymentProof(input: VerifyPaymentProofInput): Promise<VerifyPaymentProofOutput> {
  return verifyPaymentProofFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyPaymentProofPrompt',
  input: {schema: VerifyPaymentProofInputSchema},
  output: {schema: VerifyPaymentProofOutputSchema},
  prompt: `You are an expert payment verification specialist.

You will analyze the provided payment proof image and determine if it is a valid proof of payment for the specified amount and order.

The user has paid {{expectedAmount}}. Look for this amount in the proof.
The Order ID is {{orderId}}. This may or may not be present in the proof.

Consider the following factors:
- Clarity and legibility of the image.
- Presence of key information such as amount paid, date, and transaction ID.
- Consistency of the information with the expected amount.
- Any obvious signs of tampering or fraud.

Based on your analysis, set the isVerified output field to true if the payment proof is valid, and false otherwise. Provide a detailed reason for your decision in the reason output field. If you approve, the reason should be "Payment confirmed via AI.". If you reject, explain why (e.g., "Amount does not match expected value.", "Image is blurry.").

Payment Proof Image: {{media url=paymentProofDataUri}}
Expected Amount: {{{expectedAmount}}}
Order ID: {{{orderId}}}`,
});

const verifyPaymentProofFlow = ai.defineFlow(
  {
    name: 'verifyPaymentProofFlow',
    inputSchema: VerifyPaymentProofInputSchema,
    outputSchema: VerifyPaymentProofOutputSchema,
  },
  async input => {
    // Add a small delay to simulate processing, as local verification can be too fast.
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const {output} = await prompt(input);
      if (!output) {
        return {
          isVerified: false,
          reason: 'AI model did not return a valid response.'
        }
      }
      return output;
    } catch (e) {
       console.error("AI verification flow failed", e);
       return {
         isVerified: false,
         reason: 'An error occurred during AI processing.'
       }
    }
  }
);
