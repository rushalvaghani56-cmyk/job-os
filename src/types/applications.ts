/**
 * Application Types
 * Types for job applications, stages, and Kanban board in Job Application OS
 */

import type { Job } from "./jobs";

/** Application status in the pipeline */
export type ApplicationStatus =
  | "pending"
  | "submitted"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn"
  | "ghosted";

/** Interview type */
export type InterviewType =
  | "phone_screen"
  | "technical"
  | "behavioral"
  | "system_design"
  | "coding"
  | "panel"
  | "hiring_manager"
  | "final"
  | "other";

/** Application stage entry */
export interface ApplicationStage {
  /** Unique identifier */
  id: string;
  /** Stage name */
  name: string;
  /** Stage status */
  status: "pending" | "completed" | "current" | "skipped";
  /** When this stage was reached */
  started_at: string | null;
  /** When this stage was completed */
  completed_at: string | null;
  /** Notes for this stage */
  notes: string | null;
  /** Feedback received */
  feedback: string | null;
}

/** Interview entry */
export interface Interview {
  /** Unique identifier */
  id: string;
  /** Application ID */
  application_id: string;
  /** Interview type */
  type: InterviewType;
  /** Scheduled date and time */
  scheduled_at: string;
  /** Duration in minutes */
  duration_minutes: number;
  /** Meeting link */
  meeting_link: string | null;
  /** Location if in-person */
  location: string | null;
  /** Interviewer names */
  interviewers: string[];
  /** Preparation notes */
  prep_notes: string | null;
  /** Post-interview notes */
  debrief_notes: string | null;
  /** Status */
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  /** Outcome if completed */
  outcome: "passed" | "failed" | "pending" | null;
}

/** Document attached to application */
export interface ApplicationDocument {
  /** Unique identifier */
  id: string;
  /** Document type */
  type: "resume" | "cover_letter" | "portfolio" | "other";
  /** File name */
  name: string;
  /** File URL */
  url: string;
  /** Version number */
  version: number;
  /** Whether this was AI-generated */
  is_ai_generated: boolean;
  /** Created timestamp */
  created_at: string;
}

/** Complete application entity */
export interface Application {
  /** Unique identifier */
  id: string;
  /** Associated job ID */
  job_id: string;
  /** Associated job details */
  job: Job;
  /** Profile ID used for application */
  profile_id: string;
  /** Current status */
  status: ApplicationStatus;
  /** Application stages */
  stages: ApplicationStage[];
  /** Current stage index */
  current_stage: number;
  /** Scheduled interviews */
  interviews: Interview[];
  /** Attached documents */
  documents: ApplicationDocument[];
  /** Submitted date */
  submitted_at: string | null;
  /** When response was received */
  response_at: string | null;
  /** How the application was submitted */
  submission_method: "auto" | "manual" | "referral";
  /** Referrer name if applicable */
  referrer: string | null;
  /** User notes */
  notes: string | null;
  /** Expected salary for this application */
  expected_salary: number | null;
  /** Follow-up date */
  follow_up_date: string | null;
  /** Created timestamp */
  created_at: string;
  /** Updated timestamp */
  updated_at: string;
}

/** Kanban column definition */
export interface KanbanColumn {
  /** Column ID matching ApplicationStatus */
  id: ApplicationStatus;
  /** Display title */
  title: string;
  /** Column color */
  color: string;
  /** Applications in this column */
  applications: Application[];
  /** Count of applications */
  count: number;
}

/** Application list item (lighter version) */
export interface ApplicationListItem {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  company_logo: string | null;
  status: ApplicationStatus;
  current_stage: number;
  total_stages: number;
  submitted_at: string | null;
  next_interview: string | null;
  follow_up_date: string | null;
  score: number | null;
  updated_at: string;
}

/** Application statistics */
export interface ApplicationStats {
  total: number;
  by_status: Record<ApplicationStatus, number>;
  response_rate: number;
  interview_rate: number;
  offer_rate: number;
  average_response_days: number;
}
