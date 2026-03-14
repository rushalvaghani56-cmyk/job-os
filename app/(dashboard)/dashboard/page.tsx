"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  FileSearch,
  Send,
  TrendingUp,
  Sparkles,
  X,
  ArrowRight,
} from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActionRequiredPanel } from "@/components/dashboard/action-required-panel"
import { CopilotPreview } from "@/components/dashboard/copilot-preview"
import { DiscoveryStatus } from "@/components/dashboard/discovery-status"
import { GoalProgress } from "@/components/dashboard/goal-progress"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"

const stats = [
  {
    title: "Jobs Discovered",
    value: "247",
    subtitle: "Today: 12 | This week: 47",
    trend: { value: "15% vs last week", direction: "up" as const },
    icon: Briefcase,
    accentColor: "primary" as const,
  },
  {
    title: "Pending Reviews",
    value: "16",
    subtitle: "Oldest: 2 hours ago",
    trend: undefined,
    icon: FileSearch,
    accentColor: "amber" as const,
    miniBar: {
      segments: [
        { value: 19, color: "bg-amber-500" }, // 3 dream
        { value: 31, color: "bg-red-500" }, // 5 high
        { value: 50, color: "bg-blue-500" }, // 8 medium
      ],
    },
  },
  {
    title: "Active Applications",
    value: "38",
    subtitle: "5 new this week",
    trend: { value: "8%", direction: "up" as const },
    icon: Send,
    accentColor: "blue" as const,
  },
  {
    title: "Response Rate",
    value: "24%",
    subtitle: "Industry avg: 18%",
    trend: { value: "3% vs last month", direction: "up" as const },
    icon: TrendingUp,
    accentColor: "green" as const,
  },
]

// Mock: In production, this would come from user preferences/API
const UNREAD_CHANGELOG_COUNT = 3

function ChangelogBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative flex items-center justify-between gap-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="size-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {UNREAD_CHANGELOG_COUNT} new updates!
          </p>
          <p className="text-xs text-muted-foreground">
            Interview Calendar, Market Intelligence, and more
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild size="sm" variant="outline" className="gap-1.5">
          <Link href="/changelog">
            See What's New
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground hover:text-foreground"
          onClick={onDismiss}
        >
          <X className="size-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [showChangelogBanner, setShowChangelogBanner] = useState(true)
  
  return (
    <div className="space-y-6">
      {/* Changelog Banner */}
      {showChangelogBanner && UNREAD_CHANGELOG_COUNT > 0 && (
        <ChangelogBanner onDismiss={() => setShowChangelogBanner(false)} />
      )}
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Dashboard</h1>
        <Badge variant="secondary" className="text-xs">
          Senior Frontend
        </Badge>
      </div>

      {/* Row 1: Stats Grid - 4 columns */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            trend={stat.trend}
            icon={stat.icon}
            accentColor={stat.accentColor}
            miniBar={stat.miniBar}
          />
        ))}
      </div>

      {/* Row 2: Action Required (60%) | Copilot Preview (40%) */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ActionRequiredPanel />
        </div>
        <div className="lg:col-span-2">
          <CopilotPreview />
        </div>
      </div>

      {/* Row 3: Discovery Status (40%) | Goal Progress (60%) */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <DiscoveryStatus />
        </div>
        <div className="lg:col-span-3">
          <GoalProgress
            hasGoals={true}
            goalTitle="Interviews This Month"
            current={3}
            target={5}
            advice="You're on pace. Consider targeting smaller companies for faster cycles."
          />
        </div>
      </div>

      {/* Row 4: Recent Activity (60%) | Quick Actions (40%) */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
