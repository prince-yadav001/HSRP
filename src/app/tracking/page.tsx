
"use client";

import OrderTracker from "@/components/hsrp/OrderTracker";

export default function TrackingPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
          Track Your HSRP Orders
        </h1>
        <p className="text-lg text-muted-foreground">
          Enter your registered mobile number below to see the current status of all your High
          Security Registration Plate orders.
        </p>
      </div>

      <div className="mt-12">
        <OrderTracker />
      </div>
    </div>
  );
}
