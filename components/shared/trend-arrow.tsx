"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrendArrowProps {
  /** Trend direction */
  direction: "up" | "down" | "flat";
  /** Value to display (e.g., "12%", "+5") */
  value: string;
  /** Additional class names */
  className?: string;
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  down: {
    icon: TrendingDown,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
  },
  flat: {
    icon: Minus,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-500/10",
  },
};

/**
 * Trend arrow component
 * Shows trend direction with color-coded arrow and value
 */
export function TrendArrow({ direction, value, className }: TrendArrowProps) {
  const config = trendConfig[direction];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {value}
    </span>
  );
}
