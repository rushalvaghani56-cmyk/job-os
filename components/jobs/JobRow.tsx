"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, Send, MoreHorizontal, AlertTriangle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CompanyLogo } from "@/components/shared/company-logo";
import { ScoreBadge } from "@/components/shared/score-badge";
import { ConfidenceBar } from "@/components/shared/confidence-bar";
import { StatusPill } from "@/components/shared/status-pill";
import { TimeAgo } from "@/components/shared/time-ago";
import type { MockJob } from "@/lib/mock-data/jobs";

interface JobRowProps {
  job: MockJob;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onBookmark?: (id: string) => void;
  onGenerate?: (id: string) => void;
  onApply?: (id: string) => void;
  onSkip?: (id: string) => void;
}

export function JobRow({
  job,
  isSelected = false,
  onSelect,
  onBookmark,
  onGenerate,
  onApply,
  onSkip,
}: JobRowProps) {
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("a") ||
      target.closest("[role='menuitem']")
    ) {
      return;
    }
    router.push(`/jobs/${job.id}`);
  };

  const formatSalary = () => {
    if (!job.salary_min || !job.salary_max) return "—";
    const symbol =
      job.salary_currency === "USD"
        ? "$"
        : job.salary_currency === "GBP"
          ? "£"
          : job.salary_currency === "INR"
            ? "₹"
            : job.salary_currency === "AUD"
              ? "A$"
              : "";
    return `${symbol}${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k`;
  };

  const formatSource = () => {
    switch (job.source) {
      case "linkedin":
        return "LinkedIn";
      case "company_career_page":
        return "Company";
      case "indeed":
        return "Indeed";
      default:
        return job.source;
    }
  };

  return (
    <TableRow
      className={cn(
        "cursor-pointer transition-colors hover:bg-muted/50",
        isSelected && "bg-primary/5"
      )}
      onClick={handleRowClick}
    >
      {/* Selection */}
      <TableCell className="w-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect?.(job.id, !!checked)}
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell>

      {/* Company */}
      <TableCell>
        <div className="flex items-center gap-2">
          <CompanyLogo company={job.company} logoUrl={job.company_logo_url} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{job.company}</span>
            {job.is_dream_company && (
              <span className="flex items-center gap-0.5 text-xs text-violet-600 dark:text-violet-400">
                <Star className="h-2.5 w-2.5 fill-current" />
                Dream
              </span>
            )}
          </div>
        </div>
      </TableCell>

      {/* Title */}
      <TableCell>
        <div className="flex items-center gap-2">
          <Link
            href={`/jobs/${job.id}`}
            className="text-sm font-medium hover:text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {job.title}
          </Link>
          {job.is_scam && (
            <Tooltip>
              <TooltipTrigger>
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              </TooltipTrigger>
              <TooltipContent>Potential scam</TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>

      {/* Score */}
      <TableCell>
        <ScoreBadge score={job.match_score || 0} size="sm" isDream={job.is_dream_company} />
      </TableCell>

      {/* Confidence */}
      <TableCell>
        {job.score_confidence ? (
          <ConfidenceBar confidence={job.score_confidence} showLabel className="w-16" />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusPill status={job.status} />
      </TableCell>

      {/* Location */}
      <TableCell>
        <span className="text-sm">{job.location}</span>
      </TableCell>

      {/* Seniority */}
      <TableCell>
        <span className="text-sm">{job.seniority}</span>
      </TableCell>

      {/* Salary */}
      <TableCell>
        <span className="text-sm">{formatSalary()}</span>
      </TableCell>

      {/* Posted */}
      <TableCell>
        <TimeAgo date={job.posted_date || job.discovered_at} className="text-sm" />
      </TableCell>

      {/* Source */}
      <TableCell>
        <span className="text-sm text-muted-foreground">{formatSource()}</span>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark?.(job.id);
                }}
              >
                <Heart
                  className={cn(
                    "h-3.5 w-3.5",
                    job.status === "bookmarked" && "fill-red-500 text-red-500"
                  )}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bookmark</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/jobs/${job.id}`)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onGenerate?.(job.id)}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Content
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onApply?.(job.id)}
                disabled={job.status === "applied" || job.is_scam}
              >
                <Send className="mr-2 h-4 w-4" />
                Apply
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSkip?.(job.id)}>Skip Job</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
