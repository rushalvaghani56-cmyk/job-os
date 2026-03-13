"use client";

import { cn } from "@/lib/utils";

interface QualityScoreRingProps {
  /** Score value (0-100) */
  score: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Additional class names */
  className?: string;
}

/**
 * Quality score ring component
 * Circular SVG progress ring with color based on score
 * Green >80, Amber >60, Red <=60
 */
export function QualityScoreRing({
  score,
  size = 48,
  strokeWidth = 4,
  className,
}: QualityScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;

  const getStrokeColor = () => {
    if (clampedScore > 80) return "stroke-emerald-500";
    if (clampedScore > 60) return "stroke-amber-500";
    return "stroke-red-500";
  };

  const getTextColor = () => {
    if (clampedScore > 80) return "text-emerald-600 dark:text-emerald-400";
    if (clampedScore > 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
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
          className={cn("transition-all duration-500", getStrokeColor())}
        />
      </svg>
      <span
        className={cn(
          "absolute text-sm font-semibold font-mono",
          getTextColor()
        )}
      >
        {clampedScore}
      </span>
    </div>
  );
}
