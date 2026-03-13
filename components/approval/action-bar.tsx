"use client"

import { useState } from "react"
import {
  CheckIcon,
  SendIcon,
  PencilIcon,
  XIcon,
  RefreshCwIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ActionBarProps {
  onApproveAndSubmit: () => void
  onApprove: () => void
  onEditAndApprove: () => void
  onReject: (reason: string) => void
  onRegenerate: (instructions: string) => void
  isLoading?: boolean
}

const rejectReasons = [
  "Needs more personalization",
  "Tone doesn't match my style",
  "Contains inaccurate information",
  "Too long / Too short",
  "Missing key qualifications",
  "Other",
]

export function ActionBar({
  onApproveAndSubmit,
  onApprove,
  onEditAndApprove,
  onReject,
  onRegenerate,
  isLoading,
}: ActionBarProps) {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [customRejectReason, setCustomRejectReason] = useState("")
  const [regenerateInstructions, setRegenerateInstructions] = useState("")

  const handleReject = () => {
    const reason = rejectReason === "Other" ? customRejectReason : rejectReason
    if (reason) {
      onReject(reason)
      setRejectDialogOpen(false)
      setRejectReason("")
      setCustomRejectReason("")
    }
  }

  const handleRegenerate = () => {
    if (regenerateInstructions.trim()) {
      onRegenerate(regenerateInstructions)
      setRegenerateDialogOpen(false)
      setRegenerateInstructions("")
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-2 border-t border-border bg-card px-5 py-3">
        {/* Regenerate */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setRegenerateDialogOpen(true)}
          disabled={isLoading}
          className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <RefreshCwIcon className="size-4" />
          Regenerate
        </Button>

        {/* Reject */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRejectDialogOpen(true)}
          disabled={isLoading}
          className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-primary"
        >
          <XIcon className="size-4" />
          Reject
        </Button>

        {/* Edit & Approve */}
        <Button
          variant="outline"
          size="sm"
          onClick={onEditAndApprove}
          disabled={isLoading}
          className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <PencilIcon className="size-4" />
          Edit & Approve
        </Button>

        {/* Approve */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onApprove}
          disabled={isLoading}
          className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <CheckIcon className="size-4" />
          Approve
        </Button>

        {/* Approve & Submit */}
        <Button
          size="default"
          onClick={onApproveAndSubmit}
          disabled={isLoading}
          className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <SendIcon className="size-4" />
          Approve & Submit
        </Button>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Select a reason for rejection. This helps improve future
              generations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-wrap gap-2">
              {rejectReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setRejectReason(reason)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    rejectReason === reason
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  )}
                >
                  {reason}
                </button>
              ))}
            </div>
            {rejectReason === "Other" && (
              <div>
                <Label htmlFor="custom-reason" className="text-sm">
                  Custom reason
                </Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Describe the issue..."
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  className="mt-1.5 resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason || (rejectReason === "Other" && !customRejectReason)}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate Dialog */}
      <Dialog open={regenerateDialogOpen} onOpenChange={setRegenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Regenerate Content</DialogTitle>
            <DialogDescription>
              Provide instructions for how you&apos;d like the content to be
              regenerated.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="e.g., Make it more concise, add more technical details, emphasize leadership experience..."
              value={regenerateInstructions}
              onChange={(e) => setRegenerateInstructions(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRegenerateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegenerate}
              disabled={!regenerateInstructions.trim()}
            >
              <RefreshCwIcon className="mr-1.5 size-4" />
              Regenerate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
