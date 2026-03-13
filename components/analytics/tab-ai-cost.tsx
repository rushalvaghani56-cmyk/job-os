"use client"

import * as React from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { dailySpending, taskSpending, aiCostStats } from "./mock-data"
import { DollarSign, TrendingUp, FileText, Zap } from "lucide-react"

const lineChartConfig: ChartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--chart-1))",
  },
}

const stackedBarConfig: ChartConfig = {
  anthropic: {
    label: "Anthropic",
    color: "hsl(239, 84%, 67%)",
  },
  openai: {
    label: "OpenAI",
    color: "hsl(142, 71%, 45%)",
  },
  google: {
    label: "Google",
    color: "hsl(0, 72%, 51%)",
  },
}

export function TabAICost() {
  const [activeTaskIndex, setActiveTaskIndex] = React.useState<number | null>(null)

  // Format date for x-axis
  const formattedSpending = dailySpending.map(d => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }))

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="This Month"
          value={`$${aiCostStats.thisMonth.toFixed(2)}`}
          subtext="Total AI spending"
        />
        <StatCard
          icon={TrendingUp}
          label="Projected"
          value={`$${aiCostStats.projected.toFixed(2)}`}
          subtext="Monthly projection"
        />
        <StatCard
          icon={FileText}
          label="Per Application"
          value={`$${aiCostStats.costPerApplication.toFixed(2)}`}
          subtext="Average cost"
        />
        <StatCard
          icon={Zap}
          label="Most Expensive"
          value={aiCostStats.mostExpensiveTask}
          subtext="Task type"
        />
      </div>

      {/* Line Chart - Daily Spending */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Daily Spending (Last 30 Days)</h3>
        <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
          <AreaChart data={formattedSpending}>
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              className="text-muted-foreground"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-popover p-3 shadow-md">
                    <p className="text-sm font-medium">{data.date}</p>
                    <p className="text-xs text-muted-foreground">
                      Total: ${data.total.toFixed(2)}
                    </p>
                  </div>
                )
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#totalGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stacked Bar Chart - By Provider */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Spending by Provider</h3>
          <ChartContainer config={stackedBarConfig} className="h-[250px] w-full">
            <BarChart data={formattedSpending.filter((_, i) => i % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                className="text-muted-foreground"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-popover p-3 shadow-md">
                      <p className="text-sm font-medium">{data.date}</p>
                      <div className="mt-1 space-y-0.5">
                        <p className="text-xs"><span className="text-indigo-500">Anthropic:</span> ${data.anthropic.toFixed(2)}</p>
                        <p className="text-xs"><span className="text-emerald-500">OpenAI:</span> ${data.openai.toFixed(2)}</p>
                        <p className="text-xs"><span className="text-red-500">Google:</span> ${data.google.toFixed(2)}</p>
                      </div>
                    </div>
                  )
                }}
              />
              <Bar dataKey="anthropic" stackId="a" fill="hsl(239, 84%, 67%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="openai" stackId="a" fill="hsl(142, 71%, 45%)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="google" stackId="a" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
          {/* Legend */}
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
              <span className="text-muted-foreground">Anthropic</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              <span className="text-muted-foreground">OpenAI</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="h-2.5 w-2.5 rounded-sm bg-red-500" />
              <span className="text-muted-foreground">Google</span>
            </div>
          </div>
        </div>

        {/* Donut Chart - By Task */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Spending by Task</h3>
          <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
            <PieChart>
              <Pie
                data={taskSpending}
                dataKey="amount"
                nameKey="task"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                onMouseEnter={(_, index) => setActiveTaskIndex(index)}
                onMouseLeave={() => setActiveTaskIndex(null)}
              >
                {taskSpending.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={activeTaskIndex === null || activeTaskIndex === index ? 1 : 0.4}
                    className="transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const data = payload[0].payload
                  return (
                    <div className="rounded-lg border bg-popover p-3 shadow-md">
                      <p className="text-sm font-medium">{data.task}</p>
                      <p className="text-xs text-muted-foreground">
                        ${data.amount.toFixed(2)} ({data.percentage}%)
                      </p>
                    </div>
                  )
                }}
              />
            </PieChart>
          </ChartContainer>
          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {taskSpending.map((item, index) => (
              <div
                key={item.task}
                className={`flex items-center gap-2 text-xs transition-opacity ${
                  activeTaskIndex !== null && activeTaskIndex !== index ? "opacity-40" : ""
                }`}
                onMouseEnter={() => setActiveTaskIndex(index)}
                onMouseLeave={() => setActiveTaskIndex(null)}
              >
                <div
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground">{item.task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
}: {
  icon: React.ElementType
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold font-mono">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
    </div>
  )
}
