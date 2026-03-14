import type { Timestamps, UserOwned } from "./database";

/**
 * Type of content being reviewed
 */
export type ReviewType = "resume" | "cover_letter" | "outreach" | "answer" | "email";

/**
 * Review action taken
 */
export type ReviewAction = "approve" | "reject" | "regenerate" | "edit";

/**
 * Content quality assessment
 */
export interface ContentQuality {
  /** Overall quality score (0-100) */
  overall: number;
  /** Relevance to job (0-100) */
  relevance: number;
  /** Tone appropriateness (0-100) */
  tone: number;
  /** Grammar/clarity (0-100) */
  clarity: number;
  /** Keyword optimization (0-100) */
  keywords: number;
  /** Improvement suggestions */
  suggestions: string[];
}

/**
 * Review queue item
 */
export interface ReviewItem extends Timestamps, UserOwned {
  /** Unique identifier */
  id: string;
  /** Type of content */
  type: ReviewType;
  /** Associated job ID */
  job_id: string;
  /** Job title (denormalized for display) */
  job_title: string;
  /** Company name */
  company: string;
  /** Company logo URL */
  company_logo_url: string | null;
  /** Associated profile ID */
  profile_id: string;
  /** Profile name */
  profile_name: string;
  /** Generated content */
  content: string;
  /** Content quality assessment */
  quality: ContentQuality;
  /** AI model used for generation */
  model_used: string;
  /** Generation prompt (for debugging) */
  prompt_summary: string | null;
  /** Review status */
  status: "pending" | "approved" | "rejected" | "regenerating";
  /** Number of regenerations */
  regeneration_count: number;
  /** Maximum allowed regenerations */
  max_regenerations: number;
  /** Action taken */
  action_taken: ReviewAction | null;
  /** Reviewer notes */
  reviewer_notes: string | null;
  /** Priority level */
  priority: "high" | "medium" | "low";
  /** Due date (deadline-based priority) */
  due_date: string | null;
  /** Time spent reviewing (seconds) */
  review_time_seconds: number | null;
}

/**
 * Review item list entry
 */
export interface ReviewListItem {
  id: string;
  type: ReviewType;
  job_id: string;
  job_title: string;
  company: string;
  company_logo_url: string | null;
  quality_score: number;
  status: "pending" | "approved" | "rejected" | "regenerating";
  priority: "high" | "medium" | "low";
  due_date: string | null;
  created_at: string;
}

/**
 * Review queue statistics
 */
export interface ReviewStats {
  total_pending: number;
  by_type: Record<ReviewType, number>;
  by_priority: {
    high: number;
    medium: number;
    low: number;
  };
  average_quality_score: number;
  approved_today: number;
  rejected_today: number;
  average_review_time_seconds: number;
}

/**
 * Regeneration request
 */
export interface RegenerationRequest {
  /** Item ID to regenerate */
  item_id: string;
  /** Specific feedback for regeneration */
  feedback: string;
  /** Focus areas for improvement */
  focus_areas: ("tone" | "length" | "keywords" | "specificity" | "creativity")[];
}

/**
 * Batch review action
 */
export interface BatchReviewAction {
  /** Item IDs to act on */
  item_ids: string[];
  /** Action to perform */
  action: "approve" | "reject";
  /** Notes for batch action */
  notes?: string;
}

/**
 * Review diff (for edited content)
 */
export interface ReviewDiff {
  /** Original content */
  original: string;
  /** Edited content */
  edited: string;
  /** List of changes */
  changes: Array<{
    type: "addition" | "deletion" | "modification";
    original_text: string | null;
    new_text: string | null;
    position: number;
  }>;
}
