"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { DataResponse } from "@/types/api";

export function useContacts(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.contacts.list(filters),
    queryFn: async () => {
      const response = await apiClient.get<{ data: unknown[] }>(
        "/api/v1/outreach/contacts",
        { params: filters }
      );
      return response.data.data;
    },
  });
}

export function useContactStats() {
  return useQuery({
    queryKey: queryKeys.contacts.stats(),
    queryFn: async () => {
      const response = await apiClient.get<DataResponse<Record<string, unknown>>>(
        "/api/v1/outreach/stats"
      );
      return response.data.data;
    },
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiClient.post("/api/v1/outreach/contacts", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      toast.success("Contact added");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useFollowUps() {
  return useQuery({
    queryKey: queryKeys.contacts.followUps(),
    queryFn: async () => {
      const response = await apiClient.get<{ data: unknown[] }>(
        "/api/v1/outreach/follow-ups"
      );
      return response.data.data;
    },
  });
}
