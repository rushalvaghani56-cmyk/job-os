"use client"

import { X, Sparkles, Star, SkipForward, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BulkActionsBarProps {
  selectedCount: number
  onClear: () => void
  onScoreAll: () => void
  onGenerateAll: () => void
  onBookmark: () => void
  onSkip: () => void
  onApply: () => void
}

export function BulkActionsBar({
  selectedCount,
  onClear,
  onScoreAll,
  onGenerateAll,
  onBookmark,
  onSkip,
  onApply,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-4 py-3 bg-background border border-border rounded-xl shadow-lg">
        <span className="text-sm font-medium mr-2">
          {selectedCount} selected
        </span>
        
        <div className="h-6 w-px bg-border" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onScoreAll}
          className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Zap className="h-4 w-4" />
          Score All
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onGenerateAll}
          className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Sparkles className="h-4 w-4" />
          Generate All
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onBookmark}
          className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Star className="h-4 w-4" />
          Bookmark
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onSkip}
          className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onApply}
          className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowRight className="h-4 w-4" />
          Apply
        </Button>
        
        <div className="h-6 w-px bg-border" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
