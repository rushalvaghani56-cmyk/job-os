"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { PaginatedResponse, DataResponse } from "@/types/api";
import { getErrorMessage } from "@/lib/apiHelpers";

// ─── Types ───

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "enterprise";
  status: "active" | "suspended" | "pending";
  createdAt: string;
  lastActive: string;
  profileCount: number;
  jobsDiscovered: number;
  applications: number;
}

export interface AdminFeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
}

export interface AdminService {
  name: string;
  status: "operational" | "degraded" | "outage";
  uptime: number;
  lastIncident: string | null;
}

export interface SystemHealth {
  services: AdminService[];
  overallStatus: "operational" | "degraded" | "outage";
}

export interface AdminStats {
  totalUsers: number;
  activeThisWeek: number;
  jobsDiscovered: number;
  applicationsSent: number;
}

// ─── Hooks ───

export function useAdminUsers(params?: { search?: string; status?: string; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: async (): Promise<PaginatedResponse<AdminUser>> => {
      const response = await apiClient.get<PaginatedResponse<AdminUser>>(
        "/api/v1/admin/users",
        { params }
      );
      return response.data;
    },
  });
}

export function useAdminUserDetail(userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.admin.userDetail(userId!),
    queryFn: async (): Promise<AdminUser> => {
      const response = await apiClient.get<DataResponse<AdminUser>>(
        `/api/v1/admin/users/${userId}`
      );
      return response.data.data;
    },
    enabled: !!userId,
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, suspend }: { userId: string; suspend: boolean }) => {
      const response = await apiClient.put(
        `/api/v1/admin/users/${userId}/suspend`,
        { suspended: suspend }
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success(
        variables.suspend ? "User suspended" : "User reactivated"
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await apiClient.put(
        `/api/v1/admin/users/${userId}/role`,
        { role }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      toast.success("User role updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useAdminFeatureFlags() {
  return useQuery({
    queryKey: queryKeys.admin.featureFlags(),
    queryFn: async (): Promise<AdminFeatureFlag[]> => {
      const response = await apiClient.get<DataResponse<AdminFeatureFlag[]>>(
        "/api/v1/admin/feature-flags"
      );
      return response.data.data;
    },
  });
}

export function useUpdateFeatureFlags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (flags: AdminFeatureFlag[]) => {
      const response = await apiClient.put(
        "/api/v1/admin/feature-flags",
        { flags }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.featureFlags() });
      toast.success("Feature flags updated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats(),
    queryFn: async (): Promise<AdminStats> => {
      const response = await apiClient.get<DataResponse<AdminStats>>(
        "/api/v1/admin/stats"
      );
      return response.data.data;
    },
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: queryKeys.admin.systemHealth(),
    queryFn: async (): Promise<SystemHealth> => {
      const response = await apiClient.get<DataResponse<SystemHealth>>(
        "/api/v1/admin/system-health"
      );
      return response.data.data;
    },
    refetchInterval: 60_000, // refresh every 60s
  });
}
