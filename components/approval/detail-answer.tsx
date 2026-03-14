"use client"

import { useState } from "react"
import {
  HelpCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import type { ApprovalItem } from "./types"

interface AnswerContent {
  question: string
  answer: string
  confidence: "high" | "medium" | "low"
  wordCount: number
  sources?: string[]
}

interface DetailAnswerProps {
  item: ApprovalItem
  content: AnswerContent
  onContentChange?: (content: string) => void
}

export function DetailAnswer({
  item,
  content,
  onContentChange,
}: DetailAnswerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedAnswer, setEditedAnswer] = useState(content.answer)

  const confidenceConfig = {
    high: {
      label: "High Confidence",
      color: "text-success",
      bg: "bg-success-muted",
      icon: CheckCircle2Icon,
    },
    medium: {
      label: "Medium Confidence",
      color: "text-primary",
      bg: "bg-primary-muted",
      icon: CheckCircle2Icon,
    },
    low: {
      label: "Low Confidence",
      color: "text-warning-foreground",
      bg: "bg-warning-muted",
      icon: AlertTriangleIcon,
    },
  }

  const confidenceInfo = confidenceConfig[content.confidence]
  const ConfidenceIcon = confidenceInfo.icon

  const handleSaveEdit = () => {
    onContentChange?.(editedAnswer)
    setIsEditing(false)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <HelpCircleIcon className="size-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">
            Answer Review
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1", confidenceInfo.bg)}>
            <ConfidenceIcon className={cn("size-3.5", confidenceInfo.color)} />
            <span className={cn("text-xs font-medium", confidenceInfo.color)}>
              {confidenceInfo.label}
            </span>
          </div>
          <QualityScoreRing score={item.qualityScore} />
        </div>
      </div>

      {/* Low Confidence Warning Banner */}
      {content.confidence === "low" && (
        <div className="flex items-start gap-3 border-b border-warning bg-warning-muted px-5 py-3">
          <AlertTriangleIcon className="mt-0.5 size-5 shrink-0 text-warning-foreground" />
          <div>
            <p className="text-sm font-medium text-warning-foreground">
              AI flagged this answer for review
            </p>
            <p className="text-xs text-warning-foreground/80">
              Insufficient profile data to generate a confident response. Please review and edit as needed.
            </p>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-5">
          {/* Job Context */}
          <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">
                {item.companyLogo}
              </div>
              <div>
                <p className="font-medium text-foreground">{item.company}</p>
                <p className="text-sm text-muted-foreground">{item.jobTitle}</p>
              </div>
            </div>
          </div>

          {/* Question */}
          <div>
            <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Application Question
            </h3>
            <div className="rounded-xl bg-muted/50 p-4">
              <p className="text-sm font-medium leading-relaxed text-foreground">
                {content.question}
              </p>
            </div>
          </div>

          {/* Answer */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Generated Answer
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {content.wordCount} words
                </Badge>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editedAnswer}
                  onChange={(e) => setEditedAnswer(e.target.value)}
                  className="min-h-[200px] resize-none text-sm leading-relaxed"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditedAnswer(content.answer)
                      setIsEditing(false)
                    }}
                    className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {editedAnswer}
                </p>
              </div>
            )}
          </div>

          {/* Sources (if available) */}
          {content.sources && content.sources.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Profile Sources Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.sources.map((source, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function QualityScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 16
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative size-10">
      <svg className="size-full -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted"
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            score >= 90
              ? "text-success"
              : score >= 80
                ? "text-primary"
                : "text-warning"
          )}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-medium">
        {score}
      </span>
    </div>
  )
}
