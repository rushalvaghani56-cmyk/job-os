"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScoreBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  isDreamCompany?: boolean
}

export function ScoreBadge({ score, size = "md", showLabel = false, isDreamCompany = false }: ScoreBadgeProps) {
  // Per audit spec: 85-100 = emerald, 70-84 = blue, 60-69 = amber, <60 = slate
  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500 text-white"
    if (score >= 70) return "bg-blue-500 text-white"
    if (score >= 60) return "bg-amber-500 text-white"
    return "bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Low"
  }

  const sizes = {
    sm: "text-xs px-1.5 py-0.5 min-w-[32px]",
    md: "text-sm px-2 py-0.5 min-w-[40px]",
    lg: "text-base px-2.5 py-1 min-w-[48px]",
  }

  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-mono font-semibold",
          getScoreColor(score),
          sizes[size],
          isDreamCompany && "ring-2 ring-violet-500"
        )}
      >
        {isDreamCompany && <Star className="h-3 w-3 mr-1 fill-current" />}
        {score}
      </span>
      {showLabel && (
        <span className="text-xs text-muted-foreground">{getScoreLabel(score)}</span>
      )}
    </div>
  )
}

interface ConfidenceBarProps {
  confidence: number
  className?: string
}

export function ConfidenceBar({ confidence, className }: ConfidenceBarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            confidence >= 0.8 ? "bg-green-500" :
            confidence >= 0.6 ? "bg-emerald-500" :
            confidence >= 0.4 ? "bg-amber-500" : "bg-orange-500"
          )}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-mono w-8">
        {(confidence * 100).toFixed(0)}%
      </span>
    </div>
  )
}

interface DecisionBadgeProps {
  decision: "auto" | "review" | "skip"
}

export function DecisionBadge({ decision }: DecisionBadgeProps) {
  const styles = {
    auto: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
    review: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
    skip: "bg-muted text-muted-foreground border-border",
  }

  const labels = {
    auto: "Auto-apply",
    review: "Review",
    skip: "Skip",
  }

  return (
    <span className={cn(
      "inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium border",
      styles[decision]
    )}>
      {labels[decision]}
    </span>
  )
}
