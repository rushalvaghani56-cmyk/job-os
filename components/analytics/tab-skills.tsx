"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
  ReferenceLine,
} from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSkillsAnalysis } from "@/hooks/useAnalytics"
import type { SkillsAnalysis } from "@/types/analytics"

function SkillsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5">
        <Skeleton className="mb-1 h-5 w-36" />
        <Skeleton className="mb-4 h-4 w-64" />
        <Skeleton className="h-[350px] w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </div>
  )
}

const chartConfig: ChartConfig = {
  demandScore: {
    label: "Market Demand",
    color: "hsl(var(--chart-1))",
  },
  yourLevel: {
    label: "Your Level",
    color: "hsl(var(--chart-2))",
  },
}

/** Map API SkillsAnalysis to the local SkillDemand shape used by charts/cards */
function mapSkillsData(apiData: SkillsAnalysis | undefined) {
  if (!apiData) return []
  return apiData.in_demand_skills.map((s) => {
    const proficiencyToLevel: Record<string, number> = {
      expert: 90, advanced: 75, intermediate: 55, beginner: 30,
    }
    const yourLevel = s.proficiency ? (proficiencyToLevel[s.proficiency.toLowerCase()] ?? 50) : (s.user_has ? 70 : 20)
    const demandScore = Math.min(100, Math.round((s.demand_count / Math.max(1, apiData.in_demand_skills[0]?.demand_count ?? 1)) * 100))
    return {
      skill: s.skill,
      demandScore,
      yourLevel,
      gap: demandScore - yourLevel,
      trend: "stable" as "up" | "down" | "stable",
    }
  })
}

export function TabSkills() {
  const { data, isLoading, error } = useSkillsAnalysis()

  if (isLoading) {
    return <SkillsSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-card p-10">
        <p className="text-sm text-destructive">Failed to load skills data. Please try again later.</p>
      </div>
    )
  }

  const skillDemand = mapSkillsData(data)

  return (
    <div className="space-y-6">
      {/* Skills Gap Chart */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-1 text-sm font-semibold">Skills Gap Analysis</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Compare your skill levels against market demand in your target roles
        </p>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={skillDemand} layout="vertical" barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              type="category"
              dataKey="skill"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={80}
              className="text-muted-foreground"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-popover p-3 shadow-md">
                    <p className="text-sm font-medium">{data.skill}</p>
                    <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      <p>Market Demand: {data.demandScore}</p>
                      <p>Your Level: {data.yourLevel}</p>
                      <p className={cn(
                        "font-medium",
                        data.gap > 0 ? "text-amber-500" : "text-emerald-500"
                      )}>
                        Gap: {data.gap > 0 ? "+" : ""}{data.gap}
                      </p>
                    </div>
                  </div>
                )
              }}
            />
            <Bar dataKey="demandScore" name="Market Demand" radius={[0, 4, 4, 0]} barSize={12}>
              {skillDemand.map((entry, index) => (
                <Cell key={`demand-${index}`} fill="hsl(var(--chart-1))" opacity={0.6} />
              ))}
            </Bar>
            <Bar dataKey="yourLevel" name="Your Level" radius={[0, 4, 4, 0]} barSize={12}>
              {skillDemand.map((entry, index) => (
                <Cell 
                  key={`level-${index}`} 
                  fill={entry.gap > 10 ? "hsl(var(--warning))" : "hsl(var(--chart-2))"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        {/* Legend */}
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2 text-xs">
            <div className="h-2.5 w-2.5 rounded-sm bg-chart-1 opacity-60" />
            <span className="text-muted-foreground">Market Demand</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="h-2.5 w-2.5 rounded-sm bg-chart-2" />
            <span className="text-muted-foreground">Your Level</span>
          </div>
        </div>
      </div>

      {/* Skill Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillDemand.map((skill) => (
          <div key={skill.skill} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{skill.skill}</h4>
              <Badge
                variant="secondary"
                className={cn(
                  "gap-1",
                  skill.trend === "up" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  skill.trend === "down" && "bg-red-500/10 text-red-600 dark:text-red-400",
                  skill.trend === "stable" && "bg-muted text-muted-foreground"
                )}
              >
                {skill.trend === "up" && <TrendingUp className="h-3 w-3" />}
                {skill.trend === "down" && <TrendingDown className="h-3 w-3" />}
                {skill.trend === "stable" && <Minus className="h-3 w-3" />}
                {skill.trend}
              </Badge>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Market Demand</span>
                <span className="font-mono">{skill.demandScore}</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-chart-1 opacity-60"
                  style={{ width: `${skill.demandScore}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Your Level</span>
                <span className="font-mono">{skill.yourLevel}</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    skill.gap > 10 ? "bg-warning" : "bg-chart-2"
                  )}
                  style={{ width: `${skill.yourLevel}%` }}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="text-xs text-muted-foreground">Gap</span>
              <span
                className={cn(
                  "text-sm font-mono font-medium",
                  skill.gap > 0 ? "text-amber-500" : "text-emerald-500"
                )}
              >
                {skill.gap > 0 ? "+" : ""}{skill.gap}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Recommendations</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Priority: AWS Skills</p>
              <p className="text-xs text-muted-foreground">
                25-point gap detected. 70% of your target roles require AWS experience. Consider AWS certifications.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Growing Demand: Python</p>
              <p className="text-xs text-muted-foreground">
                Python demand is trending up in your target market. Your current level is below market needs.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-emerald-500/10 p-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500" />
            <div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Strength: React & Node.js</p>
              <p className="text-xs text-muted-foreground">
                Your frontend skills exceed market requirements. Highlight these in your applications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
