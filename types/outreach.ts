import type { Timestamps, UserOwned } from "./database";

/**
 * Contact warmth level
 */
export type WarmthLevel = "cold" | "warm" | "hot";

/**
 * Contact source
 */
export type ContactSource = "linkedin" | "referral" | "event" | "email" | "manual";

/**
 * Outreach contact
 */
export interface Contact extends Timestamps, UserOwned {
  /** Unique identifier */
  id: string;
  /** Contact's full name */
  name: string;
  /** Contact's email */
  email: string | null;
  /** Contact's phone */
  phone: string | null;
  /** LinkedIn profile URL */
  linkedin_url: string | null;
  /** Contact's job title */
  title: string | null;
  /** Contact's company */
  company: string;
  /** Company logo URL */
  company_logo_url: string | null;
  /** Department */
  department: string | null;
  /** Contact warmth level */
  warmth: WarmthLevel;
  /** How we know this contact */
  source: ContactSource;
  /** Associated job IDs */
  related_job_ids: string[];
  /** Notes about the contact */
  notes: string | null;
  /** Tags for organization */
  tags: string[];
  /** Last contacted date */
  last_contacted_at: string | null;
  /** Next follow-up date */
  next_follow_up_at: string | null;
  /** Total messages sent */
  messages_sent: number;
  /** Total responses received */
  responses_received: number;
  /** Contact status */
  status: "active" | "responded" | "not_interested" | "hired" | "archived";
}

/**
 * Outreach message
 */
export interface OutreachMessage extends Timestamps {
  /** Unique identifier */
  id: string;
  /** Contact ID */
  contact_id: string;
  /** Message type */
  type: "initial" | "follow_up" | "thank_you" | "referral_request";
  /** Message subject (for emails) */
  subject: string | null;
  /** Message content */
  content: string;
  /** Channel used */
  channel: "email" | "linkedin" | "other";
  /** Send status */
  status: "draft" | "pending_review" | "approved" | "sent" | "failed";
  /** Scheduled send time */
  scheduled_at: string | null;
  /** Actual send time */
  sent_at: string | null;
  /** Whether a response was received */
  response_received: boolean;
  /** Response content (if any) */
  response_content: string | null;
  /** Response received at */
  response_at: string | null;
  /** AI generated */
  ai_generated: boolean;
  /** Quality score */
  quality_score: number | null;
}

/**
 * Follow-up reminder
 */
export interface FollowUp {
  /** Unique identifier */
  id: string;
  /** Contact ID */
  contact_id: string;
  /** Contact name */
  contact_name: string;
  /** Company name */
  company: string;
  /** Reminder date */
  due_date: string;
  /** Follow-up type */
  type: "initial" | "check_in" | "thank_you" | "referral";
  /** Notes */
  notes: string | null;
  /** Status */
  status: "pending" | "completed" | "skipped";
  /** Priority */
  priority: "high" | "medium" | "low";
}

/**
 * Contact list item
 */
export interface ContactListItem {
  id: string;
  name: string;
  title: string | null;
  company: string;
  company_logo_url: string | null;
  warmth: WarmthLevel;
  status: "active" | "responded" | "not_interested" | "hired" | "archived";
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  messages_sent: number;
  responses_received: number;
}

/**
 * Outreach statistics
 */
export interface OutreachStats {
  total_contacts: number;
  by_warmth: Record<WarmthLevel, number>;
  by_status: Record<string, number>;
  total_messages_sent: number;
  total_responses: number;
  response_rate: number;
  pending_follow_ups: number;
  connections_this_week: number;
}

/**
 * Message template
 */
export interface MessageTemplate {
  /** Unique identifier */
  id: string;
  /** Template name */
  name: string;
  /** Template type */
  type: "initial" | "follow_up" | "thank_you" | "referral_request";
  /** Subject template (with placeholders) */
  subject: string | null;
  /** Content template (with placeholders) */
  content: string;
  /** Available placeholders */
  placeholders: string[];
  /** Is default template */
  is_default: boolean;
}
