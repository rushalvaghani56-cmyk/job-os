"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { Profile, ProfileListItem, ProfileCompleteness } from "@/types/profiles";
import type { DataResponse } from "@/types/api";

export function useProfiles() {
  return useQuery({
    queryKey: queryKeys.profiles.list(),
    queryFn: async (): Promise<ProfileListItem[]> => {
      const response = await apiClient.get<{ data: ProfileListItem[] }>(
        "/api/v1/profiles"
      );
      return response.data.data;
    },
  });
}

export function useProfile(profileId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profiles.detail(profileId!),
    queryFn: async (): Promise<Profile> => {
      const response = await apiClient.get<DataResponse<Profile>>(
        `/api/v1/profiles/${profileId}`
      );
      return response.data.data;
    },
    enabled: !!profileId,
  });
}

export function useProfileCompleteness(profileId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.profiles.completeness(profileId!),
    queryFn: async (): Promise<ProfileCompleteness> => {
      const response = await apiClient.get<ProfileCompleteness>(
        `/api/v1/profiles/${profileId}/completeness`
      );
      return response.data;
    },
    enabled: !!profileId,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Profile>): Promise<Profile> => {
      const response = await apiClient.post<DataResponse<Profile>>(
        "/api/v1/profiles",
        data
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
      toast.success("Profile created");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Profile>;
    }): Promise<Profile> => {
      const response = await apiClient.put<DataResponse<Profile>>(
        `/api/v1/profiles/${id}`,
        data
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profiles.detail(variables.id),
      });
      toast.success("Profile updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileId: string): Promise<void> => {
      await apiClient.delete(`/api/v1/profiles/${profileId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
      toast.success("Profile deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useCloneProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileId: string): Promise<Profile> => {
      const response = await apiClient.post<DataResponse<Profile>>(
        `/api/v1/profiles/${profileId}/clone`
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
      toast.success("Profile cloned");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useActivateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileId: string): Promise<void> => {
      await apiClient.put(`/api/v1/profiles/${profileId}/activate`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profiles.all });
      toast.success("Profile activated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
