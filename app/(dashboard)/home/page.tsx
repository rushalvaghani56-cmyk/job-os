"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { SectionErrorBoundary } from "@/components/shared/section-error-boundary"
import { StatsRow } from "@/components/dashboard/stats-row"
import { ActionRequiredPanel } from "@/components/dashboard/action-required-panel"
import { CopilotPreview } from "@/components/dashboard/copilot-preview"
import { DiscoveryStatus } from "@/components/dashboard/discovery-status"
import { GoalProgress } from "@/components/dashboard/goal-progress"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useProfileStore } from "@/stores/profileStore"

export default function DashboardHomePage() {
  const { activeProfile } = useProfileStore()
  const [isLoading, setIsLoading] = React.useState(true)

  // Simulate initial data load
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        {activeProfile && (
          <Badge variant="secondary" className="w-fit">
            {activeProfile.name}
          </Badge>
        )}
      </div>

      {/* Row 1: Stats Row - 4 cards */}
      <SectionErrorBoundary>
        <StatsRow isLoading={isLoading} />
      </SectionErrorBoundary>

      {/* Row 2: Action Required (60%) + Copilot Preview (40%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionErrorBoundary>
            <ActionRequiredPanel isLoading={isLoading} />
          </SectionErrorBoundary>
        </div>
        <div className="lg:col-span-2">
          <SectionErrorBoundary>
            <CopilotPreview isLoading={isLoading} />
          </SectionErrorBoundary>
        </div>
      </div>

      {/* Row 3: Discovery Status (40%) + Goal Progress (60%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionErrorBoundary>
            <DiscoveryStatus isLoading={isLoading} />
          </SectionErrorBoundary>
        </div>
        <div className="lg:col-span-3">
          <SectionErrorBoundary>
            <GoalProgress isLoading={isLoading} />
          </SectionErrorBoundary>
        </div>
      </div>

      {/* Row 4: Recent Activity (60%) + Quick Actions (40%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SectionErrorBoundary>
            <RecentActivity isLoading={isLoading} />
          </SectionErrorBoundary>
        </div>
        <div className="lg:col-span-2">
          <SectionErrorBoundary>
            <QuickActions isLoading={isLoading} />
          </SectionErrorBoundary>
        </div>
      </div>
    </div>
  )
}
