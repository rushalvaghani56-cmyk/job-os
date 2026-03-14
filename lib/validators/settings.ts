import { z } from "zod";

// General settings
export const generalSettingsSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  email: z.string().email("Must be a valid email"),
  timezone: z.string().min(1, "Timezone is required"),
  date_format: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]),
  theme: z.enum(["light", "dark", "system"]),
  language: z.string().default("en"),
});

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;

// AI Model settings
export const aiModelSchema = z.object({
  provider: z.enum(["openai", "anthropic", "google", "custom"]),
  model_id: z.string().min(1, "Model ID is required"),
  display_name: z.string().min(1, "Display name is required"),
  is_default: z.boolean().default(false),
  use_for: z.array(z.enum(["scoring", "resume", "cover_letter", "outreach", "copilot"])).default([]),
});

export type AIModelFormData = z.infer<typeof aiModelSchema>;

// API Key settings
export const apiKeySchema = z.object({
  provider: z.enum(["openai", "anthropic", "google", "custom"]),
  api_key: z.string().min(1, "API key is required"),
  name: z.string().optional(),
});

export type APIKeyFormData = z.infer<typeof apiKeySchema>;

// Automation settings
export const automationSettingsSchema = z.object({
  auto_apply_enabled: z.boolean(),
  auto_apply_threshold: z.number().min(0).max(100),
  auto_apply_dream_companies: z.boolean(),
  require_review_before_apply: z.boolean(),
  daily_apply_limit: z.number().min(1).max(100),
  auto_skip_threshold: z.number().min(0).max(100),
  auto_skip_enabled: z.boolean(),
  auto_generate_content: z.boolean(),
  auto_score_jobs: z.boolean(),
  auto_discover_enabled: z.boolean(),
});

export type AutomationSettingsFormData = z.infer<typeof automationSettingsSchema>;

// Scoring settings
export const scoringSettingsSchema = z.object({
  weights: z.object({
    skills: z.number().min(0).max(100),
    experience: z.number().min(0).max(100),
    location: z.number().min(0).max(100),
    salary: z.number().min(0).max(100),
    culture: z.number().min(0).max(100),
    growth: z.number().min(0).max(100),
    work_life_balance: z.number().min(0).max(100),
    stability: z.number().min(0).max(100),
  }),
  minimum_score: z.number().min(0).max(100),
  high_priority_threshold: z.number().min(0).max(100),
  dream_company_boost: z.number().min(0).max(50),
  referral_boost: z.number().min(0).max(50),
  include_salary: z.boolean(),
});

export type ScoringSettingsFormData = z.infer<typeof scoringSettingsSchema>;

// Source settings
export const sourceSettingsSchema = z.object({
  source_id: z.string().min(1),
  name: z.string().min(1, "Source name is required"),
  enabled: z.boolean(),
  type: z.enum(["job_board", "company_page", "aggregator"]),
  sync_frequency: z.enum(["hourly", "daily", "manual"]),
  search_criteria: z
    .object({
      keywords: z.array(z.string()).default([]),
      locations: z.array(z.string()).default([]),
      job_types: z.array(z.string()).default([]),
      experience_levels: z.array(z.string()).default([]),
    })
    .optional(),
});

export type SourceSettingsFormData = z.infer<typeof sourceSettingsSchema>;

// Notification settings
export const notificationSettingsSchema = z.object({
  in_app: z.boolean(),
  email: z.boolean(),
  push: z.boolean(),
  enabled_types: z.array(z.string()).default([]),
  quiet_hours_start: z.string().optional(),
  quiet_hours_end: z.string().optional(),
  email_digest: z.enum(["realtime", "daily", "weekly", "off"]),
});

export type NotificationSettingsFormData = z.infer<typeof notificationSettingsSchema>;

// Email settings
export const emailSettingsSchema = z.object({
  from_email: z.string().email("Must be a valid email"),
  signature: z.string().default(""),
  provider: z.enum(["gmail", "outlook", "smtp", "none"]),
  smtp: z
    .object({
      host: z.string(),
      port: z.number(),
      username: z.string(),
      password: z.string(),
      use_tls: z.boolean(),
    })
    .optional(),
});

export type EmailSettingsFormData = z.infer<typeof emailSettingsSchema>;

// Schedule settings
export const scheduleSettingsSchema = z.object({
  work_hours_start: z.string().regex(/^\d{2}:\d{2}$/, "Must be in HH:MM format"),
  work_hours_end: z.string().regex(/^\d{2}:\d{2}$/, "Must be in HH:MM format"),
  work_days: z.array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])),
  discovery_schedule: z.object({
    days: z.array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Must be in HH:MM format"),
    timezone: z.string(),
  }),
});

export type ScheduleSettingsFormData = z.infer<typeof scheduleSettingsSchema>;

// Feature flags settings
export const featureFlagsSchema = z.object({
  feature_flags: z.record(z.string(), z.boolean()),
});

export type FeatureFlagsFormData = z.infer<typeof featureFlagsSchema>;
