"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Star,
  FileText,
  Calendar,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ActivityType =
  | "applied"
  | "match"
  | "resume"
  | "interview"
  | "outreach"
  | "response"
  | "rejected"
  | "viewed"
  | "scheduled"

interface Activity {
  id: string
  type: ActivityType
  title: string
  company: string
  timestamp: string
  href: string
}

const typeConfig: Record<
  ActivityType,
  { icon: typeof Send; className: string }
> = {
  applied: {
    icon: Send,
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  match: {
    icon: Star,
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  resume: {
    icon: FileText,
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  interview: {
    icon: Calendar,
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  outreach: {
    icon: Mail,
    className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  response: {
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  rejected: {
    icon: XCircle,
    className: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  viewed: {
    icon: Eye,
    className: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
  scheduled: {
    icon: Clock,
    className: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
}

const activities: Activity[] = [
  {
    id: "1",
    type: "applied",
    title: "Applied to Senior Frontend Engineer",
    company: "Vercel",
    timestamp: "2h ago",
    href: "/dashboard/applications/1",
  },
  {
    id: "2",
    type: "interview",
    title: "Interview scheduled - Technical Round",
    company: "Stripe",
    timestamp: "3h ago",
    href: "/dashboard/interviews/2",
  },
  {
    id: "3",
    type: "match",
    title: "New job match (92% score)",
    company: "Linear",
    timestamp: "5h ago",
    href: "/dashboard/jobs/3",
  },
  {
    id: "4",
    type: "resume",
    title: "Resume tailored for application",
    company: "Notion",
    timestamp: "1d ago",
    href: "/dashboard/documents/4",
  },
  {
    id: "5",
    type: "outreach",
    title: "Outreach email sent",
    company: "Figma",
    timestamp: "1d ago",
    href: "/dashboard/outreach/5",
  },
  {
    id: "6",
    type: "response",
    title: "Received response",
    company: "Airbnb",
    timestamp: "2d ago",
    href: "/dashboard/applications/6",
  },
  {
    id: "7",
    type: "viewed",
    title: "Application viewed",
    company: "Shopify",
    timestamp: "2d ago",
    href: "/dashboard/applications/7",
  },
  {
    id: "8",
    type: "rejected",
    title: "Application declined",
    company: "Meta",
    timestamp: "3d ago",
    href: "/dashboard/applications/8",
  },
  {
    id: "9",
    type: "scheduled",
    title: "Phone screen scheduled",
    company: "Datadog",
    timestamp: "3d ago",
    href: "/dashboard/interviews/9",
  },
  {
    id: "10",
    type: "applied",
    title: "Applied to Staff Engineer",
    company: "Supabase",
    timestamp: "4d ago",
    href: "/dashboard/applications/10",
  },
  {
    id: "11",
    type: "match",
    title: "New job match (88% score)",
    company: "Planetscale",
    timestamp: "4d ago",
    href: "/dashboard/jobs/11",
  },
  {
    id: "12",
    type: "outreach",
    title: "Follow-up sent",
    company: "Clerk",
    timestamp: "5d ago",
    href: "/dashboard/outreach/12",
  },
  {
    id: "13",
    type: "resume",
    title: "Cover letter generated",
    company: "Railway",
    timestamp: "5d ago",
    href: "/dashboard/documents/13",
  },
  {
    id: "14",
    type: "applied",
    title: "Applied to Frontend Lead",
    company: "Retool",
    timestamp: "6d ago",
    href: "/dashboard/applications/14",
  },
  {
    id: "15",
    type: "interview",
    title: "Interview completed",
    company: "Loom",
    timestamp: "1w ago",
    href: "/dashboard/interviews/15",
  },
]

export function RecentActivity() {
  return (
    <Card className="p-5 h-full flex flex-col">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-[280px] pr-4">
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
                    "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
                      <span className="text-muted-foreground">
                        {activity.title.split(activity.company)[0]}
                      </span>
                      <span className="font-medium">{activity.company}</span>
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
