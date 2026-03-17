"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import type {
  Application,
  ApplicationListItem,
  ApplicationStats,
  ApplicationStatus,
} from "@/types/applications";
import type { DataResponse } from "@/types/api";

export function useApplications(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.applications.list(filters),
    queryFn: async (): Promise<ApplicationListItem[]> => {
      const response = await apiClient.get<{ data: ApplicationListItem[] }>(
        "/api/v1/applications",
        { params: filters }
      );
      const items = response.data.data;
      return Array.isArray(items) ? items : [];
    },
  });
}

export function useApplication(applicationId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.applications.detail(applicationId!),
    queryFn: async (): Promise<Application> => {
      const response = await apiClient.get<DataResponse<Application>>(
        `/api/v1/applications/${applicationId}`
      );
      return response.data.data;
    },
    enabled: !!applicationId,
  });
}

export function useApplicationStats() {
  return useQuery({
    queryKey: queryKeys.applications.stats(),
    queryFn: async (): Promise<ApplicationStats> => {
      try {
        const response = await apiClient.get<DataResponse<ApplicationStats>>(
          "/api/v1/applications/stats"
        );
        return response.data.data;
      } catch {
        return {} as ApplicationStats;
      }
    },
    retry: false,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      job_id: string;
      profile_id: string;
      submission_method?: string;
    }): Promise<Application> => {
      const response = await apiClient.post<DataResponse<Application>>(
        "/api/v1/applications",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success("Application created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ApplicationStatus;
    }): Promise<Application> => {
      const response = await apiClient.put<DataResponse<Application>>(
        `/api/v1/applications/${id}/status`,
        { status }
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.applications.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
