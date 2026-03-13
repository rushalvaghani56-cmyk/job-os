"use client"

import { MessageSquareIcon, LinkedinIcon, MailIcon, FlameIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { ApprovalItem, OutreachContent } from "./types"

interface DetailOutreachProps {
  item: ApprovalItem
  content: OutreachContent
  onAutoSendChange?: (autoSend: boolean) => void
}

export function DetailOutreach({
  item,
  content,
  onAutoSendChange,
}: DetailOutreachProps) {
  const warmthConfig = {
    cold: { label: "Cold", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" },
    warm: { label: "Warm", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
    hot: { label: "Hot", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950" },
  }

  const warmth = warmthConfig[content.warmth]

  // Highlight personalization hooks in the message
  const renderMessageWithHighlights = () => {
    let highlightedMessage = content.message
    const segments: React.ReactNode[] = []
    let lastIndex = 0

    // Simple highlighting based on hook keywords
    content.personalizationHooks.forEach((hook) => {
      // Find keywords from the hook in the message
      const keywords = hook.toLowerCase().split(" ")
      keywords.forEach((keyword) => {
        if (keyword.length > 4) {
          const regex = new RegExp(`(${keyword})`, "gi")
          highlightedMessage = highlightedMessage.replace(
            regex,
            "___HIGHLIGHT_START___$1___HIGHLIGHT_END___"
          )
        }
      })
    })

    // Parse the highlighted message
    const parts = highlightedMessage.split(/___HIGHLIGHT_START___|___HIGHLIGHT_END___/)
    let isHighlight = false

    parts.forEach((part, i) => {
      if (part) {
        if (isHighlight) {
          segments.push(
            <span
              key={i}
              className="rounded bg-warning-muted px-0.5 text-foreground"
              title="Personalization hook"
            >
              {part}
            </span>
          )
        } else {
          segments.push(<span key={i}>{part}</span>)
        }
      }
      isHighlight = !isHighlight
    })

    // Fallback to original if no highlights found
    if (segments.length === 0) {
      return content.message
    }

    return segments
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <MessageSquareIcon className="size-5 text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">
            Outreach Review
          </h2>
        </div>
        <QualityScoreRing score={item.qualityScore} />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-5">
          {/* Contact Card */}
          <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground">
                  {content.contactName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-foreground">{content.contactName}</p>
                  <p className="text-sm text-muted-foreground">
                    {content.contactTitle}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {content.contactCompany}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {/* Channel Badge */}
                <Badge
                  variant="outline"
                  className="gap-1.5"
                >
                  {content.channel === "linkedin" ? (
                    <LinkedinIcon className="size-3" />
                  ) : (
                    <MailIcon className="size-3" />
                  )}
                  {content.channel === "linkedin" ? "LinkedIn" : "Email"}
                </Badge>
                {/* Warmth Indicator */}
                <div className={cn("flex items-center gap-1 rounded-full px-2 py-1", warmth.bg)}>
                  <FlameIcon className={cn("size-3", warmth.color)} />
                  <span className={cn("text-xs font-medium", warmth.color)}>
                    {warmth.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Message</h3>
              <Badge variant="secondary" className="font-mono text-xs">
                {content.characterCount} chars
              </Badge>
            </div>
            <div className="rounded-xl bg-card p-4 shadow-sm ring-1 ring-border">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {renderMessageWithHighlights()}
              </p>
            </div>
          </div>

          {/* Personalization Hooks */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Personalization Hooks
            </h3>
            <div className="flex flex-wrap gap-2">
              {content.personalizationHooks.map((hook, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {hook}
                </Badge>
              ))}
            </div>
          </div>

          {/* Auto-send Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div>
              <Label htmlFor="auto-send" className="text-sm font-medium">
                Auto-send after approval
              </Label>
              <p className="text-xs text-muted-foreground">
                Message will be sent automatically when approved
              </p>
            </div>
            <Switch
              id="auto-send"
              checked={content.autoSend}
              onCheckedChange={onAutoSendChange}
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
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
