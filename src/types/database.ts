/**
 * Database Types
 * Core user and database entity types for Job Application OS
 */

/** User roles in the system */
export type UserRole = "user" | "super_admin";

/** Subscription plan tiers */
export type PlanTier = "free" | "pro" | "enterprise";

/** User entity */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's display name */
  name: string;
  /** URL to user's avatar image */
  avatar_url: string | null;
  /** User's role in the system */
  role: UserRole;
  /** Current subscription plan */
  plan: PlanTier;
  /** Whether onboarding has been completed */
  has_completed_onboarding: boolean;
  /** Account creation timestamp */
  created_at: string;
  /** Last update timestamp */
  updated_at: string;
  /** Last login timestamp */
  last_login_at: string | null;
  /** User preferences */
  preferences: UserPreferences;
}

/** User preferences stored in the database */
export interface UserPreferences {
  /** Default theme preference */
  theme: "light" | "dark" | "system";
  /** Email notification settings */
  email_notifications: boolean;
  /** Weekly digest enabled */
  weekly_digest: boolean;
  /** Timezone for scheduling */
  timezone: string;
  /** Preferred language */
  language: string;
}

/** Session information */
export interface Session {
  /** Session token */
  access_token: string;
  /** Refresh token for token renewal */
  refresh_token: string;
  /** Token expiration timestamp */
  expires_at: string;
  /** Associated user */
  user: User;
}

/** Audit log entry */
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
