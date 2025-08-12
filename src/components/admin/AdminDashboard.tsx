
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  IndianRupee,
  Eye,
  Edit,
  QrCode,
  Megaphone,
  MessageSquare,
  FileImage,
  CreditCard
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

// Define the possible status options
const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "payment_verified", label: "Payment Verified" },
  { value: "in_production", label: "In Production" },
  { value: "quality_check", label: "Quality Check" },
  { value: "ready_for_dispatch", label: "Ready for Dispatch" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
];

// Helper function to get a user-friendly label from status
const getStatusLabel = (status: string) => {
  const option = statusOptions.find(option => option.value === status);
  return option ? option.label : status.replace('_', ' ');
};

const bookings = [
    {
        id: '1',
        orderId: 'HSRP-12345',
        vehicleRegistrationNumber: 'DL1CAB1234',
        ownerFullName: 'Ramesh Kumar',
        amount: 450,
        status: 'in_production',
        createdAt: new Date().toISOString(),
        paymentProof: 'https://placehold.co/400x300.png',
        ownerMobile: '9876543210',
        ownerEmail: 'ramesh@example.com',
        ownerAddress: '123, Main Street, Delhi',
        vehicleCategory: 'Bike/Scooter'
    }
];

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  // Calculate stats
  const totalOrders = bookings.length;
  const pendingOrders = bookings.filter((b: any) =>
    ['pending', 'payment_verified', 'in_production', 'quality_check', 'ready_for_dispatch', 'out_for_delivery'].includes(b.status)
  ).length;
  const completedOrders = bookings.filter((b: any) => b.status === 'delivered').length;
  const totalRevenue = bookings.reduce((sum: number, b: any) => sum + b.amount, 0);

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

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border border-gov-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="text-gov-blue text-xl" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
                <p className="text-2xl font-bold text-gov-text">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gov-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600 text-xl" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">Pending</h3>
                <p className="text-2xl font-bold text-gov-text">{pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gov-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-gov-success text-xl" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">Completed</h3>
                <p className="text-2xl font-bold text-gov-text">{completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gov-border">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="text-gov-green text-xl" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
                <p className="text-2xl font-bold text-gov-text">₹{(totalRevenue / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tabs */}
      <Card className="border border-gov-border">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200">
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
            <Card className="border border-gov-border">
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
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
                      {bookings.map((booking: any) => (
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
                                onValueChange={(value) => console.log(value)}
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
                          <td className="p-2">{new Date(booking.createdAt).toLocaleDateString()}</td>
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
                                  {selectedBooking && (
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
                                            <img
                                              src={selectedBooking.paymentProof}
                                              alt="Payment Proof"
                                              className="max-w-full h-auto rounded"
                                            />
                                            <div className="mt-2 text-center">
                                              <a
                                                href={selectedBooking.paymentProof}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                              >
                                                View Full Size
                                              </a>
                                            </div>
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
                              {booking.paymentProof && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" title="View Payment Proof">
                                      <CreditCard className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Payment Proof - {booking.orderId}</DialogTitle>
                                    </DialogHeader>
                                    <div className="text-center">
                                      <img
                                        src={booking.paymentProof}
                                        alt="Payment Proof"
                                        className="max-w-full h-auto rounded border"
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">QR Code Management</h2>
              <Button className="bg-gov-blue hover:bg-blue-600">
                Generate New QR
              </Button>
            </div>
            <div className="text-center py-8 text-gray-500">
              QR code management functionality will be implemented here.
            </div>
          </TabsContent>

          <TabsContent value="announcements" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Site Announcements</h2>
              <Button className="bg-gov-blue hover:bg-blue-600">
                New Announcement
              </Button>
            </div>
            <div className="text-center py-8 text-gray-500">
              Announcements management functionality will be implemented here.
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="p-6">
            <h2 className="text-xl font-bold mb-6">Contact Submissions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Subject</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
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
                          <Button variant="ghost" size="sm" className="text-gov-blue hover:text-blue-600">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gov-green hover:text-green-600">
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
