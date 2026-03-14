"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import {
  SearchIcon,
  DownloadIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CalendarIcon,
  ExternalLinkIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

// Types
type Actor = "system" | "user" | "ai"
type EntityType = "job" | "application" | "content" | "profile" | "outreach" | "settings"

interface ActivityLog {
  id: string
  timestamp: Date
  action: string
  actor: Actor
  entityType: EntityType
  entityId: string
  entityLabel: string
  profileId?: string
  profileName?: string
  detail: Record<string, unknown>
}

// Mock data
const mockActivityLogs: ActivityLog[] = [
  {
    id: "log_001",
    timestamp: new Date("2026-03-14T14:32:00"),
    action: "job.scored",
    actor: "ai",
    entityType: "job",
    entityId: "job_abc123",
    entityLabel: "Senior Frontend Engineer at Vercel",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      score: 92,
      matchReasons: ["React expertise", "Remote-friendly", "Salary match"],
      model: "gpt-4-turbo",
      processingTime: "1.2s",
    },
  },
  {
    id: "log_002",
    timestamp: new Date("2026-03-14T14:28:00"),
    action: "content.generated",
    actor: "ai",
    entityType: "content",
    entityId: "content_def456",
    entityLabel: "Cover Letter - Vercel",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      contentType: "cover_letter",
      wordCount: 320,
      model: "gpt-4-turbo",
      template: "professional",
      tokensUsed: 1250,
    },
  },
  {
    id: "log_003",
    timestamp: new Date("2026-03-14T13:45:00"),
    action: "application.submitted",
    actor: "user",
    entityType: "application",
    entityId: "app_ghi789",
    entityLabel: "Application to Stripe",
    detail: {
      jobTitle: "Staff Engineer",
      company: "Stripe",
      method: "manual",
      documentsAttached: ["resume_v3.pdf", "cover_letter.pdf"],
    },
  },
  {
    id: "log_004",
    timestamp: new Date("2026-03-14T12:15:00"),
    action: "outreach.sent",
    actor: "system",
    entityType: "outreach",
    entityId: "outreach_jkl012",
    entityLabel: "Email to John Doe",
    detail: {
      channel: "email",
      recipient: "john.doe@stripe.com",
      subject: "Following up on my application",
      status: "delivered",
    },
  },
  {
    id: "log_005",
    timestamp: new Date("2026-03-14T11:00:00"),
    action: "profile.updated",
    actor: "user",
    entityType: "profile",
    entityId: "profile_001",
    entityLabel: "Frontend Developer Profile",
    detail: {
      fieldsUpdated: ["skills", "target_salary"],
      previousValues: {
        skills: ["React", "TypeScript"],
        target_salary: "$150k-$180k",
      },
      newValues: {
        skills: ["React", "TypeScript", "Next.js"],
        target_salary: "$160k-$200k",
      },
    },
  },
  {
    id: "log_006",
    timestamp: new Date("2026-03-14T10:30:00"),
    action: "job.discovered",
    actor: "system",
    entityType: "job",
    entityId: "job_mno345",
    entityLabel: "Product Engineer at Linear",
    detail: {
      source: "linkedin",
      matchScore: 88,
      autoSaved: true,
    },
  },
  {
    id: "log_007",
    timestamp: new Date("2026-03-13T16:45:00"),
    action: "content.approved",
    actor: "user",
    entityType: "content",
    entityId: "content_pqr678",
    entityLabel: "Resume - Backend Focus",
    profileId: "profile_002",
    profileName: "Backend Engineer",
    detail: {
      contentType: "resume",
      version: 2,
      approvalNote: "Looks good, ready to send",
    },
  },
  {
    id: "log_008",
    timestamp: new Date("2026-03-13T15:20:00"),
    action: "settings.changed",
    actor: "user",
    entityType: "settings",
    entityId: "settings_001",
    entityLabel: "AI Model Settings",
    detail: {
      setting: "default_model",
      previousValue: "gpt-4",
      newValue: "gpt-4-turbo",
    },
  },
  {
    id: "log_009",
    timestamp: new Date("2026-03-13T14:00:00"),
    action: "application.status_changed",
    actor: "system",
    entityType: "application",
    entityId: "app_stu901",
    entityLabel: "Application to Netflix",
    detail: {
      previousStatus: "applied",
      newStatus: "interview",
      trigger: "email_detected",
      emailSubject: "Interview Invitation - Netflix",
    },
  },
  {
    id: "log_010",
    timestamp: new Date("2026-03-13T09:15:00"),
    action: "job.rejected",
    actor: "ai",
    entityType: "job",
    entityId: "job_vwx234",
    entityLabel: "Junior Developer at Startup XYZ",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      reason: "below_seniority_threshold",
      score: 45,
      threshold: 70,
    },
  },
  {
    id: "log_011",
    timestamp: new Date("2026-03-13T08:30:00"),
    action: "content.generated",
    actor: "ai",
    entityType: "content",
    entityId: "content_abc111",
    entityLabel: "Resume - Stripe Staff Engineer",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      contentType: "resume",
      variant: "A",
      tokensUsed: 2100,
      model: "gpt-4-turbo",
    },
  },
  {
    id: "log_012",
    timestamp: new Date("2026-03-13T07:45:00"),
    action: "job.discovered",
    actor: "system",
    entityType: "job",
    entityId: "job_disc012",
    entityLabel: "Platform Engineer at Ramp",
    detail: {
      source: "indeed",
      matchScore: 91,
      autoSaved: true,
    },
  },
  {
    id: "log_013",
    timestamp: new Date("2026-03-12T18:00:00"),
    action: "application.submitted",
    actor: "user",
    entityType: "application",
    entityId: "app_sub013",
    entityLabel: "Application to Airbnb",
    detail: {
      jobTitle: "Senior Software Engineer",
      company: "Airbnb",
      method: "manual",
      documentsAttached: ["resume_airbnb.pdf"],
    },
  },
  {
    id: "log_014",
    timestamp: new Date("2026-03-12T16:30:00"),
    action: "outreach.replied",
    actor: "system",
    entityType: "outreach",
    entityId: "outreach_rep014",
    entityLabel: "Reply from Sarah at Notion",
    detail: {
      channel: "email",
      sentiment: "positive",
      responseTime: "2 days",
    },
  },
  {
    id: "log_015",
    timestamp: new Date("2026-03-12T15:00:00"),
    action: "job.scored",
    actor: "ai",
    entityType: "job",
    entityId: "job_score015",
    entityLabel: "Staff Engineer at Figma",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      score: 88,
      matchReasons: ["Design systems", "Remote", "Competitive salary"],
      model: "gpt-4-turbo",
    },
  },
  {
    id: "log_016",
    timestamp: new Date("2026-03-12T14:15:00"),
    action: "content.approved",
    actor: "user",
    entityType: "content",
    entityId: "content_app016",
    entityLabel: "Cover Letter - Netflix",
    detail: {
      contentType: "cover_letter",
      version: 1,
      approvalNote: "Great opening paragraph",
    },
  },
  {
    id: "log_017",
    timestamp: new Date("2026-03-12T13:00:00"),
    action: "profile.created",
    actor: "user",
    entityType: "profile",
    entityId: "profile_003",
    entityLabel: "Full Stack Engineer Profile",
    detail: {
      clonedFrom: "profile_001",
      targetRoles: ["Full Stack Engineer", "Software Engineer"],
    },
  },
  {
    id: "log_018",
    timestamp: new Date("2026-03-12T11:30:00"),
    action: "settings.changed",
    actor: "user",
    entityType: "settings",
    entityId: "settings_018",
    entityLabel: "Automation Settings",
    detail: {
      setting: "auto_apply_enabled",
      previousValue: false,
      newValue: true,
    },
  },
  {
    id: "log_019",
    timestamp: new Date("2026-03-12T10:00:00"),
    action: "job.discovered",
    actor: "system",
    entityType: "job",
    entityId: "job_disc019",
    entityLabel: "47 jobs from morning discovery",
    detail: {
      sources: ["linkedin", "indeed", "greenhouse"],
      totalJobs: 47,
      highScoreJobs: 8,
    },
  },
  {
    id: "log_020",
    timestamp: new Date("2026-03-12T09:00:00"),
    action: "outreach.sent",
    actor: "system",
    entityType: "outreach",
    entityId: "outreach_sent020",
    entityLabel: "Follow-up to recruiter at Meta",
    detail: {
      channel: "linkedin",
      type: "follow_up",
      dayNumber: 7,
    },
  },
  {
    id: "log_021",
    timestamp: new Date("2026-03-11T17:45:00"),
    action: "application.status_changed",
    actor: "system",
    entityType: "application",
    entityId: "app_status021",
    entityLabel: "Application to Google",
    detail: {
      previousStatus: "applied",
      newStatus: "rejected",
      trigger: "email_detected",
    },
  },
  {
    id: "log_022",
    timestamp: new Date("2026-03-11T16:30:00"),
    action: "content.generated",
    actor: "ai",
    entityType: "content",
    entityId: "content_gen022",
    entityLabel: "Resume Variant B - Stripe",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      contentType: "resume",
      variant: "B",
      tokensUsed: 2250,
      improvements: ["Added metrics", "Highlighted leadership"],
    },
  },
  {
    id: "log_023",
    timestamp: new Date("2026-03-11T15:00:00"),
    action: "job.scored",
    actor: "ai",
    entityType: "job",
    entityId: "job_score023",
    entityLabel: "Senior Engineer at Shopify",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      score: 85,
      matchReasons: ["E-commerce experience", "Remote OK"],
    },
  },
  {
    id: "log_024",
    timestamp: new Date("2026-03-11T14:00:00"),
    action: "profile.updated",
    actor: "user",
    entityType: "profile",
    entityId: "profile_001",
    entityLabel: "Frontend Developer Profile",
    detail: {
      fieldsUpdated: ["dream_companies"],
      addedCompanies: ["Anthropic", "Perplexity"],
    },
  },
  {
    id: "log_025",
    timestamp: new Date("2026-03-11T12:30:00"),
    action: "application.submitted",
    actor: "system",
    entityType: "application",
    entityId: "app_auto025",
    entityLabel: "Auto-applied to Linear",
    detail: {
      jobTitle: "Staff Frontend Engineer",
      company: "Linear",
      method: "automated",
      score: 94,
    },
  },
  {
    id: "log_026",
    timestamp: new Date("2026-03-11T11:00:00"),
    action: "outreach.sent",
    actor: "system",
    entityType: "outreach",
    entityId: "outreach_init026",
    entityLabel: "Initial outreach to Vercel recruiter",
    detail: {
      channel: "linkedin",
      type: "cold_outreach",
      messageLength: 150,
    },
  },
  {
    id: "log_027",
    timestamp: new Date("2026-03-11T10:00:00"),
    action: "job.discovered",
    actor: "system",
    entityType: "job",
    entityId: "job_disc027",
    entityLabel: "32 jobs from LinkedIn",
    detail: {
      source: "linkedin",
      totalJobs: 32,
      dreamCompanyMatches: 2,
    },
  },
  {
    id: "log_028",
    timestamp: new Date("2026-03-11T09:00:00"),
    action: "settings.changed",
    actor: "user",
    entityType: "settings",
    entityId: "settings_028",
    entityLabel: "Scoring Weights",
    detail: {
      setting: "salary_weight",
      previousValue: 20,
      newValue: 25,
    },
  },
  {
    id: "log_029",
    timestamp: new Date("2026-03-10T18:00:00"),
    action: "content.rejected",
    actor: "user",
    entityType: "content",
    entityId: "content_rej029",
    entityLabel: "Cover Letter - Amazon",
    detail: {
      contentType: "cover_letter",
      reason: "Too generic, needs more personalization",
      requestedChanges: ["Add specific project mentions"],
    },
  },
  {
    id: "log_030",
    timestamp: new Date("2026-03-10T16:45:00"),
    action: "job.scored",
    actor: "ai",
    entityType: "job",
    entityId: "job_score030",
    entityLabel: "Engineering Manager at Datadog",
    profileId: "profile_002",
    profileName: "Backend Engineer",
    detail: {
      score: 78,
      matchReasons: ["Backend focus", "Management experience needed"],
    },
  },
  {
    id: "log_031",
    timestamp: new Date("2026-03-10T15:30:00"),
    action: "application.status_changed",
    actor: "system",
    entityType: "application",
    entityId: "app_status031",
    entityLabel: "Application to Coinbase",
    detail: {
      previousStatus: "applied",
      newStatus: "ghosted",
      daysSinceApply: 14,
    },
  },
  {
    id: "log_032",
    timestamp: new Date("2026-03-10T14:00:00"),
    action: "content.generated",
    actor: "ai",
    entityType: "content",
    entityId: "content_gen032",
    entityLabel: "Application Answers - Notion",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      contentType: "answers",
      questionCount: 5,
      tokensUsed: 1800,
    },
  },
  {
    id: "log_033",
    timestamp: new Date("2026-03-10T12:30:00"),
    action: "outreach.replied",
    actor: "system",
    entityType: "outreach",
    entityId: "outreach_rep033",
    entityLabel: "Reply from hiring manager at Stripe",
    detail: {
      channel: "email",
      sentiment: "interested",
      nextStep: "Schedule call",
    },
  },
  {
    id: "log_034",
    timestamp: new Date("2026-03-10T11:00:00"),
    action: "job.discovered",
    actor: "system",
    entityType: "job",
    entityId: "job_disc034",
    entityLabel: "Dream company alert: Anthropic",
    detail: {
      source: "greenhouse",
      company: "Anthropic",
      matchScore: 96,
      isDreamCompany: true,
    },
  },
  {
    id: "log_035",
    timestamp: new Date("2026-03-10T09:30:00"),
    action: "profile.updated",
    actor: "user",
    entityType: "profile",
    entityId: "profile_002",
    entityLabel: "Backend Engineer Profile",
    detail: {
      fieldsUpdated: ["target_locations"],
      addedLocations: ["San Francisco", "New York"],
    },
  },
  {
    id: "log_036",
    timestamp: new Date("2026-03-09T17:00:00"),
    action: "application.submitted",
    actor: "user",
    entityType: "application",
    entityId: "app_sub036",
    entityLabel: "Application to OpenAI",
    detail: {
      jobTitle: "Research Engineer",
      company: "OpenAI",
      method: "manual",
      documentsAttached: ["resume_ml.pdf", "cover_letter.pdf", "publications.pdf"],
    },
  },
  {
    id: "log_037",
    timestamp: new Date("2026-03-09T15:30:00"),
    action: "content.approved",
    actor: "user",
    entityType: "content",
    entityId: "content_app037",
    entityLabel: "Resume - Vercel",
    detail: {
      contentType: "resume",
      version: 2,
      improvements: ["Better metrics", "Clearer impact statements"],
    },
  },
  {
    id: "log_038",
    timestamp: new Date("2026-03-09T14:00:00"),
    action: "job.scored",
    actor: "ai",
    entityType: "job",
    entityId: "job_score038",
    entityLabel: "Principal Engineer at Plaid",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      score: 82,
      matchReasons: ["Fintech", "Senior level", "Remote option"],
    },
  },
  {
    id: "log_039",
    timestamp: new Date("2026-03-09T12:00:00"),
    action: "settings.changed",
    actor: "user",
    entityType: "settings",
    entityId: "settings_039",
    entityLabel: "Discovery Schedule",
    detail: {
      setting: "discovery_frequency",
      previousValue: "daily",
      newValue: "twice_daily",
    },
  },
  {
    id: "log_040",
    timestamp: new Date("2026-03-09T10:30:00"),
    action: "outreach.sent",
    actor: "system",
    entityType: "outreach",
    entityId: "outreach_sent040",
    entityLabel: "Thank you email to Netflix interviewer",
    detail: {
      channel: "email",
      type: "thank_you",
      personalized: true,
    },
  },
  {
    id: "log_041",
    timestamp: new Date("2026-03-09T09:00:00"),
    action: "job.discovered",
    actor: "system",
    entityType: "job",
    entityId: "job_disc041",
    entityLabel: "Morning discovery: 28 jobs",
    detail: {
      sources: ["linkedin", "glassdoor"],
      totalJobs: 28,
      autoScored: 28,
    },
  },
  {
    id: "log_042",
    timestamp: new Date("2026-03-08T17:30:00"),
    action: "application.status_changed",
    actor: "system",
    entityType: "application",
    entityId: "app_status042",
    entityLabel: "Application to Netflix",
    detail: {
      previousStatus: "interview",
      newStatus: "offer",
      trigger: "email_detected",
    },
  },
  {
    id: "log_043",
    timestamp: new Date("2026-03-08T16:00:00"),
    action: "content.generated",
    actor: "ai",
    entityType: "content",
    entityId: "content_gen043",
    entityLabel: "Cover Letter - Figma",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      contentType: "cover_letter",
      wordCount: 280,
      tokensUsed: 950,
    },
  },
  {
    id: "log_044",
    timestamp: new Date("2026-03-08T14:30:00"),
    action: "job.rejected",
    actor: "ai",
    entityType: "job",
    entityId: "job_rej044",
    entityLabel: "Entry Level Developer at Startup ABC",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      reason: "seniority_mismatch",
      score: 38,
      threshold: 70,
    },
  },
  {
    id: "log_045",
    timestamp: new Date("2026-03-08T13:00:00"),
    action: "profile.updated",
    actor: "user",
    entityType: "profile",
    entityId: "profile_001",
    entityLabel: "Frontend Developer Profile",
    detail: {
      fieldsUpdated: ["min_salary"],
      previousValue: "$150,000",
      newValue: "$180,000",
    },
  },
  {
    id: "log_046",
    timestamp: new Date("2026-03-08T11:30:00"),
    action: "outreach.sent",
    actor: "system",
    entityType: "outreach",
    entityId: "outreach_sent046",
    entityLabel: "LinkedIn connection to recruiter at Ramp",
    detail: {
      channel: "linkedin",
      type: "connection_request",
      includesNote: true,
    },
  },
  {
    id: "log_047",
    timestamp: new Date("2026-03-08T10:00:00"),
    action: "job.scored",
    actor: "ai",
    entityType: "job",
    entityId: "job_score047",
    entityLabel: "Tech Lead at Notion",
    profileId: "profile_001",
    profileName: "Frontend Developer",
    detail: {
      score: 94,
      matchReasons: ["Dream company", "Tech leadership", "Product focus"],
      bonusPoints: 5,
    },
  },
  {
    id: "log_048",
    timestamp: new Date("2026-03-08T09:00:00"),
    action: "job.discovered",
    actor: "system",
    entityType: "job",
    entityId: "job_disc048",
    entityLabel: "Evening discovery: 19 jobs",
    detail: {
      sources: ["indeed", "builtin"],
      totalJobs: 19,
      newCompanies: 3,
    },
  },
  {
    id: "log_049",
    timestamp: new Date("2026-03-07T18:00:00"),
    action: "content.approved",
    actor: "user",
    entityType: "content",
    entityId: "content_app049",
    entityLabel: "Resume - Linear",
    detail: {
      contentType: "resume",
      version: 1,
      approvalNote: "Perfect for this role",
    },
  },
  {
    id: "log_050",
    timestamp: new Date("2026-03-07T16:30:00"),
    action: "settings.changed",
    actor: "user",
    entityType: "settings",
    entityId: "settings_050",
    entityLabel: "Notification Preferences",
    detail: {
      setting: "email_digest",
      previousValue: "weekly",
      newValue: "daily",
    },
  },
]

const profiles = [
  { id: "all", name: "All Profiles" },
  { id: "profile_001", name: "Frontend Developer" },
  { id: "profile_002", name: "Backend Engineer" },
  { id: "profile_003", name: "Full Stack" },
]

const actionTypes = [
  { id: "all", name: "All Actions" },
  { id: "job", name: "Job Actions" },
  { id: "application", name: "Application Actions" },
  { id: "content", name: "Content Actions" },
  { id: "profile", name: "Profile Actions" },
  { id: "outreach", name: "Outreach Actions" },
  { id: "settings", name: "Settings Actions" },
]

const entityTypes = [
  { id: "all", name: "All Entities" },
  { id: "job", name: "Jobs" },
  { id: "application", name: "Applications" },
  { id: "content", name: "Content" },
  { id: "profile", name: "Profiles" },
  { id: "outreach", name: "Outreach" },
  { id: "settings", name: "Settings" },
]

function getActorBadgeStyles(actor: Actor) {
  switch (actor) {
    case "system":
      return "bg-muted text-muted-foreground border-transparent"
    case "user":
      return "bg-primary/10 text-primary border-primary/20"
    case "ai":
      return "bg-chart-4/10 text-chart-4 border-chart-4/20"
  }
}

function getEntityLink(entityType: EntityType, entityId: string) {
  switch (entityType) {
    case "job":
      return `/jobs/${entityId}`
    case "application":
      return `/applications?id=${entityId}`
    case "content":
      return `/review?id=${entityId}`
    case "profile":
      return `/profiles?id=${entityId}`
    case "outreach":
      return `/outreach?id=${entityId}`
    case "settings":
      return `/settings`
    default:
      return "#"
  }
}

function ActivityRow({ log, isEven }: { log: ActivityLog; isEven: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <TableRow
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "cursor-pointer transition-colors",
          isEven ? "bg-background" : "bg-surface",
          isOpen && "bg-surface-raised"
        )}
      >
        <TableCell className="w-[180px]">
          <span className="font-mono text-xs text-muted-foreground">
            {format(log.timestamp, "MMM dd, HH:mm:ss")}
          </span>
        </TableCell>
        <TableCell>
          <span className="text-sm">{log.action}</span>
        </TableCell>
        <TableCell>
          <Badge
            variant="outline"
            className={cn(
              "text-xs font-medium capitalize",
              getActorBadgeStyles(log.actor)
            )}
          >
            {log.actor}
          </Badge>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground capitalize">
              {log.entityType}
            </span>
            <a
              href={getEntityLink(log.entityType, log.entityId)}
              onClick={(e) => e.stopPropagation()}
              className="group inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
            >
              {log.entityId.slice(0, 12)}...
              <ExternalLinkIcon className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </TableCell>
        <TableCell className="text-right">
          {isOpen ? (
            <ChevronDownIcon className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          )}
        </TableCell>
      </TableRow>
      {isOpen && (
        <tr>
          <td colSpan={5} className="p-0">
            <div className="bg-surface-raised border-y border-border px-4 py-3">
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                {log.entityLabel}
                {log.profileName && (
                  <span className="ml-2 text-foreground">
                    Profile: {log.profileName}
                  </span>
                )}
              </div>
              <pre className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs">
                <code className="text-foreground">
                  {JSON.stringify(log.detail, null, 2)}
                </code>
              </pre>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function ActivityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actorFilter, setActorFilter] = useState<Actor | "all">("all")
  const [actionTypeFilter, setActionTypeFilter] = useState("all")
  const [profileFilter, setProfileFilter] = useState("all")
  const [entityTypeFilter, setEntityTypeFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const filteredLogs = useMemo(() => {
    return mockActivityLogs.filter((log) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          log.action.toLowerCase().includes(query) ||
          log.entityLabel.toLowerCase().includes(query) ||
          log.entityId.toLowerCase().includes(query) ||
          JSON.stringify(log.detail).toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Actor filter
      if (actorFilter !== "all" && log.actor !== actorFilter) return false

      // Action type filter
      if (actionTypeFilter !== "all" && !log.action.startsWith(actionTypeFilter))
        return false

      // Profile filter
      if (profileFilter !== "all" && log.profileId !== profileFilter) return false

      // Entity type filter
      if (entityTypeFilter !== "all" && log.entityType !== entityTypeFilter)
        return false

      // Date range filter
      if (dateRange.from && log.timestamp < dateRange.from) return false
      if (dateRange.to) {
        const endOfDay = new Date(dateRange.to)
        endOfDay.setHours(23, 59, 59, 999)
        if (log.timestamp > endOfDay) return false
      }

      return true
    })
  }, [
    searchQuery,
    actorFilter,
    actionTypeFilter,
    profileFilter,
    entityTypeFilter,
    dateRange,
  ])

  const { toast } = useToast()
  
  const handleExportCSV = () => {
    const headers = ["Timestamp", "Action", "Actor", "Entity Type", "Entity ID", "Detail"]
    const rows = filteredLogs.map((log) => [
      format(log.timestamp, "yyyy-MM-dd HH:mm:ss"),
      log.action,
      log.actor,
      log.entityType,
      log.entityId,
      JSON.stringify(log.detail),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `activity-log-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    toast({
      title: "Export complete",
      description: `Exported ${filteredLogs.length} activity log entries to CSV`,
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Activity Log</h1>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="shrink-0 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <DownloadIcon className="mr-2 size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-muted/30 px-4 py-3">
        {/* Date Range Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal focus-visible:ring-2 focus-visible:ring-primary",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 size-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd")} -{" "}
                    {format(dateRange.to, "LLL dd")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, yyyy")
                )
              ) : (
                "Date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) =>
                setDateRange({ from: range?.from, to: range?.to })
              }
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* Actor Filter */}
        <Select
          value={actorFilter}
          onValueChange={(v) => setActorFilter(v as Actor | "all")}
        >
          <SelectTrigger className="w-[130px] focus-visible:ring-2 focus-visible:ring-primary">
            <SelectValue placeholder="Actor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actors</SelectItem>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="ai">AI</SelectItem>
          </SelectContent>
        </Select>

        {/* Action Type Filter */}
        <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
          <SelectTrigger className="w-[160px] focus-visible:ring-2 focus-visible:ring-primary">
            <SelectValue placeholder="Action type" />
          </SelectTrigger>
          <SelectContent>
            {actionTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Profile Filter */}
        <Select value={profileFilter} onValueChange={setProfileFilter}>
          <SelectTrigger className="w-[160px] focus-visible:ring-2 focus-visible:ring-primary">
            <SelectValue placeholder="Profile" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Entity Type Filter */}
        <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
          <SelectTrigger className="w-[140px] focus-visible:ring-2 focus-visible:ring-primary">
            <SelectValue placeholder="Entity type" />
          </SelectTrigger>
          <SelectContent>
            {entityTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {(dateRange.from ||
          actorFilter !== "all" ||
          actionTypeFilter !== "all" ||
          profileFilter !== "all" ||
          entityTypeFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDateRange({ from: undefined, to: undefined })
              setActorFilter("all")
              setActionTypeFilter("all")
              setProfileFilter("all")
              setEntityTypeFilter("all")
            }}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="w-[100px]">Actor</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="text-muted-foreground">
                    <p className="text-sm">No activity logs found</p>
                    <p className="text-xs mt-1">
                      Try adjusting your filters or search query
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log, index) => (
                <ActivityRow key={log.id} log={log} isEven={index % 2 === 0} />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
        <span>
          Showing <span className="font-mono text-foreground">{filteredLogs.length}</span> of{" "}
          <span className="font-mono text-foreground">{mockActivityLogs.length}</span> entries
        </span>
        <span>
          Last updated:{" "}
          <span className="font-mono text-foreground">
            {format(new Date(), "HH:mm:ss")}
          </span>
        </span>
      </div>
    </div>
  )
}
