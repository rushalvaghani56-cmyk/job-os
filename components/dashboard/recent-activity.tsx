"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Target,
  FileText,
  CheckCircle,
  Mail,
  AlertTriangle,
  Star,
  Calendar,
  MessageSquare,
  BarChart3,
  Clock,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ActivityType =
  | "discovered"
  | "scored"
  | "resume"
  | "applied"
  | "follow-up"
  | "failed"
  | "dream-match"
  | "interview"
  | "copilot"
  | "report"

interface Activity {
  id: string
  type: ActivityType
  title: string
  company?: string
  timestamp: string
  href: string
}

const typeConfig: Record<ActivityType, { icon: typeof Search; className: string }> = {
  discovered: {
    icon: Search,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  scored: {
    icon: Target,
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  resume: {
    icon: FileText,
    className: "bg-primary/10 text-primary",
  },
  applied: {
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  "follow-up": {
    icon: Mail,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  failed: {
    icon: AlertTriangle,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  "dream-match": {
    icon: Star,
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  interview: {
    icon: Calendar,
    className: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  copilot: {
    icon: MessageSquare,
    className: "bg-secondary/50 text-secondary-foreground",
  },
  report: {
    icon: BarChart3,
    className: "bg-primary/10 text-primary",
  },
}

// Mock data per spec
const activities: Activity[] = [
  {
    id: "1",
    type: "discovered",
    title: "Discovered 47 jobs from 6 sources",
    timestamp: "2h ago",
    href: "/jobs?filter=new",
  },
  {
    id: "2",
    type: "scored",
    title: "Scored 12 new jobs",
    timestamp: "2h ago",
    href: "/jobs?filter=scored",
  },
  {
    id: "3",
    type: "resume",
    title: "Resume generated",
    company: "Stripe",
    timestamp: "3h ago",
    href: "/review?job=stripe",
  },
  {
    id: "4",
    type: "applied",
    title: "Application submitted",
    company: "Google",
    timestamp: "5h ago",
    href: "/applications?company=google",
  },
  {
    id: "5",
    type: "follow-up",
    title: "Follow-up sent",
    company: "Razorpay",
    timestamp: "6h ago",
    href: "/outreach?company=razorpay",
  },
  {
    id: "6",
    type: "failed",
    title: "Submission failed (CAPTCHA)",
    company: "Amazon",
    timestamp: "8h ago",
    href: "/applications?company=amazon&status=failed",
  },
  {
    id: "7",
    type: "dream-match",
    title: "Dream company match!",
    company: "Vercel",
    timestamp: "12h ago",
    href: "/jobs?company=vercel",
  },
  {
    id: "8",
    type: "interview",
    title: "Interview scheduled",
    company: "Meta",
    timestamp: "1d ago",
    href: "/interview-prep?company=meta",
  },
  {
    id: "9",
    type: "copilot",
    title: "Copilot insight generated",
    timestamp: "1d ago",
    href: "/copilot",
  },
  {
    id: "10",
    type: "report",
    title: "Weekly report ready",
    timestamp: "2d ago",
    href: "/analytics?report=weekly",
  },
  {
    id: "11",
    type: "applied",
    title: "Application submitted",
    company: "Linear",
    timestamp: "2d ago",
    href: "/applications?company=linear",
  },
  {
    id: "12",
    type: "resume",
    title: "Cover letter generated",
    company: "Notion",
    timestamp: "3d ago",
    href: "/review?job=notion",
  },
  {
    id: "13",
    type: "discovered",
    title: "Discovered 38 jobs from 5 sources",
    timestamp: "3d ago",
    href: "/jobs?filter=new",
  },
  {
    id: "14",
    type: "interview",
    title: "Interview completed",
    company: "Figma",
    timestamp: "4d ago",
    href: "/interview-prep?company=figma",
  },
  {
    id: "15",
    type: "follow-up",
    title: "Follow-up sent",
    company: "Shopify",
    timestamp: "5d ago",
    href: "/outreach?company=shopify",
  },
]

interface RecentActivityProps {
  isLoading?: boolean
}

export function RecentActivity({ isLoading = false }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card className="p-5 h-full flex flex-col">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 min-h-0">
          <div className="space-y-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-2">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-5 h-full flex flex-col">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </div>
          <Link
            href="/activity"
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-1">
            {activities.map((activity) => {
              const config = typeConfig[activity.type]
              const Icon = config.icon

              return (
                <Link
                  key={activity.id}
                  href={activity.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-2 py-2 transition-colors",
                    "hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                      config.className
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      <span className="text-muted-foreground">{activity.title}</span>
                      {activity.company && (
                        <>
                          {" "}
                          <span className="font-medium text-foreground">{activity.company}</span>
                        </>
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {activity.timestamp}
                  </span>
                </Link>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
