
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Cog, Search, Package, Truck, FlagIcon, CreditCard } from "lucide-react";

interface ProgressTrackerProps {
  booking: any;
}

const statusSteps = [
  {
    key: "pending",
    title: "Order Received",
    description: "Your order has been received and is being processed",
    icon: Check
  },
  {
    key: "payment_verified", 
    title: "Payment Verified",
    description: "Payment has been verified successfully",
    icon: CreditCard
  },
  {
    key: "in_production",
    title: "In Production", 
    description: "Your HSRP plates are being manufactured",
    icon: Cog
  },
  {
    key: "quality_check",
    title: "Quality Check",
    description: "Quality inspection and verification",
    icon: Search
  },
  {
    key: "ready_for_dispatch",
    title: "Ready for Dispatch",
    description: "Order packed and ready for shipment", 
    icon: Package
  },
  {
    key: "out_for_delivery",
    title: "Out for Delivery",
    description: "Your order is out for delivery",
    icon: Truck
  },
  {
    key: "delivered",
    title: "Delivered",
    description: "Order delivered successfully",
    icon: FlagIcon
  }
];

const getStatusIndex = (status: string) => {
  const statusOrder = ["pending", "payment_verified", "in_production", "quality_check", "ready_for_dispatch", "out_for_delivery", "delivered"];
  return statusOrder.indexOf(status);
};

export default function ProgressTracker({ booking }: ProgressTrackerProps) {
  const currentStatusIndex = getStatusIndex(booking.status);

  const orderDate = new Date(booking.createdAt);
  const estimatedDeliveryStart = new Date(orderDate);
  estimatedDeliveryStart.setDate(orderDate.getDate() + 7);
  const estimatedDeliveryEnd = new Date(orderDate);
  estimatedDeliveryEnd.setDate(orderDate.getDate() + 10);

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-xl">Order Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {statusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const IconComponent = step.icon;
            
            return (
              <div key={step.key} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? isCurrent 
                      ? 'bg-yellow-500' 
                      : 'bg-green-500'
                    : 'bg-gray-300'
                }`}>
                  <IconComponent 
                    className={`text-white text-sm ${
                      isCompleted ? 'text-white' : 'text-gray-500'
                    }`} 
                    size={16} 
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`font-semibold ${
                    isCompleted 
                      ? isCurrent 
                        ? 'text-yellow-600' 
                        : 'text-green-600'
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm ${
                    isCompleted ? 'text-muted-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.description}
                  </p>
                  {isCompleted && (
                    <p className="text-xs text-muted-foreground/80">
                      {isCurrent 
                        ? `Updated: ${new Date(booking.updatedAt).toLocaleString('en-IN')}`
                        : 'Completed'
                      }
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <Truck className="text-primary mr-3" size={20} />
            <div>
              <h3 className="font-semibold text-primary">Estimated Delivery</h3>
              <p className="text-sm text-muted-foreground">
                {estimatedDeliveryStart.toLocaleDateString('en-IN')} - {estimatedDeliveryEnd.toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
