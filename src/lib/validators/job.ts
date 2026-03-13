/**
 * Job Validators
 * Zod schemas for job-related forms
 */

import { z } from "zod";

/** Job filter schema */
export const jobFilterSchema = z.object({
  search: z.string().optional(),
  status: z
    .array(
      z.enum([
        "new",
        "scored",
        "content_ready",
        "applied",
        "interview",
        "offer",
        "rejected",
        "skipped",
        "bookmarked",
        "ghosted",
      ])
    )
    .optional(),
  decision: z.array(z.enum(["auto_apply", "review", "skip"])).optional(),
  min_score: z.number().min(0).max(100).optional(),
  max_score: z.number().min(0).max(100).optional(),
  source: z
    .array(
      z.enum([
        "linkedin",
        "indeed",
        "glassdoor",
        "greenhouse",
        "lever",
        "workday",
        "manual",
        "referral",
        "company_site",
      ])
    )
    .optional(),
  remote_policy: z.array(z.enum(["remote", "hybrid", "onsite"])).optional(),
  experience_level: z
    .array(z.enum(["entry", "mid", "senior", "staff", "principal", "executive"]))
    .optional(),
  locations: z.array(z.string()).optional(),
  dream_companies_only: z.boolean().optional(),
  bookmarked_only: z.boolean().optional(),
  salary_min: z.number().min(0).optional(),
  posted_within_days: z.number().min(1).optional(),
  tags: z.array(z.string()).optional(),
  sort_by: z.enum(["score", "posted_at", "discovered_at", "salary", "company"]).optional(),
  sort_direction: z.enum(["asc", "desc"]).optional(),
});

export type JobFilterInput = z.infer<typeof jobFilterSchema>;

/** Manual job add schema */
export const manualJobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  locations: z.array(z.string()).min(1, "At least one location is required"),
  remote_policy: z.enum(["remote", "hybrid", "onsite"]),
  employment_type: z.enum(["full_time", "part_time", "contract", "internship", "freelance"]),
  experience_level: z.enum(["entry", "mid", "senior", "staff", "principal", "executive"]),
  salary_min: z.number().min(0).optional(),
  salary_max: z.number().min(0).optional(),
  salary_currency: z.string().default("USD"),
  description: z.string().min(1, "Job description is required"),
  requirements: z.array(z.string()).default([]),
  nice_to_haves: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  source_url: z.string().url("Please enter a valid URL"),
  deadline: z.string().optional(),
  is_dream_company: z.boolean().default(false),
  priority: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(3),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type ManualJobInput = z.infer<typeof manualJobSchema>;

/** Job notes schema */
export const jobNotesSchema = z.object({
  notes: z.string().max(5000, "Notes are too long"),
});

export type JobNotesInput = z.infer<typeof jobNotesSchema>;

/** Job status update schema */
export const jobStatusUpdateSchema = z.object({
  status: z.enum([
    "new",
    "scored",
    "content_ready",
    "applied",
    "interview",
    "offer",
    "rejected",
    "skipped",
    "bookmarked",
    "ghosted",
  ]),
  reason: z.string().optional(),
});

export type JobStatusUpdateInput = z.infer<typeof jobStatusUpdateSchema>;

/** Bulk job action schema */
export const bulkJobActionSchema = z.object({
  job_ids: z.array(z.string()).min(1, "Select at least one job"),
  action: z.enum(["apply", "skip", "bookmark", "remove_bookmark", "delete", "add_tag", "remove_tag"]),
  tag: z.string().optional(),
});

export type BulkJobActionInput = z.infer<typeof bulkJobActionSchema>;
