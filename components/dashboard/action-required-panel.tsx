"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CompanyLogo } from "@/components/shared/company-logo"
import { PriorityTag } from "@/components/shared/priority-tag"
import { TimeAgo } from "@/components/shared/time-ago"
import { EmptyState } from "@/components/shared/empty-state"
import {
  Star,
  FileText,
  Mail,
  AlertTriangle,
  Calendar,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ActionType = "dream-match" | "review" | "follow-up" | "failed" | "interview-prep"

interface ActionItem {
  id: string
  type: ActionType
  priority: 1 | 2 | 3
  title: string
  company: string
  companyLogo?: string
  timestamp: Date
  actionLabel: string
  actionHref: string
}

const typeIcons: Record<ActionType, typeof Star> = {
  "dream-match": Star,
  review: FileText,
  "follow-up": Mail,
  failed: AlertTriangle,
  "interview-prep": Calendar,
}

// Mock data matching the spec
// Priority: 1 = Dream, 2 = High, 3 = Medium
const actionItems: ActionItem[] = [
  {
    id: "1",
    type: "dream-match",
    priority: 1, // Dream
    title: "Stripe — Platform Engineer scored 91",
    company: "Stripe",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
    actionLabel: "Review",
    actionHref: "/review?job=stripe-platform-engineer",
  },
  {
    id: "2",
    type: "review",
    priority: 2, // High
    title: "Resume ready: Google — SWE III",
    company: "Google",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4h ago
    actionLabel: "Review",
    actionHref: "/review?job=google-swe",
  },
  {
    id: "3",
    type: "failed",
    priority: 2, // High
    title: "Submission failed: Amazon",
    company: "Amazon",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6h ago
    actionLabel: "Retry",
    actionHref: "/applications?job=amazon&action=retry",
  },
  {
    id: "4",
    type: "follow-up",
    priority: 3, // Medium
    title: "Follow-up due: Razorpay recruiter",
    company: "Razorpay",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1d ago
    actionLabel: "Send",
    actionHref: "/outreach?contact=razorpay",
  },
  {
    id: "5",
    type: "interview-prep",
    priority: 3, // Medium
    title: "Interview prep: Meta — Day 12",
    company: "Meta",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2d ago
    actionLabel: "Prepare",
    actionHref: "/interview-prep?company=meta",
  },
]

interface ActionRequiredPanelProps {
  isLoading?: boolean
}

export function ActionRequiredPanel({ isLoading = false }: ActionRequiredPanelProps) {
  const totalActions = 16 // Mock total count

  if (isLoading) {
    return (
      <Card className="p-5">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-6 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-8 w-16 rounded" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (actionItems.length === 0) {
    return (
      <Card className="p-5">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Action Required</CardTitle>
            <Badge variant="secondary" className="font-mono text-xs">
              0
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <EmptyState
            icon={CheckCircle}
            title="All caught up!"
            description="No actions pending."
            actionLabel="Browse Jobs"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-5">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Action Required</CardTitle>
            <Badge className="bg-destructive text-destructive-foreground font-mono text-xs">
              {totalActions}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        {actionItems.map((item) => {
          const Icon = typeIcons[item.type]

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
              onClick={() => window.location.href = item.actionHref}
            >
              <PriorityTag priority={item.priority} />
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-2">
                  <CompanyLogo company={item.company} size="xs" />
                  <span className="text-xs text-muted-foreground">
                    {item.company}
                  </span>
                </div>
              </div>
              <TimeAgo date={item.timestamp} className="text-xs text-muted-foreground shrink-0" />
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  window.location.href = item.actionHref
                }}
              >
                {item.actionLabel}
              </Button>
            </div>
          )
        })}
        <Link
          href="/review"
          className="flex items-center justify-center gap-1 text-sm text-primary hover:underline pt-2"
        >
          View all ({totalActions})
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
