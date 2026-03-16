"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { ReviewItem, ReviewListItem, ReviewStats } from "@/types/review";
import type { DataResponse } from "@/types/api";

export function useReviewQueue(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.reviews.list(filters),
    queryFn: async (): Promise<ReviewListItem[]> => {
      const response = await apiClient.get<{ data: ReviewListItem[] }>(
        "/api/v1/review",
        { params: filters }
      );
      return response.data.data;
    },
  });
}

export function useReviewItem(itemId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.reviews.detail(itemId!),
    queryFn: async (): Promise<ReviewItem> => {
      const response = await apiClient.get<DataResponse<ReviewItem>>(
        `/api/v1/review/${itemId}`
      );
      return response.data.data;
    },
    enabled: !!itemId,
  });
}

export function useReviewStats() {
  return useQuery({
    queryKey: queryKeys.reviews.stats(),
    queryFn: async (): Promise<ReviewStats> => {
      try {
        const response = await apiClient.get<DataResponse<ReviewStats>>(
          "/api/v1/review/stats"
        );
        return response.data.data;
      } catch {
        return {} as ReviewStats;
      }
    },
    retry: false,
  });
}

export function useApproveReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      notes,
    }: {
      id: string;
      notes?: string;
    }): Promise<void> => {
      await apiClient.post(`/api/v1/review/${id}/approve`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success("Content approved");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useRejectReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      notes,
    }: {
      id: string;
      notes?: string;
    }): Promise<void> => {
      await apiClient.post(`/api/v1/review/${id}/reject`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success("Content rejected");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
