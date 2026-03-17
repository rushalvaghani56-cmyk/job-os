"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api";
import { getErrorMessage } from "@/lib/apiHelpers";
import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";
import type { NotificationListItem, NotificationCounts } from "@/types/notifications";

export function useNotifications(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: queryKeys.notifications.list(filters),
    queryFn: async (): Promise<NotificationListItem[]> => {
      const response = await apiClient.get<{ data: NotificationListItem[] }>(
        "/api/v1/notifications",
        { params: filters }
      );
      const items = response.data.data;
      return Array.isArray(items) ? items : [];
    },
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async (): Promise<NotificationCounts> => {
      const response = await apiClient.get<NotificationCounts>(
        "/api/v1/notifications/unread-count"
      );
      return response.data;
    },
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string): Promise<void> => {
      await apiClient.put(`/api/v1/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await apiClient.put("/api/v1/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success("All notifications marked as read");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
