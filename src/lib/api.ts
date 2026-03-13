/**
 * API Client
 * Mock API client with configurable delay and error simulation
 */

import type { ApiError, ApiResponse, PaginatedResponse } from "@/src/types/api";

interface RequestOptions extends RequestInit {
  /** Custom delay in ms (overrides random delay) */
  delay?: number;
  /** Whether to simulate an error */
  simulateError?: boolean;
}

/** Default delay range in ms */
const MIN_DELAY = 400;
const MAX_DELAY = 900;

/** Generate random delay */
function getRandomDelay(): number {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
}

/** Simulate network delay */
async function simulateDelay(delay?: number): Promise<void> {
  const actualDelay = delay ?? getRandomDelay();
  await new Promise((resolve) => setTimeout(resolve, actualDelay));
}

/** Get auth token from storage */
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const storage = localStorage.getItem("auth-storage");
  if (!storage) return null;
  try {
    const { state } = JSON.parse(storage);
    return state?.user?.id ? `mock_token_${state.user.id}` : null;
  } catch {
    return null;
  }
}

/** Create mock API error */
function createApiError(
  code: string,
  message: string,
  details?: Array<{ field: string; message: string }>
): ApiError {
  return {
    error: {
      code: code as ApiError["error"]["code"],
      message,
      details,
    },
  };
}

/**
 * Mock API client
 * Simulates API calls with configurable delay and error handling
 */
export const api = {
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    await simulateDelay(options?.delay);

    if (options?.simulateError) {
      throw createApiError("RESOURCE_NOT_FOUND", `Resource not found: ${endpoint}`);
    }

    // Return mock data based on endpoint
    return {
      data: {} as T,
      meta: {
        request_id: `req_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    };
  },

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    await simulateDelay(options?.delay);

    if (options?.simulateError) {
      throw createApiError("VALIDATION_ERROR", "Invalid request data");
    }

    return {
      data: body as T,
      meta: {
        request_id: `req_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    };
  },

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    await simulateDelay(options?.delay);

    if (options?.simulateError) {
      throw createApiError("RESOURCE_NOT_FOUND", `Resource not found: ${endpoint}`);
    }

    return {
      data: body as T,
      meta: {
        request_id: `req_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    };
  },

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    await simulateDelay(options?.delay);

    if (options?.simulateError) {
      throw createApiError("RESOURCE_NOT_FOUND", `Resource not found: ${endpoint}`);
    }

    return {
      data: {} as T,
      meta: {
        request_id: `req_${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
    };
  },

  /**
   * Make a paginated GET request
   */
  async getPaginated<T>(
    endpoint: string,
    options?: RequestOptions & { cursor?: string; limit?: number }
  ): Promise<PaginatedResponse<T>> {
    await simulateDelay(options?.delay);

    return {
      data: [] as T[],
      next_cursor: null,
      has_more: false,
    };
  },

  /**
   * Get default headers with auth
   */
  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  },
};

export { createApiError, getAuthToken };
