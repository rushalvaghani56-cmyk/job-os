/**
 * Settings Validators
 * Zod schemas for settings forms
 */

import { z } from "zod";

/** General settings schema */
export const generalSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  language: z.string().min(1, "Language is required"),
  timezone: z.string().min(1, "Timezone is required"),
  date_format: z.string().min(1, "Date format is required"),
  currency: z.string().min(1, "Currency is required"),
});

export type GeneralSettingsInput = z.infer<typeof generalSettingsSchema>;

/** AI model settings schema */
export const aiModelSettingsSchema = z.object({
  provider: z.enum(["openai", "anthropic", "google", "local"]),
  model: z.string().min(1, "Model is required"),
  display_name: z.string().min(1, "Display name is required"),
  api_key: z.string().optional(),
  max_tokens: z.number().min(100).max(128000),
  temperature: z.number().min(0).max(2),
  is_default: z.boolean().default(false),
});

export type AIModelSettingsInput = z.infer<typeof aiModelSettingsSchema>;

/** API key schema */
export const apiKeySchema = z.object({
  provider: z.enum(["openai", "anthropic", "google", "custom"]),
  api_key: z.string().min(1, "API key is required"),
  name: z.string().optional(),
});

export type APIKeyInput = z.infer<typeof apiKeySchema>;

/** Automation settings schema */
export const automationSettingsSchema = z.object({
  auto_discovery: z.boolean(),
  discovery_frequency: z.enum(["hourly", "twice_daily", "daily", "weekly"]),
  auto_apply: z.boolean(),
  auto_apply_threshold: z.number().min(0).max(100),
  max_auto_apply_daily: z.number().min(0).max(100),
  auto_follow_up: z.boolean(),
  follow_up_delay_days: z.number().min(1).max(30),
  max_follow_ups: z.number().min(0).max(10),
  pause_during_interviews: z.boolean(),
  excluded_companies: z.array(z.string()).default([]),
  required_keywords: z.array(z.string()).default([]),
  excluded_keywords: z.array(z.string()).default([]),
});

export type AutomationSettingsInput = z.infer<typeof automationSettingsSchema>;

/** Scoring settings schema */
export const scoringSettingsSchema = z.object({
  weights: z.object({
    skills_match: z.number().min(0).max(1),
    experience_level: z.number().min(0).max(1),
    culture_fit: z.number().min(0).max(1),
    growth_potential: z.number().min(0).max(1),
    compensation_alignment: z.number().min(0).max(1),
    location_preference: z.number().min(0).max(1),
    company_reputation: z.number().min(0).max(1),
    role_interest: z.number().min(0).max(1),
  }).refine(
    (weights) => {
      const sum = Object.values(weights).reduce((a, b) => a + b, 0);
      return Math.abs(sum - 1) < 0.01; // Allow small floating point error
    },
    { message: "Weights must sum to 1.0" }
  ),
  minimum_score: z.number().min(0).max(100),
  dream_company_bonus: z.number().min(0).max(20),
  auto_skip_threshold: z.number().min(0).max(100),
  include_salary: z.boolean(),
  prefer_remote: z.boolean(),
  remote_preference_weight: z.number().min(0).max(1),
});

export type ScoringSettingsInput = z.infer<typeof scoringSettingsSchema>;

/** Source settings schema */
export const sourceSettingsSchema = z.object({
  source: z.string().min(1, "Source is required"),
  enabled: z.boolean(),
  credentials: z.object({
    username: z.string().optional(),
    password: z.string().optional(),
    api_key: z.string().optional(),
  }).optional(),
  filters: z.object({
    keywords: z.array(z.string()).default([]),
    locations: z.array(z.string()).default([]),
    job_types: z.array(z.string()).default([]),
    experience_levels: z.array(z.string()).default([]),
    remote_only: z.boolean().default(false),
  }),
});

export type SourceSettingsInput = z.infer<typeof sourceSettingsSchema>;

/** Email settings schema */
export const emailSettingsSchema = z.object({
  provider: z.enum(["gmail", "outlook", "other"]),
  sync: z.object({
    enabled: z.boolean(),
    frequency: z.enum(["realtime", "hourly", "daily"]),
    folders: z.array(z.string()).default([]),
  }),
  signature: z.string().max(2000, "Signature is too long"),
  send_delay_minutes: z.number().min(0).max(60),
});

export type EmailSettingsInput = z.infer<typeof emailSettingsSchema>;

/** Notification settings schema */
export const notificationSettingsSchema = z.object({
  email_enabled: z.boolean(),
  push_enabled: z.boolean(),
  in_app_enabled: z.boolean(),
  enabled_types: z.array(z.string()).default([]),
  quiet_hours_start: z.string().optional(),
  quiet_hours_end: z.string().optional(),
  weekly_digest: z.boolean(),
  daily_summary: z.boolean(),
});

export type NotificationSettingsInput = z.infer<typeof notificationSettingsSchema>;

/** Schedule settings schema */
export const scheduleSettingsSchema = z.object({
  name: z.string().min(1, "Schedule name is required"),
  active_days: z.array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])).min(1, "Select at least one day"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  timezone: z.string().min(1, "Timezone is required"),
  actions: z.array(z.enum(["discovery", "apply", "outreach", "follow_up"])).min(1, "Select at least one action"),
});

export type ScheduleSettingsInput = z.infer<typeof scheduleSettingsSchema>;

/** Feature flags schema */
export const featureFlagsSchema = z.object({
  beta_features: z.boolean(),
  experimental_ai: z.boolean(),
  advanced_analytics: z.boolean(),
  custom_integrations: z.boolean(),
  api_access: z.boolean(),
});

export type FeatureFlagsInput = z.infer<typeof featureFlagsSchema>;
