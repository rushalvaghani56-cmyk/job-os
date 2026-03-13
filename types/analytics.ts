/**
 * Time range for analytics queries
 */
export type TimeRange = "7d" | "30d" | "90d" | "all";

/**
 * Funnel stage data
 */
export interface FunnelStage {
  /** Stage name */
  name: string;
  /** Count at this stage */
  count: number;
  /** Conversion rate from previous stage */
  conversion_rate: number;
  /** Change from previous period */
  change: number;
}

/**
 * Complete funnel data
 */
export interface FunnelData {
  /** Time range */
  period: TimeRange;
  /** Funnel stages in order */
  stages: FunnelStage[];
  /** Overall conversion rate (applied / discovered) */
  overall_conversion: number;
  /** Comparison to previous period */
  previous_period: {
    overall_conversion: number;
    change: number;
  };
}

/**
 * Source performance data
 */
export interface SourceData {
  /** Source name */
  source: string;
  /** Jobs discovered from this source */
  jobs_discovered: number;
  /** Applications submitted */
  applications: number;
  /** Interviews received */
  interviews: number;
  /** Offers received */
  offers: number;
  /** Average match score */
  avg_match_score: number;
  /** Response rate */
  response_rate: number;
  /** Cost (if paid source) */
  cost: number | null;
  /** Cost per application */
  cost_per_application: number | null;
}

/**
 * Rejection analysis data
 */
export interface RejectionData {
  /** Total rejections */
  total_rejections: number;
  /** Rejections by reason */
  by_reason: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
  /** Rejections by stage */
  by_stage: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
  /** Top companies rejecting */
  top_rejecting_companies: Array<{
    company: string;
    count: number;
  }>;
  /** Recommendations to improve */
  recommendations: string[];
}

/**
 * Goal tracking data
 */
export interface GoalData {
  /** Goal ID */
  id: string;
  /** Goal name */
  name: string;
  /** Goal type */
  type: "applications_per_week" | "interviews_per_month" | "response_rate" | "custom";
  /** Target value */
  target: number;
  /** Current value */
  current: number;
  /** Progress percentage */
  progress: number;
  /** Time remaining */
  time_remaining_days: number | null;
  /** Status */
  status: "on_track" | "at_risk" | "behind" | "completed";
  /** Trend direction */
  trend: "up" | "down" | "flat";
}

/**
 * A/B test result
 */
export interface ABTestResult {
  /** Test ID */
  id: string;
  /** Test name */
  name: string;
  /** What's being tested */
  test_type: "resume" | "cover_letter" | "subject_line" | "outreach_template";
  /** Variant A description */
  variant_a: {
    name: string;
    description: string;
    sample_size: number;
    conversion_rate: number;
  };
  /** Variant B description */
  variant_b: {
    name: string;
    description: string;
    sample_size: number;
    conversion_rate: number;
  };
  /** Statistical significance */
  significance: number;
  /** Winner (if determined) */
  winner: "a" | "b" | "none" | "inconclusive";
  /** Test status */
  status: "running" | "completed" | "stopped";
  /** Start date */
  started_at: string;
  /** End date */
  ended_at: string | null;
}

/**
 * Skills gap analysis
 */
export interface SkillsAnalysis {
  /** Most requested skills in target jobs */
  in_demand_skills: Array<{
    skill: string;
    demand_count: number;
    user_has: boolean;
    proficiency: string | null;
  }>;
  /** Skills user has that are rarely requested */
  underutilized_skills: Array<{
    skill: string;
    proficiency: string;
    match_count: number;
  }>;
  /** Recommended skills to learn */
  recommended_skills: Array<{
    skill: string;
    reason: string;
    resources: string[];
  }>;
}

/**
 * Timing analysis
 */
export interface TimingAnalysis {
  /** Best days to apply */
  best_days: Array<{
    day: string;
    response_rate: number;
    sample_size: number;
  }>;
  /** Best times to apply */
  best_times: Array<{
    hour: number;
    response_rate: number;
    sample_size: number;
  }>;
  /** Average time to response by company size */
  response_time_by_company_size: Array<{
    size: string;
    avg_days: number;
  }>;
  /** Optimal follow-up timing */
  optimal_follow_up_days: number;
}

/**
 * AI cost tracking
 */
export interface AICostData {
  /** Total cost this period */
  total_cost: number;
  /** Cost by model */
  by_model: Array<{
    model: string;
    cost: number;
    requests: number;
    tokens_used: number;
  }>;
  /** Cost by feature */
  by_feature: Array<{
    feature: string;
    cost: number;
    requests: number;
  }>;
  /** Daily cost trend */
  daily_trend: Array<{
    date: string;
    cost: number;
  }>;
  /** Projected monthly cost */
  projected_monthly: number;
}

/**
 * Dashboard summary metrics
 */
export interface DashboardMetrics {
  /** Jobs discovered today */
  jobs_today: number;
  jobs_today_change: number;
  /** Pending reviews */
  pending_reviews: number;
  pending_reviews_change: number;
  /** Active applications */
  active_applications: number;
  active_applications_change: number;
  /** Interviews this week */
  interviews_this_week: number;
  interviews_this_week_change: number;
  /** Response rate */
  response_rate: number;
  response_rate_change: number;
  /** Average match score */
  avg_match_score: number;
  avg_match_score_change: number;
}

/**
 * Report configuration
 */
export interface ReportConfig {
  /** Report ID */
  id: string;
  /** Report name */
  name: string;
  /** Report type */
  type: "weekly_summary" | "monthly_summary" | "custom";
  /** Sections to include */
  sections: string[];
  /** Delivery schedule */
  schedule: "daily" | "weekly" | "monthly" | "manual";
  /** Email recipients */
  recipients: string[];
  /** Last generated */
  last_generated_at: string | null;
}
