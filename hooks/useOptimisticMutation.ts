"use client";

import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";

interface OptimisticMutationOptions<TData, TVariables, TContext> {
  /** Query keys to invalidate on success */
  invalidateKeys?: unknown[][];
  /** Query key and updater for optimistic update */
  optimisticUpdate?: {
    queryKey: unknown[];
    updater: (oldData: TData | undefined, variables: TVariables) => TData;
  };
  /** Success message for toast */
  successMessage?: string | ((data: TData, variables: TVariables) => string);
  /** Error message for toast */
  errorMessage?: string | ((error: Error, variables: TVariables) => string);
  /** Show undo toast with countdown */
  undoable?: {
    duration: number;
    onUndo: (variables: TVariables, context: TContext | undefined) => void | Promise<void>;
  };
}

export function useOptimisticMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: OptimisticMutationOptions<TData, TVariables, TContext> &
    Omit<
      UseMutationOptions<TData, TError, TVariables, TContext>,
      "mutationFn" | "onMutate" | "onError" | "onSuccess" | "onSettled"
    > = {}
) {
  const queryClient = useQueryClient();
  const {
    invalidateKeys,
    optimisticUpdate,
    successMessage,
    errorMessage,
    undoable,
    ...mutationOptions
  } = options;

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    
    onMutate: async (variables: TVariables) => {
      // Cancel outgoing refetches
      if (optimisticUpdate) {
        await queryClient.cancelQueries({ queryKey: optimisticUpdate.queryKey });
        
        // Snapshot previous value
        const previousData = queryClient.getQueryData<TData>(optimisticUpdate.queryKey);
        
        // Optimistically update
        queryClient.setQueryData<TData>(
          optimisticUpdate.queryKey,
          (old) => optimisticUpdate.updater(old, variables)
        );
        
        return { previousData } as TContext;
      }
      return undefined as TContext;
    },

    onError: (error: TError, variables: TVariables, context: TContext | undefined) => {
      // Rollback on error
      if (optimisticUpdate && context && typeof context === "object" && "previousData" in context) {
        queryClient.setQueryData(
          optimisticUpdate.queryKey,
          (context as { previousData: TData }).previousData
        );
      }

      // Show error toast
      const message =
        typeof errorMessage === "function"
          ? errorMessage(error as Error, variables)
          : errorMessage || (error as Error).message || "An error occurred";
      
      toast.error(message, {
        action: {
          label: "Retry",
          onClick: () => {
            // Retry the mutation
            mutationFn(variables);
          },
        },
      });
    },

    onSuccess: (data: TData, variables: TVariables, context: TContext | undefined) => {
      // Invalidate queries
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }

      // Show success toast
      if (successMessage) {
        const message =
          typeof successMessage === "function"
            ? successMessage(data, variables)
            : successMessage;

        if (undoable) {
          // Show undo toast with countdown
          toast.success(message, {
            duration: undoable.duration * 1000,
            action: {
              label: "Undo",
              onClick: async () => {
                await undoable.onUndo(variables, context);
              },
            },
          });
        } else {
          toast.success(message);
        }
      }
    },

    onSettled: () => {
      // Refetch to ensure data is in sync
      if (optimisticUpdate) {
        queryClient.invalidateQueries({ queryKey: optimisticUpdate.queryKey });
      }
    },

    ...mutationOptions,
  });
}

/**
 * Simple mutation wrapper with toast notifications
 */
export function useSimpleMutation<TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    successMessage?: string;
    errorMessage?: string;
    invalidateKeys?: unknown[][];
  } = {}
) {
  const queryClient = useQueryClient();
  const { successMessage, errorMessage, invalidateKeys } = options;

  return useMutation({
    mutationFn,
    onSuccess: () => {
      if (invalidateKeys) {
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });
      }
      if (successMessage) {
        toast.success(successMessage);
      }
    },
    onError: (error: Error) => {
      toast.error(errorMessage || error.message || "An error occurred");
    },
  });
}
