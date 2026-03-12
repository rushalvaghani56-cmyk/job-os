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
  | "ghosted"

export type SeniorityLevel =
  | "intern"
  | "entry"
  | "mid"
  | "senior"
  | "staff"
  | "principal"
  | "director"
  | "vp"
  | "c_level"

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "contract"
  | "temporary"

export type LocationType =
  | "remote"
  | "remote_tz"
  | "hybrid_flex"
  | "hybrid_fixed"
  | "onsite"

export type JobSource =
  | "linkedin"
  | "indeed"
  | "glassdoor"
  | "company_site"
  | "wellfound"
  | "ycombinator"

export type DecisionType = "auto" | "review" | "skip"

export interface Job {
  id: string
  title: string
  company: {
    name: string
    logo?: string
    isDreamCompany?: boolean
  }
  score: number
  confidence: number
  status: JobStatus
  location: string
  locationType: LocationType
  seniority: SeniorityLevel
  employmentType: EmploymentType
  salary?: {
    min: number
    max: number
    currency: string
    estimated?: boolean
  }
  postedAt: Date
  source: JobSource
  skills: {
    matched: string[]
    missing: string[]
  }
  decision: DecisionType
  hasContent: boolean
  isPotentialScam?: boolean
  isBlacklisted?: boolean
}

export interface JobFilters {
  scoreRange: [number, number]
  confidenceRange: [number, number]
  status: JobStatus[]
  seniority: SeniorityLevel[]
  employmentType: EmploymentType[]
  locationType: LocationType[]
  locations: string[]
  companies: string[]
  salaryRange: [number, number]
  salaryCurrency: string
  sources: JobSource[]
  dateRange: { from?: Date; to?: Date }
  dreamCompanyOnly: boolean
  hasContentOnly: boolean
  showBlacklisted: boolean
  showPotentialScam: boolean
}

export type ViewMode = "table" | "cards" | "compact"

export type SortOption =
  | "score_desc"
  | "date_desc"
  | "company_asc"
  | "salary_desc"
  | "status"

// Extended types for job detail page
export type TimelineEventType =
  | "discovered"
  | "scored"
  | "generated"
  | "reviewed"
  | "approved"
  | "submitted"
  | "confirmation"
  | "follow_up"
  | "reply"
  | "status_change"
  | "interview"
  | "outcome"
  | "note"

export type TimelineActor = "system" | "user" | "ai"

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  timestamp: Date
  actor: TimelineActor
  title: string
  detail?: string
}

export type DocumentType = "resume_v1" | "resume_v2" | "cover_letter" | "portfolio" | "references"

export interface JobDocument {
  id: string
  filename: string
  type: DocumentType
  qualityScore: number
  variant?: "A" | "B"
  template: string
  createdAt: Date
  versions: { version: number; date: Date }[]
}

export interface ScoreBreakdown {
  dimension: string
  score: number
  maxScore: number
}

export interface Contact {
  id: string
  name: string
  title: string
  company: string
  linkedinUrl: string
  warmth: "cold" | "warm" | "hot"
  channel: "linkedin" | "email" | "referral"
  status: "not_contacted" | "contacted" | "replied" | "connected"
  lastContact?: Date
  nextFollowUp?: Date
}

export interface Message {
  id: string
  contactId: string
  content: string
  direction: "sent" | "received"
  timestamp: Date
  channel: "linkedin" | "email"
}

export interface CompanyInfo {
  description: string
  industry: string
  size: string
  stage: string
  hq: string
  founded: number
  funding?: {
    lastRound: string
    totalRaised: string
    investors: string[]
  }
  culture?: {
    glassdoorRating: number
    workLifeBalance: number
    pros: string[]
    cons: string[]
  }
  techStack: string[]
  news: { title: string; date: Date; url: string }[]
  healthSignals: {
    employeeGrowth: number
    glassdoorTrend: "up" | "down" | "stable"
    layoffSignals: boolean
  }
}

export interface JobDetail extends Job {
  description: string
  requirements: string[]
  preferredSkills: string[]
  matchedRequirements: string[]
  missingRequirements: string[]
  matchedPreferred: string[]
  missingPreferred: string[]
  aiSummary: string
  riskFactors: string[]
  recommendedAction: string
  scoreBreakdown: ScoreBreakdown[]
  bonusPoints: number
  marketSalaryContext: string
  interviewProbability: number
  contentQuality?: { resumeScore: number; coverLetterScore: number }
  documents: JobDocument[]
  timeline: TimelineEvent[]
  contacts: Contact[]
  messages: Message[]
  companyInfo: CompanyInfo
  applicationHistory: { jobId: string; title: string; date: Date; outcome: string }[]
  atsType?: string
  externalUrl: string
}
