export interface FunnelNode {
  id: string
  name: string
  value: number
  color: string
}

export interface FunnelLink {
  source: string
  target: string
  value: number
}

export interface ConversionRow {
  from: string
  to: string
  count: number
  rate: number
  changeVsLastPeriod: number
}

export interface SourceData {
  source: string
  logo: string
  jobsFound: number
  scored80Plus: number
  applied: number
  interviews: number
  scoreAvg: number
  costPerInterview: number
}

export interface DailySpending {
  date: string
  anthropic: number
  openai: number
  google: number
  total: number
}

export interface TaskSpending {
  task: string
  amount: number
  percentage: number
  color: string
}

export interface RejectionData {
  reason: string
  count: number
  percentage: number
}

export interface SkillDemand {
  skill: string
  demandScore: number
  yourLevel: number
  gap: number
  trend: "up" | "down" | "stable"
}

export interface ABTest {
  id: string
  name: string
  variant: string
  metric: string
  control: number
  treatment: number
  improvement: number
  significance: number
  status: "running" | "winner" | "loser" | "inconclusive"
}

export interface Goal {
  id: string
  title: string
  type: "interviews" | "applications" | "responses" | "offers"
  current: number
  target: number
  deadline: string
  pace: "on-track" | "behind" | "ahead"
  copilotAdvice: string
}

export interface TimingData {
  hour: number
  day: string
  responseRate: number
  applications: number
}

export interface Report {
  id: string
  name: string
  type: "weekly" | "monthly" | "custom"
  lastGenerated: string
  schedule: string
  recipients: string[]
}

export type DateRange = "today" | "7d" | "30d" | "90d" | "all" | "custom"
