"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Clock, Building2, FlaskConical, History } from "lucide-react"
import { cn } from "@/lib/utils"
import type { JobDetail } from "../types"

interface TabAnalyticsProps {
  job: JobDetail
}

function ScoreComparisonBar({ label, yourScore, avgScore }: { label: string; yourScore: number; avgScore: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-primary" />
            You: <span className="font-mono">{yourScore}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-muted-foreground/30" />
            Avg: <span className="font-mono">{avgScore}</span>
          </span>
        </div>
      </div>
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-muted-foreground/20 rounded-full"
          style={{ width: `${avgScore}%` }}
        />
        <div 
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          style={{ width: `${yourScore}%` }}
        />
      </div>
    </div>
  )
}

function StageMetric({ stage, days, isActive }: { stage: string; days: number; isActive?: boolean }) {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg",
      isActive ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
    )}>
      <span className={cn("text-sm", isActive ? "font-medium text-primary" : "text-muted-foreground")}>
        {stage}
      </span>
      <span className={cn("text-sm font-mono", isActive && "text-primary")}>
        {days} day{days !== 1 ? "s" : ""}
      </span>
    </div>
  )
}

export function TabAnalytics({ job }: TabAnalyticsProps) {
  // Mock data for analytics
  const scoreComparison = [
    { label: "Overall Score", yourScore: job.score, avgScore: 62 },
    { label: "Skills Match", yourScore: 90, avgScore: 68 },
    { label: "Experience Fit", yourScore: 80, avgScore: 71 },
    { label: "Salary Alignment", yourScore: 70, avgScore: 65 },
  ]

  const stageMetrics = [
    { stage: "Discovery → Scored", days: 0, isActive: false },
    { stage: "Scored → Content Ready", days: 0, isActive: false },
    { stage: "Content Ready → Applied", days: 1, isActive: false },
    { stage: "Applied → Interview", days: 9, isActive: true },
  ]

  const similarJobs = [
    { title: "Frontend Engineer", score: 72, status: "rejected", date: "Jan 2026" },
    { title: "Software Engineer II", score: 68, status: "ghosted", date: "Nov 2025" },
  ]

  const abTestResults = {
    variantA: { opens: 1, replies: 1, conversionRate: 100 },
    variantB: { opens: 0, replies: 0, conversionRate: 0 },
  }

  return (
    <div className="p-6 grid grid-cols-2 gap-6">
      {/* Score vs Pipeline Average */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="size-4" />
            Score vs Pipeline Average
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scoreComparison.map((item) => (
            <ScoreComparisonBar key={item.label} {...item} />
          ))}
          <p className="text-xs text-muted-foreground pt-2">
            Your score is <span className="text-green-600 dark:text-green-400 font-medium">
              {job.score - 62} points above
            </span> the pipeline average
          </p>
        </CardContent>
      </Card>

      {/* Time in Stage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-4" />
            Time in Stage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stageMetrics.map((item) => (
            <StageMetric key={item.stage} {...item} />
          ))}
          <p className="text-xs text-muted-foreground pt-2">
            Total time in pipeline: <span className="font-mono">10 days</span>
          </p>
        </CardContent>
      </Card>

      {/* Similar Jobs at Company */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="size-4" />
            Similar Jobs at {job.company.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {similarJobs.length > 0 ? (
            <div className="space-y-3">
              {similarJobs.map((similarJob, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{similarJob.title}</p>
                    <p className="text-xs text-muted-foreground">{similarJob.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{similarJob.score}</span>
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      similarJob.status === "rejected" && "border-red-500/30 text-red-600 dark:text-red-400",
                      similarJob.status === "ghosted" && "border-muted-foreground/30 text-muted-foreground"
                    )}>
                      {similarJob.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No previous applications at this company
            </p>
          )}
        </CardContent>
      </Card>

      {/* A/B Test Results */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FlaskConical className="size-4" />
            A/B Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className={cn(
              "p-4 rounded-lg border",
              abTestResults.variantA.conversionRate > abTestResults.variantB.conversionRate 
                ? "border-green-500/30 bg-green-500/5" 
                : "border-border"
            )}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Variant A</span>
                {abTestResults.variantA.conversionRate > abTestResults.variantB.conversionRate && (
                  <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30 text-xs">
                    Winner
                  </Badge>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Opens</span>
                  <span className="font-mono">{abTestResults.variantA.opens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Replies</span>
                  <span className="font-mono">{abTestResults.variantA.replies}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Conversion</span>
                  <span className="font-mono font-medium">{abTestResults.variantA.conversionRate}%</span>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <span className="text-sm font-medium">Variant B</span>
              <div className="space-y-1 text-sm mt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Opens</span>
                  <span className="font-mono">{abTestResults.variantB.opens}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Replies</span>
                  <span className="font-mono">{abTestResults.variantB.replies}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Conversion</span>
                  <span className="font-mono font-medium">{abTestResults.variantB.conversionRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application History */}
      <Card className="col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <History className="size-4" />
            Your History at {job.company.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {job.applicationHistory.length > 0 ? (
            <div className="space-y-2">
              {job.applicationHistory.map((app) => (
                <div key={app.jobId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{app.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {app.outcome}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              This is your first application at {job.company.name}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
