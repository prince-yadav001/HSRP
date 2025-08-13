
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Search, Phone, ChevronRight, List } from "lucide-react";
import OrderDetails from "./OrderDetails";
import ProgressTracker from "./ProgressTracker";
import { Badge } from "../ui/badge";
import { getBookingsByMobile } from "@/app/tracking/actions";


interface Order {
  id: number;
  orderId: string;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  [key: string]: any;
}

const getStatusLabel = (status: string | null) => {
    if (!status) return "Unknown";
    const labels: { [key: string]: string } = {
      pending: "Pending",
      payment_verified: "Payment Verified",
      in_production: "In Production",
      quality_check: "Quality Check",
      ready_for_dispatch: "Ready for Dispatch",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered"
    };
    return labels[status] || status;
  };

const OrderTrackerContent = () => {
  const searchParams = useSearchParams();
  const [mobileNumber, setMobileNumber] = useState("");
  const [foundBookings, setFoundBookings] = useState<Order[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlMobile = searchParams.get('mobile');
    if (urlMobile) {
      setMobileNumber(urlMobile);
      trackOrdersByMobile(urlMobile);
    }
  }, [searchParams]);

  const trackOrdersByMobile = async (mobile: string) => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setFoundBookings([]);
    setSelectedBooking(null);

    try {
      const results = await getBookingsByMobile(mobile.trim());
      
      if (results.length > 0) {
        setFoundBookings(results as Order[]);
      } else {
        setError("No orders found for this mobile number. Please check the number and try again.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("An error occurred while fetching your orders.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    trackOrdersByMobile(mobileNumber);
  };

  const handleSelectBooking = (booking: Order) => {
    if (selectedBooking?.id === booking.id) {
        setSelectedBooking(null); // Allow deselecting
    } else {
        setSelectedBooking(booking);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">Enter Mobile Number</CardTitle>
        <CardDescription>
          Track all your orders using your registered mobile number.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTrackOrder} className="flex items-center gap-2 max-w-md mx-auto">
          <div className="relative flex-grow">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="tel"
              placeholder="10-digit mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="pl-10"
              maxLength={10}
            />
          </div>
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
        
        {foundBookings.length > 0 && (
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center"><List className="mr-2 h-5 w-5" /> Your Orders ({foundBookings.length})</h3>
                <div className="border rounded-md">
                    {foundBookings.map(booking => (
                        <div key={booking.id} className="border-b last:border-b-0">
                             <div 
                                className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted/50"
                                onClick={() => handleSelectBooking(booking)}
                            >
                                <div>
                                    <p className="font-semibold">{booking.orderId}</p>
                                    <p className="text-sm text-muted-foreground">{booking.vehicleRegistrationNumber}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <Badge variant={booking.status === 'delivered' ? 'default' : 'secondary'}>{getStatusLabel(booking.status)}</Badge>
                                    <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${selectedBooking?.id === booking.id ? 'rotate-90' : ''}`} />
                                </div>
                            </div>
                            {selectedBooking?.id === booking.id && (
                                 <div className="p-4 bg-muted/20 border-t">
                                     <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <OrderDetails booking={selectedBooking} />
                                        </div>
                                        <div>
                                            <ProgressTracker booking={selectedBooking} />
                                        </div>
                                    </div>
                                 </div>
                            )}
                        </div>
                    ))}
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

    