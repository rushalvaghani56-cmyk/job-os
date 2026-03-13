"use client"

import { useState } from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  FileTextIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { ApprovalItem, ResumeContent, JobRequirement, QAReport } from "./types"

interface DetailResumeProps {
  item: ApprovalItem
  content: ResumeContent
  requirements: JobRequirement[]
  qaReport: QAReport
}

export function DetailResume({
  item,
  content,
  requirements,
  qaReport,
}: DetailResumeProps) {
  const [activeVariant, setActiveVariant] = useState<"A" | "B">(item.variant || "A")
  const [qaExpanded, setQaExpanded] = useState(false)

  const requiredReqs = requirements.filter((r) => r.type === "required")
  const preferredReqs = requirements.filter((r) => r.type === "preferred")

  return (
    <div className="flex h-full flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <FileTextIcon className="size-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">Resume Review</h2>
        </div>
        <div className="flex items-center gap-3">
          {item.variant && (
            <Tabs
              value={activeVariant}
              onValueChange={(v) => setActiveVariant(v as "A" | "B")}
            >
              <TabsList className="h-8">
                <TabsTrigger value="A" className="h-7 px-3 text-xs">
                  Variant A
                </TabsTrigger>
                <TabsTrigger value="B" className="h-7 px-3 text-xs">
                  Variant B
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <QualityScoreRing score={item.qualityScore} />
        </div>
      </div>

      {/* Two-Column Compare */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Job Requirements */}
        <div className="flex w-[45%] flex-col border-r border-border">
          <div className="border-b border-border bg-muted/30 px-4 py-2.5">
            <h3 className="text-sm font-medium text-foreground">Job Requirements</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              {/* Required */}
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Required
                </h4>
                <ul className="space-y-2">
                  {requiredReqs.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {req.matched ? (
                        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success" />
                      ) : (
                        <XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          req.matched ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preferred */}
              <div>
                <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Preferred
                </h4>
                <ul className="space-y-2">
                  {preferredReqs.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {req.matched ? (
                        <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-success" />
                      ) : (
                        <div className="mt-0.5 size-4 shrink-0 rounded-full border border-muted-foreground/30" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          req.matched ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {req.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right: Generated Resume */}
        <div className="flex w-[55%] flex-col">
          <div className="border-b border-border bg-muted/30 px-4 py-2.5">
            <h3 className="text-sm font-medium text-foreground">Generated Resume</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4">
              {content.sections.map((section, i) => (
                <div key={i}>
                  <div className="mb-1.5 flex items-center gap-2">
                    <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {section.name}
                    </h4>
                    {section.diffType === "added" && (
                      <Badge
                        variant="outline"
                        className="h-5 border-success bg-success-muted px-1.5 text-[10px] text-success"
                      >
                        New
                      </Badge>
                    )}
                    {section.diffType === "modified" && (
                      <Badge
                        variant="outline"
                        className="h-5 border-warning bg-warning-muted px-1.5 text-[10px] text-warning-foreground"
                      >
                        Modified
                      </Badge>
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-lg p-3 text-sm leading-relaxed",
                      section.diffType === "added" && "bg-success-muted",
                      section.diffType === "modified" && "bg-warning-muted",
                      section.diffType === "unchanged" && "bg-muted/50"
                    )}
                  >
                    <pre className="whitespace-pre-wrap font-sans">
                      {section.content}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* QA Report */}
      <Collapsible open={qaExpanded} onOpenChange={setQaExpanded}>
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center justify-between border-t border-border bg-muted/30 px-4 py-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset">
            <div className="flex items-center gap-2">
              <AlertTriangleIcon className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">QA Report</span>
              {qaReport.hallucinations.length > 0 && (
                <Badge
                  variant="outline"
                  className="h-5 border-warning bg-warning-muted px-1.5 text-[10px] text-warning-foreground"
                >
                  {qaReport.hallucinations.length} warning
                  {qaReport.hallucinations.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                Score: {qaReport.overallScore}
              </span>
              {qaExpanded ? (
                <ChevronUpIcon className="size-4 text-muted-foreground" />
              ) : (
                <ChevronDownIcon className="size-4 text-muted-foreground" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-border bg-card p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Hallucinations */}
              <div>
                <h5 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Potential Issues
                </h5>
                {qaReport.hallucinations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No issues detected</p>
                ) : (
                  <ul className="space-y-2">
                    {qaReport.hallucinations.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertTriangleIcon
                          className={cn(
                            "mt-0.5 size-4 shrink-0",
                            h.severity === "error"
                              ? "text-destructive"
                              : "text-warning"
                          )}
                        />
                        <span className="text-sm text-foreground">{h.issue}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Fact Checks */}
              <div>
                <h5 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Fact Verification
                </h5>
                <ul className="space-y-1.5">
                  {qaReport.factChecks.map((fc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      {fc.verified ? (
                        <CheckCircle2Icon className="size-3.5 shrink-0 text-success" />
                      ) : (
                        <XCircleIcon className="size-3.5 shrink-0 text-warning" />
                      )}
                      <span className="text-xs text-muted-foreground">{fc.claim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

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
