/**
 * Outreach Types
 * Types for networking contacts and outreach messages in Job Application OS
 */

/** Warmth level of a contact */
export type WarmthLevel = "cold" | "warm" | "hot";

/** Contact source */
export type ContactSource = "linkedin" | "email" | "referral" | "event" | "manual" | "alumni";

/** Outreach channel */
export type OutreachChannel = "linkedin" | "email" | "twitter" | "phone" | "other";

/** Message status */
export type MessageStatus = "draft" | "scheduled" | "sent" | "delivered" | "read" | "replied" | "bounced";

/** Contact entity */
export interface Contact {
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
  /** Twitter handle */
  twitter_handle: string | null;
  /** Current company */
  company: string;
  /** Job title */
  title: string;
  /** Profile image URL */
  avatar_url: string | null;
  /** How we know this contact */
  source: ContactSource;
  /** Warmth level */
  warmth: WarmthLevel;
  /** Whether this is at a target company */
  is_target_company: boolean;
  /** Mutual connections */
  mutual_connections: number;
  /** Tags */
  tags: string[];
  /** Notes about the contact */
  notes: string | null;
  /** Last contacted date */
  last_contacted_at: string | null;
  /** Next follow-up date */
  next_follow_up: string | null;
  /** Total messages sent */
  messages_sent: number;
  /** Total responses received */
  responses_received: number;
  /** Response rate */
  response_rate: number;
  /** Created timestamp */
  created_at: string;
  /** Updated timestamp */
  updated_at: string;
}

/** Outreach message */
export interface OutreachMessage {
  /** Unique identifier */
  id: string;
  /** Contact ID */
  contact_id: string;
  /** Associated job ID if applicable */
  job_id: string | null;
  /** Message channel */
  channel: OutreachChannel;
  /** Message subject (for email) */
  subject: string | null;
  /** Message content */
  content: string;
  /** Message status */
  status: MessageStatus;
  /** Scheduled send time */
  scheduled_at: string | null;
  /** Actual send time */
  sent_at: string | null;
  /** When message was read */
  read_at: string | null;
  /** When reply was received */
  replied_at: string | null;
  /** Whether this was AI-generated */
  is_ai_generated: boolean;
  /** AI quality score */
  quality_score: number | null;
  /** Thread ID for conversation grouping */
  thread_id: string | null;
  /** Whether this is a follow-up */
  is_follow_up: boolean;
  /** Follow-up number in sequence */
  follow_up_number: number;
  /** Created timestamp */
  created_at: string;
  /** Updated timestamp */
  updated_at: string;
}

/** Follow-up schedule */
export interface FollowUp {
  /** Unique identifier */
  id: string;
  /** Contact ID */
  contact_id: string;
  /** Original message ID */
  original_message_id: string;
  /** Scheduled date */
  scheduled_date: string;
  /** Follow-up number */
  sequence_number: number;
  /** Draft message content */
  draft_content: string | null;
  /** Status */
  status: "pending" | "sent" | "cancelled" | "skipped";
  /** Created timestamp */
  created_at: string;
}

/** Contact list item (lighter version) */
export interface ContactListItem {
  id: string;
  name: string;
  company: string;
  title: string;
  avatar_url: string | null;
  warmth: WarmthLevel;
  is_target_company: boolean;
  last_contacted_at: string | null;
  next_follow_up: string | null;
  response_rate: number;
}

/** Outreach statistics */
export interface OutreachStats {
  /** Total contacts */
  total_contacts: number;
  /** Contacts by warmth */
  by_warmth: Record<WarmthLevel, number>;
  /** Messages sent this week */
  messages_this_week: number;
  /** Response rate */
  response_rate: number;
  /** Pending follow-ups */
  pending_follow_ups: number;
  /** Best performing channel */
  best_channel: OutreachChannel;
}

/** Contact filter options */
export interface ContactFilter {
  /** Search query */
  search?: string;
  /** Filter by warmth */
  warmth?: WarmthLevel[];
  /** Filter by company */
  company?: string[];
  /** Target companies only */
  target_companies_only?: boolean;
  /** Has pending follow-up */
  pending_follow_up?: boolean;
  /** Filter by tags */
  tags?: string[];
  /** Sort field */
  sort_by?: "name" | "company" | "warmth" | "last_contacted" | "response_rate";
  /** Sort direction */
  sort_direction?: "asc" | "desc";
}
