"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { TaskResponse } from "@/types/api";

export function useTriggerDiscovery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileId: string): Promise<{ task_id: string }> => {
      const response = await apiClient.post<TaskResponse>(
        "/api/v1/jobs/discover",
        { profile_id: profileId }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success("Discovery started", {
        description: "Scanning job sources for new opportunities...",
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDiscoveryStatus(taskId: string | null) {
  return useQuery({
    queryKey: ["discovery", "status", taskId],
    queryFn: async () => {
      const response = await apiClient.get<{ data: { status: string; progress_pct: number; result: Record<string, unknown> | null } }>(
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

export function useSourceHealth() {
  return useQuery({
    queryKey: queryKeys.settings.sources(),
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: Record<string, unknown> }>(
          "/api/v1/settings/job_sources"
        );
        return response.data.data;
      } catch {
        return {};
      }
    },
    retry: false,
  });
}
