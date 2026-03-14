/**
 * Paginated list response wrapper for all list endpoints
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[];
  /** Cursor for fetching the next page, null if no more pages */
  next_cursor: string | null;
  /** Whether more pages exist after this one */
  has_more: boolean;
  /** Total count of items (optional, may be expensive to compute) */
  total_count?: number;
}

/**
 * Standard API error envelope
 */
export interface ApiError {
  error: {
    /** Machine-readable error code */
    code: ErrorCode;
    /** Human-readable error message */
    message: string;
    /** Field-level validation errors */
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

/**
 * Standard error codes used across the API
 */
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTH_TOKEN_EXPIRED"
  | "AUTH_INVALID_TOKEN"
  | "AUTH_INSUFFICIENT_ROLE"
  | "RATE_LIMIT_EXCEEDED"
  | "AI_PROVIDER_TIMEOUT"
  | "AI_PROVIDER_QUOTA_EXCEEDED"
  | "AI_KEY_INVALID"
  | "ATS_CAPTCHA_DETECTED"
  | "ATS_SUBMISSION_FAILED"
  | "RESOURCE_NOT_FOUND"
  | "RESOURCE_ALREADY_EXISTS"
  | "TASK_FAILED";

/**
 * API response wrapper for mutations
 */
export interface MutationResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Custom headers to include */
  headers?: Record<string, string>;
  /** Whether to include credentials */
  credentials?: RequestCredentials;
  /** Abort signal for cancellation */
  signal?: AbortSignal;
}

/**
 * Batch operation result
 */
export interface BatchResult<T> {
  succeeded: T[];
  failed: Array<{
    item: T;
    error: string;
  }>;
}
