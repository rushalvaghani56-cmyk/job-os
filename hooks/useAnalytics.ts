"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type {
  FunnelData,
  SourceData,
  RejectionData,
  GoalData,
  ABTestResult,
  SkillsAnalysis,
  TimingAnalysis,
  AICostData,
  DashboardMetrics,
} from "@/types/analytics";
import type { DataResponse } from "@/types/api";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: async (): Promise<DashboardMetrics> => {
      const response = await apiClient.get<DataResponse<DashboardMetrics>>(
        "/api/v1/analytics/dashboard"
      );
      return response.data.data;
    },
  });
}

export function useFunnelData(period: string = "30d") {
  return useQuery({
    queryKey: queryKeys.analytics.funnel(period),
    queryFn: async (): Promise<FunnelData> => {
      const response = await apiClient.get<DataResponse<FunnelData>>(
        "/api/v1/analytics/funnel",
        { params: { period } }
      );
      return response.data.data;
    },
  });
}

export function useSourceData(period: string = "30d") {
  return useQuery({
    queryKey: queryKeys.analytics.sources(period),
    queryFn: async (): Promise<SourceData[]> => {
      const response = await apiClient.get<{ data: SourceData[] }>(
        "/api/v1/analytics/sources",
        { params: { period } }
      );
      return response.data.data;
    },
  });
}

export function useRejectionData(period: string = "30d") {
  return useQuery({
    queryKey: queryKeys.analytics.rejections(period),
    queryFn: async (): Promise<RejectionData> => {
      const response = await apiClient.get<DataResponse<RejectionData>>(
        "/api/v1/analytics/rejections",
        { params: { period } }
      );
      return response.data.data;
    },
  });
}

export function useGoals() {
  return useQuery({
    queryKey: queryKeys.analytics.goals(),
    queryFn: async (): Promise<GoalData[]> => {
      const response = await apiClient.get<{ data: GoalData[] }>(
        "/api/v1/analytics/goals"
      );
      return response.data.data;
    },
  });
}

export function useABTests() {
  return useQuery({
    queryKey: queryKeys.analytics.abTests(),
    queryFn: async (): Promise<ABTestResult[]> => {
      const response = await apiClient.get<{ data: ABTestResult[] }>(
        "/api/v1/analytics/ab-tests"
      );
      return response.data.data;
    },
  });
}

export function useSkillsAnalysis() {
  return useQuery({
    queryKey: queryKeys.analytics.skills(),
    queryFn: async (): Promise<SkillsAnalysis> => {
      const response = await apiClient.get<DataResponse<SkillsAnalysis>>(
        "/api/v1/analytics/skills"
      );
      return response.data.data;
    },
  });
}

export function useTimingAnalysis() {
  return useQuery({
    queryKey: queryKeys.analytics.timing(),
    queryFn: async (): Promise<TimingAnalysis> => {
      const response = await apiClient.get<DataResponse<TimingAnalysis>>(
        "/api/v1/analytics/timing"
      );
      return response.data.data;
    },
  });
}

export function useAICostData(period: string = "30d") {
  return useQuery({
    queryKey: queryKeys.analytics.aiCost(period),
    queryFn: async (): Promise<AICostData> => {
      const response = await apiClient.get<DataResponse<AICostData>>(
        "/api/v1/analytics/ai-cost",
        { params: { period } }
      );
      return response.data.data;
    },
  });
}
