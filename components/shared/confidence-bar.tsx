"use client";

import { cn } from "@/lib/utils";

interface ConfidenceBarProps {
  /** Confidence value (0-1) */
  confidence: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Confidence bar component
 * Mini horizontal bar with color transition from red to green
 */
export function ConfidenceBar({ confidence, showLabel = false, className }: ConfidenceBarProps) {
  // Clamp confidence between 0 and 1
  const clampedConfidence = Math.max(0, Math.min(1, confidence));
  const percentage = Math.round(clampedConfidence * 100);

  const getBarColor = () => {
    if (clampedConfidence >= 0.8) return "bg-emerald-500";
    if (clampedConfidence >= 0.6) return "bg-green-500";
    if (clampedConfidence >= 0.4) return "bg-amber-500";
    if (clampedConfidence >= 0.2) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-300", getBarColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-muted-foreground">{percentage}%</span>
      )}
    </div>
  );
}
