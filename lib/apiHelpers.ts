// Typed helper functions wrapping the API client for common patterns

import { AxiosError } from "axios";
import type { ApiError } from "@/types/api";

/**
 * Extract a user-facing error message from any API error.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.error?.message) {
      return apiError.error.message;
    }
    if (error.message === "Network Error") {
      return "Unable to connect to the server. Please check your connection.";
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred.";
}

/**
 * Extract the machine-readable error code from an API error.
 */
export function getErrorCode(error: unknown): string | null {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    return apiError?.error?.code ?? null;
  }
  return null;
}

/**
 * Extract field-level validation errors from a 422 response.
 */
export function getFieldErrors(
  error: unknown
): Record<string, string> | null {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    if (apiError?.error?.details && apiError.error.details.length > 0) {
      const fieldErrors: Record<string, string> = {};
      for (const detail of apiError.error.details) {
        fieldErrors[detail.field] = detail.message;
      }
      return fieldErrors;
    }
  }
  return null;
}
