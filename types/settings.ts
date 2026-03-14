import type { NotificationPreferences } from "./notifications";

/**
 * AI model provider
 */
export type AIProvider = "openai" | "anthropic" | "google" | "custom";

/**
 * AI model configuration
 */
export interface AIModelConfig {
  /** Provider name */
  provider: AIProvider;
  /** Model identifier */
  model_id: string;
  /** Display name */
  display_name: string;
  /** API key (masked in responses) */
  api_key?: string;
  /** Whether key is configured */
  is_configured: boolean;
  /** Key expiry date */
  key_expires_at?: string;
  /** Usage this month */
  usage_this_month?: number;
  /** Usage limit */
  usage_limit?: number;
  /** Cost this month */
  cost_this_month?: number;
  /** Is default for category */
  is_default: boolean;
  /** Use for which tasks */
  use_for: ("scoring" | "resume" | "cover_letter" | "outreach" | "copilot")[];
}

/**
 * Automation configuration
 */
export interface AutomationConfig {
  /** Auto-apply enabled */
  auto_apply_enabled: boolean;
  /** Auto-apply threshold score */
  auto_apply_threshold: number;
  /** Auto-apply for dream companies */
  auto_apply_dream_companies: boolean;
  /** Require review before apply */
  require_review_before_apply: boolean;
  /** Daily auto-apply limit */
  daily_apply_limit: number;
  /** Auto-skip threshold */
  auto_skip_threshold: number;
  /** Auto-skip enabled */
  auto_skip_enabled: boolean;
  /** Auto-generate content */
  auto_generate_content: boolean;
  /** Auto-score new jobs */
  auto_score_jobs: boolean;
  /** Auto-discover jobs */
  auto_discover_enabled: boolean;
  /** Discovery schedule */
  discovery_schedule: DiscoverySchedule;
}

/**
 * Discovery schedule
 */
export interface DiscoverySchedule {
  /** Days to run discovery */
  days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
  /** Time to run (HH:MM) */
  time: string;
  /** Timezone */
  timezone: string;
}

/**
 * Scoring configuration
 */
export interface ScoringConfig {
  /** Weight for each scoring dimension */
  weights: {
    skills: number;
    experience: number;
    location: number;
    salary: number;
    culture: number;
    growth: number;
    work_life_balance: number;
    stability: number;
  };
  /** Minimum acceptable score */
  minimum_score: number;
  /** High priority threshold */
  high_priority_threshold: number;
  /** Dream company boost */
  dream_company_boost: number;
  /** Referral boost */
  referral_boost: number;
  /** Include salary in scoring */
  include_salary: boolean;
}

/**
 * Job source configuration
 */
export interface SourceConfig {
  /** Source identifier */
  source_id: string;
  /** Source display name */
  name: string;
  /** Is enabled */
  enabled: boolean;
  /** Source type */
  type: "job_board" | "company_page" | "aggregator";
  /** Credentials (if required) */
  credentials?: {
    username?: string;
    password?: string;
    api_key?: string;
  };
  /** Search criteria */
  search_criteria?: {
    keywords: string[];
    locations: string[];
    job_types: string[];
    experience_levels: string[];
  };
  /** Last sync timestamp */
  last_sync_at?: string;
  /** Sync frequency */
  sync_frequency: "hourly" | "daily" | "manual";
}

/**
 * Email settings
 */
export interface EmailSettings {
  /** Default send-from email */
  from_email: string;
  /** Email signature */
  signature: string;
  /** Email provider */
  provider: "gmail" | "outlook" | "smtp" | "none";
  /** SMTP settings (if provider is smtp) */
  smtp?: {
    host: string;
    port: number;
    username: string;
    password: string;
    use_tls: boolean;
  };
  /** OAuth connected */
  oauth_connected: boolean;
}

/**
 * Complete user settings
 */
export interface UserSettings {
  /** User ID */
  user_id: string;

  // General
  /** Display name */
  display_name: string;
  /** Email */
  email: string;
  /** Avatar URL */
  avatar_url: string | null;
  /** Timezone */
  timezone: string;
  /** Date format */
  date_format: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  /** Theme preference */
  theme: "light" | "dark" | "system";
  /** Language */
  language: string;

  // AI Models
  /** Configured AI models */
  ai_models: AIModelConfig[];
  /** Default model for each task */
  default_models: {
    scoring: string;
    resume: string;
    cover_letter: string;
    outreach: string;
    copilot: string;
  };

  // Automation
  /** Automation settings */
  automation: AutomationConfig;

  // Scoring
  /** Scoring configuration */
  scoring: ScoringConfig;

  // Sources
  /** Job source configurations */
  sources: SourceConfig[];

  // Notifications
  /** Notification preferences */
  notifications: NotificationPreferences;

  // Email
  /** Email settings */
  email: EmailSettings;

  // Schedules
  /** Work hours start */
  work_hours_start: string;
  /** Work hours end */
  work_hours_end: string;
  /** Work days */
  work_days: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];

  // Feature flags
  /** Enabled feature flags */
  feature_flags: Record<string, boolean>;
}

/**
 * Settings update payload (partial)
 */
export type SettingsUpdate = Partial<Omit<UserSettings, "user_id">>;

/**
 * API key validation result
 */
export interface APIKeyValidation {
  valid: boolean;
  provider: AIProvider;
  model_access: string[];
  error?: string;
  usage_limit?: number;
  current_usage?: number;
}

/**
 * Settings tab identifiers
 */
export type SettingsTab =
  | "general"
  | "ai-models"
  | "api-keys"
  | "automation"
  | "scoring"
  | "sources"
  | "notifications"
  | "email"
  | "schedules"
  | "feature-flags";
