"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import {
  Star,
  Target,
  FileText,
  CheckCircle2,
  AlertCircle,
  Calendar,
  XCircle,
  Ghost,
  Mail,
  AlertTriangle,
  ShieldAlert,
  BarChart,
  Search as SearchIcon,
  Sparkles,
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
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from "@/hooks/useNotifications"

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
  // API types mapped
  | "new_jobs_discovered"
  | "job_deadline_approaching"
  | "dream_company_job"
  | "application_status_change"
  | "interview_scheduled"
  | "interview_reminder"
  | "content_ready_for_review"
  | "content_approved"
  | "content_rejected"
  | "follow_up_due"
  | "ai_key_expiring"
  | "ai_quota_warning"
  | "discovery_completed"
  | "weekly_summary"

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
  entityType?: string
  entityId?: string
}

const notificationIcons: Record<string, React.ElementType> = {
  dream_company_match: Star,
  dream_company_job: Star,
  high_score_job: Target,
  new_jobs_discovered: Target,
  content_ready: FileText,
  content_ready_for_review: FileText,
  content_approved: CheckCircle2,
  content_rejected: XCircle,
  application_submitted: CheckCircle2,
  application_status_change: CheckCircle2,
  application_failed: XCircle,
  interview_detected: Calendar,
  interview_scheduled: Calendar,
  interview_reminder: Calendar,
  rejection_detected: XCircle,
  rejection_received: XCircle,
  ghost_detected: Ghost,
  follow_up_due: Mail,
  response_received: Bell,
  api_key_warning: AlertTriangle,
  ai_key_expiring: AlertTriangle,
  ai_quota_warning: AlertTriangle,
  captcha_intervention: ShieldAlert,
  weekly_report: BarChart,
  weekly_summary: BarChart,
  discovery_complete: SearchIcon,
  discovery_completed: SearchIcon,
  copilot_insight: Sparkles,
  offer_received: Trophy,
  prep_ready: CheckCircle,
  job_deadline_approaching: AlertCircle,
}

const priorityColors: Record<Priority, string> = {
  critical: "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/30 dark:text-orange-400",
  medium: "bg-blue-500/10 text-blue-600 border-blue-500/30 dark:text-blue-400",
  low: "bg-muted text-muted-foreground border-border",
}

// Icon background and text colors for each notification type (32px circle)
const iconStyles: Record<string, { bg: string; text: string }> = {
  dream_company_match: { bg: "bg-violet-500/10", text: "text-violet-500" },
  dream_company_job: { bg: "bg-violet-500/10", text: "text-violet-500" },
  high_score_job: { bg: "bg-blue-500/10", text: "text-blue-500" },
  new_jobs_discovered: { bg: "bg-blue-500/10", text: "text-blue-500" },
  content_ready: { bg: "bg-primary/10", text: "text-primary" },
  content_ready_for_review: { bg: "bg-primary/10", text: "text-primary" },
  content_approved: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  content_rejected: { bg: "bg-red-500/10", text: "text-red-500" },
  application_submitted: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  application_status_change: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  application_failed: { bg: "bg-red-500/10", text: "text-red-500" },
  interview_detected: { bg: "bg-teal-500/10", text: "text-teal-500" },
  interview_scheduled: { bg: "bg-teal-500/10", text: "text-teal-500" },
  interview_reminder: { bg: "bg-teal-500/10", text: "text-teal-500" },
  rejection_detected: { bg: "bg-slate-500/10", text: "text-slate-500" },
  rejection_received: { bg: "bg-slate-500/10", text: "text-slate-500" },
  ghost_detected: { bg: "bg-slate-400/10", text: "text-slate-400" },
  follow_up_due: { bg: "bg-amber-500/10", text: "text-amber-500" },
  response_received: { bg: "bg-blue-500/10", text: "text-blue-500" },
  api_key_warning: { bg: "bg-amber-500/10", text: "text-amber-500" },
  ai_key_expiring: { bg: "bg-amber-500/10", text: "text-amber-500" },
  ai_quota_warning: { bg: "bg-amber-500/10", text: "text-amber-500" },
  captcha_intervention: { bg: "bg-amber-500/10", text: "text-amber-500" },
  weekly_report: { bg: "bg-primary/10", text: "text-primary" },
  weekly_summary: { bg: "bg-primary/10", text: "text-primary" },
  discovery_complete: { bg: "bg-blue-500/10", text: "text-blue-500" },
  discovery_completed: { bg: "bg-blue-500/10", text: "text-blue-500" },
  copilot_insight: { bg: "bg-secondary/10", text: "text-secondary-foreground" },
  offer_received: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  prep_ready: { bg: "bg-green-500/10", text: "text-green-500" },
  job_deadline_approaching: { bg: "bg-amber-500/10", text: "text-amber-500" },
}

const defaultIconStyle = { bg: "bg-muted", text: "text-muted-foreground" }

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
  const Icon = notificationIcons[notification.type] ?? Bell
  const styles = iconStyles[notification.type] ?? defaultIconStyle

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
  const { data: apiNotifications, isLoading: apiLoading } = useNotifications()
  const markReadMutation = useMarkNotificationRead()
  const markAllReadMutation = useMarkAllRead()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [visibleCount, setVisibleCount] = useState(15)

  // Hydrate local state from API
  useEffect(() => {
    if (apiNotifications) {
      setNotifications(
        apiNotifications.map((n) => ({
          id: n.id,
          type: n.type as NotificationType,
          title: n.title,
          body: n.body,
          priority: n.priority as Priority,
          read: n.is_read,
          timestamp: new Date(n.created_at),
          link: n.action_url,
        }))
      )
    }
  }, [apiNotifications])

  const isLoading = apiLoading

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
    markReadMutation.mutate(id)
  }

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    markAllReadMutation.mutate()
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
