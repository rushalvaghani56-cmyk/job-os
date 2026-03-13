"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  /** Score value (0-100) */
  score: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether this is a dream company */
  isDream?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * Score badge component
 * Color-coded badge based on score value
 * 85-100: Green, 70-84: Blue, 60-69: Amber, <60: Gray
 * Dream companies get purple border and star icon
 */
export function ScoreBadge({ score, size = "md", isDream = false, className }: ScoreBadgeProps) {
  const getScoreStyles = () => {
    if (score >= 85) {
      return "bg-emerald-500 text-white";
    }
    if (score >= 70) {
      return "bg-blue-500 text-white";
    }
    if (score >= 60) {
      return "bg-amber-500 text-amber-950";
    }
    return "bg-slate-400 text-slate-700";
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "h-5 min-w-5 text-xs px-1.5";
      case "md":
        return "h-6 min-w-6 text-sm px-2";
      case "lg":
        return "h-8 min-w-8 text-base px-3";
      default:
        return "h-6 min-w-6 text-sm px-2";
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-1 rounded-full font-mono font-semibold",
        getScoreStyles(),
        getSizeStyles(),
        isDream && "ring-2 ring-violet-500 ring-offset-2 ring-offset-background",
        className
      )}
    >
      {isDream && <Star className="h-3 w-3 fill-current" />}
      {score}
    </div>
  );
}
