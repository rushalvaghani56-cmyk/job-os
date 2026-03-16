"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";

export function useGeneralSettings() {
  return useQuery({
    queryKey: queryKeys.settings.user(),
    queryFn: async () => {
      const response = await apiClient.get<{ user: Record<string, unknown> }>(
        "/api/v1/auth/me"
      );
      return response.data.user;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiClient.put("/api/v1/auth/settings", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      toast.success("Settings saved");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useAIModels() {
  return useQuery({
    queryKey: queryKeys.settings.aiModels(),
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: unknown[] }>("/api/v1/ai/models");
        return response.data.data;
      } catch {
        return [];
      }
    },
    retry: false,
  });
}

export function useAPIKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: unknown[] }>("/api/v1/ai/keys");
        return response.data.data;
      } catch {
        return [];
      }
    },
    retry: false,
  });
}

export function useAutomationSettings() {
  return useQuery({
    queryKey: queryKeys.settings.automation(),
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: Record<string, unknown> }>(
          "/api/v1/auth/settings"
        );
        return response.data.data;
      } catch {
        return {};
      }
    },
    retry: false,
  });
}

export function useScoringSettings() {
  return useQuery({
    queryKey: queryKeys.settings.scoring(),
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ data: Record<string, unknown> }>(
          "/api/v1/profiles/scoring-weights"
        );
        return response.data.data;
      } catch {
        return {};
      }
    },
    retry: false,
  });
}
