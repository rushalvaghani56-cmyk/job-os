import type { Timestamps, UserOwned } from "./database";

/**
 * Job status in the pipeline
 */
export type JobStatus =
  | "new"
  | "scored"
  | "content_ready"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "skipped"
  | "bookmarked"
  | "ghosted";

/**
 * AI-recommended decision for a job
 */
export type JobDecision = "auto_apply" | "review" | "skip";

/**
 * Source where the job was discovered
 */
export type JobSource =
  | "linkedin"
  | "indeed"
  | "greenhouse"
  | "lever"
  | "workday"
  | "manual"
  | "referral"
  | "company_career_page";

/**
 * Employment type
 */
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship";

/**
 * Work location type
 */
export type WorkLocationType = "remote" | "hybrid" | "onsite";

/**
 * Experience level
 */
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";

/**
 * Complete job record
 */
export interface Job extends Timestamps, UserOwned {
  /** Unique job identifier */
  id: string;
  /** Job title */
  title: string;
  /** Company name */
  company: string;
  /** Company logo URL */
  company_logo_url: string | null;
  /** Company website */
  company_website: string | null;
  /** Job location */
  location: string;
  /** Work location type */
  work_location_type: WorkLocationType;
  /** Employment type */
  employment_type: EmploymentType;
  /** Experience level */
  experience_level: ExperienceLevel;
  /** Salary range minimum */
  salary_min: number | null;
  /** Salary range maximum */
  salary_max: number | null;
  /** Salary currency */
  salary_currency: string;
  /** Full job description */
  description: string;
  /** Required skills extracted */
  required_skills: string[];
  /** Nice-to-have skills extracted */
  preferred_skills: string[];
  /** Years of experience required */
  years_experience_required: number | null;
  /** Education requirement */
  education_requirement: string | null;
  /** Original job posting URL */
  source_url: string;
  /** Where the job was discovered */
  source: JobSource;
  /** External job ID from source */
  external_id: string | null;
  /** Current status in pipeline */
  status: JobStatus;
  /** AI-recommended decision */
  decision: JobDecision | null;
  /** Overall match score (0-100) */
  match_score: number | null;
  /** Detailed score breakdown */
  score_breakdown: ScoreBreakdown | null;
  /** Skills match analysis */
  skill_matches: SkillMatch[];
  /** Profile ID used for scoring */
  profile_id: string | null;
  /** Whether this is a dream company */
  is_dream_company: boolean;
  /** Priority level (1=dream, 2=high, 3=normal) */
  priority: 1 | 2 | 3;
  /** AI confidence in the score */
  score_confidence: number | null;
  /** User notes */
  notes: string | null;
  /** Application deadline */
  deadline: string | null;
  /** Date job was posted */
  posted_date: string | null;
  /** Date job was discovered */
  discovered_at: string;
  /** Date job was scored */
  scored_at: string | null;
  /** Date user applied */
  applied_at: string | null;
  /** Tags for organization */
  tags: string[];
}

/**
 * 8-dimension score breakdown
 */
export interface ScoreBreakdown {
  /** Skills alignment (0-100) */
  skills: number;
  /** Experience match (0-100) */
  experience: number;
  /** Location/remote fit (0-100) */
  location: number;
  /** Salary range fit (0-100) */
  salary: number;
  /** Company culture fit (0-100) */
  culture: number;
  /** Growth opportunity (0-100) */
  growth: number;
  /** Work-life balance (0-100) */
  work_life_balance: number;
  /** Role stability (0-100) */
  stability: number;
}

/**
 * Individual skill match result
 */
export interface SkillMatch {
  /** Skill name */
  skill: string;
  /** Whether user has this skill */
  matched: boolean;
  /** User's proficiency level if matched */
  proficiency: "beginner" | "intermediate" | "advanced" | "expert" | null;
  /** Whether it's required or preferred */
  importance: "required" | "preferred";
  /** Related skills user has */
  related_skills: string[];
}

/**
 * Job filter parameters
 */
export interface JobFilter {
  /** Filter by status */
  status?: JobStatus[];
  /** Filter by decision */
  decision?: JobDecision[];
  /** Filter by source */
  source?: JobSource[];
  /** Minimum match score */
  min_score?: number;
  /** Maximum match score */
  max_score?: number;
  /** Filter by location type */
  work_location_type?: WorkLocationType[];
  /** Filter by employment type */
  employment_type?: EmploymentType[];
  /** Filter by experience level */
  experience_level?: ExperienceLevel[];
  /** Minimum salary */
  min_salary?: number;
  /** Filter by dream companies only */
  is_dream_company?: boolean;
  /** Filter by priority */
  priority?: (1 | 2 | 3)[];
  /** Filter by profile */
  profile_id?: string;
  /** Text search query */
  search?: string;
  /** Filter by tags */
  tags?: string[];
  /** Filter by date range (discovered) */
  discovered_after?: string;
  discovered_before?: string;
  /** Sort field */
  sort_by?: "match_score" | "discovered_at" | "company" | "title" | "deadline";
  /** Sort direction */
  sort_order?: "asc" | "desc";
}

/**
 * Job list item (lighter than full Job)
 */
export interface JobListItem {
  id: string;
  title: string;
  company: string;
  company_logo_url: string | null;
  location: string;
  work_location_type: WorkLocationType;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  status: JobStatus;
  decision: JobDecision | null;
  match_score: number | null;
  is_dream_company: boolean;
  priority: 1 | 2 | 3;
  discovered_at: string;
  deadline: string | null;
  source: JobSource;
  tags: string[];
}

/**
 * Job statistics summary
 */
export interface JobStats {
  total: number;
  by_status: Record<JobStatus, number>;
  by_decision: Record<JobDecision, number>;
  average_score: number;
  discovered_today: number;
  pending_review: number;
}
