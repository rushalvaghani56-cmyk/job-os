import type { Timestamps, UserOwned } from "./database";

/**
 * Skill proficiency level
 */
export type SkillProficiency = "beginner" | "intermediate" | "advanced" | "expert";

/**
 * User skill
 */
export interface Skill {
  /** Skill name */
  name: string;
  /** Proficiency level */
  proficiency: SkillProficiency;
  /** Years of experience with this skill */
  years: number;
  /** Whether this is a primary/featured skill */
  is_primary: boolean;
  /** Skill category */
  category: string;
}

/**
 * Work experience entry
 */
export interface WorkExperience {
  /** Unique identifier */
  id: string;
  /** Company name */
  company: string;
  /** Job title */
  title: string;
  /** Location */
  location: string;
  /** Start date (YYYY-MM) */
  start_date: string;
  /** End date (YYYY-MM) or null if current */
  end_date: string | null;
  /** Whether this is current position */
  is_current: boolean;
  /** Job description / responsibilities */
  description: string;
  /** Key achievements with metrics */
  achievements: Achievement[];
  /** Technologies/skills used */
  technologies: string[];
}

/**
 * Achievement with quantified impact
 */
export interface Achievement {
  /** Achievement description */
  description: string;
  /** Quantified impact (e.g., "40%", "$2M") */
  metric: string | null;
  /** Category of achievement */
  category: "revenue" | "efficiency" | "growth" | "leadership" | "technical" | "other";
}

/**
 * Project entry
 */
export interface Project {
  /** Unique identifier */
  id: string;
  /** Project name */
  name: string;
  /** Project description */
  description: string;
  /** Technologies used */
  technologies: string[];
  /** Project URL (if applicable) */
  url: string | null;
  /** GitHub/repo URL */
  repo_url: string | null;
  /** Key highlights/achievements */
  highlights: string[];
  /** Start date */
  start_date: string | null;
  /** End date */
  end_date: string | null;
}

/**
 * Education entry
 */
export interface Education {
  /** Unique identifier */
  id: string;
  /** Institution name */
  institution: string;
  /** Degree type */
  degree: string;
  /** Field of study */
  field: string;
  /** Start date (YYYY-MM) */
  start_date: string;
  /** End date (YYYY-MM) or null if current */
  end_date: string | null;
  /** GPA (if provided) */
  gpa: number | null;
  /** Notable achievements/activities */
  highlights: string[];
  /** Location */
  location: string | null;
}

/**
 * Certification
 */
export interface Certification {
  /** Unique identifier */
  id: string;
  /** Certification name */
  name: string;
  /** Issuing organization */
  issuer: string;
  /** Issue date */
  issue_date: string;
  /** Expiry date (if applicable) */
  expiry_date: string | null;
  /** Credential ID */
  credential_id: string | null;
  /** Verification URL */
  credential_url: string | null;
}

/**
 * Language proficiency
 */
export interface Language {
  /** Language name */
  name: string;
  /** Proficiency level */
  proficiency: "basic" | "conversational" | "professional" | "native";
}

/**
 * Work preferences
 */
export interface WorkPreference {
  /** Desired job titles */
  target_titles: string[];
  /** Target industries */
  target_industries: string[];
  /** Target company sizes */
  company_sizes: ("startup" | "small" | "medium" | "large" | "enterprise")[];
  /** Preferred work locations */
  locations: string[];
  /** Open to relocation */
  open_to_relocation: boolean;
  /** Work location preferences */
  work_location_types: ("remote" | "hybrid" | "onsite")[];
  /** Minimum salary expectation */
  salary_min: number | null;
  /** Maximum/target salary */
  salary_max: number | null;
  /** Salary currency */
  salary_currency: string;
  /** Open to contract work */
  open_to_contract: boolean;
  /** Open to part-time */
  open_to_part_time: boolean;
  /** Visa sponsorship required */
  requires_visa_sponsorship: boolean;
  /** Notice period in days */
  notice_period_days: number | null;
  /** Dream companies */
  dream_companies: string[];
  /** Companies to avoid */
  excluded_companies: string[];
}

/**
 * Custom profile field
 */
export interface CustomField {
  /** Field label */
  label: string;
  /** Field value */
  value: string;
  /** Field type */
  type: "text" | "link" | "date";
}

/**
 * Complete user profile
 */
export interface Profile extends Timestamps, UserOwned {
  /** Unique profile identifier */
  id: string;
  /** Profile name (e.g., "Backend Engineer Search") */
  name: string;
  /** Target role for this profile */
  target_role: string;
  /** Whether this is the active profile */
  is_active: boolean;
  /** Profile completeness (0-100) */
  completeness: number;

  // Identity
  /** Full name */
  full_name: string;
  /** Email address */
  email: string;
  /** Phone number */
  phone: string | null;
  /** LinkedIn URL */
  linkedin_url: string | null;
  /** GitHub URL */
  github_url: string | null;
  /** Portfolio URL */
  portfolio_url: string | null;
  /** Personal website */
  website_url: string | null;
  /** Location */
  location: string | null;

  // Professional summary
  /** Headline/tagline */
  headline: string | null;
  /** Professional summary (2-3 sentences) */
  summary: string | null;
  /** Elevator pitch (30-60 seconds) */
  elevator_pitch: string | null;

  // Skills & Experience
  /** User skills */
  skills: Skill[];
  /** Work history */
  work_experience: WorkExperience[];
  /** Projects */
  projects: Project[];
  /** Education */
  education: Education[];
  /** Certifications */
  certifications: Certification[];
  /** Languages */
  languages: Language[];

  // Preferences
  /** Work preferences */
  preferences: WorkPreference;

  // Custom fields
  /** Additional custom fields */
  custom_fields: CustomField[];

  // Master documents
  /** Master resume file URL */
  master_resume_url: string | null;
  /** Parsed resume content */
  parsed_resume: Record<string, unknown> | null;
}

/**
 * Profile list item
 */
export interface ProfileListItem {
  id: string;
  name: string;
  target_role: string;
  is_active: boolean;
  completeness: number;
  updated_at: string;
}

/**
 * Profile completeness breakdown
 */
export interface ProfileCompleteness {
  overall: number;
  sections: {
    identity: number;
    summary: number;
    skills: number;
    experience: number;
    education: number;
    preferences: number;
    documents: number;
  };
  missing_fields: string[];
  suggestions: string[];
}
