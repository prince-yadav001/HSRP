
import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface OwnerDetailsProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  initialData: any;
}

export default function OwnerDetails({ onNext, onPrevious, initialData }: OwnerDetailsProps) {
  const [formData, setFormData] = useState({
    ownerFullName: initialData.ownerFullName || "",
    ownerMobile: initialData.ownerMobile || "",
    ownerEmail: initialData.ownerEmail || "",
    ownerAadhaar: initialData.ownerAadhaar || "",
    ownerAddress: initialData.ownerAddress || "",
    ownerState: initialData.ownerState || "",
    ownerPincode: initialData.ownerPincode || ""
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Validate required fields
    const requiredFields = Object.keys(formData);
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Required fields missing",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.ownerEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Validate mobile number
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.ownerMobile)) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive"
      });
      return;
    }

    // Validate Aadhaar number
    const aadhaarRegex = /^\d{12}$/;
    if (!aadhaarRegex.test(formData.ownerAadhaar.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Aadhaar number",
        description: "Please enter a valid 12-digit Aadhaar number",
        variant: "destructive"
      });
      return;
    }

    onNext(formData);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Owner Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="Enter full name"
              value={formData.ownerFullName}
              onChange={(e) => handleInputChange('ownerFullName', e.target.value)}
              className="focus:ring-2 focus:ring-gov-blue"
            />
          </div>

          <div>
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              placeholder="Enter 10-digit mobile number"
              value={formData.ownerMobile}
              onChange={(e) => handleInputChange('ownerMobile', e.target.value)}
              className="focus:ring-2 focus:ring-gov-blue"
              maxLength={10}
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.ownerEmail}
              onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
              className="focus:ring-2 focus:ring-gov-blue"
            />
          </div>

          <div>
            <Label htmlFor="aadhaar">Aadhaar Number *</Label>
            <Input
              id="aadhaar"
              placeholder="Enter 12-digit Aadhaar number"
              value={formData.ownerAadhaar}
              onChange={(e) => handleInputChange('ownerAadhaar', e.target.value)}
              className="focus:ring-2 focus:ring-gov-blue"
              maxLength={14}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              placeholder="Enter complete address"
              value={formData.ownerAddress}
              onChange={(e) => handleInputChange('ownerAddress', e.target.value)}
              className="focus:ring-2 focus:ring-gov-blue"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="state">State *</Label>
            <Select value={formData.ownerState} onValueChange={(value) => handleInputChange('ownerState', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                <SelectItem value="west-bengal">West Bengal</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
                <SelectItem value="rajasthan">Rajasthan</SelectItem>
                <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                <SelectItem value="punjab">Punjab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="pincode">PIN Code *</Label>
            <Input
              id="pincode"
              placeholder="Enter 6-digit PIN code"
              value={formData.ownerPincode}
              onChange={(e) => handleInputChange('ownerPincode', e.target.value)}
              className="focus:ring-2 focus:ring-gov-blue"
              maxLength={6}
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={onPrevious}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="bg-gov-blue hover:bg-blue-600"
          >
            Proceed to Payment
          </Button>
        </div>
      </CardContent>
    </>
  );
}
