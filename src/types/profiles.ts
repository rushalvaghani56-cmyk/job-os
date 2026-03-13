/**
 * Profile Types
 * Types for user profiles, skills, experience, and preferences in Job Application OS
 */

/** Skill proficiency level */
export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

/** Skill category */
export type SkillCategory =
  | "programming_language"
  | "framework"
  | "database"
  | "cloud"
  | "devops"
  | "soft_skill"
  | "domain"
  | "tool"
  | "other";

/** Individual skill entry */
export interface Skill {
  /** Skill name */
  name: string;
  /** Proficiency level */
  level: SkillLevel;
  /** Years of experience */
  years: number;
  /** Category of the skill */
  category: SkillCategory;
  /** Whether this is a primary skill */
  is_primary: boolean;
  /** Last used date */
  last_used: string | null;
}

/** Work experience entry */
export interface WorkExperience {
  /** Unique identifier */
  id: string;
  /** Company name */
  company: string;
  /** Job title */
  title: string;
  /** Location */
  location: string;
  /** Start date */
  start_date: string;
  /** End date, null if current */
  end_date: string | null;
  /** Whether this is current position */
  is_current: boolean;
  /** Job description */
  description: string;
  /** Key achievements */
  achievements: Achievement[];
  /** Technologies used */
  technologies: string[];
  /** Company industry */
  industry: string;
}

/** Achievement with quantified impact */
export interface Achievement {
  /** Achievement description */
  description: string;
  /** Quantified impact if available */
  impact: string | null;
  /** Category of achievement */
  category: "revenue" | "efficiency" | "growth" | "technical" | "leadership" | "other";
}

/** Education entry */
export interface Education {
  /** Unique identifier */
  id: string;
  /** Institution name */
  institution: string;
  /** Degree type */
  degree: string;
  /** Field of study */
  field: string;
  /** Start date */
  start_date: string;
  /** End date */
  end_date: string | null;
  /** GPA if applicable */
  gpa: number | null;
  /** Notable achievements or activities */
  achievements: string[];
  /** Location */
  location: string;
}

/** Certification entry */
export interface Certification {
  /** Unique identifier */
  id: string;
  /** Certification name */
  name: string;
  /** Issuing organization */
  issuer: string;
  /** Date obtained */
  issued_date: string;
  /** Expiration date if applicable */
  expiry_date: string | null;
  /** Credential ID */
  credential_id: string | null;
  /** Verification URL */
  verification_url: string | null;
}

/** Project entry */
export interface Project {
  /** Unique identifier */
  id: string;
  /** Project name */
  name: string;
  /** Project description */
  description: string;
  /** Role in the project */
  role: string;
  /** Technologies used */
  technologies: string[];
  /** Project URL */
  url: string | null;
  /** Start date */
  start_date: string;
  /** End date */
  end_date: string | null;
  /** Key achievements */
  achievements: string[];
}

/** Language proficiency */
export interface Language {
  /** Language name */
  name: string;
  /** Proficiency level */
  proficiency: "basic" | "conversational" | "professional" | "native";
}

/** Work preference settings */
export interface WorkPreference {
  /** Preferred job titles */
  target_titles: string[];
  /** Target industries */
  target_industries: string[];
  /** Preferred locations */
  preferred_locations: string[];
  /** Willing to relocate */
  willing_to_relocate: boolean;
  /** Relocation preferences */
  relocation_preferences: string[];
  /** Remote work preference */
  remote_preference: "remote_only" | "hybrid_preferred" | "onsite_ok" | "no_preference";
  /** Minimum salary expectation */
  salary_min: number;
  /** Target salary */
  salary_target: number;
  /** Salary currency */
  salary_currency: string;
  /** Company size preferences */
  company_sizes: ("startup" | "small" | "medium" | "large" | "enterprise")[];
  /** Must-have benefits */
  must_have_benefits: string[];
  /** Deal breakers */
  deal_breakers: string[];
  /** Dream companies */
  dream_companies: string[];
}

/** Custom field for additional profile data */
export interface CustomField {
  /** Field key */
  key: string;
  /** Field label */
  label: string;
  /** Field value */
  value: string;
  /** Field type */
  type: "text" | "url" | "date" | "number";
}

/** Complete user profile */
export interface Profile {
  /** Unique profile identifier */
  id: string;
  /** User ID this profile belongs to */
  user_id: string;
  /** Profile name (e.g., "Backend Engineer Search") */
  name: string;
  /** Target job title */
  target_role: string;
  /** Whether this is the active profile */
  is_active: boolean;
  /** Profile completeness percentage */
  completeness: number;
  /** Personal information */
  personal: {
    full_name: string;
    email: string;
    phone: string | null;
    location: string;
    linkedin_url: string | null;
    github_url: string | null;
    portfolio_url: string | null;
    personal_website: string | null;
  };
  /** Professional summary */
  summary: string;
  /** Skills list */
  skills: Skill[];
  /** Work experience */
  experience: WorkExperience[];
  /** Education history */
  education: Education[];
  /** Certifications */
  certifications: Certification[];
  /** Projects */
  projects: Project[];
  /** Languages */
  languages: Language[];
  /** Work preferences */
  preferences: WorkPreference;
  /** Custom fields */
  custom_fields: CustomField[];
  /** Created timestamp */
  created_at: string;
  /** Updated timestamp */
  updated_at: string;
}

/** Profile list item (lighter version) */
export interface ProfileListItem {
  id: string;
  name: string;
  target_role: string;
  is_active: boolean;
  completeness: number;
  job_count: number;
  application_count: number;
  updated_at: string;
}
