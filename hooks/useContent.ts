"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { toast } from "sonner";
import type { DataResponse } from "@/types/api";

export function useContentVariants(jobId: string | undefined) {
  return useQuery({
    queryKey: ["content", "variants", jobId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: unknown[] }>(
        `/api/v1/content/variants/${jobId}`
      );
      return response.data.data;
    },
    enabled: !!jobId,
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
        "/api/v1/content/resume",
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
        "/api/v1/content/cover-letter",
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
