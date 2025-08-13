
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  IndianRupee,
  Eye,
  QrCode,
  Megaphone,
  MessageSquare,
  FileImage,
  CreditCard,
  Edit,
  Loader2,
  LogOut
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getBookings, updateBookingStatus } from "@/app/admin/actions";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "payment_verified", label: "Payment Verified" },
  { value: "in_production", label: "In Production" },
  { value: "quality_check", label: "Quality Check" },
  { value: "ready_for_dispatch", label: "Ready for Dispatch" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
];

const getStatusLabel = (status: string) => {
  const option = statusOptions.find(option => option.value === status);
  return option ? option.label : status.replace(/_/g, ' ');
};

const contacts = [
    {
        id: '1',
        name: 'Suresh Raina',
        email: 'suresh@example.com',
        subject: 'Query about delivery',
        createdAt: new Date().toISOString(),
        status: 'pending'
    }
];

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingsData, setBookingsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const result = await getBookings();
        setBookingsData(result);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to fetch bookings from the database.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [toast]);

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    const originalBookings = [...bookingsData];
    const updatedBookings = bookingsData.map(b => 
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    setBookingsData(updatedBookings);

    try {
      await updateBookingStatus({ bookingId, newStatus });

      toast({
        title: "Success",
        description: "Order status updated successfully."
      });
    } catch (error) {
      console.error("Error updating status:", error);
      setBookingsData(originalBookings); // Revert on error
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive"
      });
    }
  };
  
  const totalOrders = bookingsData.length;
  const pendingOrders = bookingsData.filter((b: any) => b.status !== 'delivered').length;
  const completedOrders = bookingsData.filter((b: any) => b.status === 'delivered').length;
  const totalRevenue = bookingsData.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);

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

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-IN');
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
            <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
            </Button>
        </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="text-primary text-xl" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total Orders</h3>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600 text-xl" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600 text-xl" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="text-green-600 text-xl" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
                <p className="text-2xl font-bold">₹{(totalRevenue / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Card className="border">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="orders" className="flex items-center">
                <ClipboardList className="mr-2" size={16} />
                Orders
              </TabsTrigger>
              <TabsTrigger value="qr" className="flex items-center">
                <QrCode className="mr-2" size={16} />
                QR Codes
              </TabsTrigger>
              <TabsTrigger value="announcements" className="flex items-center">
                <Megaphone className="mr-2" size={16} />
                Announcements
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center">
                <MessageSquare className="mr-2" size={16} />
                Contacts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders">
            <Card className="border-0">
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Order ID</th>
                        <th className="text-left p-2">Vehicle Number</th>
                        <th className="text-left p-2">Customer</th>
                        <th className="text-left p-2">Amount</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsData.map((booking: any) => (
                        <tr key={booking.id} className="border-b">
                          <td className="p-2 font-mono text-sm">{booking.orderId}</td>
                          <td className="p-2">{booking.vehicleRegistrationNumber}</td>
                          <td className="p-2">{booking.ownerFullName}</td>
                          <td className="p-2">₹{booking.amount}</td>
                          <td className="p-2">
                            <div className="flex flex-col gap-1">
                              <Badge className={getStatusColor(booking.status)}>
                                {getStatusLabel(booking.status)}
                              </Badge>
                              <Select
                                value={booking.status}
                                onValueChange={(value) => handleStatusChange(booking.id, value)}
                              >
                                <SelectTrigger className="w-full h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </td>
                           <td className="p-2">{formatTimestamp(booking.createdAt)}</td>
                          <td className="p-2">
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedBooking(booking)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Order Details - {booking.orderId}</DialogTitle>
                                  </DialogHeader>
                                  {selectedBooking && selectedBooking.id === booking.id && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <h3 className="font-semibold mb-3">Order Information</h3>
                                        <div className="space-y-2 text-sm">
                                          <div><strong>Vehicle:</strong> {selectedBooking.vehicleRegistrationNumber}</div>
                                          <div><strong>Owner:</strong> {selectedBooking.ownerFullName}</div>
                                          <div><strong>Mobile:</strong> {selectedBooking.ownerMobile}</div>
                                          <div><strong>Email:</strong> {selectedBooking.ownerEmail}</div>
                                          <div><strong>Address:</strong> {selectedBooking.ownerAddress}</div>
                                          <div><strong>Category:</strong> {selectedBooking.vehicleCategory}</div>
                                          <div><strong>Amount:</strong> ₹{selectedBooking.amount}</div>
                                          <div><strong>Status:</strong>
                                            <Badge className={`ml-2 ${getStatusColor(selectedBooking.status)}`}>
                                              {getStatusLabel(selectedBooking.status)}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="font-semibold mb-3">Payment Proof</h3>
                                        {selectedBooking.paymentProof ? (
                                          <div className="border rounded-lg p-4">
                                            <a
                                                href={selectedBooking.paymentProof}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                              >
                                                <img
                                                  src={selectedBooking.paymentProof}
                                                  alt="Payment Proof"
                                                  className="max-w-full h-auto rounded"
                                                />
                                                <div className="mt-2 text-center">
                                                    View Full Size
                                                </div>
                                             </a>
                                          </div>
                                        ) : (
                                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                            <FileImage className="mx-auto text-gray-400 mb-2" size={48} />
                                            <p className="text-gray-500">No payment proof uploaded</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              <Button size="sm" variant="outline">
                                <QrCode className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">QR Code Management</h2>
              <Button>
                Generate New QR
              </Button>
            </div>
            <div className="text-center py-8 text-muted-foreground">
              QR code management functionality will be implemented here.
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Site Announcements</h2>
              <Button>
                New Announcement
              </Button>
            </div>
            <div className="text-center py-8 text-muted-foreground">
              Announcements management functionality will be implemented here.
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="p-6">
            <h2 className="text-xl font-bold mb-6">Contact Submissions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subject</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {contacts.map((contact: any) => (
                    <tr key={contact.id}>
                      <td className="px-4 py-3">{contact.name}</td>
                      <td className="px-4 py-3">{contact.email}</td>
                      <td className="px-4 py-3">{contact.subject}</td>
                      <td className="px-4 py-3">
                        {new Date(contact.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={contact.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                          {contact.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-500">
                            <Edit size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

    