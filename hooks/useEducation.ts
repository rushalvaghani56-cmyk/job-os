"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { toast } from "sonner";
import type { Education } from "@/types/profiles";
import type { DataResponse } from "@/types/api";

export function useEducation(profileId: string | undefined) {
  return useQuery({
    queryKey: ["education", profileId],
    queryFn: async (): Promise<Education[]> => {
      const response = await apiClient.get<{ data: Education[] }>(
        `/api/v1/education`,
        { params: { profile_id: profileId } }
      );
      return response.data.data;
    },
    enabled: !!profileId,
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Education> & { profile_id: string }) => {
      const response = await apiClient.post<DataResponse<Education>>(
        "/api/v1/education",
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["education", variables.profile_id],
      });
      toast.success("Education added");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Education> & { profile_id: string };
    }) => {
      const response = await apiClient.put<DataResponse<Education>>(
        `/api/v1/education/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["education", variables.data.profile_id],
      });
      toast.success("Education updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
