import type {
  GeneralSettings,
  AIModelSettings,
  APIKey,
  AutomationSettings,
  ScoringSettings,
  JobSource,
  ScheduleItem,
  EmailSettings,
  FeatureFlag,
} from "./types"

export const mockGeneralSettings: GeneralSettings = {
  displayName: "Alex Johnson",
  email: "alex@example.com",
  timezone: "America/Los_Angeles",
  language: "en",
  dateFormat: "MM/DD/YYYY",
  theme: "system",
}

export const mockAIModelSettings: AIModelSettings = {
  defaultModel: "claude-4",
  temperature: 0.7,
  maxTokens: 4096,
  streamResponses: true,
  fallbackModel: "gpt-4o",
}

export const mockAPIKeys: APIKey[] = [
  {
    id: "1",
    provider: "anthropic",
    maskedKey: "sk-ant-••••••••••••••1234",
    status: "active",
    lastValidated: new Date("2026-03-10T14:30:00"),
  },
  {
    id: "2",
    provider: "openai",
    maskedKey: "sk-••••••••••••••5678",
    status: "active",
    lastValidated: new Date("2026-03-08T09:15:00"),
  },
  {
    id: "3",
    provider: "google",
    maskedKey: "",
    status: "not_set",
  },
]

export const mockAutomationSettings: AutomationSettings = {
  autoApplyEnabled: false,
  scoreThreshold: 75,
  confidenceThreshold: 0.8,
  riskThreshold: 0.3,
  cooldownDelay: "30min",
  dailyLimits: {
    applications: 25,
    outreach: 15,
    easyApply: 50,
  },
  operatingMode: "approval_required",
  dreamCompanies: ["Google", "Stripe", "Vercel", "Linear", "Notion"],
  blacklist: ["Acme Corp", "Spam Inc"],
}

export const mockScoringSettings: ScoringSettings = {
  weights: [
    { id: "1", label: "Skill Match", value: 25, color: "#6366F1" },
    { id: "2", label: "Experience Fit", value: 20, color: "#8B5CF6" },
    { id: "3", label: "Salary Range", value: 15, color: "#EC4899" },
    { id: "4", label: "Location", value: 10, color: "#F43F5E" },
    { id: "5", label: "Company Rating", value: 10, color: "#F97316" },
    { id: "6", label: "Growth Potential", value: 8, color: "#EAB308" },
    { id: "7", label: "Culture Fit", value: 7, color: "#22C55E" },
    { id: "8", label: "Benefits", value: 5, color: "#06B6D4" },
  ],
  bonusRules: [
    { id: "1", condition: "Company Rating", field: "glassdoor_rating", operator: ">", value: "4.0", bonus: 5, enabled: true },
    { id: "2", condition: "Company Size", field: "employee_count", operator: "<", value: "200", bonus: 3, enabled: true },
    { id: "3", condition: "Remote Work", field: "remote", operator: "=", value: "true", bonus: 5, enabled: true },
    { id: "4", condition: "Visa Sponsorship", field: "visa_sponsor", operator: "=", value: "true", bonus: 10, enabled: false },
  ],
}

export const mockJobSources: JobSource[] = [
  { id: "1", name: "LinkedIn", enabled: true, rateLimit: 100, lastSync: new Date("2026-03-13T08:00:00") },
  { id: "2", name: "Indeed", enabled: true, rateLimit: 150, lastSync: new Date("2026-03-13T07:30:00") },
  { id: "3", name: "Glassdoor", enabled: true, rateLimit: 80, lastSync: new Date("2026-03-13T06:00:00") },
  { id: "4", name: "AngelList", enabled: false, rateLimit: 50 },
  { id: "5", name: "Wellfound", enabled: true, rateLimit: 60, lastSync: new Date("2026-03-12T22:00:00") },
  { id: "6", name: "Hacker News Jobs", enabled: true, rateLimit: 30, lastSync: new Date("2026-03-13T09:00:00") },
]

export const mockSchedules: ScheduleItem[] = [
  { id: "1", name: "Morning Discovery", type: "discovery", frequency: "daily", time: "08:00", enabled: true, lastRun: new Date("2026-03-13T08:00:00"), nextRun: new Date("2026-03-14T08:00:00") },
  { id: "2", name: "Evening Apply Batch", type: "apply", frequency: "daily", time: "18:00", enabled: true, lastRun: new Date("2026-03-12T18:00:00"), nextRun: new Date("2026-03-13T18:00:00") },
  { id: "3", name: "Weekly Outreach", type: "outreach", frequency: "weekly", days: ["Monday", "Wednesday"], time: "10:00", enabled: true, lastRun: new Date("2026-03-11T10:00:00"), nextRun: new Date("2026-03-17T10:00:00") },
  { id: "4", name: "Source Sync", type: "sync", frequency: "hourly", enabled: true, lastRun: new Date("2026-03-13T09:00:00"), nextRun: new Date("2026-03-13T10:00:00") },
]

export const mockEmailSettings: EmailSettings = {
  defaultSignature: "Best regards,\nAlex Johnson",
  replyTo: "alex@example.com",
  sendCopyToSelf: true,
  trackOpens: true,
  trackClicks: false,
  templates: [
    { id: "1", name: "Follow Up", subject: "Following up on my application", body: "Hi {{name}},\n\nI wanted to follow up on my application for the {{position}} role...", type: "follow_up" },
    { id: "2", name: "Thank You", subject: "Thank you for your time", body: "Hi {{name}},\n\nThank you for taking the time to speak with me about...", type: "thank_you" },
    { id: "3", name: "Cold Outreach", subject: "Interested in {{company}}", body: "Hi {{name}},\n\nI came across your profile and...", type: "cold_outreach" },
  ],
}

export const mockFeatureFlags: FeatureFlag[] = [
  { id: "1", name: "AI Resume Tailoring", description: "Automatically tailor resumes based on job descriptions", enabled: true },
  { id: "2", name: "Smart Follow-ups", description: "AI-powered follow-up email suggestions", enabled: true },
  { id: "3", name: "Interview Prep", description: "AI mock interviews and preparation", enabled: true, beta: true },
  { id: "4", name: "Salary Negotiation", description: "AI-assisted salary negotiation coaching", enabled: false, beta: true },
  { id: "5", name: "Network Mapping", description: "Visualize your professional network connections", enabled: false },
  { id: "6", name: "Company Insights", description: "Deep company research and culture analysis", enabled: true },
  { id: "7", name: "Application Analytics", description: "Advanced analytics on your job search", enabled: true },
  { id: "8", name: "Browser Extension", description: "One-click job saving from any site", enabled: false, beta: true },
]

// Mock top jobs for live preview in scoring
export const mockTopJobs = [
  { id: "1", title: "Senior Frontend Engineer", company: "Stripe", currentScore: 92 },
  { id: "2", title: "Staff Engineer", company: "Vercel", currentScore: 89 },
  { id: "3", title: "Tech Lead", company: "Linear", currentScore: 87 },
  { id: "4", title: "Senior SWE", company: "Notion", currentScore: 85 },
  { id: "5", title: "Principal Engineer", company: "Figma", currentScore: 83 },
]
