export type ApprovalItemType = "resume" | "cover_letter" | "outreach" | "email" | "answer"

export type ApprovalPriority = "dream" | "high" | "medium"

export type ApprovalStatus = "pending" | "approved" | "rejected" | "submitted"

export interface ApprovalItem {
  id: string
  type: ApprovalItemType
  priority: ApprovalPriority
  status: ApprovalStatus
  jobId: string
  jobTitle: string
  company: string
  companyLogo?: string
  qualityScore: number
  createdAt: Date
  variant?: "A" | "B"
  template?: string
}

export interface ResumeContent {
  sections: {
    name: string
    content: string
    diffType?: "added" | "modified" | "unchanged"
  }[]
}

export interface CoverLetterContent {
  content: string
  wordCount: number
  personalizationHighlights: { start: number; end: number; text: string }[]
}

export interface OutreachContent {
  contactName: string
  contactTitle: string
  contactCompany: string
  channel: "linkedin" | "email"
  warmth: "cold" | "warm" | "hot"
  message: string
  characterCount: number
  personalizationHooks: string[]
  autoSend: boolean
}

export interface AnswerContent {
  question: string
  answer: string
  confidence: "high" | "medium" | "low"
  wordCount: number
  sources?: string[]
}

export interface JobRequirement {
  text: string
  type: "required" | "preferred"
  matched: boolean
}

export interface QAReport {
  hallucinations: { issue: string; severity: "warning" | "error" }[]
  factChecks: { claim: string; verified: boolean }[]
  toneAnalysis: { aspect: string; score: number }[]
  overallScore: number
}
