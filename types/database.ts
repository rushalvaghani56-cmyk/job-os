/**
 * User roles in the system
 */
export type UserRole = "user" | "super_admin";

/**
 * User record from the database
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User's email address */
  email: string;
  /** User's display name */
  full_name: string | null;
  /** URL to user's avatar image */
  avatar_url: string | null;
  /** User's role in the system */
  role: UserRole;
  /** Whether user has completed onboarding */
  has_completed_onboarding: boolean;
  /** User's timezone (IANA format) */
  timezone: string;
  /** ISO timestamp of account creation */
  created_at: string;
  /** ISO timestamp of last update */
  updated_at: string;
  /** ISO timestamp of last login */
  last_login_at: string | null;
}

/**
 * Authentication session
 */
export interface Session {
  /** Session token */
  access_token: string;
  /** Refresh token for obtaining new access tokens */
  refresh_token: string;
  /** Token expiration time in seconds */
  expires_in: number;
  /** Token type (always "Bearer") */
  token_type: "Bearer";
  /** Associated user */
  user: User;
}

/**
 * Database timestamps mixin
 */
export interface Timestamps {
  created_at: string;
  updated_at: string;
}

/**
 * Soft delete mixin
 */
export interface SoftDelete {
  deleted_at: string | null;
}

/**
 * User ownership mixin
 */
export interface UserOwned {
  user_id: string;
}

/**
 * Audit log entry
 */
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
