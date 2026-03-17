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
    queryFn: async (): Promise<Record<string, unknown>> => {
      try {
        const response = await apiClient.get<{ user: Record<string, unknown> }>(
          "/api/v1/auth/settings"
        );
        const settings = (response.data.user?.settings as Record<string, unknown>) ?? {};
        return (settings.automation_config ?? {}) as Record<string, unknown>;
      } catch {
        return {} as Record<string, unknown>;
      }
    },
    retry: false,
  });
}

export function useScoringSettings() {
  return useQuery({
    queryKey: queryKeys.settings.scoring(),
    queryFn: async (): Promise<Record<string, unknown>> => {
      try {
        const response = await apiClient.get<{ user: Record<string, unknown> }>(
          "/api/v1/auth/settings"
        );
        const settings = (response.data.user?.settings as Record<string, unknown>) ?? {};
        return (settings.scoring_weights ?? {}) as Record<string, unknown>;
      } catch {
        return {} as Record<string, unknown>;
      }
    },
    retry: false,
  });
}

export function useUpdateScoringSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiClient.put("/api/v1/settings/scoring_weights", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.scoring() });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      toast.success("Scoring settings saved");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateAutomationSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiClient.put("/api/v1/settings/automation_config", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.automation() });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      toast.success("Automation settings saved");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateSourceSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiClient.put("/api/v1/settings/job_sources", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.sources() });
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      toast.success("Source settings saved");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateScheduleSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiClient.put("/api/v1/settings/schedules", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
      toast.success("Schedule settings saved");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
