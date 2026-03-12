import type { JobDetail, TimelineEvent, JobDocument, Contact, Message, ScoreBreakdown, CompanyInfo } from "./types"

const scoreBreakdown: ScoreBreakdown[] = [
  { dimension: "Skills Match", score: 9, maxScore: 10 },
  { dimension: "Experience Level", score: 8, maxScore: 10 },
  { dimension: "Location Fit", score: 10, maxScore: 10 },
  { dimension: "Salary Alignment", score: 7, maxScore: 10 },
  { dimension: "Company Culture", score: 8, maxScore: 10 },
  { dimension: "Growth Potential", score: 9, maxScore: 10 },
  { dimension: "Tech Stack", score: 8, maxScore: 10 },
  { dimension: "Role Clarity", score: 7, maxScore: 10 },
]

const timeline: TimelineEvent[] = [
  { id: "1", type: "discovered", timestamp: new Date("2026-03-01T09:00:00"), actor: "system", title: "Job discovered", detail: "Found via LinkedIn Jobs API scan" },
  { id: "2", type: "scored", timestamp: new Date("2026-03-01T09:01:00"), actor: "ai", title: "Initial scoring complete", detail: "Score: 85/100 with 92% confidence" },
  { id: "3", type: "generated", timestamp: new Date("2026-03-01T09:05:00"), actor: "ai", title: "Content generated", detail: "Resume V1, Cover Letter variants A/B created" },
  { id: "4", type: "reviewed", timestamp: new Date("2026-03-02T14:30:00"), actor: "user", title: "Reviewed by you", detail: "Approved resume, selected cover letter variant A" },
  { id: "5", type: "approved", timestamp: new Date("2026-03-02T14:32:00"), actor: "user", title: "Approved for submission" },
  { id: "6", type: "submitted", timestamp: new Date("2026-03-02T14:35:00"), actor: "system", title: "Application submitted", detail: "Via Greenhouse ATS" },
  { id: "7", type: "confirmation", timestamp: new Date("2026-03-02T14:36:00"), actor: "system", title: "Confirmation received", detail: "Application ID: GH-2024-8834" },
  { id: "8", type: "follow_up", timestamp: new Date("2026-03-09T10:00:00"), actor: "ai", title: "Follow-up sent", detail: "LinkedIn message to Sarah Chen (Hiring Manager)" },
  { id: "9", type: "reply", timestamp: new Date("2026-03-10T16:45:00"), actor: "system", title: "Reply received", detail: "Sarah Chen responded positively" },
  { id: "10", type: "status_change", timestamp: new Date("2026-03-11T09:00:00"), actor: "system", title: "Status updated", detail: "Moved to Interview stage" },
  { id: "11", type: "interview", timestamp: new Date("2026-03-13T14:00:00"), actor: "user", title: "Phone screen scheduled", detail: "March 15, 2026 at 2:00 PM PST" },
  { id: "12", type: "note", timestamp: new Date("2026-03-12T11:30:00"), actor: "user", title: "Personal note added", detail: "Remember to ask about remote work policy" },
]

const documents: JobDocument[] = [
  { id: "d1", filename: "Resume_SeniorFE_Stripe_v1.pdf", type: "resume_v1", qualityScore: 94, template: "Modern Tech", createdAt: new Date("2026-03-01"), versions: [{ version: 1, date: new Date("2026-03-01") }] },
  { id: "d2", filename: "Resume_SeniorFE_Stripe_v2.pdf", type: "resume_v2", qualityScore: 91, template: "Classic Pro", createdAt: new Date("2026-03-01"), versions: [{ version: 1, date: new Date("2026-03-01") }] },
  { id: "d3", filename: "CoverLetter_Stripe_A.pdf", type: "cover_letter", qualityScore: 89, variant: "A", template: "Concise Impact", createdAt: new Date("2026-03-01"), versions: [{ version: 1, date: new Date("2026-03-01") }, { version: 2, date: new Date("2026-03-02") }] },
  { id: "d4", filename: "CoverLetter_Stripe_B.pdf", type: "cover_letter", qualityScore: 87, variant: "B", template: "Story-driven", createdAt: new Date("2026-03-01"), versions: [{ version: 1, date: new Date("2026-03-01") }] },
]

const contacts: Contact[] = [
  { id: "c1", name: "Sarah Chen", title: "Engineering Manager", company: "Stripe", linkedinUrl: "https://linkedin.com/in/sarahchen", warmth: "warm", channel: "linkedin", status: "replied", lastContact: new Date("2026-03-10"), nextFollowUp: new Date("2026-03-17") },
  { id: "c2", name: "Michael Torres", title: "Senior Staff Engineer", company: "Stripe", linkedinUrl: "https://linkedin.com/in/mtorres", warmth: "cold", channel: "linkedin", status: "contacted", lastContact: new Date("2026-03-09") },
  { id: "c3", name: "Emily Watson", title: "Technical Recruiter", company: "Stripe", linkedinUrl: "https://linkedin.com/in/emilyw", warmth: "hot", channel: "email", status: "connected", lastContact: new Date("2026-03-11"), nextFollowUp: new Date("2026-03-14") },
]

const messages: Message[] = [
  { id: "m1", contactId: "c1", content: "Hi Sarah, I recently applied for the Senior Frontend Engineer position and wanted to reach out directly. I've been following Stripe's work on the new Elements redesign and would love to contribute to the team.", direction: "sent", timestamp: new Date("2026-03-09T10:00:00"), channel: "linkedin" },
  { id: "m2", contactId: "c1", content: "Hi! Thanks for reaching out. I saw your application and your experience looks great. Let me connect you with our recruiting team to set up a call.", direction: "received", timestamp: new Date("2026-03-10T16:45:00"), channel: "linkedin" },
  { id: "m3", contactId: "c2", content: "Hi Michael, I noticed we both worked with React at scale. Would love to hear about your experience at Stripe.", direction: "sent", timestamp: new Date("2026-03-09T10:30:00"), channel: "linkedin" },
  { id: "m4", contactId: "c3", content: "Emily, thank you for scheduling the phone screen! Looking forward to learning more about the role.", direction: "sent", timestamp: new Date("2026-03-11T09:15:00"), channel: "email" },
  { id: "m5", contactId: "c3", content: "You're welcome! I've sent over the calendar invite. Please let me know if you have any questions before the call.", direction: "received", timestamp: new Date("2026-03-11T09:45:00"), channel: "email" },
]

const companyInfo: CompanyInfo = {
  description: "Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size—from new startups to public companies—use our software to accept payments and manage their businesses online.",
  industry: "Financial Technology",
  size: "5,000-10,000 employees",
  stage: "Late Stage (Series I)",
  hq: "San Francisco, CA",
  founded: 2010,
  funding: {
    lastRound: "Series I ($600M)",
    totalRaised: "$2.3B",
    investors: ["Sequoia", "Andreessen Horowitz", "General Catalyst", "Founders Fund"],
  },
  culture: {
    glassdoorRating: 4.2,
    workLifeBalance: 3.8,
    pros: ["Great engineering culture", "Impactful work", "Smart colleagues", "Good compensation"],
    cons: ["Fast-paced can be stressful", "High expectations", "Some teams have long hours"],
  },
  techStack: ["React", "TypeScript", "Ruby", "Go", "Kubernetes", "AWS", "PostgreSQL", "GraphQL"],
  news: [
    { title: "Stripe launches new embedded finance platform", date: new Date("2026-02-28"), url: "#" },
    { title: "Stripe expands to 5 new countries in APAC", date: new Date("2026-02-15"), url: "#" },
    { title: "Q4 2025 results: 25% YoY payment volume growth", date: new Date("2026-01-30"), url: "#" },
  ],
  healthSignals: {
    employeeGrowth: 12,
    glassdoorTrend: "stable",
    layoffSignals: false,
  },
}

export const mockJobDetail: JobDetail = {
  id: "job-stripe-1",
  title: "Senior Frontend Engineer",
  company: {
    name: "Stripe",
    logo: "/logos/stripe.svg",
    isDreamCompany: true,
  },
  score: 85,
  confidence: 0.92,
  status: "interview",
  location: "San Francisco, CA",
  locationType: "hybrid_flex",
  seniority: "senior",
  employmentType: "full_time",
  salary: {
    min: 180000,
    max: 250000,
    currency: "USD",
    estimated: false,
  },
  postedAt: new Date("2026-02-28"),
  source: "linkedin",
  skills: {
    matched: ["React", "TypeScript", "GraphQL", "Node.js", "AWS"],
    missing: ["Ruby"],
  },
  decision: "auto",
  hasContent: true,
  description: `We're looking for a Senior Frontend Engineer to join our Developer Experience team. You'll work on Stripe's dashboard and developer tools, building interfaces that help millions of businesses manage their payments.

## What you'll do
- Build and maintain the Stripe Dashboard used by millions of businesses
- Develop new features for our developer documentation and API explorer
- Collaborate with designers and product managers to create delightful user experiences
- Mentor junior engineers and contribute to our engineering culture
- Drive technical decisions and architecture for frontend systems

## Requirements
- 5+ years of frontend development experience
- Expert knowledge of React and TypeScript
- Experience with GraphQL and REST APIs
- Strong understanding of web performance optimization
- Excellent communication and collaboration skills

## Nice to have
- Experience with Ruby on Rails
- Contributions to open source projects
- Experience in fintech or payments industry`,
  requirements: [
    "5+ years of frontend development experience",
    "Expert knowledge of React and TypeScript",
    "Experience with GraphQL and REST APIs",
    "Strong understanding of web performance optimization",
    "Excellent communication and collaboration skills",
  ],
  preferredSkills: ["Ruby on Rails", "Open source contributions", "Fintech experience"],
  matchedRequirements: [
    "5+ years of frontend development experience",
    "Expert knowledge of React and TypeScript",
    "Experience with GraphQL and REST APIs",
    "Strong understanding of web performance optimization",
    "Excellent communication and collaboration skills",
  ],
  missingRequirements: [],
  matchedPreferred: ["Open source contributions"],
  missingPreferred: ["Ruby on Rails", "Fintech experience"],
  aiSummary: "This is an excellent match for your profile. Your React and TypeScript expertise directly aligns with their core requirements, and your experience with GraphQL at your current role is exactly what they're looking for. The main risk is limited fintech background, but your strong technical skills should compensate. Recommend applying immediately given the dream company status.",
  riskFactors: ["No fintech experience", "Ruby on Rails preferred but not required", "Competitive position with many applicants"],
  recommendedAction: "Apply immediately - strong match with dream company",
  scoreBreakdown,
  bonusPoints: 5,
  marketSalaryContext: "This salary range is 15% above market median for Senior Frontend roles in SF Bay Area.",
  interviewProbability: 68,
  contentQuality: { resumeScore: 94, coverLetterScore: 89 },
  documents,
  timeline,
  contacts,
  messages,
  companyInfo,
  applicationHistory: [
    { jobId: "job-stripe-old-1", title: "Frontend Engineer", date: new Date("2025-06-15"), outcome: "No response" },
  ],
  atsType: "Greenhouse",
  externalUrl: "https://stripe.com/jobs/senior-frontend-engineer",
}
