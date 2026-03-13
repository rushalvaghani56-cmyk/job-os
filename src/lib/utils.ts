/**
 * Utility Functions
 * Common utility functions for the application
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isValid, parseISO } from "date-fns";

/**
 * Merge class names with Tailwind conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string or Date object
 * @param date Date to format
 * @param formatStr Format string (default: "MMM d, yyyy")
 */
export function formatDate(date: string | Date | null | undefined, formatStr = "MMM d, yyyy"): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "";
  return format(dateObj, formatStr);
}

/**
 * Format a date as relative time (e.g., "3 hours ago")
 * @param date Date to format
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(dateObj)) return "";
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format a number as currency
 * @param amount Amount to format
 * @param currency Currency code (default: "USD")
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency = "USD"
): string {
  if (amount == null) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a salary range
 */
export function formatSalaryRange(
  min: number | null | undefined,
  max: number | null | undefined,
  currency = "USD"
): string {
  if (min == null && max == null) return "Not specified";
  if (min != null && max != null) {
    return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
  }
  if (min != null) return `From ${formatCurrency(min, currency)}`;
  if (max != null) return `Up to ${formatCurrency(max, currency)}`;
  return "Not specified";
}

/**
 * Format a number as percentage
 * @param value Value to format (0-1 or 0-100)
 * @param isDecimal Whether the value is a decimal (0-1)
 */
export function formatPercentage(
  value: number | null | undefined,
  isDecimal = false
): string {
  if (value == null) return "";
  const percentage = isDecimal ? value * 100 : value;
  return `${Math.round(percentage)}%`;
}

/**
 * Format a number with thousands separator
 */
export function formatNumber(value: number | null | undefined): string {
  if (value == null) return "";
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Truncate a string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a consistent color from a string
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 55%)`;
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if a value is a valid URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .split(/[\s_-]+/)
    .map((word) => capitalize(word.toLowerCase()))
    .join(" ");
}

/**
 * Get score color based on score value
 */
export function getScoreColor(score: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (score >= 85) {
    return {
      bg: "bg-emerald-500",
      text: "text-white",
      border: "border-emerald-500",
    };
  }
  if (score >= 70) {
    return {
      bg: "bg-blue-500",
      text: "text-white",
      border: "border-blue-500",
    };
  }
  if (score >= 60) {
    return {
      bg: "bg-amber-500",
      text: "text-amber-950",
      border: "border-amber-500",
    };
  }
  return {
    bg: "bg-slate-400",
    text: "text-slate-700",
    border: "border-slate-400",
  };
}
