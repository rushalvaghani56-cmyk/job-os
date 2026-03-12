"use client"

import Link from "next/link"
import {
  Star,
  Sparkles,
  ArrowRight,
  MapPin,
  Briefcase,
  Clock,
  Linkedin,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScoreBadge, ConfidenceBar, DecisionBadge } from "./score-badge"
import type { Job } from "./types"

interface JobCardViewProps {
  jobs: Job[]
  selectedJobs: string[]
  onSelectJob: (jobId: string) => void
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
  content_ready: "Content Ready",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  skipped: "Skipped",
  bookmarked: "Bookmarked",
  ghosted: "Ghosted",
}

const locationTypeLabels: Record<string, string> = {
  remote: "Remote",
  remote_tz: "Remote (TZ)",
  hybrid_flex: "Hybrid",
  hybrid_fixed: "Hybrid",
  onsite: "Onsite",
}

const seniorityLabels: Record<string, string> = {
  intern: "Intern",
  entry: "Entry",
  mid: "Mid",
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
  temporary: "Temp",
}

function getSourceIcon(source: string) {
  switch (source) {
    case "linkedin":
      return <Linkedin className="h-4 w-4 text-[#0A66C2]" />
    default:
      return <Globe className="h-4 w-4 text-muted-foreground" />
  }
}

function formatDate(date: Date) {
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

function formatSalary(salary: Job["salary"]) {
  if (!salary) return null
  const format = (n: number) => `$${(n / 1000).toFixed(0)}k`
  return {
    text: `${format(salary.min)} - ${format(salary.max)}`,
    estimated: salary.estimated
  }
}

function JobCard({ job }: { job: Job }) {
  const salary = formatSalary(job.salary)
  
  return (
    <Card className={cn(
      "p-4 hover:shadow-md transition-shadow group cursor-pointer",
      job.isBlacklisted && "opacity-50",
      job.isPotentialScam && "border-red-500/30 bg-red-500/5"
    )}>
      <CardContent className="p-0 space-y-3">
        {/* Header: Company + Source */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-medium shrink-0">
              {job.company.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm text-muted-foreground truncate">
                {job.company.name}
              </span>
              {job.company.isDreamCompany && (
                <span className="text-xs text-amber-600 dark:text-amber-400">Dream Company</span>
              )}
            </div>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{getSourceIcon(job.source)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="capitalize">{job.source.replace("_", " ")}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Title */}
        <Link 
          href={`/jobs/${job.id}`}
          className="block font-medium text-base hover:text-primary transition-colors line-clamp-1"
        >
          {job.title}
        </Link>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-xs">
            {seniorityLabels[job.seniority]}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {locationTypeLabels[job.locationType]}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {employmentLabels[job.employmentType]}
          </Badge>
        </div>

        {/* Score Section */}
        <div className="flex items-center gap-3">
          <ScoreBadge score={job.score} size="lg" />
          <div className="flex-1 space-y-1">
            <ConfidenceBar confidence={job.confidence} />
            <DecisionBadge decision={job.decision} />
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {job.skills.matched.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-1.5 py-0.5 text-xs rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
            >
              {skill}
            </span>
          ))}
          {job.skills.missing.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="px-1.5 py-0.5 text-xs rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
            >
              {skill}
            </span>
          ))}
          {job.skills.matched.length + job.skills.missing.length > 5 && (
            <span className="px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground">
              +{job.skills.matched.length + job.skills.missing.length - 5} more
            </span>
          )}
        </div>

        {/* Salary */}
        {salary && (
          <div className="text-sm font-mono">
            {salary.estimated ? (
              <span className="text-muted-foreground">Est: {salary.text}</span>
            ) : (
              <span>{salary.text}</span>
            )}
          </div>
        )}

        {/* Footer: Date + Status */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(job.postedAt)}
          </span>
          <Badge
            variant="outline"
            className={cn("text-xs", statusStyles[job.status])}
          >
            {statusLabels[job.status]}
          </Badge>
        </div>

        {/* Quick Actions (on hover) */}
        <div className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Star className="h-3.5 w-3.5 mr-1" />
            Bookmark
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Generate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowRight className="h-3.5 w-3.5 mr-1" />
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function JobCardView({ jobs, selectedJobs, onSelectJob }: JobCardViewProps) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </TooltipProvider>
  )
}
