/**
 * useOptimisticMutation Hook
 * Wrapper around useMutation with optimistic updates and rollback
 */

import { useCallback, useState } from "react";
import { toast } from "sonner";

interface OptimisticMutationOptions<TData, TVariables> {
  /** The mutation function */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Get the optimistic data before mutation */
  getOptimisticData?: (variables: TVariables) => TData;
  /** Called when mutation succeeds */
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** Called when mutation fails */
  onError?: (error: Error, variables: TVariables) => void;
  /** Called to rollback optimistic update */
  onRollback?: (variables: TVariables) => void;
  /** Success toast message */
  successMessage?: string;
  /** Error toast message */
  errorMessage?: string;
}

interface OptimisticMutationReturn<TData, TVariables> {
  /** Execute the mutation */
  mutate: (variables: TVariables) => Promise<TData | null>;
  /** Current data */
  data: TData | null;
  /** Whether mutation is in progress */
  isLoading: boolean;
  /** Error if mutation failed */
  error: Error | null;
  /** Reset mutation state */
  reset: () => void;
}

export function useOptimisticMutation<TData, TVariables>(
  options: OptimisticMutationOptions<TData, TVariables>
): OptimisticMutationReturn<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | null> => {
      setIsLoading(true);
      setError(null);

      // Apply optimistic update if provided
      let optimisticData: TData | undefined;
      if (options.getOptimisticData) {
        optimisticData = options.getOptimisticData(variables);
        setData(optimisticData);
      }

      try {
        const result = await options.mutationFn(variables);
        setData(result);
        setIsLoading(false);

        if (options.successMessage) {
          toast.success(options.successMessage);
        }

        options.onSuccess?.(result, variables);
        return result;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error("Mutation failed");
        setError(errorObj);
        setIsLoading(false);

        // Rollback optimistic update
        if (optimisticData) {
          options.onRollback?.(variables);
          setData(null);
        }

        const errorMsg = options.errorMessage || errorObj.message;
        toast.error(errorMsg, {
          action: {
            label: "Retry",
            onClick: () => mutate(variables),
          },
        });

        options.onError?.(errorObj, variables);
        return null;
      }
    },
    [options]
  );

  return {
    mutate,
    data,
    isLoading,
    error,
    reset,
  };
}
