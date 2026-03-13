/**
 * Analytics Types
 * Types for analytics, reports, and insights in Job Application OS
 */

/** Time period for analytics */
export type AnalyticsPeriod = "day" | "week" | "month" | "quarter" | "year" | "all_time";

/** Funnel stage data point */
export interface FunnelStage {
  /** Stage name */
  name: string;
  /** Count at this stage */
  count: number;
  /** Conversion rate from previous stage */
  conversion_rate: number;
  /** Change from previous period */
  change: number;
  /** Change direction */
  trend: "up" | "down" | "flat";
}

/** Complete funnel data */
export interface FunnelData {
  /** Period for this data */
  period: AnalyticsPeriod;
  /** Funnel stages */
  stages: FunnelStage[];
  /** Overall conversion rate */
  overall_conversion: number;
  /** Comparison to previous period */
  period_comparison: {
    previous_conversion: number;
    change_percentage: number;
  };
}

/** Source performance data */
export interface SourceData {
  /** Source name */
  source: string;
  /** Number of jobs from source */
  jobs_count: number;
  /** Number of applications */
  applications_count: number;
  /** Response rate */
  response_rate: number;
  /** Interview rate */
  interview_rate: number;
  /** Average score */
  average_score: number;
  /** Best performing for */
  best_for: string[];
}

/** Rejection analysis data */
export interface RejectionData {
  /** Rejection reason category */
  reason: string;
  /** Count of rejections */
  count: number;
  /** Percentage of total rejections */
  percentage: number;
  /** Stage where rejection occurred */
  stage: string;
  /** Suggestions to improve */
  suggestions: string[];
}

/** Goal tracking data */
export interface GoalData {
  /** Goal identifier */
  id: string;
  /** Goal name */
  name: string;
  /** Goal type */
  type: "applications" | "interviews" | "offers" | "networking" | "custom";
  /** Target value */
  target: number;
  /** Current value */
  current: number;
  /** Progress percentage */
  progress: number;
  /** Deadline */
  deadline: string;
  /** Status */
  status: "on_track" | "at_risk" | "behind" | "completed";
  /** Trend over time */
  trend: Array<{
    date: string;
    value: number;
  }>;
}

/** A/B test result */
export interface ABTestResult {
  /** Test identifier */
  id: string;
  /** Test name */
  name: string;
  /** What's being tested */
  test_subject: "resume" | "cover_letter" | "outreach" | "subject_line";
  /** Variant A description */
  variant_a: {
    name: string;
    description: string;
    sample_size: number;
    response_rate: number;
  };
  /** Variant B description */
  variant_b: {
    name: string;
    description: string;
    sample_size: number;
    response_rate: number;
  };
  /** Winner */
  winner: "a" | "b" | "inconclusive";
  /** Statistical confidence */
  confidence: number;
  /** Test start date */
  started_at: string;
  /** Test end date */
  ended_at: string | null;
  /** Status */
  status: "running" | "completed" | "paused";
}

/** Skill demand data */
export interface SkillDemand {
  /** Skill name */
  skill: string;
  /** Demand score (0-100) */
  demand: number;
  /** Change from previous period */
  change: number;
  /** Number of jobs requiring this skill */
  jobs_count: number;
  /** Average salary for jobs with this skill */
  average_salary: number;
  /** Whether user has this skill */
  user_has: boolean;
}

/** Timing analytics */
export interface TimingData {
  /** Day of week */
  day: string;
  /** Hour of day (0-23) */
  hour: number;
  /** Applications sent */
  applications: number;
  /** Response rate */
  response_rate: number;
  /** Best times to apply */
  is_optimal: boolean;
}

/** Weekly report data */
export interface WeeklyReport {
  /** Report week start date */
  week_start: string;
  /** Report week end date */
  week_end: string;
  /** Summary statistics */
  summary: {
    jobs_discovered: number;
    applications_sent: number;
    responses_received: number;
    interviews_scheduled: number;
    offers_received: number;
  };
  /** Comparison to previous week */
  comparison: {
    jobs_discovered_change: number;
    applications_change: number;
    responses_change: number;
  };
  /** Top performing jobs */
  top_jobs: Array<{
    job_id: string;
    title: string;
    company: string;
    score: number;
  }>;
  /** Key insights */
  insights: string[];
  /** Recommendations */
  recommendations: string[];
}

/** Dashboard metrics */
export interface DashboardMetrics {
  /** Period for metrics */
  period: AnalyticsPeriod;
  /** Key stats */
  stats: {
    total_jobs: number;
    total_applications: number;
    response_rate: number;
    interview_rate: number;
    average_score: number;
    active_outreach: number;
  };
  /** Changes from previous period */
  changes: {
    jobs_change: number;
    applications_change: number;
    response_rate_change: number;
    interview_rate_change: number;
  };
  /** Goals progress */
  goals: GoalData[];
  /** Recent activity */
  recent_activity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}
