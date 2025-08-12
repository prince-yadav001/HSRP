
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import OrderDetails from "./OrderDetails";
import ProgressTracker from "./ProgressTracker";
import { ORDER_STATUSES } from "@/lib/constants";

interface OrderStatus {
  orderId: string;
  currentStatus: string;
  history: {
    status: string;
    date: string;
  }[];
  [key: string]: any;
}

const mockOrderStatus = (orderId: string): OrderStatus => {
  const statuses = ORDER_STATUSES.map(s => s.name);
  const hash = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const currentIndex = Math.max(1, hash % statuses.length);

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
    vehicleRegistrationNumber: "DL1C" + orderId.slice(-4),
    vehicleCategory: "Car/SUV",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    amount: 1200,
    ownerFullName: "Demo User",
    ownerMobile: "9876543210",
    ownerEmail: "demo@example.com",
    status: statuses[currentIndex]
  };
};

export default function OrderTracker() {
  const [orderId, setOrderId] = useState("");
  const [booking, setBooking] = useState<OrderStatus | null>(null);
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
    setBooking(null);

    // Simulate API call
    setTimeout(() => {
      if (orderId.toUpperCase().startsWith("HSRP-")) {
        setBooking(mockOrderStatus(orderId));
      } else {
        setError("Order ID not found. Please check the ID and try again.");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Enter Order ID</CardTitle>
        <CardDescription>
          Your Order ID was provided upon booking confirmation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTrackOrder} className="flex items-center gap-2 max-w-md mx-auto">
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

        {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
        
        {booking && (
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div>
              <OrderDetails booking={booking} />
            </div>
            <div>
              <ProgressTracker booking={booking} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
