import type { Timestamps, UserOwned } from "./database";

/**
 * Notification priority levels
 */
export type NotificationPriority = "critical" | "high" | "medium" | "low";

/**
 * All notification types (17 types from spec)
 */
export type NotificationType =
  // Job-related
  | "new_jobs_discovered"
  | "job_deadline_approaching"
  | "dream_company_job"
  // Application-related
  | "application_status_change"
  | "interview_scheduled"
  | "interview_reminder"
  | "offer_received"
  | "rejection_received"
  // Review-related
  | "content_ready_for_review"
  | "content_approved"
  | "content_rejected"
  // Outreach-related
  | "follow_up_due"
  | "response_received"
  // System-related
  | "ai_key_expiring"
  | "ai_quota_warning"
  | "discovery_completed"
  | "weekly_summary";

/**
 * Complete notification record
 */
export interface Notification extends Timestamps, UserOwned {
  /** Unique identifier */
  id: string;
  /** Notification type */
  type: NotificationType;
  /** Priority level */
  priority: NotificationPriority;
  /** Notification title */
  title: string;
  /** Notification body/description */
  body: string;
  /** Associated entity type */
  entity_type?: "job" | "application" | "review" | "contact" | "interview";
  /** Associated entity ID */
  entity_id?: string;
  /** Deep link URL */
  action_url?: string;
  /** Action label */
  action_label?: string;
  /** Whether notification has been read */
  is_read: boolean;
  /** Whether notification has been dismissed */
  is_dismissed: boolean;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Notification list item
 */
export interface NotificationListItem {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  body: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

/**
 * Notification preferences by type
 */
export interface NotificationPreferences {
  /** Enable in-app notifications */
  in_app: boolean;
  /** Enable email notifications */
  email: boolean;
  /** Enable push notifications */
  push: boolean;
  /** Notification types to enable */
  enabled_types: NotificationType[];
  /** Quiet hours start (HH:MM) */
  quiet_hours_start?: string;
  /** Quiet hours end (HH:MM) */
  quiet_hours_end?: string;
  /** Email digest frequency */
  email_digest: "realtime" | "daily" | "weekly" | "off";
}

/**
 * Notification count summary
 */
export interface NotificationCounts {
  total_unread: number;
  by_priority: Record<NotificationPriority, number>;
  by_type: Partial<Record<NotificationType, number>>;
}

/**
 * Notification group (for UI grouping)
 */
export interface NotificationGroup {
  /** Group title (e.g., "Today", "Yesterday", "This Week") */
  title: string;
  /** Notifications in this group */
  notifications: NotificationListItem[];
}

/**
 * Notification template (for creating notifications)
 */
export interface NotificationTemplate {
  type: NotificationType;
  priority: NotificationPriority;
  title_template: string;
  body_template: string;
  action_url_template?: string;
  action_label?: string;
}

/**
 * Notification action (mark read, dismiss, etc.)
 */
export interface NotificationAction {
  action: "mark_read" | "mark_unread" | "dismiss" | "delete";
  notification_ids: string[];
}
