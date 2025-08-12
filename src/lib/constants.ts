
import type { VehicleCategory } from "@/components/hsrp/VehicleIcon";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/booking", label: "Booking" },
  { href: "/tracking", label: "Tracking" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

export const PRICING_DATA: {
  category: VehicleCategory;
  price: number;
}[] = [
  { category: "Bike/Scooter", price: 450 },
  { category: "Car/SUV", price: 1200 },
  { category: "Electric Vehicle", price: 800 },
  { category: "Only Colour Sticker", price: 200 },
  { category: "Tractor & Trailer", price: 2500 },
];

export const vehicleCategoryMap = {
    bike: "Bike/Scooter",
    car: "Car/SUV",
    electric: "Electric Vehicle",
    sticker: "Only Colour Sticker",
    heavy: "Tractor & Trailer",
};

export const vehiclePricing = {
    bike: 450,
    car: 1200,
    electric: 800,
    sticker: 200,
    heavy: 2500,
};


export const FAQ_DATA = [
  {
    question: "What is an HSRP?",
    answer:
      "A High Security Registration Plate (HSRP) is a standardized number plate with several security features, such as a hot-stamped chromium-based hologram and a laser-etched permanent identification number. It is designed to be tamper-proof and to aid in vehicle identification.",
  },
  {
    question: "Why is HSRP mandatory?",
    answer:
      "The Ministry of Road Transport and Highways (MoRTH) has made HSRPs mandatory for all vehicles to curb theft and to create a national, standardized database of all registered vehicles. It enhances security and helps in tracking stolen or wanted vehicles.",
  },
  {
    question: "How long does the HSRP booking process take?",
    answer:
      "The online booking process is quick and can be completed in under 5 minutes. You just need to provide your vehicle and owner details, make the payment, and upload the proof.",
  },
  {
    question: "How can I track my HSRP order?",
    answer:
      "Once your booking is confirmed, you will receive an Order ID. You can use this ID on our 'Tracking' page to get real-time updates on the status of your HSRP, from production to delivery.",
  },
  {
    question: "What documents are required for HSRP booking?",
    answer:
      "You will need your Vehicle Registration Certificate (RC) to provide details like the registration number, chassis number, and engine number. No physical document upload is required for the booking form itself, but you will need to upload a payment proof.",
  },
  {
    question: "What if my payment verification fails?",
    answer:
      "Our AI-powered system verifies payment proofs. If it fails, you will be notified with a reason. You may be asked to re-upload a clearer proof or contact support for manual verification. Your booking will not proceed until the payment is verified.",
  },
];

export const ORDER_STATUSES = [
  { name: "Payment Verified", icon: "CreditCard" },
  { name: "In Production", icon: "Factory" },
  { name: "Quality Check", icon: "ShieldCheck" },
  { name: "Ready for Dispatch", icon: "Package" },
  { name: "Out for Delivery", icon: "Truck" },
  { name: "Delivered", icon: "Home" },
];
