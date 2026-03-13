/**
 * Query Client Configuration
 * TanStack Query client with default options
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * Create a new QueryClient with default configuration
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        /** Time until data is considered stale (30 seconds) */
        staleTime: 30 * 1000,
        /** Time until inactive data is garbage collected (5 minutes) */
        gcTime: 5 * 60 * 1000,
        /** Number of retry attempts */
        retry: 1,
        /** Refetch on window focus */
        refetchOnWindowFocus: false,
        /** Refetch on reconnect */
        refetchOnReconnect: true,
      },
      mutations: {
        /** Number of retry attempts for mutations */
        retry: 0,
      },
    },
  });
}

/** Singleton query client for use in components */
let browserQueryClient: QueryClient | undefined;

/**
 * Get the query client (singleton on browser, new instance on server)
 */
export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always create a new client
    return createQueryClient();
  }

  // Browser: use singleton
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }
  return browserQueryClient;
}
