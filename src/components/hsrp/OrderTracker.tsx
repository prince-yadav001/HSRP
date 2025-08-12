
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Search } from "lucide-react";
import OrderDetails from "./OrderDetails";
import ProgressTracker from "./ProgressTracker";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";

interface OrderStatus {
  orderId: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  [key: string]: any;
}

const OrderTrackerContent = () => {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState("");
  const [booking, setBooking] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlOrderId = searchParams.get('orderId');
    if (urlOrderId) {
      setOrderId(urlOrderId);
      trackOrder(urlOrderId);
    }
  }, [searchParams]);

  const trackOrder = async (id: string) => {
    if (!id.trim()) {
      setError("Please enter a valid Order ID.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setBooking(null);

    try {
      const q = query(collection(db, "bookings"), where("orderId", "==", id.trim()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const foundBooking = querySnapshot.docs[0].data() as OrderStatus;
        setBooking(foundBooking);
      } else {
        setError("Order ID not found. Please check the ID and try again.");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("An error occurred while fetching your order.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    trackOrder(orderId);
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
  )
}


export default function OrderTracker() {
  return (
    <Suspense fallback={<div className="text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}>
      <OrderTrackerContent />
    </Suspense>
  )
}
