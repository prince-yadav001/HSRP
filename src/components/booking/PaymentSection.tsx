
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
import { createBooking, handlePaymentUploadAndVerification } from "@/app/booking/actions";

interface PaymentSectionProps {
  onPrevious: () => void;
  bookingData: any;
  selectedCategory: string;
}

// Helper to convert file to Data URI
const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });


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
        bookingData,
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

      setOrderId(bookingResult.orderId);
      setShowSuccess(true); // Show success UI immediately

      // Step 2: Handle file upload and AI verification in the background
      const paymentProofDataUri = await toDataURL(paymentProofFile);
      handlePaymentUploadAndVerification({
          paymentProofDataUri,
          totalAmount,
          orderId: bookingResult.orderId,
          bookingId: bookingResult.bookingId
      }).then(uploadResult => {
          if(!uploadResult.success) {
              console.error("Background upload failed:", uploadResult.error);
              // Optional: You could use a websocket or other mechanism to notify
              // the user of this background failure, but for now we just log it.
          }
      });

    } catch (error) {
      console.error("Booking failed:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive"
      });
      setShowSuccess(false); // Hide success UI if it failed
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
              <Link href={`/tracking?orderId=${orderId}`}>Track Order</Link>
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
