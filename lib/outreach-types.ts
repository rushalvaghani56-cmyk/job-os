export type WarmthLevel = "cold" | "warm" | "hot"

export type Channel = "linkedin-dm" | "inmail" | "email"

export type ContactStatus =
  | "draft"
  | "queued"
  | "sent"
  | "opened"
  | "replied"
  | "no-response"
  | "do-not-contact"

export type MessageStatus = "sent" | "opened" | "replied"

export interface Contact {
  id: string
  name: string
  title: string
  company: string
  avatarUrl?: string
  linkedinUrl?: string
  email?: string
  warmth: WarmthLevel
  channels: Channel[]
  status: ContactStatus
  lastActivityAt: Date
  nextFollowUp?: Date
  notes?: string
}

export interface Message {
  id: string
  contactId: string
  content: string
  sentAt: Date
  status: MessageStatus
  channel: Channel
  isOutgoing: boolean
}

export interface OutreachStats {
  sent: number
  openRate: number
  replyRate: number
  bestTemplate: string
  bestTiming: string
}

// Mock data for demonstration
export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Engineering Manager",
    company: "Stripe",
    warmth: "hot",
    channels: ["linkedin-dm", "email"],
    status: "replied",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 30),
    linkedinUrl: "https://linkedin.com/in/sarahchen",
    email: "sarah.chen@stripe.com",
  },
  {
    id: "2",
    name: "Michael Torres",
    title: "Senior Recruiter",
    company: "Vercel",
    warmth: "warm",
    channels: ["inmail"],
    status: "opened",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    nextFollowUp: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
    linkedinUrl: "https://linkedin.com/in/mtorres",
  },
  {
    id: "3",
    name: "Emily Watson",
    title: "Head of Talent",
    company: "Notion",
    warmth: "cold",
    channels: ["linkedin-dm"],
    status: "sent",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    linkedinUrl: "https://linkedin.com/in/emilyw",
  },
  {
    id: "4",
    name: "James Park",
    title: "VP Engineering",
    company: "Linear",
    warmth: "warm",
    channels: ["email", "linkedin-dm"],
    status: "queued",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    email: "james@linear.app",
    linkedinUrl: "https://linkedin.com/in/jamespark",
  },
  {
    id: "5",
    name: "Lisa Rodriguez",
    title: "Technical Recruiter",
    company: "Figma",
    warmth: "hot",
    channels: ["inmail", "email"],
    status: "replied",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 15),
    email: "lisa.r@figma.com",
    linkedinUrl: "https://linkedin.com/in/lisarodriguez",
  },
  {
    id: "6",
    name: "David Kim",
    title: "Hiring Manager",
    company: "Datadog",
    warmth: "cold",
    channels: ["linkedin-dm"],
    status: "no-response",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    linkedinUrl: "https://linkedin.com/in/davidkim",
  },
  {
    id: "7",
    name: "Anna Schmidt",
    title: "Director of Engineering",
    company: "Cloudflare",
    warmth: "warm",
    channels: ["email"],
    status: "draft",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    email: "anna.schmidt@cloudflare.com",
  },
  {
    id: "8",
    name: "Kevin Patel",
    title: "Staff Software Engineer",
    company: "Airbnb",
    warmth: "hot",
    channels: ["linkedin-dm", "email"],
    status: "replied",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    linkedinUrl: "https://linkedin.com/in/kevinpatel",
    email: "kevin.p@airbnb.com",
    nextFollowUp: new Date(Date.now() + 1000 * 60 * 60 * 24),
  },
  {
    id: "9",
    name: "Rachel Green",
    title: "Tech Lead",
    company: "Shopify",
    warmth: "warm",
    channels: ["inmail"],
    status: "opened",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    linkedinUrl: "https://linkedin.com/in/rachelgreen",
    nextFollowUp: new Date(Date.now() + 1000 * 60 * 60 * 48),
  },
  {
    id: "10",
    name: "Marcus Johnson",
    title: "Engineering Director",
    company: "Coinbase",
    warmth: "cold",
    channels: ["linkedin-dm"],
    status: "sent",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    linkedinUrl: "https://linkedin.com/in/marcusjohnson",
  },
  {
    id: "11",
    name: "Sophie Williams",
    title: "Senior Recruiter",
    company: "Meta",
    warmth: "hot",
    channels: ["email", "inmail"],
    status: "replied",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 20),
    email: "sophie.w@meta.com",
    linkedinUrl: "https://linkedin.com/in/sophiewilliams",
    nextFollowUp: new Date(Date.now() + 1000 * 60 * 60 * 2),
  },
  {
    id: "12",
    name: "Tom Anderson",
    title: "VP of Product",
    company: "Plaid",
    warmth: "warm",
    channels: ["linkedin-dm"],
    status: "queued",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    linkedinUrl: "https://linkedin.com/in/tomanderson",
  },
  {
    id: "13",
    name: "Jennifer Lee",
    title: "Principal Engineer",
    company: "Databricks",
    warmth: "cold",
    channels: ["email"],
    status: "no-response",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
    email: "jennifer.lee@databricks.com",
  },
  {
    id: "14",
    name: "Chris Martinez",
    title: "Head of Engineering",
    company: "Ramp",
    warmth: "hot",
    channels: ["linkedin-dm", "email"],
    status: "opened",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    linkedinUrl: "https://linkedin.com/in/chrismartinez",
    email: "chris@ramp.com",
  },
  {
    id: "15",
    name: "Priya Sharma",
    title: "Technical Recruiter",
    company: "OpenAI",
    warmth: "warm",
    channels: ["inmail", "email"],
    status: "sent",
    lastActivityAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    linkedinUrl: "https://linkedin.com/in/priyasharma",
    email: "priya@openai.com",
  },
]

export const mockMessages: Message[] = [
  {
    id: "m1",
    contactId: "1",
    content: "Hi Sarah, I came across your profile and was impressed by the work your team is doing at Stripe on the payments infrastructure. I'm a senior software engineer with 6+ years of experience in distributed systems...",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    status: "opened",
    channel: "linkedin-dm",
    isOutgoing: true,
  },
  {
    id: "m2",
    contactId: "1",
    content: "Thanks for reaching out! Your background looks interesting. We do have some openings on our payments team. Would you be open to a quick call next week?",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: "replied",
    channel: "linkedin-dm",
    isOutgoing: false,
  },
  {
    id: "m3",
    contactId: "1",
    content: "Absolutely! I'm free Tuesday or Wednesday afternoon. Looking forward to learning more about the role and team.",
    sentAt: new Date(Date.now() - 1000 * 60 * 30),
    status: "sent",
    channel: "linkedin-dm",
    isOutgoing: true,
  },
  {
    id: "m4",
    contactId: "2",
    content: "Hi Michael, I noticed Vercel is scaling their frontend infrastructure team. With my background in Next.js and edge computing, I'd love to explore opportunities...",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "opened",
    channel: "inmail",
    isOutgoing: true,
  },
  {
    id: "m5",
    contactId: "3",
    content: "Hello Emily, I'm reaching out because Notion's approach to collaborative tools aligns perfectly with my experience building real-time sync systems...",
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: "sent",
    channel: "linkedin-dm",
    isOutgoing: true,
  },
]

export const mockStats: OutreachStats = {
  sent: 87,
  openRate: 68,
  replyRate: 31,
  bestTemplate: "Referral Intro",
  bestTiming: "Tue 9-11am",
}

// Additional stats for spec compliance
export interface OutreachSummaryStats {
  totalContacts: number
  messagesSent: number
  responseRate: number
  followUpsDueToday: number
}

export const mockSummaryStats: OutreachSummaryStats = {
  totalContacts: 42,
  messagesSent: 87,
  responseRate: 31,
  followUpsDueToday: 3,
}

// Prospecting mock data
export interface ProspectedContact {
  id: string
  name: string
  title: string
  company: string
  linkedinUrl: string
  mutualConnections: number
}

export const mockProspectedContacts: ProspectedContact[] = [
  {
    id: "prospect_1",
    name: "Alex Turner",
    title: "Senior Engineering Manager",
    company: "Stripe",
    linkedinUrl: "https://linkedin.com/in/alexturner",
    mutualConnections: 12,
  },
  {
    id: "prospect_2",
    name: "Maria Garcia",
    title: "Staff Engineer",
    company: "Stripe",
    linkedinUrl: "https://linkedin.com/in/mariagarcia",
    mutualConnections: 5,
  },
  {
    id: "prospect_3",
    name: "Daniel Kim",
    title: "Technical Recruiter",
    company: "Stripe",
    linkedinUrl: "https://linkedin.com/in/danielkim",
    mutualConnections: 8,
  },
]
