"use client";

import { useState, useEffect } from "react";
import { formatRelativeTime } from "@/src/lib/utils";
import { cn } from "@/lib/utils";

interface TimeAgoProps {
  /** Date to display relative time for */
  date: string | Date;
  /** Additional class names */
  className?: string;
}

/**
 * TimeAgo component
 * Renders relative time like "3 hours ago" and updates every minute
 */
export function TimeAgo({ date, className }: TimeAgoProps) {
  const [relativeTime, setRelativeTime] = useState(() => formatRelativeTime(date));

  useEffect(() => {
    // Update immediately
    setRelativeTime(formatRelativeTime(date));

    // Update every minute
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(date));
    }, 60000);

    return () => clearInterval(interval);
  }, [date]);

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const fullDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <time dateTime={dateObj.toISOString()} title={fullDate} className={cn("text-muted-foreground", className)}>
      {relativeTime}
    </time>
  );
}
