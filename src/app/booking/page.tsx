
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import VehicleSelection from "@/components/booking/VehicleSelection";
import VehicleDetails from "@/components/booking/VehicleDetails";
import OwnerDetails from "@/components/booking/OwnerDetails";
import PaymentSection from "@/components/booking/PaymentSection";

// Multi-step form state management
export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [bookingData, setBookingData] = useState({});

  const handleNextStep = (data: any) => {
    setBookingData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <VehicleSelection
            selectedCategory={selectedCategory}
            onSelect={handleSelectCategory}
          />
        );
      case 2:
        return (
          <VehicleDetails
            initialData={bookingData}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 3:
        return (
          <OwnerDetails
            initialData={bookingData}
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
          />
        );
      case 4:
        return (
          <PaymentSection
            bookingData={bookingData}
            selectedCategory={selectedCategory}
            onPrevious={handlePreviousStep}
          />
        );
      default:
        return (
          <VehicleSelection
            selectedCategory={selectedCategory}
            onSelect={handleSelectCategory}
          />
        );
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <Card className="border border-gov-border">{renderStep()}</Card>
    </div>
  );
}
