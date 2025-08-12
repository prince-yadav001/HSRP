"use client";

import { Suspense, useState, useTransition, type ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { PRICING_DATA } from "@/lib/constants";
import type { VehicleCategory } from "./VehicleIcon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { Loader2, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { handlePaymentVerification } from "@/app/booking/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  ownerName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
  vehicleRegNo: z.string().min(4, "Registration number is required."),
  chassisNo: z.string().length(17, "Chassis number must be 17 characters."),
  engineNo: z.string().min(5, "Engine number is required."),
  vehicleType: z.enum(
    PRICING_DATA.map((p) => p.category) as [VehicleCategory, ...VehicleCategory[]],
    { required_error: "Please select a vehicle type." }
  ),
});

type FormValues = z.infer<typeof formSchema>;

type VerificationResult = {
  isVerified: boolean;
  reason: string;
};

function BookingFormWrapper() {
  return (
    <Suspense fallback={<Loader2 className="mx-auto h-12 w-12 animate-spin" />}>
      <BookingForm />
    </Suspense>
  )
}

function BookingForm() {
  const searchParams = useSearchParams();
  const initialVehicleType = searchParams.get("vehicle");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormValues | null>(null);
  const [orderId, setOrderId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownerName: "",
      email: "",
      phone: "",
      vehicleRegNo: "",
      chassisNo: "",
      engineNo: "",
      vehicleType: (initialVehicleType as VehicleCategory) || undefined,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setFormData(data);
    setOrderId(`HSRP-${Date.now()}`);
    setStep(2);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !formData) return;

    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({
            title: "File too large",
            description: "Please upload an image smaller than 4MB.",
            variant: "destructive"
        });
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUri = reader.result as string;
      const expectedAmount =
        PRICING_DATA.find((p) => p.category === formData.vehicleType)?.price ?? 0;
      
      setVerificationResult(null);
      setVerificationError(null);

      startTransition(async () => {
        const result = await handlePaymentVerification({
          paymentProofDataUri: dataUri,
          expectedAmount,
          orderId,
        });

        if (result.success) {
          setVerificationResult(result.data);
        } else {
          setVerificationError(result.error);
        }
      });
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
            title: "File Read Error",
            description: "Could not process the uploaded file. Please try again.",
            variant: "destructive"
        });
    };
  };

  const selectedPrice = PRICING_DATA.find(
    (p) => p.category === form.watch("vehicleType")
  )?.price;

  if (step === 3) {
    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <CardTitle className="text-2xl font-headline">Booking Confirmed!</CardTitle>
                <CardDescription>Your payment has been verified and your order is placed.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <p className="text-lg">Your Order ID is:</p>
                <p className="text-2xl font-bold bg-primary/10 text-primary py-2 px-4 rounded-md inline-block">
                    {orderId}
                </p>
                <p className="text-muted-foreground">You can use this ID to track your order status. A confirmation has been sent to your email.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
                 <Button onClick={() => {
                     setStep(1);
                     form.reset();
                     setVerificationResult(null);
                     setVerificationError(null);
                 }}>
                     Place Another Order
                </Button>
            </CardFooter>
        </Card>
    )
  }

  if (step === 2 && formData) {
    return (
      <Card>
        <CardHeader>
          <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="self-start">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <CardTitle className="font-headline text-center">Step 2: Make Payment</CardTitle>
          <CardDescription className="text-center">
            Scan the QR code to complete your payment of{" "}
            <span className="font-bold text-primary">
              ₹{selectedPrice?.toLocaleString()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col items-center gap-4">
             <Image
                src="https://placehold.co/300x300.png"
                alt="QR Code for Payment"
                width={300}
                height={300}
                className="rounded-lg shadow-md"
                data-ai-hint="qr code"
              />
               <p className="text-sm text-muted-foreground text-center">Scan with any UPI app</p>
          </div>
          <div className="space-y-6">
             <div className="space-y-2">
                <h3 className="font-semibold text-lg">Upload Payment Proof</h3>
                 <Input id="paymentProof" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} disabled={isPending} />
                 <p className="text-xs text-muted-foreground">Please upload a screenshot of your successful payment.</p>
             </div>
             {isPending && (
                <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertTitle>Verifying Payment</AlertTitle>
                    <AlertDescription>
                        Our AI is checking your payment proof. This may take a moment.
                    </AlertDescription>
                </Alert>
             )}
            {verificationResult && (
                <Alert variant={verificationResult.isVerified ? "default" : "destructive"}>
                    {verificationResult.isVerified ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    <AlertTitle>{verificationResult.isVerified ? "Verification Successful" : "Verification Failed"}</AlertTitle>
                    <AlertDescription>{verificationResult.reason}</AlertDescription>
                </Alert>
            )}
             {verificationError && (
                 <Alert variant="destructive">
                     <XCircle className="h-4 w-4" />
                     <AlertTitle>Error</AlertTitle>
                     <AlertDescription>{verificationError}</AlertDescription>
                 </Alert>
             )}
            {verificationResult?.isVerified && (
                <Button className="w-full" size="lg" onClick={() => setStep(3)}>
                    Confirm Booking
                </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
          <CardTitle className="font-headline text-center">Step 1: Vehicle & Owner Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="ownerName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Owner Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                    >
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select vehicle category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {PRICING_DATA.map((item) => (
                            <SelectItem key={item.category} value={item.category}>
                            {item.category} - ₹{item.price}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="vehicleRegNo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Vehicle Registration No.</FormLabel>
                    <FormControl>
                        <Input placeholder="MH12AB1234" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="chassisNo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Chassis No. (Last 17 digits)</FormLabel>
                    <FormControl>
                        <Input placeholder="17-digit chassis number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="engineNo"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Engine No.</FormLabel>
                    <FormControl>
                        <Input placeholder="Engine number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="flex justify-end">
                <Button type="submit" size="lg">
                    Proceed to Payment (₹{selectedPrice?.toLocaleString() || '0'})
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default BookingFormWrapper;
