import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { toast } from "sonner";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data considered fresh for 30 seconds
        staleTime: 30 * 1000,
        // Cache data for 5 minutes after it's no longer being used
        gcTime: 5 * 60 * 1000,
        // Retry failed queries once
        retry: 1,
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't refetch on window focus by default
        refetchOnWindowFocus: false,
        // Don't refetch on mount if data exists
        refetchOnMount: false,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Only show error toasts for queries that have been previously successful
        // This prevents showing errors on initial load
        if (query.state.data !== undefined) {
          toast.error(`Something went wrong: ${error.message}`);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error(`Failed to save: ${error.message}`);
      },
    }),
  });
}

// Create a singleton query client for client-side
let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a new query client
    return createQueryClient();
  }
  
  // Browser: use singleton pattern
  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }
  return browserQueryClient;
}

export { createQueryClient };
