"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import OrderStatusTimeline from "./OrderStatusTimeline";
import { ORDER_STATUSES } from "@/lib/constants";

interface OrderStatus {
  orderId: string;
  currentStatus: string;
  history: {
    status: string;
    date: string;
  }[];
}

const mockOrderStatus = (orderId: string): OrderStatus => {
  const statuses = ORDER_STATUSES.map(s => s.name);
  // Simple hash to get a consistent "random" index based on Order ID
  const hash = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Ensure the status is at least 'Payment Verified' and not beyond 'Delivered'
  const currentIndex = (hash % (statuses.length - 1)) + 1;

  const history = statuses.slice(0, currentIndex + 1).map((status, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (currentIndex - index));
      date.setHours(date.getHours() - index * 3);
      return { status, date: date.toISOString() };
  });

  return {
    orderId,
    currentStatus: statuses[currentIndex],
    history: history.reverse(),
  };
};

export default function OrderTracker() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
        setError("Please enter a valid Order ID.");
        return;
    }
    setError(null);
    setIsLoading(true);
    setStatus(null);

    // Simulate API call
    setTimeout(() => {
      if (orderId.toUpperCase().startsWith("HSRP-")) {
        setStatus(mockOrderStatus(orderId));
      } else {
        setError("Order ID not found. Please check the ID and try again.");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Enter Order ID</CardTitle>
        <CardDescription>
          Your Order ID was provided upon booking confirmation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTrackOrder} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="e.g., HSRP-123456789"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2 h-4 w-4" />
            )}
            Track
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        {status && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-center mb-2">
              Order Status for #{status.orderId}
            </h3>
            <p className="text-center text-primary font-bold text-xl mb-6">
                {status.currentStatus}
            </p>
            <OrderStatusTimeline history={status.history} currentStatus={status.currentStatus} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
