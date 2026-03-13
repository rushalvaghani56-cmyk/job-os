/**
 * Review Types
 * Types for the AI-generated content review queue in Job Application OS
 */

/** Type of content being reviewed */
export type ReviewType = "resume" | "cover_letter" | "outreach" | "answer" | "email";

/** Quality assessment of generated content */
export type ContentQuality = "excellent" | "good" | "needs_improvement" | "poor";

/** Review item status */
export type ReviewStatus = "pending" | "approved" | "rejected" | "regenerating";

/** Content section in a document */
export interface ContentSection {
  /** Section identifier */
  id: string;
  /** Section title */
  title: string;
  /** Section content */
  content: string;
  /** Whether this section was AI-modified */
  is_ai_modified: boolean;
  /** Suggestions for this section */
  suggestions: string[];
}

/** AI quality analysis */
export interface QualityAnalysis {
  /** Overall quality score (0-100) */
  score: number;
  /** Quality level */
  level: ContentQuality;
  /** Strengths identified */
  strengths: string[];
  /** Areas for improvement */
  improvements: string[];
  /** Keyword optimization score */
  keyword_score: number;
  /** ATS compatibility score */
  ats_score: number;
  /** Tone analysis */
  tone: "professional" | "casual" | "formal" | "enthusiastic";
}

/** Diff between original and generated content */
export interface ContentDiff {
  /** Type of change */
  type: "addition" | "deletion" | "modification";
  /** Original text */
  original: string;
  /** New text */
  modified: string;
  /** Reason for the change */
  reason: string;
}

/** Review action taken by user */
export interface ReviewAction {
  /** Action type */
  action: "approve" | "reject" | "regenerate" | "edit";
  /** Timestamp */
  timestamp: string;
  /** User feedback */
  feedback: string | null;
  /** Regeneration instructions if applicable */
  regeneration_instructions: string | null;
}

/** Complete review item */
export interface ReviewItem {
  /** Unique identifier */
  id: string;
  /** Type of content */
  type: ReviewType;
  /** Current status */
  status: ReviewStatus;
  /** Associated job ID */
  job_id: string;
  /** Job title for display */
  job_title: string;
  /** Company name */
  company: string;
  /** Company logo */
  company_logo: string | null;
  /** Profile ID used for generation */
  profile_id: string;
  /** Generated content */
  content: string;
  /** Content sections for detailed review */
  sections: ContentSection[];
  /** Quality analysis */
  quality: QualityAnalysis;
  /** Diffs from original/template */
  diffs: ContentDiff[];
  /** Previous versions for comparison */
  versions: Array<{
    version: number;
    content: string;
    created_at: string;
  }>;
  /** Current version number */
  current_version: number;
  /** Review history */
  actions: ReviewAction[];
  /** AI model used for generation */
  model: string;
  /** Generation timestamp */
  generated_at: string;
  /** Priority (1 = highest) */
  priority: 1 | 2 | 3;
  /** Deadline for review */
  deadline: string | null;
  /** Created timestamp */
  created_at: string;
  /** Updated timestamp */
  updated_at: string;
}

/** Review queue statistics */
export interface ReviewStats {
  /** Total pending items */
  pending: number;
  /** Items by type */
  by_type: Record<ReviewType, number>;
  /** Average quality score */
  average_quality: number;
  /** Items needing urgent review */
  urgent: number;
  /** Items reviewed today */
  reviewed_today: number;
  /** Approval rate */
  approval_rate: number;
}

/** Review filter options */
export interface ReviewFilter {
  /** Filter by type */
  type?: ReviewType[];
  /** Filter by status */
  status?: ReviewStatus[];
  /** Filter by quality level */
  quality?: ContentQuality[];
  /** Filter by job ID */
  job_id?: string;
  /** Filter by priority */
  priority?: (1 | 2 | 3)[];
  /** Sort field */
  sort_by?: "created_at" | "priority" | "quality" | "deadline";
  /** Sort direction */
  sort_direction?: "asc" | "desc";
}
