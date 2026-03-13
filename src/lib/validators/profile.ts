/**
 * Profile Validators
 * Zod schemas for profile forms
 */

import { z } from "zod";

/** Personal information schema */
export const personalInfoSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  linkedin_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  portfolio_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  personal_website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;

/** Skill schema */
export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  years: z.number().min(0, "Years must be positive").max(50, "Years must be realistic"),
  category: z.enum([
    "programming_language",
    "framework",
    "database",
    "cloud",
    "devops",
    "soft_skill",
    "domain",
    "tool",
    "other",
  ]),
  is_primary: z.boolean().default(false),
});

export type SkillInput = z.infer<typeof skillSchema>;

/** Work experience schema */
export const workExperienceSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  location: z.string().min(1, "Location is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().min(1, "Description is required").max(2000, "Description is too long"),
  technologies: z.array(z.string()).default([]),
  industry: z.string().optional(),
});

export type WorkExperienceInput = z.infer<typeof workExperienceSchema>;

/** Achievement schema */
export const achievementSchema = z.object({
  description: z.string().min(1, "Achievement description is required"),
  impact: z.string().optional(),
  category: z.enum(["revenue", "efficiency", "growth", "technical", "leadership", "other"]),
});

export type AchievementInput = z.infer<typeof achievementSchema>;

/** Education schema */
export const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  gpa: z.number().min(0).max(4).optional(),
  achievements: z.array(z.string()).default([]),
  location: z.string().optional(),
});

export type EducationInput = z.infer<typeof educationSchema>;

/** Certification schema */
export const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issued_date: z.string().min(1, "Issue date is required"),
  expiry_date: z.string().optional(),
  credential_id: z.string().optional(),
  verification_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

export type CertificationInput = z.infer<typeof certificationSchema>;

/** Project schema */
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  role: z.string().min(1, "Your role is required"),
  technologies: z.array(z.string()).default([]),
  url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  achievements: z.array(z.string()).default([]),
});

export type ProjectInput = z.infer<typeof projectSchema>;

/** Work preferences schema */
export const workPreferencesSchema = z.object({
  target_titles: z.array(z.string()).min(1, "At least one target title is required"),
  target_industries: z.array(z.string()).default([]),
  preferred_locations: z.array(z.string()).default([]),
  willing_to_relocate: z.boolean().default(false),
  remote_preference: z.enum(["remote_only", "hybrid_preferred", "onsite_ok", "no_preference"]),
  salary_min: z.number().min(0, "Minimum salary must be positive"),
  salary_target: z.number().min(0, "Target salary must be positive"),
  salary_currency: z.string().default("USD"),
  company_sizes: z.array(z.enum(["startup", "small", "medium", "large", "enterprise"])).default([]),
  must_have_benefits: z.array(z.string()).default([]),
  deal_breakers: z.array(z.string()).default([]),
  dream_companies: z.array(z.string()).default([]),
});

export type WorkPreferencesInput = z.infer<typeof workPreferencesSchema>;

/** Complete profile schema */
export const profileSchema = z.object({
  name: z.string().min(1, "Profile name is required"),
  target_role: z.string().min(1, "Target role is required"),
  summary: z.string().max(2000, "Summary is too long").optional(),
  personal: personalInfoSchema,
  preferences: workPreferencesSchema,
});

export type ProfileInput = z.infer<typeof profileSchema>;
