import {
  Bike,
  Car,
  Tractor,
  Zap,
  FileImage,
  type LucideProps,
} from "lucide-react";
import type { FC } from "react";

export type VehicleCategory =
  | "Bike/Scooter"
  | "Car/SUV"
  | "Electric Vehicle"
  | "Tractor & Trailer"
  | "Only Colour Sticker";

interface VehicleIconProps extends LucideProps {
  category: VehicleCategory;
}

const VehicleIcon: FC<VehicleIconProps> = ({ category, ...props }) => {
  switch (category) {
    case "Bike/Scooter":
      return <Bike {...props} />;
    case "Car/SUV":
      return <Car {...props} />;
    case "Electric Vehicle":
      return <Zap {...props} />;
    case "Tractor & Trailer":
      return <Tractor {...props} />;
    case "Only Colour Sticker":
      return <FileImage {...props} />;
    default:
      return null;
  }
};

export default VehicleIcon;
