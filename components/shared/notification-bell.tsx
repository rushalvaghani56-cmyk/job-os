"use client"

import { useState } from "react"
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

interface Notification {
  id: string
  type: "job_match" | "application" | "interview" | "ai_insight"
  title: string
  description: string
  timestamp: Date
  read: boolean
  href?: string
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "job_match",
    title: "New High-Match Job",
    description: "Senior Software Engineer at Stripe - 94% match",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    read: false,
    href: "/jobs/stripe-senior-swe",
  },
  {
    id: "2",
    type: "interview",
    title: "Interview Reminder",
    description: "Technical interview with Figma in 2 hours",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
    href: "/interviews",
  },
  {
    id: "3",
    type: "application",
    title: "Application Update",
    description: "Your application to Vercel moved to screening",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
    href: "/applications",
  },
  {
    id: "4",
    type: "ai_insight",
    title: "AI Insight",
    description: "Your resume score improved by 12 points",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    href: "/profiles",
  },
  {
    id: "5",
    type: "job_match",
    title: "Dream Company Alert",
    description: "OpenAI is hiring for your target role",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    read: true,
    href: "/jobs/openai-ml-eng",
  },
]

const typeIcons = {
  job_match: Briefcase,
  application: FileText,
  interview: Calendar,
  ai_insight: Sparkles,
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

export function NotificationBell() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    )
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
          {notifications.slice(0, 5).map((notification) => {
            const Icon = typeIcons[notification.type]
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
          })}
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
