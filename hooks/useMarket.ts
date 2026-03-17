"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { DataResponse } from "@/types/api";
import type {
  MarketInsights,
  MarketSalary,
  MarketTrends,
} from "@/types/market";

export function useMarketInsights() {
  return useQuery({
    queryKey: queryKeys.market.insights(),
    queryFn: async (): Promise<MarketInsights> => {
      const response = await apiClient.get<DataResponse<MarketInsights>>(
        "/api/v1/market/insights"
      );
      return response.data.data;
    },
  });
}

export function useMarketSalary(role?: string, location?: string) {
  return useQuery({
    queryKey: queryKeys.market.salaries({ role, location }),
    queryFn: async (): Promise<MarketSalary> => {
      const response = await apiClient.get<DataResponse<MarketSalary>>(
        "/api/v1/market/salary",
        { params: { role, location } }
      );
      return response.data.data;
    },
    enabled: !!role,
  });
}

export function useMarketTrends() {
  return useQuery({
    queryKey: queryKeys.market.trends(),
    queryFn: async (): Promise<MarketTrends> => {
      const response = await apiClient.get<DataResponse<MarketTrends>>(
        "/api/v1/market/trends"
      );
      return response.data.data;
    },
  });
}
