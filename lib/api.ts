// Centralized API Client — Single source of truth for all HTTP calls

import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { supabase } from "./supabase";
import type { ApiError } from "@/types/api";

// ─── Axios Instance ───

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── REQUEST INTERCEPTOR: Auto-attach JWT ───

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── RESPONSE INTERCEPTOR: Global error handling ───

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401: Try refreshing the token once, then sign out if that fails
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { data, error: refreshError } =
        await supabase.auth.refreshSession();

      if (data.session && !refreshError) {
        originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`;
        return apiClient(originalRequest);
      }

      // Refresh failed — sign out
      await supabase.auth.signOut();

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login?reason=session_expired";
      }
    }

    // 429: Rate limited → attach retry info
    if (status === 429) {
      const retryAfter = error.response?.headers?.["retry-after"];
      if (retryAfter) {
        (error as AxiosError & { retryAfter: number }).retryAfter =
          parseInt(retryAfter, 10);
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient, supabase };
export default apiClient;
