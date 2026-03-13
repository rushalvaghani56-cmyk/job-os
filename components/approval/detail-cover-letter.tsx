"use client"

import { FileTextIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ApprovalItem, CoverLetterContent, JobRequirement } from "./types"

interface DetailCoverLetterProps {
  item: ApprovalItem
  content: CoverLetterContent
  requirements: JobRequirement[]
}

export function DetailCoverLetter({
  item,
  content,
  requirements,
}: DetailCoverLetterProps) {
  // Highlight personalization markers in the content
  const renderContentWithHighlights = () => {
    let lastIndex = 0
    const segments: React.ReactNode[] = []

    content.personalizationHighlights
      .sort((a, b) => a.start - b.start)
      .forEach((highlight, i) => {
        // Add text before highlight
        if (highlight.start > lastIndex) {
          segments.push(
            <span key={`text-${i}`}>
              {content.content.slice(lastIndex, highlight.start)}
            </span>
          )
        }
        // Add highlighted text
        segments.push(
          <span
            key={`highlight-${i}`}
            className="rounded bg-warning-muted px-0.5 text-foreground"
            title="Personalization"
          >
            {content.content.slice(highlight.start, highlight.end)}
          </span>
        )
        lastIndex = highlight.end
      })

    // Add remaining text
    if (lastIndex < content.content.length) {
      segments.push(
        <span key="text-end">{content.content.slice(lastIndex)}</span>
      )
    }

    return segments
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <FileTextIcon className="size-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">
            Cover Letter Review
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <QualityScoreRing score={item.qualityScore} />
        </div>
      </div>

      {/* Two-Column Compare */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Job Context */}
        <div className="flex w-[40%] flex-col border-r border-border">
          <div className="border-b border-border bg-muted/30 px-4 py-2.5">
            <h3 className="text-sm font-medium text-foreground">Job Context</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              {/* Company Info */}
              <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">
                    {item.companyLogo}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.company}</p>
                    <p className="text-sm text-muted-foreground">{item.jobTitle}</p>
                  </div>
                </div>
              </div>

              {/* Key Requirements Summary */}
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Key Requirements
                </h4>
                <ul className="space-y-1.5">
                  {requirements.slice(0, 5).map((req, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right: Cover Letter Content */}
        <div className="flex w-[60%] flex-col">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
            <h3 className="text-sm font-medium text-foreground">
              Generated Cover Letter
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs">
                {content.wordCount} words
              </Badge>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="rounded-xl bg-card p-5 shadow-sm ring-1 ring-border">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {renderContentWithHighlights()}
                </p>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Yellow highlights indicate personalized content tailored to this
                specific company.
              </p>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Template Indicator */}
      {item.template && (
        <div className="flex items-center gap-2 border-t border-border bg-muted/20 px-4 py-2">
          <span className="text-xs text-muted-foreground">Used:</span>
          <Badge variant="secondary" className="text-xs">
            {item.template} template
          </Badge>
        </div>
      )}
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
