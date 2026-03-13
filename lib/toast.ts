import { toast } from "sonner"

interface UndoToastOptions {
  message: string
  undoAction: () => void | Promise<void>
  duration?: number
}

/**
 * Shows an undo toast with a countdown timer
 * Per audit spec: "Undo toast: [Action] — Undo (28s)" + countdown progress bar
 */
export function showUndoToast({ message, undoAction, duration = 30000 }: UndoToastOptions) {
  const toastId = toast(message, {
    duration,
    action: {
      label: "Undo",
      onClick: async () => {
        await undoAction()
        toast.dismiss(toastId)
        toast.success("Action undone")
      },
    },
  })
  return toastId
}

/**
 * Shows a success toast
 * Per audit spec: Green checkmark icon + message + auto-dismiss 5s
 */
export function showSuccessToast(message: string, description?: string) {
  return toast.success(message, {
    description,
    duration: 5000,
  })
}

/**
 * Shows an error toast with optional retry
 * Per audit spec: Red X icon + message + "Retry" button + auto-dismiss 8s
 */
export function showErrorToast(
  message: string,
  options?: {
    description?: string
    onRetry?: () => void
  }
) {
  return toast.error(message, {
    description: options?.description,
    duration: 8000,
    action: options?.onRetry
      ? {
          label: "Retry",
          onClick: options.onRetry,
        }
      : undefined,
  })
}

/**
 * Shows a warning toast
 * Per audit spec: Amber triangle icon + message + auto-dismiss 6s
 */
export function showWarningToast(message: string, description?: string) {
  return toast.warning(message, {
    description,
    duration: 6000,
  })
}

/**
 * Shows a critical toast that does NOT auto-dismiss
 * Per audit spec: Does NOT auto-dismiss — requires explicit close
 * Used for CAPTCHA intervention, failed submission
 */
export function showCriticalToast(
  message: string,
  options?: {
    description?: string
    onAction?: () => void
    actionLabel?: string
  }
) {
  return toast.error(message, {
    description: options?.description,
    duration: Infinity, // Does not auto-dismiss
    action: options?.onAction
      ? {
          label: options.actionLabel || "Resolve",
          onClick: options.onAction,
        }
      : undefined,
  })
}

/**
 * Shows an info toast
 */
export function showInfoToast(message: string, description?: string) {
  return toast.info(message, {
    description,
    duration: 5000,
  })
}

/**
 * Shows a loading toast that can be updated
 */
export function showLoadingToast(message: string) {
  return toast.loading(message)
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(toastId: string | number) {
  toast.dismiss(toastId)
}

/**
 * Update a toast
 */
export function updateToast(
  toastId: string | number,
  data: {
    type: "success" | "error" | "info" | "warning"
    message: string
    description?: string
  }
) {
  if (data.type === "success") {
    toast.success(data.message, {
      id: toastId,
      description: data.description,
    })
  } else if (data.type === "error") {
    toast.error(data.message, {
      id: toastId,
      description: data.description,
    })
  } else if (data.type === "warning") {
    toast.warning(data.message, {
      id: toastId,
      description: data.description,
    })
  } else {
    toast.info(data.message, {
      id: toastId,
      description: data.description,
    })
  }
}
