
import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";

interface PaymentSectionProps {
  onPrevious: () => void;
  bookingData: any;
  selectedCategory: string;
}

const vehicleCategoryMap = {
    bike: "Bike/Scooter",
    car: "Four Wheeler",
    electric: "Electric Vehicle",
    sticker: "Only Sticker",
    heavy: "Heavy Vehicle",
};

const vehiclePricing = {
    bike: 450,
    car: 1200,
    electric: 800,
    sticker: 200,
    heavy: 2500,
};

export default function PaymentSection({ onPrevious, bookingData, selectedCategory }: PaymentSectionProps) {
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
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
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setPaymentProof(file);
    }
  };

  const handleCompleteBooking = () => {
    if (!paymentProof) {
      toast({
        title: "Payment proof required",
        description: "Please upload payment proof to complete booking",
        variant: "destructive"
      });
      return;
    }

    setIsPending(true);
    setTimeout(() => {
        setOrderId(`HSRP-${Date.now()}`);
        setShowSuccess(true);
        setIsPending(false);
    }, 1500)

  };

  if (showSuccess) {
    return (
      <>
        <CardContent className="text-center p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Successful!</h2>
          <p className="text-gray-600 mb-6">Your HSRP booking has been submitted successfully.</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Order ID:</p>
            <p className="text-xl font-bold text-blue-600">{orderId}</p>
          </div>
          <div className="space-y-2 mb-6 text-sm text-gray-600">
            <p>• You will receive SMS and email confirmation shortly</p>
            <p>• Track your order status using the Order ID above</p>
            <p>• Expected delivery: 7-10 working days</p>
          </div>
          <div className="space-x-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href='/tracking'>Track Order</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700"
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
            <div className="bg-gray-50 p-4 rounded-lg">
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
              <div className="border-t border-gray-300 pt-2 mt-2">
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
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-4">
                 <Image
                    src="https://placehold.co/300x300.png"
                    alt="QR Code for Payment"
                    width={200}
                    height={200}
                    className="rounded-lg shadow-md mx-auto"
                    data-ai-hint="qr code"
                  />
                <p className="text-sm text-gray-600 mt-2 mb-2">Scan QR code to pay</p>
                <p className="text-lg font-bold text-green-600">₹{totalAmount}</p>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">After payment, upload payment proof below:</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <Upload className="text-2xl text-gray-400 mb-2 mx-auto" size={32} />
                  <p className="text-sm text-gray-600 mb-2">Upload payment screenshot</p>
                  <Label htmlFor="paymentProof" className="text-blue-600 font-semibold cursor-pointer">
                    Choose File
                  </Label>
                  <Input
                    type="file"
                    id="paymentProof"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {paymentProof && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {paymentProof.name}
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
            className="bg-gray-300 hover:bg-gray-400 text-gray-700"
          >
            Previous
          </Button>
          <Button
            onClick={handleCompleteBooking}
            disabled={isPending}
            className="bg-green-500 hover:bg-green-600"
          >
            <Check className="mr-2" size={16} />
            {isPending ? "Processing..." : "Complete Booking"}
          </Button>
        </div>
      </CardContent>
    </>
  );
}
