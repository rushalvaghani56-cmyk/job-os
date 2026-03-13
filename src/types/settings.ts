/**
 * Settings Types
 * Types for user settings and configuration in Job Application OS
 */

import type { NotificationPreferences } from "./notifications";

/** AI model configuration */
export interface AIModelConfig {
  /** Provider name */
  provider: "openai" | "anthropic" | "google" | "local";
  /** Model identifier */
  model: string;
  /** Display name */
  display_name: string;
  /** API key (encrypted) */
  api_key?: string;
  /** Whether key is valid */
  is_valid: boolean;
  /** Max tokens */
  max_tokens: number;
  /** Temperature setting */
  temperature: number;
  /** Whether this is the default model */
  is_default: boolean;
  /** Monthly quota */
  monthly_quota?: number;
  /** Current usage */
  current_usage?: number;
}

/** Automation configuration */
export interface AutomationConfig {
  /** Auto-discovery enabled */
  auto_discovery: boolean;
  /** Discovery frequency */
  discovery_frequency: "hourly" | "twice_daily" | "daily" | "weekly";
  /** Auto-apply enabled */
  auto_apply: boolean;
  /** Auto-apply threshold score */
  auto_apply_threshold: number;
  /** Max auto-applications per day */
  max_auto_apply_daily: number;
  /** Auto-follow-up enabled */
  auto_follow_up: boolean;
  /** Follow-up delay days */
  follow_up_delay_days: number;
  /** Max follow-ups */
  max_follow_ups: number;
  /** Pause automation during interviews */
  pause_during_interviews: boolean;
  /** Excluded companies */
  excluded_companies: string[];
  /** Required keywords */
  required_keywords: string[];
  /** Excluded keywords */
  excluded_keywords: string[];
}

/** Scoring configuration */
export interface ScoringConfig {
  /** Dimension weights (must sum to 1) */
  weights: {
    skills_match: number;
    experience_level: number;
    culture_fit: number;
    growth_potential: number;
    compensation_alignment: number;
    location_preference: number;
    company_reputation: number;
    role_interest: number;
  };
  /** Minimum score to show */
  minimum_score: number;
  /** Dream company bonus points */
  dream_company_bonus: number;
  /** Auto-skip threshold */
  auto_skip_threshold: number;
  /** Include salary in scoring */
  include_salary: boolean;
  /** Prefer remote jobs */
  prefer_remote: boolean;
  /** Remote preference weight */
  remote_preference_weight: number;
}

/** Job source configuration */
export interface SourceConfig {
  /** Source identifier */
  source: string;
  /** Whether source is enabled */
  enabled: boolean;
  /** Source-specific credentials */
  credentials?: {
    username?: string;
    password?: string;
    api_key?: string;
  };
  /** Search filters for this source */
  filters: {
    keywords: string[];
    locations: string[];
    job_types: string[];
    experience_levels: string[];
    remote_only: boolean;
  };
  /** Last sync timestamp */
  last_sync?: string;
  /** Sync status */
  sync_status: "idle" | "syncing" | "error";
  /** Error message if any */
  error_message?: string;
}

/** Email integration settings */
export interface EmailSettings {
  /** Provider */
  provider: "gmail" | "outlook" | "other";
  /** Connected email address */
  email: string;
  /** Whether connection is active */
  is_connected: boolean;
  /** OAuth tokens */
  tokens?: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
  };
  /** Sync settings */
  sync: {
    enabled: boolean;
    frequency: "realtime" | "hourly" | "daily";
    folders: string[];
  };
  /** Signature */
  signature: string;
  /** Default send delay (minutes) */
  send_delay_minutes: number;
}

/** Schedule configuration */
export interface ScheduleConfig {
  /** Schedule name */
  name: string;
  /** Active days */
  active_days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
  /** Start time */
  start_time: string;
  /** End time */
  end_time: string;
  /** Timezone */
  timezone: string;
  /** Actions during this schedule */
  actions: ("discovery" | "apply" | "outreach" | "follow_up")[];
}

/** Feature flag configuration */
export interface FeatureFlags {
  /** Beta features enabled */
  beta_features: boolean;
  /** Experimental AI enabled */
  experimental_ai: boolean;
  /** Advanced analytics enabled */
  advanced_analytics: boolean;
  /** Custom integrations enabled */
  custom_integrations: boolean;
  /** API access enabled */
  api_access: boolean;
}

/** Complete user settings */
export interface UserSettings {
  /** User ID */
  user_id: string;
  /** General preferences */
  general: {
    theme: "light" | "dark" | "system";
    language: string;
    timezone: string;
    date_format: string;
    currency: string;
  };
  /** AI model configurations */
  ai_models: AIModelConfig[];
  /** Automation settings */
  automation: AutomationConfig;
  /** Scoring configuration */
  scoring: ScoringConfig;
  /** Job source configurations */
  sources: SourceConfig[];
  /** Email integration */
  email: EmailSettings;
  /** Notification preferences */
  notifications: NotificationPreferences;
  /** Schedule configurations */
  schedules: ScheduleConfig[];
  /** Feature flags */
  features: FeatureFlags;
  /** Updated timestamp */
  updated_at: string;
}

/** Settings section identifier */
export type SettingsSection =
  | "general"
  | "ai_models"
  | "api_keys"
  | "automation"
  | "scoring"
  | "sources"
  | "email"
  | "notifications"
  | "schedules"
  | "features";
