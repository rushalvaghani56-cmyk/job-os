"use client";

import { cn } from "@/lib/utils";

interface CompletenessRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CompletenessRing({
  percentage,
  size = 64,
  strokeWidth = 6,
  className,
}: CompletenessRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 80) return { stroke: "stroke-emerald-500", text: "text-emerald-500" };
    if (pct >= 50) return { stroke: "stroke-amber-500", text: "text-amber-500" };
    return { stroke: "stroke-red-500", text: "text-red-500" };
  };

  const colors = getColor(percentage);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(colors.stroke, "transition-all duration-500 ease-out")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-mono text-lg font-bold", colors.text)}>
          {percentage}%
        </span>
        <span className="text-xs text-muted-foreground">Complete</span>
      </div>
    </div>
  );
}
