/**
 * Market Intelligence API response types
 */

// GET /api/v1/market/insights
export interface MarketInsights {
  top_companies: MarketCompany[];
  trending_skills: MarketSkill[];
  avg_salary: number;
  demand_trend: DemandTrendPoint[];
}

export interface MarketCompany {
  name: string;
  logo: string;
  open_roles: number;
  velocity: "accelerating" | "stable" | "decelerating";
  avg_match_score: number;
  is_dream: boolean;
}

export interface MarketSkill {
  skill: string;
  tier: number;
  demand: number;
  trend: number[];
  direction: "up" | "down" | "stable";
}

export interface DemandTrendPoint {
  date: string;
  market: number;
  your_target: number;
}

// GET /api/v1/market/salary?role=X&location=Y
export interface MarketSalary {
  min: number;
  max: number;
  avg: number;
  median: number;
  sample_size: number;
  distribution?: SalaryDistributionBucket[];
  regional?: RegionalSalary[];
}

export interface SalaryDistributionBucket {
  range: string;
  count: number;
}

export interface RegionalSalary {
  region: string;
  salary: number;
}

// GET /api/v1/market/trends
export interface MarketTrends {
  jobs_per_week: JobsPerWeekPoint[];
  growing_skills: string[];
  active_companies: ActiveCompany[];
  location_type_breakdown: LocationTypeBreakdown;
  layoff_companies?: LayoffCompany[];
  growth_companies?: GrowthCompany[];
  competition_jobs?: CompetitionJob[];
  best_time_data?: BestTimePoint[];
  hidden_gems?: HiddenGem[];
}

export interface JobsPerWeekPoint {
  week: string;
  postings: number;
}

export interface ActiveCompany {
  name: string;
  growth: string;
}

export interface LocationTypeBreakdown {
  remote: number;
  hybrid: number;
  onsite: number;
}

export interface LayoffCompany {
  name: string;
  date: string;
}

export interface GrowthCompany {
  name: string;
  growth: string;
}

export interface CompetitionJob {
  company: string;
  role: string;
  level: "low" | "medium" | "high" | "very-high";
  applicants: number;
}

export interface BestTimePoint {
  day: string;
  applications: number;
  success_rate: number;
}

export interface HiddenGem {
  company: string;
  role: string;
  applicants: number;
  avg_applicants: number;
}
