"use client"

import { useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PDFViewerProps {
  url?: string
  className?: string
}

export function PDFViewer({ url, className }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(3) // Mock total pages
  const [zoom, setZoom] = useState(100)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(200, prev + 25))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(50, prev - 25))
  }

  if (!url) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border bg-muted/50 p-8",
          className
        )}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">No PDF loaded</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Select a document to preview
        </p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col rounded-xl border bg-card", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-sm text-muted-foreground">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="mx-2 h-4 w-px bg-border" />
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={url} download>
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Content Area - Placeholder */}
      <div
        className="flex min-h-[500px] items-center justify-center overflow-auto bg-muted/30 p-4"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
      >
        <div className="flex aspect-[8.5/11] w-full max-w-[612px] items-center justify-center rounded-sm bg-background shadow-md">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">PDF Preview</p>
            <p className="text-xs text-muted-foreground/70">
              React-PDF integration pending
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
