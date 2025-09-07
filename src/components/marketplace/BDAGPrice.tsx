"use client";

import { Coins } from "lucide-react";
import { cn } from "@/lib/utils";

interface BDAGPriceProps {
  amount: string | number;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BDAGPrice({ amount, className, showIcon = true, size = "md" }: BDAGPriceProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <div className={cn("flex items-center gap-1 font-semibold text-orange-600", sizeClasses[size], className)}>
      {showIcon && <Coins className={cn("text-orange-500", iconSizes[size])} />}
      <span>{amount} BDAG</span>
    </div>
  );
}
