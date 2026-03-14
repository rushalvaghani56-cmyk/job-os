"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriorityTagProps {
  /** Priority level (1 = Dream, 2 = High, 3 = Medium) */
  priority: 1 | 2 | 3;
  /** Additional class names */
  className?: string;
}

const priorityConfig = {
  1: {
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500/30",
    label: "Dream",
    icon: true,
  },
  2: {
    bg: "bg-orange-500/10",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/30",
    label: "High",
    icon: false,
  },
  3: {
    bg: "bg-slate-500/10",
    text: "text-slate-600 dark:text-slate-400",
    border: "border-slate-500/30",
    label: "Medium",
    icon: false,
  },
};

/**
 * Priority tag component
 * Dream (purple + star), High (orange), Medium (gray)
 */
export function PriorityTag({ priority, className }: PriorityTagProps) {
  // Fallback to Medium (3) if priority is invalid
  const validPriority = priority in priorityConfig ? priority : 3;
  const config = priorityConfig[validPriority];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {config.icon && <Star className="h-3 w-3 fill-current" />}
      {config.label}
    </span>
  );
}
