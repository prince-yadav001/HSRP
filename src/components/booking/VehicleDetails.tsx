
import { useState } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VehicleDetailsProps {
  onNext: (data: any) => void;
  onPrevious: () => void;
  initialData: any;
}

export default function VehicleDetails({ onNext, onPrevious, initialData }: VehicleDetailsProps) {
  const [formData, setFormData] = useState({
    vehicleRegistrationNumber: initialData.vehicleRegistrationNumber || "",
    engineNumber: initialData.engineNumber || "",
    chassisNumber: initialData.chassisNumber || "",
    vehicleMake: initialData.vehicleMake || "",
    vehicleModel: initialData.vehicleModel || "",
    manufacturingYear: initialData.manufacturingYear || "",
    rcDocument: null as File | null
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      setFormData(prev => ({ ...prev, rcDocument: file }));
    }
  };

  const handleNext = () => {
    // Validate required fields
    const requiredFields = [
      'vehicleRegistrationNumber',
      'engineNumber', 
      'chassisNumber',
      'vehicleMake',
      'vehicleModel',
      'manufacturingYear'
    ];

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Required fields missing",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    onNext(formData);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="registrationNumber">Vehicle Registration Number *</Label>
            <Input
              id="registrationNumber"
              placeholder="e.g., DL 01 AA 1234"
              value={formData.vehicleRegistrationNumber}
              onChange={(e) => handleInputChange('vehicleRegistrationNumber', e.target.value)}
              className="focus:ring-2 focus:ring-gov-blue"
            />
          </div>

          <div>
            <Label htmlFor="engineNumber">Engine Number *</Label>
            <Input
              id="engineNumber"
              placeholder="Enter engine number"
              value={formData.engineNumber}
              onChange={(e) => handleInputChange('engineNumber', e.target.value)}
              className="focus:ring-2 focus:ring-gov-blue"
            />
          </div>

          <div>
            <Label htmlFor="chassisNumber">Chassis Number *</Label>
            <Input
              id="chassisNumber"
              placeholder="Enter chassis number"
              value={formData.chassisNumber}
              onChange={(e) => handleInputChange('chassisNumber', e.target.value)}
              className="focus:ring-2 focus:ring-gov-blue"
            />
          </div>

          <div>
            <Label htmlFor="vehicleMake">Vehicle Make *</Label>
            <Select value={formData.vehicleMake} onValueChange={(value) => handleInputChange('vehicleMake', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maruti">Maruti Suzuki</SelectItem>
                <SelectItem value="hyundai">Hyundai</SelectItem>
                <SelectItem value="honda">Honda</SelectItem>
                <SelectItem value="tata">Tata</SelectItem>
                <SelectItem value="mahindra">Mahindra</SelectItem>
                <SelectItem value="hero">Hero</SelectItem>
                <SelectItem value="bajaj">Bajaj</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vehicleModel">Vehicle Model *</Label>
            <Input
              id="vehicleModel"
              placeholder="Enter vehicle model"
              value={formData.vehicleModel}
              onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
              className="focus:ring-2 focus:ring-gov-blue"
            />
          </div>

          <div>
            <Label htmlFor="manufacturingYear">Manufacturing Year *</Label>
            <Select value={formData.manufacturingYear} onValueChange={(value) => handleInputChange('manufacturingYear', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2018">2018</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="rcDocument">Upload RC Document *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="text-3xl text-gray-400 mb-2 mx-auto" size={48} />
              <p className="text-gray-600">
                Drag and drop your RC document or{" "}
                <label htmlFor="rcDocument" className="text-blue-600 font-semibold cursor-pointer">
                  browse files
                </label>
              </p>
              <p className="text-sm text-gray-500 mt-1">Maximum file size: 5MB (PDF, JPG, PNG)</p>
              <input
                type="file"
                id="rcDocument"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              {formData.rcDocument && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {formData.rcDocument.name}
                </p>
              )}
            </div>
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            Next Step
          </Button>
        </div>
      </CardContent>
    </>
  );
}
