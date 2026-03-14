"use client"

import * as React from "react"
import { StatsCard } from "./stats-card"
import { Search, ClipboardCheck, Send, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface StatsRowProps {
  isLoading?: boolean
}

export function StatsRow({ isLoading = false }: StatsRowProps) {
  // Mock data - in real app this would come from API
  const stats = {
    discovered: {
      value: "247",
      subtitle: "Today: 12 | This week: 47",
      trend: { value: "15% vs last week", direction: "up" as const },
    },
    pending: {
      value: "16",
      subtitle: "3 dream · 5 high · 8 medium",
      extra: "Oldest: 2 hours ago",
    },
    active: {
      value: "34",
      subtitle: "12 screening · 8 interview · 14 submitted",
      trend: { value: "8% vs last week", direction: "up" as const },
    },
    responseRate: {
      value: "23%",
      subtitle: "Based on last 30 days",
      trend: { value: "2% vs last month", direction: "down" as const },
    },
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-5 border-l-4 border-l-primary">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Jobs Discovered"
        value={stats.discovered.value}
        subtitle={stats.discovered.subtitle}
        trend={stats.discovered.trend}
        icon={Search}
        accentColor="primary"
      />
      <StatsCard
        title="Pending Reviews"
        value={stats.pending.value}
        subtitle={stats.pending.subtitle}
        icon={ClipboardCheck}
        accentColor="amber"
        miniBar={{
          segments: [
            { value: 19, color: "bg-purple-500" }, // 3 dream
            { value: 31, color: "bg-orange-500" }, // 5 high
            { value: 50, color: "bg-gray-400" },   // 8 medium
          ],
        }}
      />
      <StatsCard
        title="Active Applications"
        value={stats.active.value}
        subtitle={stats.active.subtitle}
        trend={stats.active.trend}
        icon={Send}
        accentColor="green"
      />
      <StatsCard
        title="Response Rate"
        value={stats.responseRate.value}
        subtitle={stats.responseRate.subtitle}
        trend={stats.responseRate.trend}
        icon={TrendingUp}
        accentColor="blue"
      />
    </div>
  )
}
