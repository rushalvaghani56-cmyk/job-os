"use client";

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { Job, JobListItem, JobFilter, JobStats } from "@/types/jobs";
import type { PaginatedResponse, DataResponse } from "@/types/api";

export function useJobs(filters?: JobFilter) {
  return useInfiniteQuery({
    queryKey: queryKeys.jobs.list(filters),
    queryFn: async ({ pageParam }): Promise<PaginatedResponse<JobListItem>> => {
      const response = await apiClient.get<PaginatedResponse<JobListItem>>(
        "/api/v1/jobs",
        {
          params: {
            cursor: pageParam,
            limit: 50,
            ...filters,
          },
        }
      );
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
  });
}

export function useJob(jobId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(jobId!),
    queryFn: async (): Promise<Job> => {
      const response = await apiClient.get<DataResponse<Job>>(
        `/api/v1/jobs/${jobId}`
      );
      return response.data.data;
    },
    enabled: !!jobId,
  });
}

export function useJobStats() {
  return useQuery({
    queryKey: queryKeys.jobs.stats(),
    queryFn: async (): Promise<JobStats> => {
      try {
        const response = await apiClient.get<DataResponse<JobStats>>(
          "/api/v1/jobs/stats"
        );
        return response.data.data;
      } catch {
        return {} as JobStats;
      }
    },
    retry: false,
  });
}

export function useJobSearch(query: string) {
  return useQuery({
    queryKey: ["jobs", "search", query],
    queryFn: async (): Promise<JobListItem[]> => {
      const response = await apiClient.get<{ data: JobListItem[] }>(
        "/api/v1/jobs/search",
        { params: { q: query } }
      );
      return response.data.data;
    },
    enabled: query.length > 2,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Job>): Promise<Job> => {
      const response = await apiClient.post<DataResponse<Job>>(
        "/api/v1/jobs/manual",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success("Job added");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }): Promise<Job> => {
      const response = await apiClient.put<DataResponse<Job>>(
        `/api/v1/jobs/${id}/status`,
        { status }
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobs.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useBookmarkJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string): Promise<void> => {
      await apiClient.post(`/api/v1/jobs/${jobId}/bookmark`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success("Job bookmarked");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useSkipJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string): Promise<void> => {
      await apiClient.post(`/api/v1/jobs/${jobId}/skip`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success("Job skipped");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
