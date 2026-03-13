"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  Copy,
  MapPin,
  Check,
  Linkedin,
  Globe,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CompanyLogo } from "@/components/shared/company-logo";
import { ScoreBadge } from "@/components/shared/score-badge";
import { ConfidenceBar } from "@/components/shared/confidence-bar";
import type { JobDetailed } from "@/lib/mock-data/jobs";
import type { JobStatus } from "@/types/jobs";

interface JobDetailHeaderProps {
  job: JobDetailed;
  onStatusChange?: (status: JobStatus) => void;
  onBookmark?: () => void;
  onApply?: () => void;
}

const statusOptions: { value: JobStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "scored", label: "Scored" },
  { value: "content_ready", label: "Content Ready" },
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "skipped", label: "Skipped" },
  { value: "bookmarked", label: "Bookmarked" },
  { value: "ghosted", label: "Ghosted" },
];

const sourceIcons: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="h-4 w-4" />,
  company_career_page: <Globe className="h-4 w-4" />,
  indeed: <Briefcase className="h-4 w-4" />,
};

export function JobDetailHeader({
  job,
  onStatusChange,
  onBookmark,
  onApply,
}: JobDetailHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(job.status === "bookmarked");
  const [currentStatus, setCurrentStatus] = useState<JobStatus>(job.status);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleStatusChange = (status: JobStatus) => {
    setCurrentStatus(status);
    onStatusChange?.(status);
    toast.success(`Status updated to ${statusOptions.find((s) => s.value === status)?.label}`);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  const handleApply = () => {
    onApply?.();
    toast.success("Opening application...");
  };

  return (
    <div className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 py-4 lg:px-6">
        {/* Back link */}
        <Link
          href="/jobs"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left section: Job info */}
          <div className="flex items-start gap-4">
            <CompanyLogo
              company={job.company.name}
              logoUrl={job.company.logo_url}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-foreground lg:text-2xl">
                {job.title}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{job.company.name}</span>
                <span className="text-muted-foreground/50">|</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{job.seniority}</Badge>
                <Badge variant="outline">
                  {job.employment_type === "full_time"
                    ? "Full-time"
                    : job.employment_type === "part_time"
                      ? "Part-time"
                      : job.employment_type === "contract"
                        ? "Contract"
                        : "Internship"}
                </Badge>
                {job.work_location_type === "remote" && (
                  <Badge variant="secondary">Remote</Badge>
                )}
                {job.work_location_type === "hybrid" && (
                  <Badge variant="secondary">Hybrid</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Right section: Score, status, actions */}
          <div className="flex flex-col items-start gap-3 lg:items-end">
            {/* Score and confidence */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <ScoreBadge
                  score={job.match_score || 0}
                  size="lg"
                  isDream={job.is_dream_company}
                />
                {job.score_confidence && (
                  <ConfidenceBar
                    confidence={job.score_confidence}
                    showLabel
                    className="mt-1 w-16"
                  />
                )}
              </div>

              {/* Status dropdown */}
              <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button onClick={handleApply} disabled={currentStatus === "applied" || job.is_scam}>
                Apply Now
              </Button>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleBookmark}
                    className={cn(isBookmarked && "text-red-500")}
                  >
                    <Bookmark
                      className={cn("h-4 w-4", isBookmarked && "fill-current")}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isBookmarked ? "Remove bookmark" : "Bookmark"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleCopyUrl}>
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy URL</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={job.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sourceIcons[job.source] || <ExternalLink className="h-4 w-4" />}
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View original posting</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
