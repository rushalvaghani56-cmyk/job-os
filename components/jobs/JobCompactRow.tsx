"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CompanyLogo } from "@/components/shared/company-logo";
import { ScoreBadge } from "@/components/shared/score-badge";
import { StatusPill } from "@/components/shared/status-pill";
import { TimeAgo } from "@/components/shared/time-ago";
import type { MockJob } from "@/lib/mock-data/jobs";

interface JobCompactRowProps {
  job: MockJob;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export function JobCompactRow({ job, isSelected = false, onSelect }: JobCompactRowProps) {
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("input") || target.closest("a")) {
      return;
    }
    router.push(`/jobs/${job.id}`);
  };

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-3 border-b px-4 py-2.5 transition-colors hover:bg-muted/50",
        isSelected && "bg-primary/5",
        job.is_dream_company && "border-l-2 border-l-violet-500"
      )}
      onClick={handleRowClick}
    >
      {/* Selection */}
      {onSelect && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(job.id, !!checked)}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0"
        />
      )}

      {/* Company Logo */}
      <CompanyLogo company={job.company} logoUrl={job.company_logo_url} size="sm" />

      {/* Title and Company */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Link
          href={`/jobs/${job.id}`}
          className="truncate text-sm font-medium hover:text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {job.title}
        </Link>
        <span className="text-sm text-muted-foreground">at</span>
        <span className="truncate text-sm text-muted-foreground">{job.company}</span>
        {job.is_dream_company && (
          <Star className="h-3 w-3 shrink-0 fill-violet-500 text-violet-500" />
        )}
        {job.is_scam && (
          <Tooltip>
            <TooltipTrigger>
              <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500" />
            </TooltipTrigger>
            <TooltipContent>Potential scam</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Score */}
      <ScoreBadge score={job.match_score || 0} size="sm" className="shrink-0" />

      {/* Status */}
      <StatusPill status={job.status} className="shrink-0" />

      {/* Posted */}
      <TimeAgo date={job.posted_date || job.discovered_at} className="shrink-0 text-xs" />
    </div>
  );
}
