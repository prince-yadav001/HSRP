
"use client";

import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { vehicleCategoryMap, vehiclePricing } from "@/lib/constants";
import { createBooking, updateBookingWithPayment } from "@/app/booking/actions";

// In a real app, this would be a proper storage client to upload to S3, GCS, etc.
// For this demo, we'll simulate an upload and return a placeholder URL.
async function uploadFile(file: File, orderId: string): Promise<string> {
  console.log(`Uploading file ${file.name} for order ${orderId}`);
  // Simulate network delay for upload
  await new Promise(resolve => setTimeout(resolve, 1500)); 
  // In a real app, you would get a public URL from your storage service.
  // Using a placeholder that includes the order ID to simulate uniqueness.
  return `https://placehold.co/600x400.png?text=ProofFor-${orderId}`;
}


interface PaymentSectionProps {
  onPrevious: () => void;
  bookingData: any;
  selectedCategory: string;
}

export default function PaymentSection({ onPrevious, bookingData, selectedCategory }: PaymentSectionProps) {
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  // Calculate pricing
  const baseAmount = vehiclePricing[selectedCategory as keyof typeof vehiclePricing] || 0;
  const processingFees = 50;
  const gst = Math.round((baseAmount + processingFees) * 0.18);
  const totalAmount = baseAmount + processingFees + gst;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setPaymentProofFile(file);
    }
  };

  const handleCompleteBooking = async () => {
    if (!paymentProofFile) {
      toast({
        title: "Payment proof required",
        description: "Please upload payment proof to complete booking",
        variant: "destructive"
      });
      return;
    }

    setIsPending(true);

    try {
      // Step 1: Create the booking document to get an ID
      const bookingResult = await createBooking({
        ...bookingData,
        selectedCategory,
        totalAmount,
      });

      if (!bookingResult.success || !bookingResult.orderId || !bookingResult.bookingId) {
        toast({
          title: "Booking Failed",
          description: bookingResult.error || "Could not create booking record.",
          variant: "destructive",
        });
        setIsPending(false);
        return;
      }
      
      const newOrderId = bookingResult.orderId;
      const newBookingId = bookingResult.bookingId;
      setOrderId(newOrderId); // Set orderId for success screen

      // Step 2: Upload file.
      const paymentProofUrl = await uploadFile(paymentProofFile, newOrderId);

      // Step 3: Update the booking with the payment proof URL and trigger AI verification
      const updateResult = await updateBookingWithPayment({
          paymentProofUrl,
          orderId: newOrderId,
          bookingId: newBookingId,
          totalAmount
      });

      if (!updateResult.success) {
          throw new Error(updateResult.error || "Failed to update booking with payment proof.");
      }
      
      setShowSuccess(true); 

    } catch (error) {
      console.error("Booking failed:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Booking Failed",
        description: `There was an error submitting your booking: ${errorMessage}`,
        variant: "destructive"
      });
      setShowSuccess(false);
    } finally {
      setIsPending(false);
    }
  };

  if (showSuccess) {
    return (
      <>
        <CardContent className="text-center p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Submitted!</h2>
          <p className="text-muted-foreground mb-6">Your HSRP booking has been received and is being processed.</p>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <p className="text-sm text-muted-foreground mb-2">Your Order ID:</p>
            <p className="text-xl font-bold text-primary">{orderId}</p>
          </div>
          <div className="space-y-2 mb-6 text-sm text-muted-foreground">
            <p>• Payment verification is in progress.</p>
            <p>• Track your order status using the Order ID above.</p>
            <p>• Expected delivery: 7-10 working days.</p>
          </div>
          <div className="space-x-4">
            <Button asChild>
              <Link href={`/tracking?mobile=${bookingData.ownerMobile}`}>Track Order</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              New Booking
            </Button>
          </div>
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Vehicle Category:</span>
                <span className="font-semibold">
                  {vehicleCategoryMap[selectedCategory as keyof typeof vehicleCategoryMap]}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>HSRP Fees:</span>
                <span className="font-semibold">₹{baseAmount}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Processing Fees:</span>
                <span className="font-semibold">₹{processingFees}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>GST (18%):</span>
                <span className="font-semibold">₹{gst}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount:</span>
                  <span className="text-lg font-bold text-green-600">₹{totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Payment */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="text-center">
              <div className="bg-white border rounded-lg p-6 mb-4">
                 <Image
                    src="https://placehold.co/300x300.png"
                    alt="QR Code for Payment"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-md mx-auto"
                    data-ai-hint="qr code"
                  />
                <p className="text-sm text-muted-foreground mt-2 mb-2">Scan QR code to pay</p>
                <p className="text-lg font-bold text-green-600">₹{totalAmount}</p>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">After payment, upload payment proof below:</p>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <Upload className="text-2xl text-muted-foreground mb-2 mx-auto" size={32} />
                  <p className="text-sm text-muted-foreground mb-2">Upload payment screenshot</p>
                  <Label htmlFor="paymentProof" className="text-primary font-semibold cursor-pointer">
                    Choose File
                  </Label>
                  <Input
                    type="file"
                    id="paymentProof"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  {paymentProofFile && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {paymentProofFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isPending}
          >
            Previous
          </Button>
          <Button
            onClick={handleCompleteBooking}
            disabled={isPending || !paymentProofFile}
            className="bg-green-500 hover:bg-green-600"
          >
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2" size={16} />}
            {isPending ? "Processing..." : "Complete Booking"}
          </Button>
        </div>
      </CardContent>
    </>
  );
}
