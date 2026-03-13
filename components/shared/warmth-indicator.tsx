"use client";

import { cn } from "@/lib/utils";
import type { WarmthLevel } from "@/src/types/outreach";

interface WarmthIndicatorProps {
  /** Warmth level */
  warmth: WarmthLevel;
  /** Show as pill with label */
  showLabel?: boolean;
  /** Additional class names */
  className?: string;
}

const warmthConfig: Record<WarmthLevel, { dot: string; bg: string; text: string; label: string }> = {
  cold: {
    dot: "bg-blue-500",
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    label: "Cold",
  },
  warm: {
    dot: "bg-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    label: "Warm",
  },
  hot: {
    dot: "bg-red-500",
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    label: "Hot",
  },
};

/**
 * Warmth indicator component
 * Blue (cold), amber (warm), red (hot) dot or pill
 */
export function WarmthIndicator({ warmth, showLabel = false, className }: WarmthIndicatorProps) {
  const config = warmthConfig[warmth];

  if (!showLabel) {
    return (
      <span
        className={cn("inline-block h-2 w-2 rounded-full", config.dot, className)}
        title={config.label}
      />
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}
