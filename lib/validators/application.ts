import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "pending",
  "submitted",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
  "ghosted",
]);

export const statusTransitionSchema = z.object({
  application_id: z.string().min(1, "Application ID is required"),
  new_status: applicationStatusSchema,
  notes: z.string().optional(),
});

export type StatusTransitionFormData = z.infer<typeof statusTransitionSchema>;

export const applicationNotesSchema = z.object({
  notes: z.string().max(5000, "Notes must be 5000 characters or less"),
});

export type ApplicationNotesFormData = z.infer<typeof applicationNotesSchema>;

export const scheduleInterviewSchema = z.object({
  application_id: z.string().min(1, "Application ID is required"),
  type: z.enum(["phone_screen", "technical", "behavioral", "onsite", "panel", "final"]),
  scheduled_at: z.string().min(1, "Date and time is required"),
  duration_minutes: z.number().min(15).max(480).default(60),
  location: z.string().nullable(),
  interviewers: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type ScheduleInterviewFormData = z.infer<typeof scheduleInterviewSchema>;

export const rescheduleInterviewSchema = z.object({
  interview_id: z.string().min(1, "Interview ID is required"),
  scheduled_at: z.string().min(1, "New date and time is required"),
  reason: z.string().optional(),
});

export type RescheduleInterviewFormData = z.infer<typeof rescheduleInterviewSchema>;

export const offerDetailsSchema = z.object({
  salary: z.number().min(0, "Salary must be positive"),
  currency: z.string().default("USD"),
  equity: z.string().nullable(),
  signing_bonus: z.number().nullable(),
  annual_bonus: z.string().nullable(),
  start_date: z.string().nullable(),
  expiry_date: z.string().nullable(),
  benefits: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type OfferDetailsFormData = z.infer<typeof offerDetailsSchema>;

export const withdrawApplicationSchema = z.object({
  application_id: z.string().min(1, "Application ID is required"),
  reason: z.string().min(1, "Reason is required"),
});

export type WithdrawApplicationFormData = z.infer<typeof withdrawApplicationSchema>;

export const followUpSchema = z.object({
  application_id: z.string().min(1, "Application ID is required"),
  follow_up_date: z.string().min(1, "Follow-up date is required"),
  notes: z.string().optional(),
});

export type FollowUpFormData = z.infer<typeof followUpSchema>;

export const customAnswerSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export const applicationSubmissionSchema = z.object({
  job_id: z.string().min(1, "Job ID is required"),
  profile_id: z.string().min(1, "Profile ID is required"),
  resume_id: z.string().nullable(),
  cover_letter_id: z.string().nullable(),
  custom_answers: z.array(customAnswerSchema).default([]),
  referrer_name: z.string().nullable(),
  referrer_email: z.string().email("Must be a valid email").nullable().or(z.literal("")),
  notes: z.string().optional(),
});

export type ApplicationSubmissionFormData = z.infer<typeof applicationSubmissionSchema>;
