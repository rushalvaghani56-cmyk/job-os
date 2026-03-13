import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  years: z.number().min(0).max(50),
  is_primary: z.boolean().default(false),
  category: z.string().min(1, "Category is required"),
});

export const achievementSchema = z.object({
  description: z.string().min(1, "Achievement description is required"),
  metric: z.string().nullable(),
  category: z.enum(["revenue", "efficiency", "growth", "leadership", "technical", "other"]),
});

export const workExperienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  location: z.string().min(1, "Location is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable(),
  is_current: z.boolean().default(false),
  description: z.string().min(1, "Description is required"),
  achievements: z.array(achievementSchema).default([]),
  technologies: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().min(1, "Field of study is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable(),
  gpa: z.number().min(0).max(4).nullable(),
  highlights: z.array(z.string()).default([]),
  location: z.string().nullable(),
});

export const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issue_date: z.string().min(1, "Issue date is required"),
  expiry_date: z.string().nullable(),
  credential_id: z.string().nullable(),
  credential_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()).default([]),
  url: z.string().url("Must be a valid URL").nullable().or(z.literal("")),
  repo_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")),
  highlights: z.array(z.string()).default([]),
  start_date: z.string().nullable(),
  end_date: z.string().nullable(),
});

export const languageSchema = z.object({
  name: z.string().min(1, "Language is required"),
  proficiency: z.enum(["basic", "conversational", "professional", "native"]),
});

export const workPreferenceSchema = z.object({
  target_titles: z.array(z.string()).min(1, "At least one target title is required"),
  target_industries: z.array(z.string()).default([]),
  company_sizes: z.array(z.enum(["startup", "small", "medium", "large", "enterprise"])).default([]),
  locations: z.array(z.string()).default([]),
  open_to_relocation: z.boolean().default(false),
  work_location_types: z.array(z.enum(["remote", "hybrid", "onsite"])).default(["remote"]),
  salary_min: z.number().nullable(),
  salary_max: z.number().nullable(),
  salary_currency: z.string().default("USD"),
  open_to_contract: z.boolean().default(false),
  open_to_part_time: z.boolean().default(false),
  requires_visa_sponsorship: z.boolean().default(false),
  notice_period_days: z.number().nullable(),
  dream_companies: z.array(z.string()).default([]),
  excluded_companies: z.array(z.string()).default([]),
});

export const profileIdentitySchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Must be a valid email"),
  phone: z.string().nullable(),
  linkedin_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")),
  github_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")),
  portfolio_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")),
  website_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")),
  location: z.string().nullable(),
});

export const profileSummarySchema = z.object({
  headline: z.string().max(120, "Headline must be 120 characters or less").nullable(),
  summary: z.string().max(500, "Summary must be 500 characters or less").nullable(),
  elevator_pitch: z.string().max(1000, "Elevator pitch must be 1000 characters or less").nullable(),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Profile name is required"),
  target_role: z.string().min(1, "Target role is required"),
  ...profileIdentitySchema.shape,
  ...profileSummarySchema.shape,
  skills: z.array(skillSchema).default([]),
  work_experience: z.array(workExperienceSchema).default([]),
  projects: z.array(projectSchema).default([]),
  education: z.array(educationSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  languages: z.array(languageSchema).default([]),
  preferences: workPreferenceSchema,
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type WorkExperienceFormData = z.infer<typeof workExperienceSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type WorkPreferenceFormData = z.infer<typeof workPreferenceSchema>;
