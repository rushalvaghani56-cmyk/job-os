"use client";

import { cn } from "@/lib/utils";
import type { JobStatus, ApplicationStatus } from "@/src/types";

type Status = JobStatus | ApplicationStatus;

interface StatusPillProps {
  /** Status value */
  status: Status;
  /** Additional class names */
  className?: string;
}

/** Status color mapping */
const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  // Job statuses
  new: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500", label: "New" },
  scored: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500", label: "Scored" },
  content_ready: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", label: "Content Ready" },
  applied: { bg: "bg-primary/10", text: "text-primary", dot: "bg-primary", label: "Applied" },
  interview: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", label: "Interview" },
  offer: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500", label: "Offer" },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", dot: "bg-destructive", label: "Rejected" },
  skipped: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-500", label: "Skipped" },
  bookmarked: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", label: "Bookmarked" },
  ghosted: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-500", label: "Ghosted" },
  // Application statuses
  pending: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-500", label: "Pending" },
  submitted: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500", label: "Submitted" },
  screening: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500", label: "Screening" },
  withdrawn: { bg: "bg-slate-500/10", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-500", label: "Withdrawn" },
};

/**
 * Status pill component
 * Color-coded pill with dot indicator for job/application status
 */
export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status] || statusConfig.new;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
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
