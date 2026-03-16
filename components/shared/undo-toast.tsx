"use client"

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Undo2 } from "lucide-react"

interface UndoToastOptions {
  message: string
  duration?: number // in seconds
  onUndo: () => void
  onExpire?: () => void
}

export function showUndoToast({
  message,
  duration = 5,
  onUndo,
  onExpire,
}: UndoToastOptions) {
  let timeoutId: NodeJS.Timeout | undefined
  let hasUndone = false

  const toastId = toast.custom(
    (id) => (
      <UndoToastContent
        message={message}
        duration={duration}
        onUndo={() => {
          hasUndone = true
          clearTimeout(timeoutId)
          onUndo()
          toast.dismiss(id)
        }}
        toastId={id}
      />
    ),
    {
      duration: duration * 1000,
      onAutoClose: () => {
        if (!hasUndone) {
          onExpire?.()
        }
      },
    }
  )

  return toastId
}

interface UndoToastContentProps {
  message: string
  duration: number
  onUndo: () => void
  toastId: string | number
}

function UndoToastContent({
  message,
  duration,
  onUndo,
  toastId,
}: UndoToastContentProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleUndo = useCallback(() => {
    onUndo()
  }, [onUndo])

  return (
    <div className="flex w-full items-center justify-between gap-4 rounded-lg bg-foreground px-4 py-3 text-background shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background/20 font-mono text-xs">
          {timeLeft}
        </div>
        <span className="text-sm">{message}</span>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="h-7 gap-1.5 bg-background/20 text-background hover:bg-background/30"
        onClick={handleUndo}
      >
        <Undo2 className="h-3.5 w-3.5" />
        Undo
      </Button>
    </div>
  )
}
