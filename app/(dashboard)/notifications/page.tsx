"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Star,
  Briefcase,
  FileText,
  Send,
  AlertCircle,
  Calendar,
  XCircle,
  Ghost,
  Clock,
  Key,
  Lock,
  FileBarChart,
  Search as SearchIcon,
  Lightbulb,
  Bell,
  CheckCircle,
  Filter,
  Trophy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

type NotificationType =
  | "dream_company_match"
  | "high_score_job"
  | "content_ready"
  | "application_submitted"
  | "application_failed"
  | "interview_detected"
  | "rejection_detected"
  | "ghost_detected"
  | "follow_up_due"
  | "api_key_warning"
  | "captcha_intervention"
  | "weekly_report"
  | "discovery_complete"
  | "copilot_insight"
  | "offer_received"
  | "response_received"
  | "prep_ready"

type Priority = "critical" | "high" | "medium" | "low"

interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  priority: Priority
  read: boolean
  timestamp: Date
  link?: string
  entityType?: "job" | "application" | "profile" | "document" | "outreach" | "email"
  entityId?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "dream_company_match",
    title: "Dream Company Match",
    body: "Stripe posted Senior Frontend Engineer (Score: 92)",
    priority: "critical",
    read: false,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    link: "/jobs/stripe-frontend",
    entityType: "job",
    entityId: "job_001",
  },
  {
    id: "2",
    type: "interview_detected",
    title: "Interview Invitation",
    body: "Vercel wants to schedule a technical interview for Full Stack role",
    priority: "critical",
    read: false,
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    link: "/interviews",
    entityType: "application",
    entityId: "app_001",
  },
  {
    id: "3",
    type: "offer_received",
    title: "Offer Received!",
    body: "Congratulations! Linear has extended an offer for Staff Engineer",
    priority: "critical",
    read: false,
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    link: "/applications?id=app_linear",
    entityType: "application",
    entityId: "app_linear",
  },
  {
    id: "4",
    type: "high_score_job",
    title: "High Score Job Found",
    body: "4 new jobs scored 85+ matching your Senior Frontend profile",
    priority: "high",
    read: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    link: "/jobs?score_min=85",
    entityType: "job",
  },
  {
    id: "5",
    type: "content_ready",
    title: "Content Ready for Review",
    body: "Resume and cover letter generated for Netflix - Senior Engineer",
    priority: "high",
    read: false,
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    link: "/review",
    entityType: "document",
    entityId: "doc_001",
  },
  {
    id: "6",
    type: "application_failed",
    title: "Submission Failed",
    body: "Application to Amazon failed - CAPTCHA required",
    priority: "high",
    read: true,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    link: "/applications?status=failed",
    entityType: "application",
    entityId: "app_002",
  },
  {
    id: "7",
    type: "application_submitted",
    title: "Application Submitted",
    body: "Successfully applied to Google - Software Engineer L5",
    priority: "medium",
    read: true,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    link: "/applications",
    entityType: "application",
    entityId: "app_003",
  },
  {
    id: "8",
    type: "follow_up_due",
    title: "Follow-up Due",
    body: "Time to follow up with recruiter at Meta (Day 5)",
    priority: "medium",
    read: true,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    link: "/outreach",
    entityType: "outreach",
    entityId: "out_001",
  },
  {
    id: "9",
    type: "api_key_warning",
    title: "API Key Expiring",
    body: "Your Anthropic API key expires in 3 days",
    priority: "high",
    read: true,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    link: "/settings?tab=api-keys",
  },
  {
    id: "10",
    type: "rejection_detected",
    title: "Rejection Detected",
    body: "Received rejection email from Apple for iOS Engineer role",
    priority: "low",
    read: true,
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
    link: "/applications?status=rejected",
    entityType: "application",
    entityId: "app_004",
  },
  {
    id: "11",
    type: "ghost_detected",
    title: "Possible Ghost",
    body: "No response from Coinbase in 14 days - marked as ghosted",
    priority: "low",
    read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    link: "/applications?status=ghosted",
    entityType: "application",
    entityId: "app_005",
  },
  {
    id: "12",
    type: "weekly_report",
    title: "Weekly Report Ready",
    body: "Your job search summary for the week is available",
    priority: "medium",
    read: true,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    link: "/analytics?tab=reports",
  },
  {
    id: "13",
    type: "discovery_complete",
    title: "Discovery Complete",
    body: "Found 28 new jobs across 8 sources",
    priority: "low",
    read: true,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    link: "/jobs?sort=newest",
    entityType: "job",
  },
  {
    id: "14",
    type: "copilot_insight",
    title: "AI Insight",
    body: "Your fintech cover letters get 2x more responses - emphasize payments experience",
    priority: "medium",
    read: true,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: "15",
    type: "dream_company_match",
    title: "Dream Company Match",
    body: "Notion posted Senior Product Engineer (Score: 89)",
    priority: "critical",
    read: true,
    timestamp: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000),
    link: "/jobs/notion-product",
    entityType: "job",
    entityId: "job_015",
  },
  {
    id: "16",
    type: "content_ready",
    title: "Content Ready for Review",
    body: "Resume variant B generated for Airbnb - Staff Engineer",
    priority: "high",
    read: true,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    link: "/review",
    entityType: "document",
    entityId: "doc_016",
  },
  {
    id: "17",
    type: "application_submitted",
    title: "Application Submitted",
    body: "Successfully applied to Figma - Design Engineer",
    priority: "medium",
    read: true,
    timestamp: new Date(Date.now() - 5.2 * 24 * 60 * 60 * 1000),
    link: "/applications",
    entityType: "application",
    entityId: "app_017",
  },
  {
    id: "18",
    type: "follow_up_due",
    title: "Follow-up Due",
    body: "Time to follow up with hiring manager at Shopify (Day 7)",
    priority: "medium",
    read: true,
    timestamp: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000),
    link: "/outreach",
    entityType: "outreach",
    entityId: "out_018",
  },
  {
    id: "19",
    type: "high_score_job",
    title: "High Score Job Found",
    body: "Ramp posted Payments Engineer - 91 match score",
    priority: "high",
    read: true,
    timestamp: new Date(Date.now() - 5.8 * 24 * 60 * 60 * 1000),
    link: "/jobs/ramp-payments",
    entityType: "job",
    entityId: "job_019",
  },
  {
    id: "20",
    type: "rejection_detected",
    title: "Rejection Detected",
    body: "Received rejection from Databricks for Data Engineer role",
    priority: "low",
    read: true,
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    link: "/applications?status=rejected",
    entityType: "application",
    entityId: "app_020",
  },
  {
    id: "21",
    type: "interview_detected",
    title: "Interview Scheduled",
    body: "Phone screen confirmed with Datadog for SRE position",
    priority: "critical",
    read: true,
    timestamp: new Date(Date.now() - 6.2 * 24 * 60 * 60 * 1000),
    link: "/interviews",
    entityType: "application",
    entityId: "app_021",
  },
  {
    id: "22",
    type: "discovery_complete",
    title: "Discovery Complete",
    body: "Found 15 new remote jobs from LinkedIn and Indeed",
    priority: "low",
    read: true,
    timestamp: new Date(Date.now() - 6.5 * 24 * 60 * 60 * 1000),
    link: "/jobs?sort=newest",
    entityType: "job",
  },
  {
    id: "23",
    type: "copilot_insight",
    title: "AI Insight",
    body: "Companies respond faster when you mention specific projects - try adding case studies",
    priority: "medium",
    read: true,
    timestamp: new Date(Date.now() - 6.8 * 24 * 60 * 60 * 1000),
  },
  {
    id: "24",
    type: "ghost_detected",
    title: "Possible Ghost",
    body: "No response from Plaid in 21 days - marked as ghosted",
    priority: "low",
    read: true,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    link: "/applications?status=ghosted",
    entityType: "application",
    entityId: "app_024",
  },
  {
    id: "25",
    type: "application_submitted",
    title: "Application Submitted",
    body: "Successfully applied to OpenAI - Research Engineer",
    priority: "medium",
    read: true,
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    link: "/applications",
    entityType: "application",
    entityId: "app_025",
  },
]

const notificationIcons: Record<NotificationType, React.ElementType> = {
  dream_company_match: Star,
  high_score_job: Briefcase,
  content_ready: FileText,
  application_submitted: Send,
  application_failed: AlertCircle,
  interview_detected: Calendar,
  rejection_detected: XCircle,
  ghost_detected: Ghost,
  follow_up_due: Clock,
  api_key_warning: Key,
  captcha_intervention: Lock,
  weekly_report: FileBarChart,
  discovery_complete: SearchIcon,
  copilot_insight: Lightbulb,
  offer_received: Trophy,
  response_received: Bell,
  prep_ready: CheckCircle,
}

const priorityColors: Record<Priority, string> = {
  critical: "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/30 dark:text-orange-400",
  medium: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400",
  low: "bg-muted text-muted-foreground border-border",
}

// Icon background and text colors for each notification type (32px circle)
const iconStyles: Record<NotificationType, { bg: string; text: string }> = {
  dream_company_match: { bg: "bg-violet-500/10", text: "text-violet-500" },
  high_score_job: { bg: "bg-blue-500/10", text: "text-blue-500" },
  content_ready: { bg: "bg-primary/10", text: "text-primary" },
  application_submitted: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  application_failed: { bg: "bg-red-500/10", text: "text-red-500" },
  interview_detected: { bg: "bg-teal-500/10", text: "text-teal-500" },
  rejection_detected: { bg: "bg-slate-500/10", text: "text-slate-500" },
  ghost_detected: { bg: "bg-slate-400/10", text: "text-slate-400" },
  follow_up_due: { bg: "bg-amber-500/10", text: "text-amber-500" },
  api_key_warning: { bg: "bg-amber-500/10", text: "text-amber-500" },
  captcha_intervention: { bg: "bg-amber-500/10", text: "text-amber-500" },
  weekly_report: { bg: "bg-primary/10", text: "text-primary" },
  discovery_complete: { bg: "bg-blue-500/10", text: "text-blue-500" },
  copilot_insight: { bg: "bg-secondary/10", text: "text-secondary-foreground" },
  offer_received: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  response_received: { bg: "bg-blue-500/10", text: "text-blue-500" },
  prep_ready: { bg: "bg-green-500/10", text: "text-green-500" },
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function NotificationCard({ notification, onMarkRead }: { notification: Notification; onMarkRead: (id: string) => void }) {
  const Icon = notificationIcons[notification.type]
  const styles = iconStyles[notification.type]

  const content = (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-xl border cursor-pointer hover:bg-surface-raised transition-colors",
        !notification.read && "border-primary/30 bg-primary/5 border-l-2 border-l-primary",
        notification.read && "border-border"
      )}
      onClick={() => onMarkRead(notification.id)}
    >
      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", styles.bg)}>
        <Icon className={cn("size-4", styles.text)} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm leading-tight", !notification.read && "font-medium")}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {notification.body}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(notification.timestamp)}
          </span>
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0 h-4 capitalize", priorityColors[notification.priority])}
          >
            {notification.priority}
          </Badge>
        </div>
      </div>
    </div>
  )

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>
  }

  return content
}

function NotificationSkeleton() {
  return (
    <div className="flex gap-3 p-3 rounded-xl border">
      <Skeleton className="h-5 w-5 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(15)

  const filteredNotifications = useMemo(() => {
    let filtered = notifications

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.body.toLowerCase().includes(query)
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "unread") {
        filtered = filtered.filter((n) => !n.read)
      } else {
        filtered = filtered.filter((n) => n.priority === activeTab)
      }
    }

    return filtered.slice(0, visibleCount)
  }, [notifications, searchQuery, activeTab, visibleCount])

  const totalFilteredCount = useMemo(() => {
    let filtered = notifications
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.body.toLowerCase().includes(query)
      )
    }
    if (activeTab !== "all") {
      if (activeTab === "unread") {
        filtered = filtered.filter((n) => !n.read)
      } else {
        filtered = filtered.filter((n) => n.priority === activeTab)
      }
    }
    return filtered.length
  }, [notifications, searchQuery, activeTab])

  const unreadCount = notifications.filter((n) => !n.read).length
  const criticalCount = notifications.filter((n) => n.priority === "critical" && !n.read).length
  const highCount = notifications.filter((n) => n.priority === "high" && !n.read).length
  const mediumCount = notifications.filter((n) => n.priority === "medium" && !n.read).length
  const lowCount = notifications.filter((n) => n.priority === "low" && !n.read).length

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold leading-8">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all" className="gap-1.5">
            All
            <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
              {notifications.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-1.5">
            Unread
            {unreadCount > 0 && (
              <Badge className="h-5 min-w-5 px-1.5 text-xs bg-primary">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="critical" className="gap-1.5">
            Critical
            {criticalCount > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                {criticalCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="high" className="gap-1.5">
            High
            {highCount > 0 && (
              <Badge className="h-5 min-w-5 px-1.5 text-xs bg-orange-500">
                {highCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="medium" className="gap-1.5">
            Medium
            {mediumCount > 0 && (
              <Badge className="h-5 min-w-5 px-1.5 text-xs bg-blue-500">
                {mediumCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="low" className="gap-1.5">
            Low
            {lowCount > 0 && (
              <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                {lowCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <NotificationSkeleton key={i} />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery
                  ? `No notifications matching "${searchQuery}"`
                  : activeTab === "unread"
                  ? "You're all caught up! No unread notifications."
                  : `No ${activeTab} priority notifications.`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                />
              ))}
            </div>
          )}
          
          {/* Load More Button */}
          {visibleCount < totalFilteredCount && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 10)}
                className="gap-2"
              >
                Load More
                <span className="text-xs text-muted-foreground">
                  ({totalFilteredCount - visibleCount} remaining)
                </span>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
