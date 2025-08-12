
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { vehicleCategoryMap } from "@/lib/constants";

interface OrderDetailsProps {
  booking: any;
}

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    payment_verified: "bg-blue-100 text-blue-800",
    in_production: "bg-orange-100 text-orange-800",
    quality_check: "bg-purple-100 text-purple-800",
    ready_for_dispatch: "bg-indigo-100 text-indigo-800",
    out_for_delivery: "bg-cyan-100 text-cyan-800",
    delivered: "bg-green-100 text-green-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const getStatusLabel = (status: string) => {
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

export default function OrderDetails({ booking }: OrderDetailsProps) {
  return (
    <Card className="mb-8 border">
      <CardHeader>
        <CardTitle className="text-xl">Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Order Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-semibold">{booking.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle Number:</span>
                <span className="font-semibold">{booking.vehicleRegistrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle Type:</span>
                <span className="font-semibold">
                  {vehicleCategoryMap[booking.vehicleCategory as keyof typeof vehicleCategoryMap]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-semibold">
                  {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-semibold text-green-600">₹{booking.amount}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-semibold">{booking.ownerFullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mobile:</span>
                <span className="font-semibold">{booking.ownerMobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-semibold">{booking.ownerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge className={getStatusColor(booking.status)}>
                  {getStatusLabel(booking.status)}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
