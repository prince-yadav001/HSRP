import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Badge } from "@/components/ui/badge";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  import { MoreHorizontal } from "lucide-react";
  
  const mockOrders = [
    {
      orderId: "HSRP-16888999",
      customerName: "Alice Johnson",
      vehicleNo: "MH12AB1234",
      status: "In Production",
    },
    {
      orderId: "HSRP-16888998",
      customerName: "Bob Williams",
      vehicleNo: "DL3CAD5678",
      status: "Payment Verified",
    },
    {
      orderId: "HSRP-16888997",
      customerName: "Charlie Brown",
      vehicleNo: "KA01EF9012",
      status: "Out for Delivery",
    },
    {
      orderId: "HSRP-16888996",
      customerName: "Diana Miller",
      vehicleNo: "TN22GH3456",
      status: "Delivered",
    },
    {
      orderId: "HSRP-16888995",
      customerName: "Ethan Davis",
      vehicleNo: "GJ05JK7890",
      status: "Quality Check",
    },
  ];
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "Delivered":
        return "default";
      case "Out for Delivery":
        return "secondary";
      case "In Production":
        return "outline";
      default:
        return "destructive";
    }
  };
  
  export default function AdminDashboardPage() {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage and monitor all HSRP orders.
          </p>
        </div>
  
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Vehicle No.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.vehicleNo}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  