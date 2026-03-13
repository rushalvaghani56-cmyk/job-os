/**
 * API Response Types
 * Standard response envelopes and error handling types for the Job Application OS API
 */

/** Paginated list response for cursor-based pagination */
export interface PaginatedResponse<T> {
  /** The data array containing the requested items */
  data: T[];
  /** Cursor for fetching the next page, null if no more pages */
  next_cursor: string | null;
  /** Whether there are more items to fetch */
  has_more: boolean;
}

/** Standard API error envelope */
export interface ApiError {
  error: {
    /** Machine-readable error code */
    code: ErrorCode;
    /** Human-readable error message */
    message: string;
    /** Optional field-level validation errors */
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

/** Standard error codes used across the API */
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

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    request_id: string;
    timestamp: string;
  };
}

/** Batch operation result */
export interface BatchResult<T> {
  successful: T[];
  failed: Array<{
    item: T;
    error: ApiError;
  }>;
}
