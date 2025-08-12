
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Bike, Zap, Tag, Truck } from "lucide-react";

interface VehicleSelectionProps {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const vehicleCategories = [
  {
    id: "bike",
    name: "Bike/Scooter",
    icon: Bike,
    price: "₹450",
    description: "Two wheeler vehicles"
  },
  {
    id: "car",
    name: "Four Wheeler", 
    icon: Car,
    price: "₹1,200",
    description: "Cars and light vehicles"
  },
  {
    id: "electric",
    name: "Electric Vehicle",
    icon: Zap,
    price: "₹800", 
    description: "Electric cars and bikes"
  },
  {
    id: "sticker",
    name: "Only Sticker",
    icon: Tag,
    price: "₹200",
    description: "Replacement stickers"
  },
  {
    id: "heavy",
    name: "Heavy Vehicle",
    icon: Truck,
    price: "₹2,500",
    description: "Trucks and buses"
  }
];

export default function VehicleSelection({ selectedCategory, onSelect }: VehicleSelectionProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Select Vehicle Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {vehicleCategories.map((category) => (
            <div
              key={category.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
              onClick={() => onSelect(category.id)}
            >
              <div className="text-center">
                <category.icon className="text-3xl text-blue-600 mb-3 mx-auto" size={48} />
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                <p className="text-sm text-green-600 font-semibold mt-2">{category.price}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
}
