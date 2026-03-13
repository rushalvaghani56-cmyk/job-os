/**
 * Job Types
 * Types for job listings, scoring, and filtering in Job Application OS
 */

/** Current status of a job in the pipeline */
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

/** AI decision recommendation for a job */
export type JobDecision = "auto_apply" | "review" | "skip";

/** Source where the job was discovered */
export type JobSource =
  | "linkedin"
  | "indeed"
  | "glassdoor"
  | "greenhouse"
  | "lever"
  | "workday"
  | "manual"
  | "referral"
  | "company_site";

/** Employment type */
export type EmploymentType = "full_time" | "part_time" | "contract" | "internship" | "freelance";

/** Remote work policy */
export type RemotePolicy = "remote" | "hybrid" | "onsite";

/** Experience level requirement */
export type ExperienceLevel = "entry" | "mid" | "senior" | "staff" | "principal" | "executive";

/** Score breakdown for a single dimension */
export interface ScoreDimension {
  /** Dimension name */
  name: string;
  /** Score value (0-100) */
  score: number;
  /** Weight of this dimension in overall score */
  weight: number;
  /** Explanation of the score */
  reasoning: string;
}

/** Complete job score with all 8 dimensions */
export interface JobScore {
  /** Overall composite score (0-100) */
  overall: number;
  /** Individual dimension scores */
  dimensions: {
    skills_match: ScoreDimension;
    experience_level: ScoreDimension;
    culture_fit: ScoreDimension;
    growth_potential: ScoreDimension;
    compensation_alignment: ScoreDimension;
    location_preference: ScoreDimension;
    company_reputation: ScoreDimension;
    role_interest: ScoreDimension;
  };
  /** AI confidence in the score (0-1) */
  confidence: number;
  /** Timestamp when score was calculated */
  scored_at: string;
  /** Profile ID used for scoring */
  profile_id: string;
}

/** Skill match analysis */
export interface SkillMatch {
  /** Skill name */
  skill: string;
  /** Whether the user has this skill */
  user_has: boolean;
  /** Importance level for the job */
  importance: "required" | "preferred" | "nice_to_have";
  /** Years of experience if applicable */
  years_experience?: number;
}

/** Complete job entity */
export interface Job {
  /** Unique job identifier */
  id: string;
  /** Job title */
  title: string;
  /** Company name */
  company: string;
  /** Company logo URL */
  company_logo: string | null;
  /** Job location(s) */
  locations: string[];
  /** Remote work policy */
  remote_policy: RemotePolicy;
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
  /** Key requirements */
  requirements: string[];
  /** Nice-to-have qualifications */
  nice_to_haves: string[];
  /** Job benefits */
  benefits: string[];
  /** Current status */
  status: JobStatus;
  /** AI decision recommendation */
  decision: JobDecision | null;
  /** Complete score breakdown */
  score: JobScore | null;
  /** Matched skills analysis */
  skill_matches: SkillMatch[];
  /** Source where job was found */
  source: JobSource;
  /** Original job posting URL */
  source_url: string;
  /** External job ID from source */
  external_id: string | null;
  /** Whether this is a dream company */
  is_dream_company: boolean;
  /** User priority (1 = dream, 2 = high, 3 = normal) */
  priority: 1 | 2 | 3;
  /** Application deadline if known */
  deadline: string | null;
  /** When the job was posted */
  posted_at: string | null;
  /** When the job was discovered */
  discovered_at: string;
  /** User's notes about the job */
  notes: string | null;
  /** Tags applied to the job */
  tags: string[];
  /** Created timestamp */
  created_at: string;
  /** Updated timestamp */
  updated_at: string;
}

/** Job filter options */
export interface JobFilter {
  /** Text search query */
  search?: string;
  /** Filter by status */
  status?: JobStatus[];
  /** Filter by decision */
  decision?: JobDecision[];
  /** Minimum score */
  min_score?: number;
  /** Maximum score */
  max_score?: number;
  /** Filter by source */
  source?: JobSource[];
  /** Filter by remote policy */
  remote_policy?: RemotePolicy[];
  /** Filter by experience level */
  experience_level?: ExperienceLevel[];
  /** Filter by location */
  locations?: string[];
  /** Only dream companies */
  dream_companies_only?: boolean;
  /** Only bookmarked */
  bookmarked_only?: boolean;
  /** Minimum salary */
  salary_min?: number;
  /** Posted within N days */
  posted_within_days?: number;
  /** Tags to include */
  tags?: string[];
  /** Sort field */
  sort_by?: "score" | "posted_at" | "discovered_at" | "salary" | "company";
  /** Sort direction */
  sort_direction?: "asc" | "desc";
}

/** Job list item (lighter version for lists) */
export interface JobListItem {
  id: string;
  title: string;
  company: string;
  company_logo: string | null;
  locations: string[];
  remote_policy: RemotePolicy;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  status: JobStatus;
  decision: JobDecision | null;
  score: number | null;
  is_dream_company: boolean;
  priority: 1 | 2 | 3;
  source: JobSource;
  discovered_at: string;
  posted_at: string | null;
}
