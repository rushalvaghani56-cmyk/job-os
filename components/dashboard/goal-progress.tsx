import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

interface GoalProgressProps {
  hasGoals?: boolean
  goalTitle?: string
  current?: number
  target?: number
  advice?: string
}

export function GoalProgress({
  hasGoals = true,
  goalTitle = "Interviews This Month",
  current = 3,
  target = 5,
  advice = "You're on pace. Consider targeting smaller companies for faster cycles.",
}: GoalProgressProps) {
  const percentage = target > 0 ? Math.round((current / target) * 100) : 0

  if (!hasGoals) {
    return (
      <Card className="p-5 h-full flex flex-col">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">Goal Progress</CardTitle>
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
          <Button
            variant="outline"
            size="sm"
            asChild
            className="focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Link href="/dashboard/settings/goals">
              Set a goal
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
          <CardTitle className="text-base">Goal Progress</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col gap-4">
        {/* Goal Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{goalTitle}</span>
            <span className="text-sm font-mono">
              {current}/{target}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {percentage}% complete
          </p>
        </div>

        {/* Copilot Advice */}
        <div className="flex gap-3 rounded-lg border p-3 bg-muted/30 mt-auto">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">{advice}</p>
        </div>
      </CardContent>
    </Card>
  )
}
