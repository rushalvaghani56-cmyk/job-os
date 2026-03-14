"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getInitials, stringToColor } from "@/lib/utils";

interface CompanyLogoProps {
  /** Company name */
  company: string;
  /** Optional logo URL */
  logoUrl?: string | null;
  /** Size variant */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Additional class names */
  className?: string;
}

const sizeConfig = {
  xs: { container: "h-5 w-5", text: "text-[10px]", image: 20 },
  sm: { container: "h-8 w-8", text: "text-xs", image: 32 },
  md: { container: "h-10 w-10", text: "text-sm", image: 40 },
  lg: { container: "h-12 w-12", text: "text-base", image: 48 },
  xl: { container: "h-16 w-16", text: "text-lg", image: 64 },
};

/**
 * Company logo component
 * Tries Clearbit logo URL, falls back to initials avatar with company-seeded color
 */
export function CompanyLogo({ company, logoUrl, size = "md", className }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);
  const config = sizeConfig[size];

  // Generate Clearbit URL if no logo provided
  const clearbitUrl = logoUrl || `https://logo.clearbit.com/${company.toLowerCase().replace(/\s+/g, "")}.com`;
  const initials = getInitials(company);
  const bgColor = stringToColor(company);

  const showFallback = hasError || !clearbitUrl;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-lg",
        config.container,
        className
      )}
      style={showFallback ? { backgroundColor: bgColor } : undefined}
    >
      {showFallback ? (
        <div className="flex h-full w-full items-center justify-center">
          <span className={cn("font-semibold text-white", config.text)}>{initials}</span>
        </div>
      ) : (
        <Image
          src={clearbitUrl}
          alt={`${company} logo`}
          width={config.image}
          height={config.image}
          className="h-full w-full object-contain"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
