"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { goals } from "./mock-data"
import { cn } from "@/lib/utils"
import { Plus, Sparkles, Target, TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react"
import type { Goal } from "./types"

function GoalsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-1 h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <Skeleton className="mb-2 h-5 w-32" />
            <Skeleton className="mb-4 h-8 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

const paceConfig = {
  "on-track": {
    label: "On Track",
    icon: Minus,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  behind: {
    label: "Behind",
    icon: TrendingDown,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  ahead: {
    label: "Ahead",
    icon: TrendingUp,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
}

const typeIcons = {
  interviews: Target,
  applications: Target,
  responses: Target,
  offers: Target,
}

export function TabGoals() {
  const [addGoalOpen, setAddGoalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 450)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <GoalsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Goals</h3>
          <p className="text-xs text-muted-foreground">
            Track your job search progress against your targets
          </p>
        </div>
        <Dialog open={addGoalOpen} onOpenChange={setAddGoalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-lg gap-1 focus-visible:ring-2 focus-visible:ring-primary">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
              <DialogDescription>
                Set a measurable goal to track your job search progress
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-type">Goal Type</Label>
                <Select>
                  <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interviews">Interviews</SelectItem>
                    <SelectItem value="applications">Applications</SelectItem>
                    <SelectItem value="responses">Responses</SelectItem>
                    <SelectItem value="offers">Offers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="target">Target</Label>
                <Input 
                  id="target" 
                  type="number" 
                  placeholder="e.g. 5" 
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input 
                  id="deadline" 
                  type="date" 
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddGoalOpen(false)} className="rounded-lg">
                Cancel
              </Button>
              <Button onClick={() => setAddGoalOpen(false)} className="rounded-lg">
                Create Goal
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goal Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs text-muted-foreground">Goals On Track</p>
          <p className="mt-2 text-2xl font-semibold font-mono">
            {goals.filter(g => g.pace === "on-track" || g.pace === "ahead").length}/{goals.length}
          </p>
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
            {Math.round((goals.filter(g => g.pace === "on-track" || g.pace === "ahead").length / goals.length) * 100)}% success rate
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs text-muted-foreground">Average Progress</p>
          <p className="mt-2 text-2xl font-semibold font-mono">
            {Math.round(goals.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) / goals.length)}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">across all goals</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs text-muted-foreground">Next Deadline</p>
          <p className="mt-2 text-2xl font-semibold font-mono">
            {Math.ceil((new Date(goals[0].deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{goals[0].title}</p>
        </div>
      </div>
    </div>
  )
}

function GoalCard({ goal }: { goal: Goal }) {
  const PaceIcon = paceConfig[goal.pace].icon
  const TypeIcon = typeIcons[goal.type]
  const progress = Math.min((goal.current / goal.target) * 100, 100)
  const daysRemaining = Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TypeIcon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-medium">{goal.title}</h4>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={cn("gap-1", paceConfig[goal.pace].color)}>
                <PaceIcon className="h-3 w-3" />
                {paceConfig[goal.pace].label}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {daysRemaining}d left
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold font-mono">{goal.current}</span>
          <span className="text-sm text-muted-foreground">/ {goal.target}</span>
        </div>
        <Progress value={progress} className="mt-2 h-2" />
        <p className="mt-1 text-xs text-muted-foreground text-right">
          {progress.toFixed(0)}% complete
        </p>
      </div>

      {/* Copilot Advice */}
      <div className="mt-4 flex gap-2 rounded-lg bg-primary/5 p-3">
        <Sparkles className="h-4 w-4 shrink-0 text-primary" />
        <p className="text-xs text-muted-foreground">{goal.copilotAdvice}</p>
      </div>
    </div>
  )
}
