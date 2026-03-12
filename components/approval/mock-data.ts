import type {
  ApprovalItem,
  ResumeContent,
  CoverLetterContent,
  OutreachContent,
  JobRequirement,
  QAReport,
} from "./types"

export const mockApprovalItems: ApprovalItem[] = [
  {
    id: "1",
    type: "resume",
    priority: "dream",
    status: "pending",
    jobId: "job-1",
    jobTitle: "Senior Frontend Engineer",
    company: "Stripe",
    companyLogo: "S",
    qualityScore: 94,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    variant: "A",
    template: "Modern Professional",
  },
  {
    id: "2",
    type: "cover_letter",
    priority: "dream",
    status: "pending",
    jobId: "job-1",
    jobTitle: "Senior Frontend Engineer",
    company: "Stripe",
    companyLogo: "S",
    qualityScore: 91,
    createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
    template: "Compelling Narrative",
  },
  {
    id: "3",
    type: "outreach",
    priority: "high",
    status: "pending",
    jobId: "job-2",
    jobTitle: "Staff Engineer",
    company: "Vercel",
    companyLogo: "V",
    qualityScore: 88,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "4",
    type: "resume",
    priority: "high",
    status: "pending",
    jobId: "job-3",
    jobTitle: "Engineering Manager",
    company: "Linear",
    companyLogo: "L",
    qualityScore: 85,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    variant: "B",
    template: "Executive Focus",
  },
  {
    id: "5",
    type: "email",
    priority: "medium",
    status: "pending",
    jobId: "job-4",
    jobTitle: "Principal Engineer",
    company: "Notion",
    companyLogo: "N",
    qualityScore: 82,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "6",
    type: "cover_letter",
    priority: "medium",
    status: "pending",
    jobId: "job-5",
    jobTitle: "Senior Software Engineer",
    company: "Figma",
    companyLogo: "F",
    qualityScore: 79,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    template: "Technical Deep Dive",
  },
  {
    id: "7",
    type: "answer",
    priority: "high",
    status: "pending",
    jobId: "job-6",
    jobTitle: "Tech Lead",
    company: "Airbnb",
    companyLogo: "A",
    qualityScore: 90,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "8",
    type: "outreach",
    priority: "medium",
    status: "pending",
    jobId: "job-7",
    jobTitle: "Senior Engineer",
    company: "Spotify",
    companyLogo: "S",
    qualityScore: 76,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

export const mockResumeContent: ResumeContent = {
  sections: [
    {
      name: "Summary",
      content:
        "Senior Frontend Engineer with 8+ years of experience building high-performance, accessible web applications. Specialized in React, TypeScript, and design systems. Led frontend architecture for products serving 10M+ users at scale.",
      diffType: "modified",
    },
    {
      name: "Experience",
      content: `**Senior Frontend Engineer** | TechCorp Inc. | 2021 - Present
• Led development of design system used by 50+ engineers, reducing UI inconsistencies by 80%
• Architected real-time collaboration features using WebSockets, serving 100K concurrent users
• Mentored 5 junior engineers and established frontend best practices

**Frontend Engineer** | StartupXYZ | 2018 - 2021
• Built checkout flow that increased conversion by 23%
• Implemented accessibility improvements achieving WCAG 2.1 AA compliance
• Reduced bundle size by 40% through code splitting and lazy loading`,
      diffType: "unchanged",
    },
    {
      name: "Skills",
      content:
        "React, TypeScript, Next.js, GraphQL, Node.js, AWS, Figma, Design Systems, Performance Optimization, Accessibility (WCAG), Team Leadership",
      diffType: "modified",
    },
    {
      name: "Stripe-Specific Additions",
      content: `• Experience with payment processing systems and PCI compliance
• Built financial dashboards with real-time data visualization
• Familiar with Stripe's design language and component patterns`,
      diffType: "added",
    },
  ],
}

export const mockJobRequirements: JobRequirement[] = [
  { text: "8+ years of frontend development experience", type: "required", matched: true },
  { text: "Expert-level React and TypeScript skills", type: "required", matched: true },
  { text: "Experience with design systems at scale", type: "required", matched: true },
  { text: "Strong understanding of web performance optimization", type: "required", matched: true },
  { text: "Experience with payment/fintech systems", type: "required", matched: true },
  { text: "Track record of mentoring engineers", type: "preferred", matched: true },
  { text: "Experience with WebGL or canvas rendering", type: "preferred", matched: false },
  { text: "Contributions to open source projects", type: "preferred", matched: false },
  { text: "Experience with Figma plugin development", type: "preferred", matched: false },
]

export const mockQAReport: QAReport = {
  hallucinations: [
    {
      issue: 'Claim of "10M+ users" could not be verified against base resume',
      severity: "warning",
    },
  ],
  factChecks: [
    { claim: "8+ years experience", verified: true },
    { claim: "Led team of 5 engineers", verified: true },
    { claim: "WCAG 2.1 AA compliance work", verified: true },
    { claim: "Payment processing experience", verified: false },
  ],
  toneAnalysis: [
    { aspect: "Professionalism", score: 95 },
    { aspect: "Confidence", score: 88 },
    { aspect: "Specificity", score: 82 },
    { aspect: "Authenticity", score: 90 },
  ],
  overallScore: 89,
}

export const mockCoverLetterContent: CoverLetterContent = {
  content: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Frontend Engineer position at Stripe. With over 8 years of experience building high-performance web applications and a deep passion for creating exceptional developer experiences, I believe I would be a valuable addition to your team.

At TechCorp Inc., I led the development of a design system that transformed how our 50+ engineers build user interfaces. This experience taught me the importance of creating scalable, accessible components that empower teams to move fast while maintaining quality—values I know Stripe holds dear.

What excites me most about Stripe is your commitment to building infrastructure that powers the internet economy. Having worked on payment processing features and financial dashboards, I understand the unique challenges of building trust through reliable, intuitive interfaces. I am particularly drawn to Stripe's focus on developer experience and believe my background in creating developer tools would translate well to your team.

I would welcome the opportunity to discuss how my experience aligns with Stripe's mission to increase the GDP of the internet.

Best regards,
[Your Name]`,
  wordCount: 187,
  personalizationHighlights: [
    { start: 89, end: 95, text: "Stripe" },
    { start: 456, end: 462, text: "Stripe" },
    { start: 678, end: 684, text: "Stripe" },
  ],
}

export const mockOutreachContent: OutreachContent = {
  contactName: "Sarah Chen",
  contactTitle: "Engineering Manager",
  contactCompany: "Vercel",
  channel: "linkedin",
  warmth: "warm",
  message: `Hi Sarah,

I noticed we both spoke at React Summit last year—your talk on edge rendering was fantastic! I've been following Vercel's work on the App Router and am genuinely impressed by the developer experience improvements.

I'm currently exploring senior engineering opportunities and saw the Staff Engineer role on your team. Given my background in performance optimization and design systems, I think there could be a great fit.

Would you be open to a brief chat about the team and role? I'd love to hear more about what you're building.

Best,
[Name]`,
  characterCount: 498,
  personalizationHooks: [
    "React Summit connection",
    "Edge rendering talk reference",
    "App Router mention",
  ],
  autoSend: false,
}
