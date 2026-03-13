"use client";

import Link from "next/link";
import { Heart, Sparkles, Eye, Send, MapPin, AlertTriangle, Star, Linkedin, Globe, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CompanyLogo } from "@/components/shared/company-logo";
import { ScoreBadge } from "@/components/shared/score-badge";
import { ConfidenceBar } from "@/components/shared/confidence-bar";
import { StatusPill } from "@/components/shared/status-pill";
import { TimeAgo } from "@/components/shared/time-ago";
import type { MockJob } from "@/lib/mock-data/jobs";

interface JobCardProps {
  job: MockJob;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onBookmark?: (id: string) => void;
  onGenerate?: (id: string) => void;
  onApply?: (id: string) => void;
}

const sourceIcons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="h-3 w-3" />,
  company_career_page: <Globe className="h-3 w-3" />,
  indeed: <Briefcase className="h-3 w-3" />,
};

export function JobCard({
  job,
  isSelected = false,
  onSelect,
  onBookmark,
  onGenerate,
  onApply,
}: JobCardProps) {
  const handleCheckboxChange = (checked: boolean) => {
    onSelect?.(job.id, checked);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md",
        job.is_dream_company && "border-violet-500/50 ring-1 ring-violet-500/20",
        job.is_scam && "border-amber-500/50",
        isSelected && "ring-2 ring-primary"
      )}
    >
      {/* Scam warning banner */}
      {job.is_scam && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-center gap-1.5 rounded-t-xl bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-3 w-3" />
          Potential scam
        </div>
      )}

      {/* Dream company star */}
      {job.is_dream_company && (
        <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white shadow-sm">
          <Star className="h-3 w-3 fill-current" />
        </div>
      )}

      {/* Selection checkbox */}
      {onSelect && (
        <div className="absolute left-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="h-4 w-4"
          />
        </div>
      )}

      {/* Header with logo and score */}
      <div className={cn("flex items-start gap-3", job.is_scam && "mt-6")}>
        <CompanyLogo company={job.company} logoUrl={job.company_logo_url} size="md" />
        <div className="min-w-0 flex-1">
          <Link
            href={`/jobs/${job.id}`}
            className="line-clamp-1 text-base font-medium text-foreground hover:text-primary hover:underline"
          >
            {job.title}
          </Link>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <ScoreBadge
            score={job.match_score || 0}
            size="lg"
            isDream={job.is_dream_company}
          />
          {job.score_confidence && (
            <ConfidenceBar confidence={job.score_confidence} className="w-12" />
          )}
        </div>
      </div>

      {/* Location */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>{job.location}</span>
      </div>

      {/* Badges row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {job.seniority}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {job.employment_type === "full_time"
            ? "Full-time"
            : job.employment_type === "part_time"
              ? "Part-time"
              : job.employment_type === "contract"
                ? "Contract"
                : "Internship"}
        </Badge>
        {job.work_location_type === "remote" && (
          <Badge variant="secondary" className="text-xs">
            Remote
          </Badge>
        )}
      </div>

      {/* Salary if available */}
      {job.salary_min && job.salary_max && (
        <p className="mt-2 text-xs text-muted-foreground">
          {job.salary_currency === "USD" && "$"}
          {job.salary_currency === "GBP" && "£"}
          {job.salary_currency === "INR" && "₹"}
          {job.salary_currency === "AUD" && "A$"}
          {(job.salary_min / 1000).toFixed(0)}k - {(job.salary_max / 1000).toFixed(0)}k
          {job.salary_currency !== "USD" && job.salary_currency !== "GBP" && job.salary_currency !== "INR" && job.salary_currency !== "AUD" && ` ${job.salary_currency}`}
        </p>
      )}

      {/* Status and meta */}
      <div className="mt-3 flex items-center justify-between">
        <StatusPill status={job.status} />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="flex items-center gap-1">
                {sourceIcons[job.source] || <Globe className="h-3 w-3" />}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {job.source === "linkedin"
                ? "LinkedIn"
                : job.source === "company_career_page"
                  ? "Company Page"
                  : job.source === "indeed"
                    ? "Indeed"
                    : job.source}
            </TooltipContent>
          </Tooltip>
          <TimeAgo date={job.discovered_at} className="text-xs" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 flex items-center gap-1 border-t pt-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onBookmark?.(job.id)}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  job.status === "bookmarked" && "fill-red-500 text-red-500"
                )}
              />
              <span className="sr-only">Bookmark</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bookmark</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onGenerate?.(job.id)}
            >
              <Sparkles className="h-4 w-4" />
              <span className="sr-only">Generate content</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Generate Resume & Cover Letter</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <Link href={`/jobs/${job.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">View details</span>
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View Details</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onApply?.(job.id)}
              disabled={job.status === "applied" || job.is_scam}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Apply</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {job.status === "applied" ? "Already Applied" : "Apply"}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
