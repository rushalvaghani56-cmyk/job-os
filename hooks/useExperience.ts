"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { toast } from "sonner";
import type { WorkExperience } from "@/types/profiles";
import type { DataResponse } from "@/types/api";

export function useWorkExperience(profileId: string | undefined) {
  return useQuery({
    queryKey: ["experience", profileId],
    queryFn: async (): Promise<WorkExperience[]> => {
      const response = await apiClient.get<{ data: WorkExperience[] }>(
        `/api/v1/work-experience`,
        { params: { profile_id: profileId } }
      );
      return response.data.data;
    },
    enabled: !!profileId,
  });
}

export function useCreateWorkExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<WorkExperience> & { profile_id: string }) => {
      const response = await apiClient.post<DataResponse<WorkExperience>>(
        "/api/v1/work-experience",
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["experience", variables.profile_id],
      });
      toast.success("Experience added");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateWorkExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<WorkExperience> & { profile_id: string };
    }) => {
      const response = await apiClient.put<DataResponse<WorkExperience>>(
        `/api/v1/work-experience/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["experience", variables.data.profile_id],
      });
      toast.success("Experience updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
