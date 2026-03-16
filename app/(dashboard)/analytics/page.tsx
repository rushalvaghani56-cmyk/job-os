"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Download, ChevronDown, Filter } from "lucide-react"
import { TabFunnel } from "@/components/analytics/tab-funnel"
import { TabSources } from "@/components/analytics/tab-sources"
import { TabRejections } from "@/components/analytics/tab-rejections"
import { TabAICost } from "@/components/analytics/tab-ai-cost"
import { TabSkills } from "@/components/analytics/tab-skills"
import { TabABTesting } from "@/components/analytics/tab-ab-testing"
import { TabGoals } from "@/components/analytics/tab-goals"
import { TabTiming } from "@/components/analytics/tab-timing"
import { TabReports } from "@/components/analytics/tab-reports"
import type { DateRange } from "@/components/analytics/types"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange>("30d")
  const [profile, setProfile] = React.useState("all")

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track your job search performance and identify opportunities
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Selector */}
          <div className="flex items-center rounded-lg border bg-card">
            {(["today", "7d", "30d", "90d", "all"] as DateRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  dateRange === range
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                } ${range === "today" ? "rounded-l-lg" : ""} ${range === "all" ? "rounded-r-lg" : ""}`}
              >
                {range === "today" ? "Today" : range === "all" ? "All" : range}
              </button>
            ))}
          </div>

          {/* Custom Date */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Calendar className="h-4 w-4" />
            Custom
          </Button>

          {/* Profile Filter */}
          <Select value={profile} onValueChange={setProfile}>
            <SelectTrigger className="w-auto min-w-[100px] sm:w-[140px] rounded-lg focus-visible:ring-2 focus-visible:ring-primary">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Profiles</SelectItem>
              <SelectItem value="senior-frontend">Senior Frontend</SelectItem>
              <SelectItem value="tech-lead">Tech Lead</SelectItem>
              <SelectItem value="staff-engineer">Staff Engineer</SelectItem>
            </SelectContent>
          </Select>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as PDF</DropdownMenuItem>
              <DropdownMenuItem>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="funnel" className="flex-1">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger
            value="funnel"
            className="rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
          >
            Funnel
          </TabsTrigger>
          <TabsTrigger
            value="sources"
            className="rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
          >
            Sources
          </TabsTrigger>
          <TabsTrigger
            value="rejections"
            className="rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
          >
            Rejections
          </TabsTrigger>
          <TabsTrigger
            value="ai-cost"
            className="rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
          >
            AI Cost
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
          >
            Skills & Market
          </TabsTrigger>
          <TabsTrigger
            value="ab-testing"
            className="rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
          >
            A/B Testing
          </TabsTrigger>
          <TabsTrigger
            value="goals"
            className="rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
          >
            Goals
          </TabsTrigger>
          <TabsTrigger
            value="timing"
            className="rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
          >
            Timing
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="rounded-lg border border-transparent data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-sm focus-visible:ring-2 focus-visible:ring-primary"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="funnel" className="m-0">
            <TabFunnel />
          </TabsContent>
          <TabsContent value="sources" className="m-0">
            <TabSources />
          </TabsContent>
          <TabsContent value="rejections" className="m-0">
            <TabRejections />
          </TabsContent>
          <TabsContent value="ai-cost" className="m-0">
            <TabAICost />
          </TabsContent>
          <TabsContent value="skills" className="m-0">
            <TabSkills />
          </TabsContent>
          <TabsContent value="ab-testing" className="m-0">
            <TabABTesting />
          </TabsContent>
          <TabsContent value="goals" className="m-0">
            <TabGoals />
          </TabsContent>
          <TabsContent value="timing" className="m-0">
            <TabTiming />
          </TabsContent>
          <TabsContent value="reports" className="m-0">
            <TabReports />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
