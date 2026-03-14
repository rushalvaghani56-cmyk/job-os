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
  PieChart,
  Pie,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { rejectionData } from "./mock-data"
import { cn } from "@/lib/utils"

function RejectionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <Skeleton className="mb-4 h-5 w-36" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="rounded-xl border bg-card p-5">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <Skeleton className="mb-2 h-5 w-24" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  )
}

const chartConfig: ChartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
}

const pieColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--muted-foreground))",
]

export function TabRejections() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <RejectionsSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Rejection Reasons</h3>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={rejectionData} layout="vertical" barSize={24}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                type="category"
                dataKey="reason"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={100}
                className="text-muted-foreground"
              />
              <Tooltip
                content={<ChartTooltipContent />}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {rejectionData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index]}
                    className={cn(
                      "transition-opacity",
                      activeIndex !== null && activeIndex !== index && "opacity-40"
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Distribution</h3>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <PieChart>
              <Pie
                data={rejectionData}
                dataKey="percentage"
                nameKey="reason"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {rejectionData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index]}
                    className={cn(
                      "transition-opacity",
                      activeIndex !== null && activeIndex !== index && "opacity-40"
                    )}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-popover p-3 shadow-md">
                      <p className="text-sm font-medium">{data.reason}</p>
                      <p className="text-xs text-muted-foreground">
                        {data.count} rejections ({data.percentage}%)
                      </p>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ChartContainer>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {rejectionData.map((item, index) => (
              <div
                key={item.reason}
                className={cn(
                  "flex items-center gap-2 text-xs transition-opacity",
                  activeIndex !== null && activeIndex !== index && "opacity-40"
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: pieColors[index] }}
                />
                <span className="text-muted-foreground">{item.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Insights</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-2xl font-semibold font-mono">45%</p>
            <p className="text-xs text-muted-foreground">
              of rejections are non-responses. Consider following up after 5 days.
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-2xl font-semibold font-mono">15%</p>
            <p className="text-xs text-muted-foreground">
              cite experience mismatch. Your scoring model may need adjustment.
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-2xl font-semibold font-mono">12%</p>
            <p className="text-xs text-muted-foreground">
              are salary-related. Add salary range filters to improve targeting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
