
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VehicleIcon, { type VehicleCategory } from "./VehicleIcon";

interface PricingCardProps {
  category: VehicleCategory;
  price: number;
}

export default function PricingCard({ category, price }: PricingCardProps) {
  return (
    <Card className="flex flex-col justify-between text-center shadow-lg transition-transform duration-300 hover:-translate-y-2">
      <CardHeader>
        <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4">
          <VehicleIcon category={category} className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-xl">{category}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <p className="text-4xl font-bold mb-4">₹{price.toLocaleString()}</p>
        <Button asChild className="w-full">
          <Link href={`/booking?vehicle=${encodeURIComponent(category)}`}>
            Book Now
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
