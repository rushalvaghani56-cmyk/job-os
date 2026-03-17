"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { DataResponse } from "@/types/api";

export function useContentVariants(jobId: string | undefined) {
  return useQuery({
    queryKey: ["content", "variants", jobId],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: unknown[] }>(
          `/api/v1/content/variants/${jobId}`
        );
        return response.data.data;
      } catch {
        return [];
      }
    },
    enabled: !!jobId,
    retry: false,
  });
}

export function useGenerateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      job_id: string;
      profile_id: string;
    }) => {
      const response = await apiClient.post<DataResponse<{ task_id: string }>>(
        "/api/v1/content/generate-resume",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Resume generation started");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useGenerateCoverLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      job_id: string;
      profile_id: string;
    }) => {
      const response = await apiClient.post<DataResponse<{ task_id: string }>>(
        "/api/v1/content/generate-cover-letter",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Cover letter generation started");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useGenerateContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      job_id: string;
      profile_id: string;
    }) => {
      const response = await apiClient.post<{ task_id: string }>(
        `/api/v1/jobs/${data.job_id}/generate`,
        { profile_id: data.profile_id }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      toast.success("Content generation started");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useContentStatus(taskId: string | null) {
  return useQuery({
    queryKey: ["content", "status", taskId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { status: string; progress_pct: number } }>(
        `/api/v1/tasks/${taskId}`
      );
      return response.data.data;
    },
    enabled: !!taskId,
    refetchInterval: (query) => {
      const data = query.state.data as { status: string } | undefined;
      if (data?.status === "completed" || data?.status === "failed") return false;
      return 2000;
    },
  });
}

export function useDocuments(jobId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.content.variants(jobId!),
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: unknown[] }>(
          `/api/v1/content/variants/${jobId}`
        );
        return response.data.data;
      } catch {
        return [];
      }
    },
    enabled: !!jobId,
    retry: false,
  });
}
