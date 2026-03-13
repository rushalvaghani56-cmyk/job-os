// Settings Types

export interface GeneralSettings {
  displayName: string
  email: string
  timezone: string
  language: string
  dateFormat: string
  theme: "light" | "dark" | "system"
}

export interface AIModelSettings {
  defaultModel: string
  temperature: number
  maxTokens: number
  streamResponses: boolean
  fallbackModel: string
}

export interface APIKey {
  id: string
  provider: "anthropic" | "openai" | "google"
  maskedKey: string
  status: "active" | "invalid" | "not_set"
  lastValidated?: Date
}

export interface AutomationSettings {
  autoApplyEnabled: boolean
  scoreThreshold: number
  confidenceThreshold: number
  riskThreshold: number
  cooldownDelay: string
  dailyLimits: {
    applications: number
    outreach: number
    easyApply: number
  }
  operatingMode: "manual" | "approval_required" | "full_auto"
  dreamCompanies: string[]
  blacklist: string[]
}

export interface ScoringWeight {
  id: string
  label: string
  value: number
  color: string
}

export interface BonusRule {
  id: string
  condition: string
  field: string
  operator: ">" | "<" | "=" | ">=" | "<="
  value: string
  bonus: number
  enabled: boolean
}

export interface ScoringSettings {
  weights: ScoringWeight[]
  bonusRules: BonusRule[]
}

export interface JobSource {
  id: string
  name: string
  enabled: boolean
  apiKey?: string
  rateLimit: number
  lastSync?: Date
}

export interface SourceSettings {
  sources: JobSource[]
}

export interface ScheduleItem {
  id: string
  name: string
  type: "discovery" | "apply" | "outreach" | "sync"
  frequency: "hourly" | "daily" | "weekly" | "custom"
  time?: string
  days?: string[]
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
}

export interface ScheduleSettings {
  schedules: ScheduleItem[]
}

export interface EmailSettings {
  defaultSignature: string
  replyTo: string
  sendCopyToSelf: boolean
  trackOpens: boolean
  trackClicks: boolean
  templates: EmailTemplate[]
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: "follow_up" | "thank_you" | "cold_outreach" | "referral"
}

export interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  beta?: boolean
}

export interface FeatureFlagSettings {
  flags: FeatureFlag[]
}
