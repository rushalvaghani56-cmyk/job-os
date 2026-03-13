import type { Timestamps, UserOwned } from "./database";
import type { Job } from "./jobs";

/**
 * Application status in the pipeline
 */
export type ApplicationStatus =
  | "pending"
  | "submitted"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn"
  | "ghosted";

/**
 * Application stage for Kanban
 */
export interface ApplicationStage {
  /** Stage identifier */
  id: ApplicationStatus;
  /** Display name */
  label: string;
  /** Stage color */
  color: string;
  /** Stage order */
  order: number;
}

/**
 * Kanban column definition
 */
export interface KanbanColumn {
  /** Column identifier (matches ApplicationStatus) */
  id: ApplicationStatus;
  /** Column display title */
  title: string;
  /** Applications in this column */
  applications: ApplicationListItem[];
  /** Column color */
  color: string;
}

/**
 * Complete application record
 */
export interface Application extends Timestamps, UserOwned {
  /** Unique application identifier */
  id: string;
  /** Associated job ID */
  job_id: string;
  /** Associated job (populated on fetch) */
  job?: Job;
  /** Profile ID used for this application */
  profile_id: string;
  /** Current status */
  status: ApplicationStatus;
  /** Date applied */
  applied_at: string;
  /** Submitted via (manual, auto, referral) */
  submission_method: "manual" | "auto" | "referral";
  /** External application ID (from ATS) */
  external_id: string | null;
  /** Application portal URL */
  portal_url: string | null;

  // Documents used
  /** Resume version ID used */
  resume_id: string | null;
  /** Cover letter ID used */
  cover_letter_id: string | null;
  /** Custom answers provided */
  custom_answers: ApplicationAnswer[];

  // Tracking
  /** Referrer name if applicable */
  referrer_name: string | null;
  /** Referrer email */
  referrer_email: string | null;
  /** Notes */
  notes: string | null;
  /** Follow-up date */
  follow_up_date: string | null;
  /** Last activity date */
  last_activity_at: string;

  // Interview tracking
  /** Scheduled interviews */
  interviews: Interview[];
  /** Current interview round */
  current_round: number;
  /** Total expected rounds */
  total_rounds: number | null;

  // Outcome
  /** Rejection reason if rejected */
  rejection_reason: string | null;
  /** Offer details if offer received */
  offer_details: OfferDetails | null;
}

/**
 * Custom application answer
 */
export interface ApplicationAnswer {
  /** Question text */
  question: string;
  /** Answer provided */
  answer: string;
  /** Whether AI generated */
  ai_generated: boolean;
}

/**
 * Interview record
 */
export interface Interview {
  /** Unique identifier */
  id: string;
  /** Interview type */
  type: "phone_screen" | "technical" | "behavioral" | "onsite" | "panel" | "final";
  /** Interview round number */
  round: number;
  /** Scheduled date/time */
  scheduled_at: string;
  /** Duration in minutes */
  duration_minutes: number;
  /** Location or video link */
  location: string | null;
  /** Interviewer names */
  interviewers: string[];
  /** Interview status */
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  /** Notes/feedback */
  notes: string | null;
  /** Prep materials */
  prep_materials: string | null;
}

/**
 * Offer details
 */
export interface OfferDetails {
  /** Base salary offered */
  salary: number;
  /** Salary currency */
  currency: string;
  /** Equity/stock options */
  equity: string | null;
  /** Signing bonus */
  signing_bonus: number | null;
  /** Annual bonus target */
  annual_bonus: string | null;
  /** Start date */
  start_date: string | null;
  /** Offer expiry date */
  expiry_date: string | null;
  /** Additional benefits */
  benefits: string[];
  /** Full offer letter URL */
  offer_letter_url: string | null;
}

/**
 * Application list item (lighter than full Application)
 */
export interface ApplicationListItem {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  company_logo_url: string | null;
  status: ApplicationStatus;
  applied_at: string;
  last_activity_at: string;
  follow_up_date: string | null;
  match_score: number | null;
  current_round: number;
  total_rounds: number | null;
  has_upcoming_interview: boolean;
  next_interview_at: string | null;
}

/**
 * Application statistics
 */
export interface ApplicationStats {
  total: number;
  by_status: Record<ApplicationStatus, number>;
  response_rate: number;
  average_time_to_response_days: number;
  interviews_scheduled: number;
  offers_received: number;
  applications_this_week: number;
}

/**
 * Application timeline event
 */
export interface ApplicationTimelineEvent {
  id: string;
  application_id: string;
  event_type: "status_change" | "interview_scheduled" | "note_added" | "document_uploaded" | "email_sent";
  description: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}
