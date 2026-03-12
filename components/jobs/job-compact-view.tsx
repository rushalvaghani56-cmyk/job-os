"use client"

import Link from "next/link"
import { Star, Sparkles, ArrowRight, Linkedin, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScoreBadge } from "./score-badge"
import type { Job } from "./types"

interface JobCompactViewProps {
  jobs: Job[]
  selectedJobs: string[]
  onSelectJob: (jobId: string) => void
  onSelectAll: (selected: boolean) => void
}

const statusStyles: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  scored: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
  content_ready: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  applied: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
  interview: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  offer: "bg-green-600/10 text-green-700 dark:text-green-300 border-green-600/30",
  rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  skipped: "bg-muted text-muted-foreground border-border",
  bookmarked: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  ghosted: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30",
}

const statusLabels: Record<string, string> = {
  new: "New",
  scored: "Scored",
  content_ready: "Ready",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  skipped: "Skipped",
  bookmarked: "Saved",
  ghosted: "Ghosted",
}

function getSourceIcon(source: string) {
  switch (source) {
    case "linkedin":
      return <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" />
    default:
      return <Globe className="h-3.5 w-3.5 text-muted-foreground" />
  }
}

function formatDate(date: Date) {
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "1d"
  if (diffDays < 7) return `${diffDays}d`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`
  return `${Math.floor(diffDays / 30)}mo`
}

export function JobCompactView({
  jobs,
  selectedJobs,
  onSelectJob,
  onSelectAll,
}: JobCompactViewProps) {
  const allSelected = jobs.length > 0 && selectedJobs.length === jobs.length

  return (
    <TooltipProvider>
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground">
          <div className="w-6">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => onSelectAll(!!checked)}
              aria-label="Select all"
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div className="w-12">Score</div>
          <div className="flex-1 min-w-[200px]">Title</div>
          <div className="w-28">Company</div>
          <div className="w-28">Location</div>
          <div className="w-16">Status</div>
          <div className="w-12">Posted</div>
          <div className="w-20">Actions</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 hover:bg-muted/30 transition-colors group",
                selectedJobs.includes(job.id) && "bg-primary/5",
                job.isBlacklisted && "opacity-50",
                job.isPotentialScam && "bg-red-500/5"
              )}
            >
              <div className="w-6">
                <Checkbox
                  checked={selectedJobs.includes(job.id)}
                  onCheckedChange={() => onSelectJob(job.id)}
                  aria-label={`Select ${job.title}`}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="w-12">
                <ScoreBadge score={job.score} size="sm" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
                >
                  {job.title}
                </Link>
              </div>
              <div className="w-28 flex items-center gap-1.5">
                <span className="text-sm truncate">{job.company.name}</span>
                {job.company.isDreamCompany && (
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                )}
              </div>
              <div className="w-28 text-sm text-muted-foreground truncate">
                {job.location}
              </div>
              <div className="w-16">
                <Badge
                  variant="outline"
                  className={cn("text-xs py-0", statusStyles[job.status])}
                >
                  {statusLabels[job.status]}
                </Badge>
              </div>
              <div className="w-12 text-xs text-muted-foreground flex items-center gap-1">
                {getSourceIcon(job.source)}
                {formatDate(job.postedAt)}
              </div>
              <div className="w-20 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Bookmark</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Generate</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Apply</TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
