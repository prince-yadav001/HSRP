"use client";

import {
  CreditCard,
  Factory,
  ShieldCheck,
  Package,
  Truck,
  Home,
  type LucideIcon,
} from "lucide-react";
import { ORDER_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface OrderStatusTimelineProps {
  history: {
    status: string;
    date: string;
  }[];
  currentStatus: string;
}

const iconMap: { [key: string]: LucideIcon } = {
  "Payment Verified": CreditCard,
  "In Production": Factory,
  "Quality Check": ShieldCheck,
  "Ready for Dispatch": Package,
  "Out for Delivery": Truck,
  Delivered: Home,
};

export default function OrderStatusTimeline({ history, currentStatus }: OrderStatusTimelineProps) {
  const currentStatusIndex = ORDER_STATUSES.findIndex(
    (s) => s.name === currentStatus
  );

  return (
    <div className="relative">
      {ORDER_STATUSES.map((status, index) => {
        const isCompleted = index < currentStatusIndex;
        const isCurrent = index === currentStatusIndex;
        const historyEntry = history.find(h => h.status === status.name);

        const Icon = iconMap[status.name] || Package;

        return (
          <div key={status.name} className="flex items-start gap-4 md:gap-6 relative">
            {/* Timeline line */}
            {index < ORDER_STATUSES.length - 1 && (
                 <div className={cn(
                    "absolute top-5 left-[18px] w-0.5 h-full -translate-x-1/2 bg-border",
                    (isCompleted || isCurrent) && "bg-primary"
                  )}></div>
            )}
            
            {/* Icon circle */}
            <div className={cn(
                "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2",
                isCompleted || isCurrent
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground"
              )}>
              <Icon className="h-5 w-5" />
            </div>

            {/* Status details */}
            <div className="pb-8 pt-1.5">
              <p
                className={cn(
                  "font-semibold",
                  isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {status.name}
              </p>
              {historyEntry ? (
                 <p className="text-sm text-muted-foreground">
                    {new Date(historyEntry.date).toLocaleString()}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Pending</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
