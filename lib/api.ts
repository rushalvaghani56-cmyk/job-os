import type { ApiError, PaginatedResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Get a random delay between min and max milliseconds
 */
function getRandomDelay(min = 400, max = 900): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Simulate network delay for mock API calls
 */
async function simulateDelay(ms?: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms ?? getRandomDelay()));
}

/**
 * Base API client with mock support
 */
class APIClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    await simulateDelay();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    await simulateDelay();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    await simulateDelay();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error);
    }

    return response.json();
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    await simulateDelay();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error);
    }

    return response.json();
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    await simulateDelay();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new APIError(error);
    }

    return response.json();
  }
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  code: string;
  details?: Array<{ field: string; message: string }>;

  constructor(apiError: ApiError) {
    super(apiError.error.message);
    this.name = "APIError";
    this.code = apiError.error.code;
    this.details = apiError.error.details;
  }
}

/**
 * Mock API client for development
 */
export const api = new APIClient();

/**
 * Helper to create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number = 1,
  pageSize: number = 20
): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = data.slice(start, end);

  return {
    data: paginatedData,
    next_cursor: end < data.length ? String(page + 1) : null,
    has_more: end < data.length,
    total_count: data.length,
  };
}

/**
 * Helper to simulate API delay
 */
export { simulateDelay };
