"use client"

import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { sourceData } from "./mock-data"

function SourcesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5">
        <Skeleton className="mb-4 h-5 w-40" />
        <Skeleton className="h-[350px] w-full" />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

const chartConfig: ChartConfig = {
  jobsFound: {
    label: "Jobs Found",
    color: "hsl(var(--chart-1))",
  },
  scored80Plus: {
    label: "Scored ≥80",
    color: "hsl(var(--chart-2))",
  },
  applied: {
    label: "Applied",
    color: "hsl(var(--chart-4))",
  },
  interviews: {
    label: "Interviews",
    color: "hsl(var(--chart-5))",
  },
}

export function TabSources() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <SourcesSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Grouped Bar Chart */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Performance by Source</h3>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart data={sourceData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
            <XAxis
              dataKey="source"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <Tooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 16 }}
              iconType="square"
              iconSize={10}
            />
            <Bar
              dataKey="jobsFound"
              name="Jobs Found"
              fill="var(--color-jobsFound)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="scored80Plus"
              name="Scored ≥80"
              fill="var(--color-scored80Plus)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="applied"
              name="Applied"
              fill="var(--color-applied)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="interviews"
              name="Interviews"
              fill="var(--color-interviews)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Source Details Table */}
      <div className="rounded-xl border bg-card">
        <div className="border-b p-4">
          <h3 className="text-sm font-semibold">Source Details</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Source</TableHead>
              <TableHead className="text-right text-xs">Total Jobs</TableHead>
              <TableHead className="text-right text-xs">Score Avg</TableHead>
              <TableHead className="text-right text-xs">Applied</TableHead>
              <TableHead className="text-right text-xs">Interviews</TableHead>
              <TableHead className="text-right text-xs">Cost/Interview</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sourceData.map((row) => (
              <TableRow key={row.source}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold">
                      {row.logo}
                    </div>
                    <span className="text-sm font-medium">{row.source}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {row.jobsFound.toLocaleString()}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {row.scoreAvg}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {row.applied}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {row.interviews}
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  ${row.costPerInterview.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
