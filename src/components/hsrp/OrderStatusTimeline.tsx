
"use client";

import {
  CreditCard,
  Factory,
  ShieldCheck,
  Package,
  Truck,
  Home,
  type LucideIcon,
  Cog,
  Check,
  Search,
  FlagIcon
} from "lucide-react";
import { ORDER_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface OrderStatusTimelineProps {
  currentStatus: string;
}

const statusSteps = [
  {
    key: "pending",
    title: "Order Received",
    icon: Check
  },
  {
    key: "payment_verified", 
    title: "Payment Verified",
    icon: CreditCard
  },
  {
    key: "in_production",
    title: "In Production", 
    icon: Cog
  },
  {
    key: "quality_check",
    title: "Quality Check",
    icon: Search
  },
  {
    key: "ready_for_dispatch",
    title: "Ready for Dispatch",
    icon: Package
  },
  {
    key: "out_for_delivery",
    title: "Out for Delivery",
    icon: Truck
  },
  {
    key: "delivered",
    title: "Delivered",
    icon: FlagIcon
  }
];

const getStatusIndex = (status: string) => {
    const option = ORDER_STATUSES.find(s => s.name.toLowerCase().replace(/ /g, '_') === status);
    if (option) {
        return ORDER_STATUSES.indexOf(option);
    }
    return -1;
};

export default function OrderStatusTimeline({ currentStatus }: OrderStatusTimelineProps) {
  const currentStatusIndex = getStatusIndex(currentStatus);

  return (
    <div className="relative">
      {ORDER_STATUSES.map((status, index) => {
        const isCompleted = index < currentStatusIndex;
        const isCurrent = index === currentStatusIndex;
        const step = statusSteps.find(s => s.title === status.name);

        const Icon = step?.icon || Package;

        return (
          <div key={status.name} className="flex items-start gap-4 md:gap-6 relative">
            {index < ORDER_STATUSES.length - 1 && (
                 <div className={cn(
                    "absolute top-5 left-[18px] w-0.5 h-full -translate-x-1/2 bg-border",
                    (isCompleted || isCurrent) && "bg-primary"
                  )}></div>
            )}
            
            <div className={cn(
                "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
                isCompleted || isCurrent
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground"
              )}>
              <Icon className="h-5 w-5" />
            </div>

            <div className="pb-8 pt-1.5">
              <p
                className={cn(
                  "font-semibold",
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {status.name}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
