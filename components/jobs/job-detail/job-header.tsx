"use client"

import { useState } from "react"
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Bookmark, 
  BookmarkCheck,
  ExternalLink,
  AlertTriangle,
  Linkedin,
  Globe,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { JobDetail, JobStatus, JobSource } from "../types"

interface JobHeaderProps {
  job: JobDetail
  onStatusChange: (status: JobStatus) => void
  onBookmarkToggle: () => void
  isBookmarked: boolean
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
  { value: "ghosted", label: "Ghosted" },
]

const sourceIcons: Record<JobSource, typeof Linkedin> = {
  linkedin: Linkedin,
  indeed: Building2,
  glassdoor: Building2,
  company_site: Globe,
  wellfound: Building2,
  ycombinator: Building2,
}

const seniorityLabels: Record<string, string> = {
  intern: "Intern",
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior",
  staff: "Staff",
  principal: "Principal",
  director: "Director",
  vp: "VP",
  c_level: "C-Level",
}

const employmentLabels: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  temporary: "Temporary",
}

const locationLabels: Record<string, string> = {
  remote: "Remote",
  remote_tz: "Remote (TZ)",
  hybrid_flex: "Hybrid Flex",
  hybrid_fixed: "Hybrid Fixed",
  onsite: "On-site",
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/30"
  if (score >= 60) return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  if (score >= 40) return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30"
  return "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/30"
}

function getDecisionStyle(decision: string) {
  switch (decision) {
    case "auto":
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
    case "review":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

const decisionLabels: Record<string, string> = {
  auto: "Auto Apply",
  review: "Review",
  skip: "Skip",
}

export function JobHeader({ job, onStatusChange, onBookmarkToggle, isBookmarked }: JobHeaderProps) {
  const [status, setStatus] = useState<JobStatus>(job.status)
  const SourceIcon = sourceIcons[job.source]

  const handleStatusChange = (newStatus: JobStatus) => {
    setStatus(newStatus)
    onStatusChange(newStatus)
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return "Today"
    if (diff === 1) return "Yesterday"
    if (diff < 7) return `${diff} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const hasRisk = job.riskFactors && job.riskFactors.length > 0

  return (
    <div className="sticky top-0 z-10 bg-background border-b">
      <div className="p-5">
        {/* Row 1: Title & Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          {/* Company Logo */}
          <div className="flex-shrink-0 size-12 rounded-lg bg-muted flex items-center justify-center border">
            {job.company.logo ? (
              <div className="size-8 rounded bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {job.company.name.charAt(0)}
              </div>
            ) : (
              <Building2 className="size-6 text-muted-foreground" />
            )}
          </div>

          {/* Title & Company */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-semibold text-foreground truncate">
                {job.title}
              </h1>
              {job.company.isDreamCompany && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 text-xs">
                  Dream Company
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{job.company.name}</span>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {job.location}
              </span>
              <Badge variant="outline" className="text-xs font-normal">
                {locationLabels[job.locationType]}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal">
                {seniorityLabels[job.seniority]}
              </Badge>
              <Badge variant="outline" className="text-xs font-normal">
                {employmentLabels[job.employmentType]}
              </Badge>
            </div>
          </div>

          {/* Posted Date & Source */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              <span>{formatDate(job.postedAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <SourceIcon className="size-3.5" />
              <span className="capitalize">{job.source.replace("_", " ")}</span>
            </div>
            {job.atsType && (
              <Badge variant="secondary" className="text-xs">
                {job.atsType}
              </Badge>
            )}
          </div>
        </div>

        {/* Row 2: Score, Status, Actions */}
        <div className="flex items-center gap-4">
          {/* Large Score Circle */}
          <div className={cn(
            "flex-shrink-0 size-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-lg",
            getScoreColor(job.score)
          )}>
            {job.score}
          </div>

          {/* Confidence Bar */}
          <div className="w-24">
            <div className="text-xs text-muted-foreground mb-1">Confidence</div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full",
                  job.confidence >= 0.8 ? "bg-green-500" :
                  job.confidence >= 0.6 ? "bg-emerald-500" :
                  job.confidence >= 0.4 ? "bg-amber-500" : "bg-orange-500"
                )}
                style={{ width: `${job.confidence * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 font-mono">
              {(job.confidence * 100).toFixed(0)}%
            </div>
          </div>

          {/* Risk Indicator */}
          {hasRisk && (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="size-4" />
              <span className="text-xs">{job.riskFactors.length} risk{job.riskFactors.length > 1 ? "s" : ""}</span>
            </div>
          )}

          {/* Decision Badge */}
          <Badge className={cn("text-xs font-medium", getDecisionStyle(job.decision))}>
            {decisionLabels[job.decision]}
          </Badge>

          <div className="flex-1" />

          {/* Status Dropdown */}
          <Select value={status} onValueChange={(v) => handleStatusChange(v as JobStatus)}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Apply Button */}
          <Button className="rounded-lg">
            <Briefcase className="size-4 mr-1.5" />
            Apply
          </Button>

          {/* Generate Content Button */}
          <Button variant="outline" className="rounded-lg">
            Generate Content
          </Button>

          {/* Bookmark Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onBookmarkToggle}
            className={cn(
              "rounded-lg",
              isBookmarked && "text-primary"
            )}
          >
            {isBookmarked ? (
              <BookmarkCheck className="size-5" />
            ) : (
              <Bookmark className="size-5" />
            )}
          </Button>

          {/* External Link */}
          <Button variant="ghost" size="sm" asChild className="rounded-lg">
            <a href={job.externalUrl} target="_blank" rel="noopener noreferrer">
              View Original
              <ExternalLink className="size-3.5 ml-1.5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
