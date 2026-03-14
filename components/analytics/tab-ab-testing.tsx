"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { abTests } from "./mock-data"
import { cn } from "@/lib/utils"
import { Trophy, XCircle, Clock, HelpCircle, Plus, BarChart3 } from "lucide-react"

function ABTestingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <Skeleton className="mb-4 h-6 w-48" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

const statusConfig = {
  running: {
    label: "Running",
    icon: Clock,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  winner: {
    label: "Winner",
    icon: Trophy,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  loser: {
    label: "Loser",
    icon: XCircle,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  inconclusive: {
    label: "Inconclusive",
    icon: HelpCircle,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
}

export function TabABTesting() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <ABTestingSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">A/B Tests</h3>
          <p className="text-xs text-muted-foreground">
            Experiment with different strategies to optimize your job search
          </p>
        </div>
        <Button size="sm" className="rounded-lg gap-1 focus-visible:ring-2 focus-visible:ring-primary">
          <Plus className="h-4 w-4" />
          New Test
        </Button>
      </div>

      {/* Test Cards */}
      <div className="grid gap-4">
        {abTests.map((test) => {
          const StatusIcon = statusConfig[test.status].icon
          return (
            <div key={test.id} className="rounded-xl border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{test.name}</h4>
                    <Badge variant="secondary" className={cn("gap-1", statusConfig[test.status].color)}>
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig[test.status].label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{test.variant}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-8 rounded-lg focus-visible:ring-2 focus-visible:ring-primary">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {/* Control */}
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Control</p>
                  <p className="mt-1 text-xl font-semibold font-mono">{test.control}%</p>
                  <p className="text-xs text-muted-foreground">{test.metric}</p>
                </div>

                {/* Treatment */}
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Treatment</p>
                  <p className={cn(
                    "mt-1 text-xl font-semibold font-mono",
                    test.improvement > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {test.treatment}%
                  </p>
                  <p className="text-xs text-muted-foreground">{test.metric}</p>
                </div>

                {/* Improvement */}
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Improvement</p>
                  <p className={cn(
                    "mt-1 text-xl font-semibold font-mono",
                    test.improvement > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {test.improvement > 0 ? "+" : ""}{test.improvement.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">vs control</p>
                </div>
              </div>

              {/* Significance */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Statistical Significance</span>
                  <span className={cn(
                    "font-mono font-medium",
                    test.significance >= 95 ? "text-emerald-600 dark:text-emerald-400" :
                    test.significance >= 80 ? "text-amber-600 dark:text-amber-400" :
                    "text-muted-foreground"
                  )}>
                    {test.significance}%
                  </span>
                </div>
                <Progress 
                  value={test.significance} 
                  className="mt-2 h-2"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {test.significance >= 95 
                    ? "High confidence - results are statistically significant"
                    : test.significance >= 80
                    ? "Moderate confidence - more data needed"
                    : "Low confidence - continue running test"
                  }
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tips */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">Testing Tips</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">Sample Size</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Aim for at least 30 applications per variant for reliable results
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">One Variable</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Test only one thing at a time to isolate what works
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs font-medium">95% Threshold</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Wait for 95% significance before declaring a winner
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
