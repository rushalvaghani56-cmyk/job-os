/**
 * Realtime Manager
 * Supabase Realtime subscription manager with query invalidation
 */

import type { QueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "./supabase";
import { queryKeys } from "./queryKeys";

type RealtimeTable =
  | "jobs"
  | "applications"
  | "reviews"
  | "contacts"
  | "notifications"
  | "interviews";

interface SubscriptionConfig {
  table: RealtimeTable;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;
}

/**
 * Realtime subscription manager
 */
class RealtimeManager {
  private subscriptions: Map<string, ReturnType<typeof this.createSubscription>> = new Map();
  private queryClient: QueryClient | null = null;

  /**
   * Initialize the manager with a query client
   */
  init(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Create a realtime subscription
   */
  private createSubscription(config: SubscriptionConfig) {
    const supabase = getSupabaseClient();
    const channelName = `${config.table}_changes`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: config.event || "*",
          schema: "public",
          table: config.table,
          filter: config.filter,
        },
        (payload) => {
          this.handleChange(config.table, payload);
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Handle realtime changes
   */
  private handleChange(
    table: RealtimeTable,
    _payload: { eventType: string; new: unknown; old: unknown }
  ) {
    if (!this.queryClient) return;

    // Invalidate relevant queries based on table
    switch (table) {
      case "jobs":
        this.queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
        break;
      case "applications":
        this.queryClient.invalidateQueries({ queryKey: queryKeys.applications.all });
        break;
      case "reviews":
        this.queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
        break;
      case "contacts":
        this.queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
        break;
      case "notifications":
        this.queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
        break;
      case "interviews":
        this.queryClient.invalidateQueries({ queryKey: queryKeys.interviews.all });
        break;
    }
  }

  /**
   * Subscribe to table changes
   */
  subscribe(config: SubscriptionConfig) {
    const key = `${config.table}_${config.event || "*"}_${config.filter || "all"}`;

    if (!this.subscriptions.has(key)) {
      const subscription = this.createSubscription(config);
      this.subscriptions.set(key, subscription);
    }

    return () => this.unsubscribe(key);
  }

  /**
   * Unsubscribe from a specific subscription
   */
  unsubscribe(key: string) {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      const supabase = getSupabaseClient();
      supabase.removeChannel(subscription);
      this.subscriptions.delete(key);
    }
  }

  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll() {
    const supabase = getSupabaseClient();
    this.subscriptions.forEach((subscription) => {
      supabase.removeChannel(subscription);
    });
    this.subscriptions.clear();
  }

  /**
   * Subscribe to all relevant tables
   */
  subscribeToAll() {
    const tables: RealtimeTable[] = [
      "jobs",
      "applications",
      "reviews",
      "contacts",
      "notifications",
      "interviews",
    ];

    tables.forEach((table) => {
      this.subscribe({ table });
    });
  }
}

export const realtimeManager = new RealtimeManager();
