/**
 * Application Validators
 * Zod schemas for application-related forms
 */

import { z } from "zod";

/** Application status values */
const applicationStatusValues = [
  "pending",
  "submitted",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
  "ghosted",
] as const;

/** Application status transition schema */
export const statusTransitionSchema = z.object({
  status: z.enum(applicationStatusValues),
  notes: z.string().max(1000, "Notes are too long").optional(),
  feedback: z.string().max(2000, "Feedback is too long").optional(),
});

export type StatusTransitionInput = z.infer<typeof statusTransitionSchema>;

/** Valid status transitions */
export const validStatusTransitions: Record<string, string[]> = {
  pending: ["submitted", "withdrawn"],
  submitted: ["screening", "interview", "rejected", "withdrawn", "ghosted"],
  screening: ["interview", "rejected", "withdrawn", "ghosted"],
  interview: ["offer", "rejected", "withdrawn", "ghosted"],
  offer: ["rejected", "withdrawn"],
  rejected: [],
  withdrawn: [],
  ghosted: [],
};

/** Validate status transition */
export function isValidStatusTransition(from: string, to: string): boolean {
  return validStatusTransitions[from]?.includes(to) ?? false;
}

/** Application notes schema */
export const applicationNotesSchema = z.object({
  notes: z.string().max(5000, "Notes are too long"),
});

export type ApplicationNotesInput = z.infer<typeof applicationNotesSchema>;

/** Interview schedule schema */
export const scheduleInterviewSchema = z.object({
  application_id: z.string().min(1, "Application is required"),
  type: z.enum([
    "phone_screen",
    "technical",
    "behavioral",
    "system_design",
    "coding",
    "panel",
    "hiring_manager",
    "final",
    "other",
  ]),
  scheduled_at: z.string().min(1, "Date and time is required"),
  duration_minutes: z.number().min(15, "Minimum duration is 15 minutes").max(480, "Maximum duration is 8 hours"),
  meeting_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  interviewers: z.array(z.string()).default([]),
  prep_notes: z.string().max(5000, "Notes are too long").optional(),
});

export type ScheduleInterviewInput = z.infer<typeof scheduleInterviewSchema>;

/** Interview feedback schema */
export const interviewFeedbackSchema = z.object({
  interview_id: z.string().min(1, "Interview is required"),
  outcome: z.enum(["passed", "failed", "pending"]),
  debrief_notes: z.string().max(5000, "Notes are too long").optional(),
});

export type InterviewFeedbackInput = z.infer<typeof interviewFeedbackSchema>;

/** Follow-up schedule schema */
export const scheduleFollowUpSchema = z.object({
  application_id: z.string().min(1, "Application is required"),
  follow_up_date: z.string().min(1, "Follow-up date is required"),
  notes: z.string().max(1000, "Notes are too long").optional(),
});

export type ScheduleFollowUpInput = z.infer<typeof scheduleFollowUpSchema>;

/** Application filter schema */
export const applicationFilterSchema = z.object({
  status: z.array(z.enum(applicationStatusValues)).optional(),
  has_interview: z.boolean().optional(),
  has_follow_up: z.boolean().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  sort_by: z.enum(["submitted_at", "updated_at", "next_interview", "company"]).optional(),
  sort_direction: z.enum(["asc", "desc"]).optional(),
});

export type ApplicationFilterInput = z.infer<typeof applicationFilterSchema>;
