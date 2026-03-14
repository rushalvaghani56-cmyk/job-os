"use client"

import { useState, useCallback, useRef } from "react"
import { Upload, X, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  accept?: string
  maxSize?: number // in bytes
  onUpload?: (file: File) => Promise<void>
  onComplete?: (metadata: FileMetadata) => void
  className?: string
}

interface FileMetadata {
  name: string
  size: number
  type: string
  url: string
}

interface UploadState {
  file: File | null
  progress: number
  status: "idle" | "uploading" | "complete" | "error"
  error?: string
}

export function FileUploader({
  accept = ".pdf,.doc,.docx",
  maxSize = 10 * 1024 * 1024, // 10MB default
  onUpload,
  onComplete,
  className,
}: FileUploaderProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    file: null,
    progress: 0,
    status: "idle",
  })
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const simulateUpload = useCallback(
    async (file: File) => {
      setUploadState({ file, progress: 0, status: "uploading" })

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        setUploadState((prev) => ({ ...prev, progress: i }))
      }

      // Call onUpload if provided
      if (onUpload) {
        try {
          await onUpload(file)
        } catch {
          setUploadState((prev) => ({
            ...prev,
            status: "error",
            error: "Upload failed. Please try again.",
          }))
          return
        }
      }

      setUploadState((prev) => ({ ...prev, status: "complete" }))

      // Return file metadata
      const metadata: FileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }

      onComplete?.(metadata)
    },
    [onUpload, onComplete]
  )

  const handleFile = useCallback(
    (file: File) => {
      if (file.size > maxSize) {
        setUploadState({
          file: null,
          progress: 0,
          status: "error",
          error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
        })
        return
      }

      simulateUpload(file)
    },
    [maxSize, simulateUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleReset = useCallback(() => {
    setUploadState({ file: null, progress: 0, status: "idle" })
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [])

  return (
    <div className={cn("w-full", className)}>
      {uploadState.status === "idle" && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
          <p className="mb-1 text-sm font-medium text-foreground">
            Drop files here or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports {accept.split(",").join(", ")} up to {Math.round(maxSize / 1024 / 1024)}MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      )}

      {(uploadState.status === "uploading" || uploadState.status === "complete") && uploadState.file && (
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-foreground">
                  {uploadState.file.name}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={handleReset}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {(uploadState.file.size / 1024).toFixed(1)} KB
              </p>
              {uploadState.status === "uploading" && (
                <Progress value={uploadState.progress} className="mt-2 h-1" />
              )}
              {uploadState.status === "complete" && (
                <div className="mt-2 flex items-center gap-1 text-xs text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  Upload complete
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {uploadState.status === "error" && (
        <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{uploadState.error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleReset}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
