import type {
  FunnelNode,
  FunnelLink,
  ConversionRow,
  SourceData,
  DailySpending,
  TaskSpending,
  RejectionData,
  SkillDemand,
  ABTest,
  Goal,
  TimingData,
  Report,
} from "./types"

export const funnelNodes: FunnelNode[] = [
  { id: "discovered", name: "Discovered", value: 1247, color: "hsl(var(--chart-1))" },
  { id: "scored", name: "Scored ≥60", value: 423, color: "hsl(230, 80%, 60%)" },
  { id: "generated", name: "Generated", value: 156, color: "hsl(210, 80%, 55%)" },
  { id: "applied", name: "Applied", value: 89, color: "hsl(180, 70%, 50%)" },
  { id: "response", name: "Response", value: 34, color: "hsl(150, 70%, 45%)" },
  { id: "interview", name: "Interview", value: 12, color: "hsl(140, 75%, 40%)" },
  { id: "offer", name: "Offer", value: 3, color: "hsl(130, 80%, 35%)" },
]

export const funnelLinks: FunnelLink[] = [
  { source: "discovered", target: "scored", value: 423 },
  { source: "scored", target: "generated", value: 156 },
  { source: "generated", target: "applied", value: 89 },
  { source: "applied", target: "response", value: 34 },
  { source: "response", target: "interview", value: 12 },
  { source: "interview", target: "offer", value: 3 },
]

export const conversionRows: ConversionRow[] = [
  { from: "Discovered", to: "Scored ≥60", count: 423, rate: 33.9, changeVsLastPeriod: 5.2 },
  { from: "Scored ≥60", to: "Generated", count: 156, rate: 36.9, changeVsLastPeriod: -2.1 },
  { from: "Generated", to: "Applied", count: 89, rate: 57.1, changeVsLastPeriod: 8.4 },
  { from: "Applied", to: "Response", count: 34, rate: 38.2, changeVsLastPeriod: 12.3 },
  { from: "Response", to: "Interview", count: 12, rate: 35.3, changeVsLastPeriod: -4.7 },
  { from: "Interview", to: "Offer", count: 3, rate: 25.0, changeVsLastPeriod: 0 },
]

export const sourceData: SourceData[] = [
  { source: "LinkedIn", logo: "LI", jobsFound: 542, scored80Plus: 87, applied: 34, interviews: 5, scoreAvg: 72, costPerInterview: 12.4 },
  { source: "Google Jobs", logo: "G", jobsFound: 324, scored80Plus: 52, applied: 21, interviews: 3, scoreAvg: 68, costPerInterview: 15.2 },
  { source: "Indeed", logo: "IN", jobsFound: 198, scored80Plus: 28, applied: 15, interviews: 2, scoreAvg: 65, costPerInterview: 18.7 },
  { source: "Wellfound", logo: "WF", jobsFound: 112, scored80Plus: 31, applied: 12, interviews: 1, scoreAvg: 74, costPerInterview: 22.1 },
  { source: "Y Combinator", logo: "YC", jobsFound: 71, scored80Plus: 24, applied: 7, interviews: 1, scoreAvg: 81, costPerInterview: 8.9 },
]

export const dailySpending: DailySpending[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toISOString().split("T")[0],
    anthropic: Math.random() * 3 + 1,
    openai: Math.random() * 2 + 0.5,
    google: Math.random() * 1 + 0.2,
    total: 0,
  }
}).map(d => ({ ...d, total: d.anthropic + d.openai + d.google }))

export const taskSpending: TaskSpending[] = [
  { task: "Resume Gen", amount: 42.5, percentage: 35, color: "hsl(var(--chart-1))" },
  { task: "Cover Letter", amount: 28.3, percentage: 23, color: "hsl(var(--chart-2))" },
  { task: "Scoring", amount: 24.1, percentage: 20, color: "hsl(var(--chart-3))" },
  { task: "Copilot", amount: 18.6, percentage: 15, color: "hsl(var(--chart-4))" },
  { task: "Other", amount: 8.5, percentage: 7, color: "hsl(var(--chart-5))" },
]

export const rejectionData: RejectionData[] = [
  { reason: "No response", count: 45, percentage: 45 },
  { reason: "Position filled", count: 18, percentage: 18 },
  { reason: "Experience mismatch", count: 15, percentage: 15 },
  { reason: "Salary mismatch", count: 12, percentage: 12 },
  { reason: "Location/remote", count: 7, percentage: 7 },
  { reason: "Other", count: 3, percentage: 3 },
]

export const skillDemand: SkillDemand[] = [
  { skill: "React", demandScore: 92, yourLevel: 90, gap: 2, trend: "stable" },
  { skill: "TypeScript", demandScore: 88, yourLevel: 85, gap: 3, trend: "up" },
  { skill: "Node.js", demandScore: 75, yourLevel: 80, gap: -5, trend: "stable" },
  { skill: "AWS", demandScore: 70, yourLevel: 55, gap: 15, trend: "up" },
  { skill: "Python", demandScore: 65, yourLevel: 40, gap: 25, trend: "up" },
  { skill: "GraphQL", demandScore: 45, yourLevel: 70, gap: -25, trend: "down" },
]

export const abTests: ABTest[] = [
  {
    id: "1",
    name: "Cover Letter Tone",
    variant: "Formal vs Casual",
    metric: "Response Rate",
    control: 32,
    treatment: 41,
    improvement: 28.1,
    significance: 94,
    status: "winner",
  },
  {
    id: "2",
    name: "Resume Length",
    variant: "1 page vs 2 pages",
    metric: "Interview Rate",
    control: 18,
    treatment: 15,
    improvement: -16.7,
    significance: 87,
    status: "loser",
  },
  {
    id: "3",
    name: "Application Time",
    variant: "Morning vs Evening",
    metric: "Response Rate",
    control: 28,
    treatment: 31,
    improvement: 10.7,
    significance: 72,
    status: "running",
  },
]

export const goals: Goal[] = [
  {
    id: "1",
    title: "5 Interviews This Month",
    type: "interviews",
    current: 3,
    target: 5,
    deadline: "2024-02-29",
    pace: "on-track",
    copilotAdvice: "You're on pace! Consider following up with Stripe and Linear - both showed strong interest.",
  },
  {
    id: "2",
    title: "Apply to 20 Jobs",
    type: "applications",
    current: 14,
    target: 20,
    deadline: "2024-02-29",
    pace: "behind",
    copilotAdvice: "You need 6 more applications. I've identified 8 high-scoring jobs ready to apply.",
  },
  {
    id: "3",
    title: "Get 1 Offer",
    type: "offers",
    current: 0,
    target: 1,
    deadline: "2024-03-15",
    pace: "on-track",
    copilotAdvice: "Focus on interview prep for your upcoming Vercel and Notion interviews.",
  },
]

export const timingData: TimingData[] = [
  { hour: 9, day: "Mon", responseRate: 42, applications: 12 },
  { hour: 10, day: "Mon", responseRate: 45, applications: 18 },
  { hour: 11, day: "Mon", responseRate: 38, applications: 15 },
  { hour: 14, day: "Tue", responseRate: 52, applications: 22 },
  { hour: 15, day: "Tue", responseRate: 48, applications: 20 },
  { hour: 10, day: "Wed", responseRate: 44, applications: 14 },
  { hour: 11, day: "Wed", responseRate: 41, applications: 16 },
  { hour: 9, day: "Thu", responseRate: 39, applications: 11 },
  { hour: 10, day: "Thu", responseRate: 47, applications: 19 },
  { hour: 14, day: "Fri", responseRate: 35, applications: 8 },
]

export const reports: Report[] = [
  {
    id: "1",
    name: "Weekly Summary",
    type: "weekly",
    lastGenerated: "2024-02-18",
    schedule: "Every Monday 9am",
    recipients: ["you@email.com"],
  },
  {
    id: "2",
    name: "Monthly Performance",
    type: "monthly",
    lastGenerated: "2024-02-01",
    schedule: "1st of month",
    recipients: ["you@email.com", "mentor@email.com"],
  },
]

export const aiCostStats = {
  thisMonth: 122.0,
  projected: 156.5,
  costPerApplication: 1.37,
  mostExpensiveTask: "Resume Generation",
}
