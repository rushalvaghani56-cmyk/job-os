"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  FileText,
  Mail,
  Clock,
  AlertTriangle,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ActionPriority = "dream" | "high" | "medium"
type ActionType = "dream-match" | "review" | "follow-up" | "failed" | "interview-prep"

interface ActionItem {
  id: string
  type: ActionType
  priority: ActionPriority
  title: string
  company: string
  companyLogo?: string
  age: string
  actionLabel: string
  actionHref: string
}

const priorityConfig: Record<
  ActionPriority,
  { label: string; className: string }
> = {
  dream: {
    label: "Dream",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  high: {
    label: "High",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
  medium: {
    label: "Medium",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
}

const typeIcons: Record<ActionType, typeof Star> = {
  "dream-match": Star,
  review: FileText,
  "follow-up": Mail,
  failed: AlertTriangle,
  "interview-prep": Calendar,
}

const actionItems: ActionItem[] = [
  {
    id: "1",
    type: "dream-match",
    priority: "dream",
    title: "New match at dream company",
    company: "Linear",
    companyLogo: "/logos/linear.svg",
    age: "2h ago",
    actionLabel: "Review",
    actionHref: "/dashboard/jobs/1",
  },
  {
    id: "2",
    type: "review",
    priority: "high",
    title: "Senior Frontend Engineer",
    company: "Vercel",
    companyLogo: "/logos/vercel.svg",
    age: "4h ago",
    actionLabel: "Review",
    actionHref: "/dashboard/jobs/2",
  },
  {
    id: "3",
    type: "follow-up",
    priority: "high",
    title: "Follow-up due",
    company: "Stripe",
    companyLogo: "/logos/stripe.svg",
    age: "1d ago",
    actionLabel: "Send",
    actionHref: "/dashboard/outreach/3",
  },
  {
    id: "4",
    type: "failed",
    priority: "medium",
    title: "Submission failed - retry",
    company: "Notion",
    companyLogo: "/logos/notion.svg",
    age: "3h ago",
    actionLabel: "Retry",
    actionHref: "/dashboard/applications/4",
  },
  {
    id: "5",
    type: "interview-prep",
    priority: "high",
    title: "Interview prep ready",
    company: "Figma",
    companyLogo: "/logos/figma.svg",
    age: "5h ago",
    actionLabel: "Prepare",
    actionHref: "/dashboard/interviews/5",
  },
]

export function ActionRequiredPanel() {
  const totalActions = actionItems.length

  return (
    <Card className="p-5">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Action Required</CardTitle>
            <Badge variant="secondary" className="font-mono text-xs">
              {totalActions}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        {actionItems.map((item) => {
          const Icon = typeIcons[item.type]
          const priority = priorityConfig[item.priority]

          return (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <Badge
                variant="outline"
                className={cn("shrink-0 text-xs", priority.className)}
              >
                {priority.label}
              </Badge>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={item.companyLogo} alt={item.company} />
                    <AvatarFallback className="text-[8px]">
                      {item.company.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {item.company}
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {item.age}
              </span>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="shrink-0 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Link href={item.actionHref}>{item.actionLabel}</Link>
              </Button>
            </div>
          )
        })}
        <Link
          href="/dashboard/actions"
          className="flex items-center justify-center gap-1 text-sm text-primary hover:underline pt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
