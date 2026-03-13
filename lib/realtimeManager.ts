import { supabase } from "./supabase";
import { getQueryClient } from "./queryClient";
import { queryKeys } from "./queryKeys";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type TableName = "jobs" | "applications" | "reviews" | "contacts" | "notifications";

interface SubscriptionConfig {
  table: TableName;
  event: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
}

/**
 * Realtime subscription manager
 * Handles Supabase Realtime subscriptions and invalidates TanStack Query caches
 */
class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private isInitialized = false;

  /**
   * Initialize realtime subscriptions for the current user
   */
  async initialize(userId: string) {
    if (this.isInitialized) return;

    // Subscribe to user-specific tables
    await this.subscribe({
      table: "jobs",
      event: "*",
      filter: `user_id=eq.${userId}`,
    });

    await this.subscribe({
      table: "applications",
      event: "*",
      filter: `user_id=eq.${userId}`,
    });

    await this.subscribe({
      table: "reviews",
      event: "*",
      filter: `user_id=eq.${userId}`,
    });

    await this.subscribe({
      table: "contacts",
      event: "*",
      filter: `user_id=eq.${userId}`,
    });

    await this.subscribe({
      table: "notifications",
      event: "INSERT",
      filter: `user_id=eq.${userId}`,
    });

    this.isInitialized = true;
  }

  /**
   * Subscribe to a table's changes
   */
  async subscribe(config: SubscriptionConfig) {
    const channelName = `${config.table}-${config.event}-${config.filter || "all"}`;

    if (this.channels.has(channelName)) {
      return;
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: config.event,
          schema: "public",
          table: config.table,
          filter: config.filter,
        },
        (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => {
          this.handleChange(config.table, payload);
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
  }

  /**
   * Handle realtime changes and invalidate relevant queries
   */
  private handleChange(
    table: TableName,
    payload: RealtimePostgresChangesPayload<Record<string, unknown>>
  ) {
    const queryClient = getQueryClient();

    switch (table) {
      case "jobs":
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
        break;

      case "applications":
        queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
        // Also invalidate jobs since application counts may change
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.stats() });
        break;

      case "reviews":
        queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
        break;

      case "contacts":
        queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
        break;

      case "notifications":
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        break;
    }

    // Log for debugging
    console.log(`[Realtime] ${table} ${payload.eventType}:`, payload);
  }

  /**
   * Unsubscribe from all channels
   */
  async cleanup() {
    for (const [name, channel] of this.channels) {
      await channel.unsubscribe();
      this.channels.delete(name);
    }
    this.isInitialized = false;
  }

  /**
   * Check if manager is initialized
   */
  get initialized() {
    return this.isInitialized;
  }
}

export const realtimeManager = new RealtimeManager();
