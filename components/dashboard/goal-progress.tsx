"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Target, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Goal {
  id: string
  title: string
  current: number
  target: number
  status: "on-track" | "almost" | "behind"
}

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Interviews This Month",
    current: 3,
    target: 5,
    status: "on-track",
  },
  {
    id: "2",
    title: "Applications This Week",
    current: 8,
    target: 10,
    status: "almost",
  },
]

const statusConfig: Record<Goal["status"], { label: string; className: string }> = {
  "on-track": {
    label: "On track",
    className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  },
  almost: {
    label: "Almost there",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  behind: {
    label: "Behind",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
}

interface GoalProgressProps {
  hasGoals?: boolean
  isLoading?: boolean
}

export function GoalProgress({ hasGoals = true, isLoading = false }: GoalProgressProps) {
  const advice = "You're on pace. Consider targeting smaller companies for faster interview cycles."

  if (isLoading) {
    return (
      <Card className="p-5 h-full flex flex-col">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-20" />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
          <Skeleton className="h-16 w-full mt-auto" />
        </CardContent>
      </Card>
    )
  }

  if (!hasGoals) {
    return (
      <Card className="p-5 h-full flex flex-col">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Goals</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-muted p-4">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">No goals set yet</p>
            <p className="text-xs text-muted-foreground">
              Set a goal to track your job search progress
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">
              Set Goals
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-5 h-full flex flex-col">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Goals</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col gap-4">
        {/* Goals List */}
        <div className="space-y-4">
          {mockGoals.map((goal) => {
            const percentage = Math.round((goal.current / goal.target) * 100)
            const status = statusConfig[goal.status]

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{goal.title}</span>
                  <span className="text-sm font-mono">
                    {goal.current}/{goal.target}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={cn("text-xs", status.className)}>
                    {status.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {percentage}% complete
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Copilot Advice */}
        <div className="flex gap-3 rounded-lg border p-3 bg-muted/30 mt-auto">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground italic">{advice}</p>
        </div>
      </CardContent>
    </Card>
  )
}
