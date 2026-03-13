/**
 * Notification Types
 * Types for notifications and alerts in Job Application OS
 */

/** Notification priority levels */
export type NotificationPriority = "critical" | "high" | "medium" | "low";

/** All notification types */
export type NotificationType =
  | "new_jobs_discovered"
  | "high_score_job"
  | "application_submitted"
  | "application_viewed"
  | "application_status_change"
  | "interview_scheduled"
  | "interview_reminder"
  | "offer_received"
  | "rejection_received"
  | "follow_up_due"
  | "outreach_replied"
  | "review_pending"
  | "review_deadline"
  | "goal_progress"
  | "goal_achieved"
  | "ai_quota_warning"
  | "system_announcement";

/** Notification entity */
export interface Notification {
  /** Unique identifier */
  id: string;
  /** Notification type */
  type: NotificationType;
  /** Priority level */
  priority: NotificationPriority;
  /** Notification title */
  title: string;
  /** Notification message */
  message: string;
  /** Whether notification has been read */
  is_read: boolean;
  /** Whether notification has been dismissed */
  is_dismissed: boolean;
  /** Associated resource type */
  resource_type?: "job" | "application" | "contact" | "review" | "interview";
  /** Associated resource ID */
  resource_id?: string;
  /** Action URL */
  action_url?: string;
  /** Action label */
  action_label?: string;
  /** Additional data */
  data?: Record<string, unknown>;
  /** Created timestamp */
  created_at: string;
  /** Read timestamp */
  read_at?: string;
}

/** Notification group for display */
export interface NotificationGroup {
  /** Group date */
  date: string;
  /** Notifications in this group */
  notifications: Notification[];
}

/** Notification preferences */
export interface NotificationPreferences {
  /** Email notifications enabled */
  email_enabled: boolean;
  /** Push notifications enabled */
  push_enabled: boolean;
  /** In-app notifications enabled */
  in_app_enabled: boolean;
  /** Notification types to receive */
  enabled_types: NotificationType[];
  /** Quiet hours start */
  quiet_hours_start?: string;
  /** Quiet hours end */
  quiet_hours_end?: string;
  /** Weekly digest enabled */
  weekly_digest: boolean;
  /** Daily summary enabled */
  daily_summary: boolean;
}

/** Notification statistics */
export interface NotificationStats {
  /** Total unread count */
  unread_count: number;
  /** Count by priority */
  by_priority: Record<NotificationPriority, number>;
  /** Count by type */
  by_type: Record<NotificationType, number>;
  /** Most recent notification */
  most_recent: Notification | null;
}

/** Notification filter options */
export interface NotificationFilter {
  /** Filter by read status */
  is_read?: boolean;
  /** Filter by type */
  type?: NotificationType[];
  /** Filter by priority */
  priority?: NotificationPriority[];
  /** Filter by date range */
  date_from?: string;
  /** Filter by date range */
  date_to?: string;
}
