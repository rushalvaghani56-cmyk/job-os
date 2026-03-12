"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  Star,
  Sparkles,
  ArrowRight,
  MoreHorizontal,
  Linkedin,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScoreBadge, ConfidenceBar } from "./score-badge"
import type { Job, SortOption } from "./types"

interface JobTableViewProps {
  jobs: Job[]
  selectedJobs: string[]
  onSelectJob: (jobId: string) => void
  onSelectAll: (selected: boolean) => void
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
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
  if (!salary) return "-"
  const format = (n: number) => `$${(n / 1000).toFixed(0)}k`
  return `${format(salary.min)} - ${format(salary.max)}${salary.estimated ? "*" : ""}`
}

export function JobTableView({
  jobs,
  selectedJobs,
  onSelectJob,
  onSelectAll,
  sortOption,
  onSortChange,
}: JobTableViewProps) {
  const allSelected = jobs.length > 0 && selectedJobs.length === jobs.length
  const someSelected = selectedJobs.length > 0 && selectedJobs.length < jobs.length

  const SortableHeader = ({ 
    label, 
    sortKey, 
    className 
  }: { 
    label: string
    sortKey: SortOption
    className?: string 
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-8 -ml-3 font-medium hover:bg-transparent", className)}
      onClick={() => onSortChange(sortKey)}
    >
      {label}
      <ArrowUpDown className={cn(
        "ml-1 h-3 w-3",
        sortOption === sortKey ? "text-primary" : "text-muted-foreground"
      )} />
    </Button>
  )

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                // Handle indeterminate state visually
                data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
                aria-label="Select all jobs"
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
            </TableHead>
            <TableHead className="min-w-[180px]">
              <SortableHeader label="Company" sortKey="company_asc" />
            </TableHead>
            <TableHead className="min-w-[200px]">Title</TableHead>
            <TableHead className="w-20">
              <SortableHeader label="Score" sortKey="score_desc" />
            </TableHead>
            <TableHead className="w-24">Confidence</TableHead>
            <TableHead className="w-28">
              <SortableHeader label="Status" sortKey="status" />
            </TableHead>
            <TableHead className="min-w-[140px]">Location</TableHead>
            <TableHead className="w-24">Seniority</TableHead>
            <TableHead className="w-32">
              <SortableHeader label="Salary" sortKey="salary_desc" />
            </TableHead>
            <TableHead className="w-20">
              <SortableHeader label="Posted" sortKey="date_desc" />
            </TableHead>
            <TableHead className="w-10">Source</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow
              key={job.id}
              className={cn(
                "group cursor-pointer",
                selectedJobs.includes(job.id) && "bg-primary/5",
                job.isBlacklisted && "opacity-50",
                job.isPotentialScam && "bg-red-500/5"
              )}
            >
              <TableCell>
                <Checkbox
                  checked={selectedJobs.includes(job.id)}
                  onCheckedChange={() => onSelectJob(job.id)}
                  aria-label={`Select ${job.title} at ${job.company.name}`}
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </TableCell>
              <TableCell>
                <Link 
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-medium">
                    {job.company.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{job.company.name}</span>
                    {job.company.isDreamCompany && (
                      <span className="text-xs text-amber-600 dark:text-amber-400">Dream Company</span>
                    )}
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <Link 
                  href={`/jobs/${job.id}`}
                  className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                >
                  {job.title}
                </Link>
              </TableCell>
              <TableCell>
                <ScoreBadge score={job.score} size="sm" />
              </TableCell>
              <TableCell>
                <ConfidenceBar confidence={job.confidence} />
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("text-xs", statusStyles[job.status])}
                >
                  {statusLabels[job.status]}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">{job.location}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {seniorityLabels[job.seniority]}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-mono">
                  {formatSalary(job.salary)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatDate(job.postedAt)}
                </span>
              </TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{getSourceIcon(job.source)}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{job.source.replace("_", " ")}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Bookmark</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Generate Content</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Apply</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}
