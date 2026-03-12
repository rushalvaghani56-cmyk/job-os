"use client"

import { cn } from "@/lib/utils"

interface ScoreBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export function ScoreBadge({ score, size = "md", showLabel = false }: ScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30"
    if (score >= 60) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
    if (score >= 40) return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
    if (score >= 20) return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30"
    return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    if (score >= 20) return "Low"
    return "Poor"
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
          "inline-flex items-center justify-center rounded-md border font-mono font-semibold",
          getScoreColor(score),
          sizes[size]
        )}
      >
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
