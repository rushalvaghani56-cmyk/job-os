"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useDashboardMetrics } from "@/hooks/useAnalytics"

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

export default function HomePage() {
  const [showChangelogBanner, setShowChangelogBanner] = useState(true)
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()

  const stats = useMemo(() => [
    {
      title: "Jobs Discovered",
      value: String(metrics?.jobs_today ?? 0),
      subtitle: `Today: ${metrics?.jobs_today ?? 0}`,
      trend: metrics?.jobs_today_change
        ? { value: `${Math.abs(metrics.jobs_today_change)}% vs last week`, direction: metrics.jobs_today_change >= 0 ? "up" as const : "down" as const }
        : undefined,
      icon: Briefcase,
      accentColor: "primary" as const,
    },
    {
      title: "Pending Reviews",
      value: String(metrics?.pending_reviews ?? 0),
      subtitle: "",
      trend: undefined,
      icon: FileSearch,
      accentColor: "amber" as const,
    },
    {
      title: "Active Applications",
      value: String(metrics?.active_applications ?? 0),
      subtitle: "",
      trend: metrics?.active_applications_change
        ? { value: `${Math.abs(metrics.active_applications_change)}%`, direction: metrics.active_applications_change >= 0 ? "up" as const : "down" as const }
        : undefined,
      icon: Send,
      accentColor: "blue" as const,
    },
    {
      title: "Response Rate",
      value: `${metrics?.response_rate ?? 0}%`,
      subtitle: "",
      trend: metrics?.response_rate_change
        ? { value: `${Math.abs(metrics.response_rate_change)}% vs last month`, direction: metrics.response_rate_change >= 0 ? "up" as const : "down" as const }
        : undefined,
      icon: TrendingUp,
      accentColor: "green" as const,
    },
  ], [metrics])

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
        {metricsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))
        ) : (
          stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              trend={stat.trend}
              icon={stat.icon}
              accentColor={stat.accentColor}
            />
          ))
        )}
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
          <GoalProgress hasGoals={true} />
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
