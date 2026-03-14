import { z } from "zod";

export const jobFilterSchema = z.object({
  status: z.array(z.enum([
    "new", "scored", "content_ready", "applied", "interview",
    "offer", "rejected", "skipped", "bookmarked", "ghosted"
  ])).optional(),
  decision: z.array(z.enum(["auto_apply", "review", "skip"])).optional(),
  source: z.array(z.enum([
    "linkedin", "indeed", "greenhouse", "lever", "workday", "manual", "referral", "company_career_page"
  ])).optional(),
  min_score: z.number().min(0).max(100).optional(),
  max_score: z.number().min(0).max(100).optional(),
  work_location_type: z.array(z.enum(["remote", "hybrid", "onsite"])).optional(),
  employment_type: z.array(z.enum(["full_time", "part_time", "contract", "internship"])).optional(),
  experience_level: z.array(z.enum(["entry", "mid", "senior", "lead", "executive"])).optional(),
  min_salary: z.number().optional(),
  is_dream_company: z.boolean().optional(),
  priority: z.array(z.enum(["1", "2", "3"]).transform(Number)).optional(),
  profile_id: z.string().optional(),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  discovered_after: z.string().optional(),
  discovered_before: z.string().optional(),
  sort_by: z.enum(["match_score", "discovered_at", "company", "title", "deadline"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

export type JobFilterFormData = z.infer<typeof jobFilterSchema>;

export const manualJobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  work_location_type: z.enum(["remote", "hybrid", "onsite"]),
  employment_type: z.enum(["full_time", "part_time", "contract", "internship"]),
  experience_level: z.enum(["entry", "mid", "senior", "lead", "executive"]),
  salary_min: z.number().nullable(),
  salary_max: z.number().nullable(),
  salary_currency: z.string().default("USD"),
  description: z.string().min(1, "Job description is required"),
  source_url: z.string().url("Must be a valid URL").or(z.literal("")),
  deadline: z.string().nullable(),
  notes: z.string().nullable(),
  is_dream_company: z.boolean().default(false),
  priority: z.enum(["1", "2", "3"]).transform(Number).default("3"),
  tags: z.array(z.string()).default([]),
  referrer_name: z.string().nullable(),
  referrer_email: z.string().email("Must be a valid email").nullable().or(z.literal("")),
});

export type ManualJobFormData = z.infer<typeof manualJobSchema>;

export const jobNotesSchema = z.object({
  notes: z.string().max(2000, "Notes must be 2000 characters or less"),
});

export type JobNotesFormData = z.infer<typeof jobNotesSchema>;

export const jobTagsSchema = z.object({
  tags: z.array(z.string()).max(10, "Maximum 10 tags allowed"),
});

export type JobTagsFormData = z.infer<typeof jobTagsSchema>;

export const jobDecisionSchema = z.object({
  decision: z.enum(["auto_apply", "review", "skip"]),
  reason: z.string().optional(),
});

export type JobDecisionFormData = z.infer<typeof jobDecisionSchema>;

export const bulkJobActionSchema = z.object({
  job_ids: z.array(z.string()).min(1, "At least one job must be selected"),
  action: z.enum(["skip", "bookmark", "delete", "change_status", "add_tag"]),
  value: z.string().optional(),
});

export type BulkJobActionFormData = z.infer<typeof bulkJobActionSchema>;
