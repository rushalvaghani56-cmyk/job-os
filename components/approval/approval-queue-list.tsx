"use client"

import { useState } from "react"
import {
  FileTextIcon,
  MailIcon,
  MessageSquareIcon,
  StarIcon,
  CheckIcon,
  HelpCircleIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ApprovalItem, ApprovalItemType } from "./types"

interface ApprovalQueueListProps {
  items: ApprovalItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onSelectAll: () => void
  onApproveSelected: () => void
}

function getTypeIcon(type: ApprovalItemType) {
  switch (type) {
    case "resume":
      return <FileTextIcon className="size-3.5" />
    case "cover_letter":
      return <FileTextIcon className="size-3.5" />
    case "outreach":
      return <MessageSquareIcon className="size-3.5" />
    case "email":
      return <MailIcon className="size-3.5" />
    case "answer":
      return <HelpCircleIcon className="size-3.5" />
  }
}

function getTypeLabel(type: ApprovalItemType) {
  switch (type) {
    case "resume":
      return "Resume"
    case "cover_letter":
      return "Cover Letter"
    case "outreach":
      return "Outreach"
    case "email":
      return "Email"
    case "answer":
      return "Answer"
  }
}

function formatAge(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60))
    return `${diffMins}m ago`
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`
  }
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export function ApprovalQueueList({
  items,
  selectedId,
  onSelect,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onApproveSelected,
}: ApprovalQueueListProps) {
  const [filter, setFilter] = useState<ApprovalItemType | "all">("all")

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true
    return item.type === filter
  })

  // Sort: dream -> high score -> medium -> oldest
  const sortedItems = [...filteredItems].sort((a, b) => {
    const priorityOrder = { dream: 0, high: 1, medium: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    if (a.qualityScore !== b.qualityScore) {
      return b.qualityScore - a.qualityScore
    }
    return a.createdAt.getTime() - b.createdAt.getTime()
  })

  const allSelected =
    sortedItems.length > 0 && sortedItems.every((item) => selectedIds.has(item.id))

  const counts = {
    all: items.length,
    resume: items.filter((i) => i.type === "resume").length,
    cover_letter: items.filter((i) => i.type === "cover_letter").length,
    outreach: items.filter((i) => i.type === "outreach").length,
    email: items.filter((i) => i.type === "email").length,
    answer: items.filter((i) => i.type === "answer").length,
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">Review Queue</h2>
          <Badge variant="secondary" className="font-mono text-xs">
            {items.length}
          </Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-border px-2 py-2">
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as ApprovalItemType | "all")}
        >
          <TabsList className="h-8 w-full justify-start gap-1 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="h-7 px-2 text-xs data-[state=active]:bg-secondary"
            >
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger
              value="resume"
              className="h-7 px-2 text-xs data-[state=active]:bg-secondary"
            >
              Resumes ({counts.resume})
            </TabsTrigger>
            <TabsTrigger
              value="cover_letter"
              className="h-7 px-2 text-xs data-[state=active]:bg-secondary"
            >
              Letters ({counts.cover_letter})
            </TabsTrigger>
            <TabsTrigger
              value="outreach"
              className="h-7 px-2 text-xs data-[state=active]:bg-secondary"
            >
              Outreach ({counts.outreach})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Checkbox
          checked={allSelected}
          onCheckedChange={onSelectAll}
          className="size-4"
          aria-label="Select all items"
        />
        <span className="text-xs text-muted-foreground">Select All</span>
        {selectedIds.size > 0 && (
          <Button
            size="sm"
            variant="outline"
            className="ml-auto h-7 text-xs"
            onClick={onApproveSelected}
          >
            <CheckIcon className="mr-1 size-3" />
            Approve ({selectedIds.size})
          </Button>
        )}
      </div>

      {/* Queue List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "group flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50",
                selectedId === item.id &&
                  "border-l-2 border-l-primary bg-primary/5"
              )}
              onClick={() => onSelect(item.id)}
            >
              {/* Checkbox */}
              <Checkbox
                checked={selectedIds.has(item.id)}
                onCheckedChange={(e) => {
                  e.stopPropagation?.()
                  onToggleSelect(item.id)
                }}
                onClick={(e) => e.stopPropagation()}
                className="mt-0.5 size-4"
                aria-label={`Select ${item.jobTitle}`}
              />

              {/* Company Logo */}
              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-medium text-secondary-foreground">
                {item.companyLogo}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                {/* Priority + Title */}
                <div className="flex items-center gap-2">
                  {item.priority === "dream" && (
                    <Badge
                      variant="outline"
                      className="h-5 gap-1 border-purple-300 bg-purple-50 px-1.5 text-[10px] text-purple-700 dark:border-purple-700 dark:bg-purple-950 dark:text-purple-300"
                    >
                      <StarIcon className="size-2.5 fill-current" />
                      Dream
                    </Badge>
                  )}
                  {item.priority === "high" && (
                    <Badge
                      variant="outline"
                      className="h-5 border-orange-300 bg-orange-50 px-1.5 text-[10px] text-orange-700 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-300"
                    >
                      High
                    </Badge>
                  )}
                  <span className="truncate text-sm font-medium text-foreground">
                    {item.jobTitle}
                  </span>
                </div>

                {/* Company */}
                <p className="truncate text-xs text-muted-foreground">
                  {item.company}
                </p>

                {/* Type + Score + Age */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    {getTypeIcon(item.type)}
                    <span className="text-xs">{getTypeLabel(item.type)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full text-[10px] font-mono font-medium",
                        item.qualityScore >= 90
                          ? "bg-success/20 text-success"
                          : item.qualityScore >= 80
                            ? "bg-primary/20 text-primary"
                            : "bg-warning/20 text-warning-foreground"
                      )}
                    >
                      {item.qualityScore}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatAge(item.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {sortedItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckIcon className="mb-2 size-8 text-muted-foreground/50" />
              <p className="text-sm font-medium text-foreground">Queue is empty</p>
              <p className="text-xs text-muted-foreground">
                All items have been reviewed
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
