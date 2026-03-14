"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { InboxIcon, ArrowLeftIcon, PartyPopperIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"
import { ApprovalQueueList } from "@/components/approval/approval-queue-list"
import { DetailResume } from "@/components/approval/detail-resume"
import { DetailCoverLetter } from "@/components/approval/detail-cover-letter"
import { DetailOutreach } from "@/components/approval/detail-outreach"
import { DetailAnswer } from "@/components/approval/detail-answer"
import { ActionBar } from "@/components/approval/action-bar"
import {
  mockApprovalItems,
  mockResumeContent,
  mockJobRequirements,
  mockQAReport,
  mockCoverLetterContent,
  mockOutreachContent,
  mockAnswerContent,
  mockAnswerContentLowConfidence,
} from "@/components/approval/mock-data"
import type { ApprovalItem } from "@/components/approval/types"

export default function ReviewPage() {
  const [items, setItems] = useState(mockApprovalItems)
  const [selectedId, setSelectedId] = useState<string | null>(
    mockApprovalItems[0]?.id ?? null
  )
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)

  const selectedItem = items.find((item) => item.id === selectedId)

  // Handle single item selection
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  // Handle checkbox toggle
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  // Handle select all
  const handleSelectAll = useCallback(() => {
    const pendingItems = items.filter((item) => item.status === "pending")
    if (selectedIds.size === pendingItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pendingItems.map((item) => item.id)))
    }
  }, [items, selectedIds.size])

  // Handle bulk approve
  const handleApproveSelected = useCallback(() => {
    const count = selectedIds.size
    setItems((prev) =>
      prev.map((item) =>
        selectedIds.has(item.id) ? { ...item, status: "approved" as const } : item
      )
    )
    setSelectedIds(new Set())
    toast.success(`${count} item${count > 1 ? "s" : ""} approved`, {
      description: "Items have been approved and queued for processing.",
    })
  }, [selectedIds])

  // Approve and submit
  const handleApproveAndSubmit = useCallback(() => {
    if (!selectedItem) return
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, status: "submitted" as const }
            : item
        )
      )
      setIsLoading(false)

      // Move to next item
      const currentIndex = items.findIndex((i) => i.id === selectedItem.id)
      const nextItem = items.find(
        (item, index) => index > currentIndex && item.status === "pending"
      )
      if (nextItem) {
        setSelectedId(nextItem.id)
      }

      // Show toast with undo
      let undoTimeout: NodeJS.Timeout
      toast.success("Approved & submitted", {
        description: `${selectedItem.jobTitle} at ${selectedItem.company}`,
        duration: 5000,
        action: {
          label: "Undo",
          onClick: () => {
            clearTimeout(undoTimeout)
            setItems((prev) =>
              prev.map((item) =>
                item.id === selectedItem.id
                  ? { ...item, status: "pending" as const }
                  : item
              )
            )
            toast.info("Submission undone")
          },
        },
      })
    }, 500)
  }, [selectedItem, items])

  // Approve only
  const handleApprove = useCallback(() => {
    if (!selectedItem) return
    setItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? { ...item, status: "approved" as const }
          : item
      )
    )
    toast.success("Approved", {
      description: `${selectedItem.jobTitle} at ${selectedItem.company}`,
    })

    // Move to next pending item
    const currentIndex = items.findIndex((i) => i.id === selectedItem.id)
    const nextItem = items.find(
      (item, index) => index > currentIndex && item.status === "pending"
    )
    if (nextItem) {
      setSelectedId(nextItem.id)
    }
  }, [selectedItem, items])

  // Edit and approve
  const handleEditAndApprove = useCallback(() => {
    toast.info("Opening editor...", {
      description: "Make your edits and save to approve",
    })
  }, [])

  // Reject
  const handleReject = useCallback(
    (reason: string) => {
      if (!selectedItem) return
      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, status: "rejected" as const }
            : item
        )
      )
      toast.error("Rejected", {
        description: reason,
      })

      // Move to next pending item
      const currentIndex = items.findIndex((i) => i.id === selectedItem.id)
      const nextItem = items.find(
        (item, index) => index > currentIndex && item.status === "pending"
      )
      if (nextItem) {
        setSelectedId(nextItem.id)
      }
    },
    [selectedItem, items]
  )

  // Regenerate
  const handleRegenerate = useCallback(
    (instructions: string) => {
      if (!selectedItem) return
      setIsLoading(true)
      toast.info("Regenerating...", {
        description: instructions,
      })

      // Simulate regeneration
      setTimeout(() => {
        setIsLoading(false)
        toast.success("Regeneration complete", {
          description: "New content is ready for review",
        })
      }, 2000)
    },
    [selectedItem]
  )

  // Render detail panel based on item type
  const renderDetailPanel = () => {
    if (!selectedItem) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
          <InboxIcon className="mb-3 size-12 opacity-50" />
          <p className="text-sm font-medium">No item selected</p>
          <p className="text-xs">Select an item from the queue to review</p>
        </div>
      )
    }

    switch (selectedItem.type) {
      case "resume":
        return (
          <DetailResume
            item={selectedItem}
            content={mockResumeContent}
            requirements={mockJobRequirements}
            qaReport={mockQAReport}
          />
        )
      case "cover_letter":
        return (
          <DetailCoverLetter
            item={selectedItem}
            content={mockCoverLetterContent}
            requirements={mockJobRequirements}
          />
        )
      case "outreach":
      case "email":
        return <DetailOutreach item={selectedItem} content={mockOutreachContent} />
      case "answer":
        // Use low confidence content for one of the answer items
        const answerContent = selectedItem.qualityScore < 70 
          ? mockAnswerContentLowConfidence 
          : mockAnswerContent
        return <DetailAnswer item={selectedItem} content={answerContent} />
      default:
        return (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p className="text-sm">Select an item to view details</p>
          </div>
        )
    }
  }

  const pendingItems = items.filter((item) => item.status === "pending")

  return (
    <div className="flex h-full flex-col">
      {/* Mobile/Tablet: Full screen switching layout */}
      <div className="flex flex-1 flex-col lg:hidden">
        {/* Show queue list when no item selected, or show detail when item selected */}
        {!selectedItem ? (
          // Queue List - full screen
          <div className="flex-1 overflow-hidden">
            {pendingItems.length === 0 ? (
              // Empty state when queue is empty
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <PartyPopperIcon className="mb-4 size-16 text-primary/60" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  All caught up!
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Your review queue is empty. Great job staying on top of things!
                </p>
                <Button variant="outline" asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            ) : (
              <ApprovalQueueList
                items={pendingItems}
                selectedId={selectedId}
                onSelect={handleSelect}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
                onApproveSelected={handleApproveSelected}
              />
            )}
          </div>
        ) : (
          // Detail View - full screen with back button
          <div className="flex flex-1 flex-col min-h-0">
            {/* Mobile back button */}
            <div className="flex items-center gap-2 border-b border-border bg-background px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedId(null)}
                className="gap-1.5"
              >
                <ArrowLeftIcon className="size-4" />
                Back to Queue
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">{renderDetailPanel()}</div>
            {selectedItem.status === "pending" && (
              <ActionBar
                onApproveAndSubmit={handleApproveAndSubmit}
                onApprove={handleApprove}
                onEditAndApprove={handleEditAndApprove}
                onReject={handleReject}
                onRegenerate={handleRegenerate}
                isLoading={isLoading}
              />
            )}
          </div>
        )}
      </div>

      {/* Desktop: Side-by-side resizable layout */}
      <ResizablePanelGroup direction="horizontal" className="hidden flex-1 lg:flex">
        {/* Left Panel - Queue List */}
        <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
          <ApprovalQueueList
            items={pendingItems}
            selectedId={selectedId}
            onSelect={handleSelect}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onApproveSelected={handleApproveSelected}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Detail View */}
        <ResizablePanel defaultSize={60} minSize={50} maxSize={70}>
          <div className="flex h-full flex-col">
            <div className="flex-1 min-h-0">{renderDetailPanel()}</div>
            {selectedItem && selectedItem.status === "pending" && (
              <ActionBar
                onApproveAndSubmit={handleApproveAndSubmit}
                onApprove={handleApprove}
                onEditAndApprove={handleEditAndApprove}
                onReject={handleReject}
                onRegenerate={handleRegenerate}
                isLoading={isLoading}
              />
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
