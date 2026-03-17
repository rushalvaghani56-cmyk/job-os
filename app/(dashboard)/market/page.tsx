"use client"

import * as React from "react"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Cell,
} from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Filter } from "lucide-react"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Star,
  AlertTriangle,
  Zap,
  Users,
  Clock,
  Gem,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMarketInsights, useMarketSalary, useMarketTrends } from "@/hooks/useMarket"

// ==================== CHART CONFIGS ====================

const salaryChartConfig: ChartConfig = {
  market: {
    label: "Market Salary",
    color: "hsl(var(--chart-1))",
  },
  yourTarget: {
    label: "Your Target",
    color: "hsl(var(--primary))",
  },
}

const velocityChartConfig: ChartConfig = {
  postings: {
    label: "Job Postings",
    color: "hsl(var(--chart-2))",
  },
}

const distributionChartConfig: ChartConfig = {
  count: {
    label: "Jobs",
    color: "hsl(var(--chart-3))",
  },
}

const regionalChartConfig: ChartConfig = {
  salary: {
    label: "Avg Salary",
    color: "hsl(var(--chart-4))",
  },
}

const bestTimeChartConfig: ChartConfig = {
  successRate: {
    label: "Success Rate",
    color: "hsl(var(--chart-5))",
  },
}

// ==================== HELPER COMPONENTS ====================

function Sparkline({
  data,
  direction,
}: {
  data: number[]
  direction: "up" | "down" | "stable"
}) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 60
      const y = 30 - ((value - min) / range) * 24
      return `${x},${y}`
    })
    .join(" ")

  const color =
    direction === "up"
      ? "text-emerald-500"
      : direction === "down"
        ? "text-red-500"
        : "text-muted-foreground"

  return (
    <svg width="60" height="30" className={cn("inline-block", color)}>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TierBadge({ tier }: { tier: number }) {
  const styles = {
    1: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    2: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    3: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    4: "bg-muted text-muted-foreground border-border",
  }[tier]

  const labels = {
    1: "Core",
    2: "Valued",
    3: "Differentiator",
    4: "Niche",
  }[tier]

  return (
    <Badge variant="outline" className={cn("text-xs font-medium", styles)}>
      {labels}
    </Badge>
  )
}

function VelocityIndicator({
  velocity,
}: {
  velocity: "accelerating" | "stable" | "decelerating"
}) {
  if (velocity === "accelerating") {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
        <ArrowUp className="size-3" />
        <span className="text-xs">Accelerating</span>
      </span>
    )
  }
  if (velocity === "decelerating") {
    return (
      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
        <ArrowDown className="size-3" />
        <span className="text-xs">Decelerating</span>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <ArrowRight className="size-3" />
      <span className="text-xs">Stable</span>
    </span>
  )
}

function CompetitionBadge({ level }: { level: "low" | "medium" | "high" | "very-high" }) {
  const styles = {
    low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    "very-high": "bg-red-500/10 text-red-600 dark:text-red-400",
  }[level]

  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
    "very-high": "Very High",
  }[level]

  return (
    <Badge variant="secondary" className={cn("text-xs font-medium", styles)}>
      {labels}
    </Badge>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

function SectionSkeleton({ height = "h-[250px]" }: { height?: string }) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-48" />
      <Skeleton className={cn("w-full", height)} />
    </div>
  )
}

// ==================== MAIN PAGE ====================

function MarketSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-36" />
        </div>
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="rounded-xl">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function MarketIntelligencePage() {
  const [dateRange, setDateRange] = React.useState("30d")
  const [profile, setProfile] = React.useState("all")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [locationFilter, setLocationFilter] = React.useState("all")

  // Fetch real data from API
  const { data: insights, isLoading: insightsLoading } = useMarketInsights()
  const { data: salary, isLoading: salaryLoading } = useMarketSalary(
    profile !== "all" ? profile : "senior-frontend",
    locationFilter !== "all" ? locationFilter : undefined
  )
  const { data: trends, isLoading: trendsLoading } = useMarketTrends()

  const isLoading = insightsLoading && salaryLoading && trendsLoading

  // Derive UI data from API responses (snake_case -> camelCase where needed)
  const trendingSkills = insights?.trending_skills ?? []
  const hotCompanies = insights?.top_companies ?? []
  const salaryTrends = (insights?.demand_trend ?? []).map((d) => ({
    date: d.date,
    market: d.market,
    yourTarget: d.your_target,
  }))
  const regionalSalaries = salary?.regional ?? []
  const salaryDistribution = salary?.distribution ?? []
  const hiringVelocity = trends?.jobs_per_week ?? []
  const layoffCompanies = trends?.layoff_companies ?? []
  const growthCompanies = trends?.growth_companies ?? []
  const competitionJobs = trends?.competition_jobs ?? []
  const bestTimeData = (trends?.best_time_data ?? []).map((d) => ({
    day: d.day,
    applications: d.applications,
    successRate: d.success_rate,
  }))
  const hiddenGems = (trends?.hidden_gems ?? []).map((g) => ({
    company: g.company,
    role: g.role,
    applicants: g.applicants,
    avgApplicants: g.avg_applicants,
  }))

  const [dreamCompanies, setDreamCompanies] = React.useState<string[]>([])

  // Sync dream companies when insights data loads
  React.useEffect(() => {
    if (insights?.top_companies) {
      setDreamCompanies(
        insights.top_companies.filter((c) => c.is_dream).map((c) => c.name)
      )
    }
  }, [insights?.top_companies])

  const toggleDream = (companyName: string) => {
    setDreamCompanies((prev) =>
      prev.includes(companyName)
        ? prev.filter((n) => n !== companyName)
        : [...prev, companyName]
    )
  }

  if (isLoading) {
    return <MarketSkeleton />
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Market Intelligence</h1>
          <p className="text-sm text-muted-foreground">
            Data-driven insights from all discovered job postings
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range */}
          <div className="flex items-center rounded-lg border bg-card">
            {(["7d", "30d", "60d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  dateRange === range
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  range === "7d" && "rounded-l-lg",
                  range === "90d" && "rounded-r-lg"
                )}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Profile Filter */}
          <Select value={profile} onValueChange={setProfile}>
            <SelectTrigger className="w-auto min-w-[100px] sm:w-[140px] rounded-lg focus-visible:ring-2 focus-visible:ring-primary">
              <Filter className="mr-2 size-4" />
              <SelectValue placeholder="Profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Profiles</SelectItem>
              <SelectItem value="senior-frontend">Senior Frontend</SelectItem>
              <SelectItem value="tech-lead">Tech Lead</SelectItem>
              <SelectItem value="staff-engineer">Staff Engineer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section 1: Trending Skills */}
      <Card className="rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base font-semibold">Trending Skills</CardTitle>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-8 w-auto min-w-[100px] sm:w-[130px] rounded-lg text-xs">
                  <SelectValue placeholder="Role Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="fullstack">Full Stack</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="h-8 w-auto min-w-[100px] sm:w-[130px] rounded-lg text-xs">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {insightsLoading ? (
            <SectionSkeleton />
          ) : trendingSkills.length === 0 ? (
            <EmptyState message="No trending skills data available yet." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Skill</TableHead>
                    <TableHead className="text-xs">Tier</TableHead>
                    <TableHead className="text-right text-xs">Demand %</TableHead>
                    <TableHead className="text-center text-xs">8-Week Trend</TableHead>
                    <TableHead className="text-center text-xs">Direction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendingSkills.map((skill) => (
                    <TableRow key={skill.skill}>
                      <TableCell className="text-sm font-medium">{skill.skill}</TableCell>
                      <TableCell>
                        <TierBadge tier={skill.tier} />
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {skill.demand}%
                      </TableCell>
                      <TableCell className="text-center">
                        <Sparkline data={skill.trend} direction={skill.direction} />
                      </TableCell>
                      <TableCell className="text-center">
                        {skill.direction === "up" && (
                          <TrendingUp className="mx-auto size-4 text-emerald-500" />
                        )}
                        {skill.direction === "down" && (
                          <TrendingDown className="mx-auto size-4 text-red-500" />
                        )}
                        {skill.direction === "stable" && (
                          <Minus className="mx-auto size-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Skills Recommendation Box */}
          {trendingSkills.length > 0 && (
            <div className="rounded-lg bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Zap className="size-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Skills You Should Learn</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Based on market trends and your profile gaps, consider learning{" "}
                    <span className="font-medium text-foreground">AWS</span> and{" "}
                    <span className="font-medium text-foreground">Kubernetes</span>. These skills
                    are in high demand and trending upward in your target roles.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 2: Hot Companies */}
      <Card className="rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Hot Companies</CardTitle>
        </CardHeader>
        <CardContent>
          {insightsLoading ? (
            <SectionSkeleton />
          ) : hotCompanies.length === 0 ? (
            <EmptyState message="No company data available yet." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Company</TableHead>
                    <TableHead className="text-right text-xs">Open Roles</TableHead>
                    <TableHead className="text-center text-xs">Hiring Velocity</TableHead>
                    <TableHead className="text-right text-xs">Avg Match</TableHead>
                    <TableHead className="text-right text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotCompanies.map((company) => (
                    <TableRow key={company.name}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 rounded-lg">
                            <AvatarImage src={company.logo} alt={company.name} />
                            <AvatarFallback className="rounded-lg text-xs">
                              {company.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{company.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {company.open_roles}
                      </TableCell>
                      <TableCell className="text-center">
                        <VelocityIndicator velocity={company.velocity} />
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "font-mono text-sm font-medium",
                            company.avg_match_score >= 85
                              ? "text-emerald-600 dark:text-emerald-400"
                              : company.avg_match_score >= 70
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-muted-foreground"
                          )}
                        >
                          {company.avg_match_score}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant={dreamCompanies.includes(company.name) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleDream(company.name)}
                          className="h-7 gap-1.5 rounded-lg text-xs focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Star
                            className={cn(
                              "size-3",
                              dreamCompanies.includes(company.name) && "fill-current"
                            )}
                          />
                          {dreamCompanies.includes(company.name) ? "Dream" : "Set as Dream"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Salary Trends */}
      <Card className="rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Salary Trends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Line Chart */}
          {insightsLoading || salaryLoading ? (
            <SectionSkeleton />
          ) : salaryTrends.length === 0 && regionalSalaries.length === 0 && salaryDistribution.length === 0 ? (
            <EmptyState message="No salary data available yet." />
          ) : (
            <>
              {salaryTrends.length > 0 && (
                <div>
                  <p className="mb-3 text-xs text-muted-foreground">
                    Market salary over time for Senior Frontend Engineer
                  </p>
                  <ChartContainer config={salaryChartConfig} className="h-[250px] w-full">
                    <LineChart data={salaryTrends}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        className="text-muted-foreground"
                      />
                      <YAxis
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        className="text-muted-foreground"
                        domain={[150000, 200000]}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null
                          return (
                            <div className="rounded-lg border bg-popover p-2 shadow-md">
                              <p className="text-xs font-medium">{payload[0]?.payload?.date}</p>
                              <p className="text-xs text-muted-foreground">
                                Market: ${(payload[0]?.value as number)?.toLocaleString()}
                              </p>
                              <p className="text-xs text-primary">
                                Your Target: ${(payload[1]?.value as number)?.toLocaleString()}
                              </p>
                            </div>
                          )
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="market"
                        stroke="var(--color-market)"
                        strokeWidth={2}
                        dot={false}
                      />
                      <ReferenceLine
                        y={180000}
                        stroke="hsl(var(--primary))"
                        strokeDasharray="5 5"
                        label={{
                          value: "Your Target: $180k",
                          position: "right",
                          fill: "hsl(var(--primary))",
                          fontSize: 10,
                        }}
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              )}

              {/* Regional Comparison */}
              <div className="grid gap-6 lg:grid-cols-2">
                {regionalSalaries.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-medium">Regional Comparison</p>
                    <ChartContainer config={regionalChartConfig} className="h-[180px] w-full">
                      <BarChart data={regionalSalaries} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                        <XAxis
                          type="number"
                          tick={{ fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                          className="text-muted-foreground"
                        />
                        <YAxis
                          type="category"
                          dataKey="region"
                          tick={{ fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                          width={60}
                          className="text-muted-foreground"
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            return (
                              <div className="rounded-lg border bg-popover p-2 shadow-md">
                                <p className="text-xs font-medium">{payload[0]?.payload?.region}</p>
                                <p className="text-xs text-muted-foreground">
                                  Avg: ${(payload[0]?.value as number)?.toLocaleString()}
                                </p>
                              </div>
                            )
                          }}
                        />
                        <Bar dataKey="salary" fill="var(--color-salary)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                )}

                {/* Salary Distribution */}
                {salaryDistribution.length > 0 && (
                  <div>
                    <p className="mb-3 text-xs font-medium">Salary Distribution</p>
                    <ChartContainer config={distributionChartConfig} className="h-[180px] w-full">
                      <BarChart data={salaryDistribution}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                        <XAxis
                          dataKey="range"
                          tick={{ fontSize: 9 }}
                          tickLine={false}
                          axisLine={false}
                          className="text-muted-foreground"
                        />
                        <YAxis
                          tick={{ fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                          className="text-muted-foreground"
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            return (
                              <div className="rounded-lg border bg-popover p-2 shadow-md">
                                <p className="text-xs font-medium">{payload[0]?.payload?.range}</p>
                                <p className="text-xs text-muted-foreground">
                                  {payload[0]?.value} jobs
                                </p>
                              </div>
                            )
                          }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {salaryDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.range === "160-180k" || entry.range === "180-200k"
                                  ? "hsl(var(--primary))"
                                  : "hsl(var(--chart-3))"
                              }
                              opacity={
                                entry.range === "160-180k" || entry.range === "180-200k" ? 1 : 0.6
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Section 4: Hiring Velocity */}
      <Card className="rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Hiring Velocity</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Market is HOT for Senior Backend Engineers
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {trendsLoading ? (
            <SectionSkeleton height="h-[200px]" />
          ) : hiringVelocity.length === 0 ? (
            <EmptyState message="No hiring velocity data available yet." />
          ) : (
            <>
              {/* Area Chart */}
              <div>
                <p className="mb-3 text-xs text-muted-foreground">
                  Weekly job posting volume over time
                </p>
                <ChartContainer config={velocityChartConfig} className="h-[200px] w-full">
                  <AreaChart data={hiringVelocity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis
                      dataKey="week"
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null
                        return (
                          <div className="rounded-lg border bg-popover p-2 shadow-md">
                            <p className="text-xs font-medium">{payload[0]?.payload?.week}</p>
                            <p className="text-xs text-muted-foreground">
                              {payload[0]?.value} postings
                            </p>
                          </div>
                        )
                      }}
                    />
                    <defs>
                      <linearGradient id="velocityGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="postings"
                      stroke="var(--color-postings)"
                      strokeWidth={2}
                      fill="url(#velocityGradient)"
                    />
                  </AreaChart>
                </ChartContainer>
              </div>

              {/* Layoffs & Growth */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Layoff Tracker */}
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <AlertTriangle className="size-4 text-amber-500" />
                    <h4 className="text-sm font-medium">Recent Layoffs</h4>
                  </div>
                  {layoffCompanies.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No recent layoffs tracked.</p>
                  ) : (
                    <div className="space-y-2">
                      {layoffCompanies.map((company) => (
                        <div
                          key={company.name}
                          className="flex items-center justify-between rounded-md bg-amber-500/5 px-3 py-2"
                        >
                          <span className="text-sm font-medium">{company.name}</span>
                          <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 text-xs dark:text-amber-400">
                            {company.date}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Growth Signals */}
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <TrendingUp className="size-4 text-emerald-500" />
                    <h4 className="text-sm font-medium">Growth Signals</h4>
                  </div>
                  {growthCompanies.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No growth signals detected yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {growthCompanies.map((company) => (
                        <div
                          key={company.name}
                          className="flex items-center justify-between rounded-md bg-emerald-500/5 px-3 py-2"
                        >
                          <span className="text-sm font-medium">{company.name}</span>
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-xs dark:text-emerald-400">
                            {company.growth}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Section 5: Competition Analysis */}
      <Card className="rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Competition Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {trendsLoading ? (
            <SectionSkeleton />
          ) : competitionJobs.length === 0 && bestTimeData.length === 0 && hiddenGems.length === 0 ? (
            <EmptyState message="No competition data available yet." />
          ) : (
            <>
              {/* Competition Table */}
              {competitionJobs.length > 0 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Company</TableHead>
                        <TableHead className="text-xs">Role</TableHead>
                        <TableHead className="text-center text-xs">Competition</TableHead>
                        <TableHead className="text-right text-xs">Applicants</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {competitionJobs.map((job, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-sm font-medium">{job.company}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{job.role}</TableCell>
                          <TableCell className="text-center">
                            <CompetitionBadge level={job.level} />
                          </TableCell>
                          <TableCell className="text-right font-mono text-sm">
                            {job.applicants}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Best Time to Apply */}
              <div className="grid gap-6 lg:grid-cols-2">
                {bestTimeData.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Clock className="size-4 text-primary" />
                      <h4 className="text-sm font-medium">Best Time to Apply</h4>
                    </div>
                    <ChartContainer config={bestTimeChartConfig} className="h-[180px] w-full">
                      <BarChart data={bestTimeData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                          className="text-muted-foreground"
                        />
                        <YAxis
                          tick={{ fontSize: 10 }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                          className="text-muted-foreground"
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload?.length) return null
                            return (
                              <div className="rounded-lg border bg-popover p-2 shadow-md">
                                <p className="text-xs font-medium">{payload[0]?.payload?.day}</p>
                                <p className="text-xs text-muted-foreground">
                                  Success Rate: {payload[0]?.value}%
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Applications: {payload[0]?.payload?.applications}
                                </p>
                              </div>
                            )
                          }}
                        />
                        <Bar dataKey="successRate" radius={[4, 4, 0, 0]}>
                          {bestTimeData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.successRate >= 20
                                  ? "hsl(var(--primary))"
                                  : "hsl(var(--chart-5))"
                              }
                              opacity={entry.successRate >= 20 ? 1 : 0.6}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Weekends show highest success rates despite lower volume
                    </p>
                  </div>
                )}

                {/* Hidden Gems */}
                {hiddenGems.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Gem className="size-4 text-primary" />
                      <h4 className="text-sm font-medium">Hidden Gems</h4>
                    </div>
                    <p className="mb-3 text-xs text-muted-foreground">
                      Companies with fewer applicants than average
                    </p>
                    <div className="space-y-2">
                      {hiddenGems.map((gem) => (
                        <div
                          key={gem.company}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div>
                            <p className="text-sm font-medium">{gem.company}</p>
                            <p className="text-xs text-muted-foreground">{gem.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400">
                              {gem.applicants} applicants
                            </p>
                            <p className="text-xs text-muted-foreground">
                              vs avg {gem.avgApplicants}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
