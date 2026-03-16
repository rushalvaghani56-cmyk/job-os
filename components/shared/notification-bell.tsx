"use client"

import { Bell, Check, Briefcase, FileText, Calendar, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useNotifications, useUnreadCount, useMarkAllRead } from "@/hooks/useNotifications"
import { Skeleton } from "@/components/ui/skeleton"

interface Notification {
  id: string
  type: "job_match" | "application" | "interview" | "ai_insight" | string
  title: string
  description: string
  timestamp: Date
  read: boolean
  href?: string
}

const typeIcons: Record<string, React.ElementType> = {
  job_match: Briefcase,
  application: FileText,
  interview: Calendar,
  ai_insight: Sparkles,
  // Map API types
  new_jobs_discovered: Briefcase,
  dream_company_job: Briefcase,
  application_status_change: FileText,
  interview_scheduled: Calendar,
  interview_reminder: Calendar,
  content_ready_for_review: FileText,
  offer_received: Briefcase,
  follow_up_due: FileText,
  weekly_summary: Sparkles,
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function mapNotificationType(apiType: string): string {
  const typeMap: Record<string, string> = {
    new_jobs_discovered: "job_match",
    dream_company_job: "job_match",
    application_status_change: "application",
    interview_scheduled: "interview",
    interview_reminder: "interview",
    content_ready_for_review: "application",
    offer_received: "job_match",
    follow_up_due: "application",
    weekly_summary: "ai_insight",
    rejection_received: "application",
    response_received: "application",
    ai_key_expiring: "ai_insight",
    ai_quota_warning: "ai_insight",
    discovery_completed: "job_match",
    content_approved: "application",
    content_rejected: "application",
    job_deadline_approaching: "job_match",
  }
  return typeMap[apiType] ?? apiType
}

export function NotificationBell() {
  const { data: apiNotifications, isLoading: notificationsLoading } = useNotifications()
  const { data: unreadData } = useUnreadCount()
  const markAllReadMutation = useMarkAllRead()

  const unreadCount = unreadData?.total_unread ?? 0

  const notifications: Notification[] = (apiNotifications ?? []).slice(0, 5).map((n) => ({
    id: n.id,
    type: mapNotificationType(n.type),
    title: n.title,
    description: n.body,
    timestamp: new Date(n.created_at),
    read: n.is_read,
    href: n.action_url,
  }))

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllRead}
            >
              <Check className="mr-1 h-3 w-3" />
              Mark All Read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notificationsLoading ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = typeIcons[notification.type] ?? Bell
              return (
                <DropdownMenuItem
                  key={notification.id}
                  asChild
                  className="cursor-pointer"
                >
                  <Link
                    href={notification.href || "#"}
                    className={cn(
                      "flex items-start gap-3 px-3 py-2.5",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        notification.type === "job_match" && "bg-success/10 text-success",
                        notification.type === "interview" && "bg-warning/10 text-warning",
                        notification.type === "application" && "bg-info/10 text-info",
                        notification.type === "ai_insight" && "bg-primary/10 text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{notification.title}</span>
                        {!notification.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )
            })
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href="/notifications"
            className="flex items-center justify-center py-2 text-sm text-primary"
          >
            View All Notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
