"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import {
  Mail,
  Check,
  X,
  Calendar,
  Link2,
  ExternalLink,
  Clock,
  Eye,
  Reply,
  Send,
  Lock,
  AlertTriangle,
  Plus,
  Pencil,
  Copy,
  Trash2,
  Loader2,
} from "lucide-react"
import { format } from "date-fns"

// Types
type EmailCategory = "rejections" | "interviews" | "recruiter" | "confirmations"
type EmailStatus = "queued" | "sent" | "delivered" | "opened" | "replied"
type TemplateCategory =
  | "follow-up"
  | "thank-you"
  | "withdrawal"
  | "referral"
  | "cold-email"
  | "counter-offer"
  | "accept-offer"

type Sentiment = "positive" | "neutral" | "negative"

interface DetectedEmail {
  id: string
  date: Date
  from: string
  subject: string
  snippet: string
  category: EmailCategory
  confidence: number
  applicationId: string
  applicationTitle: string
  company: string
  autoAction?: string
  sentiment?: Sentiment
  extractedData?: {
    interviewDate?: Date
    platform?: string
    interviewer?: string
  }
}

interface EmailTemplate {
  id: string
  name: string
  category: TemplateCategory
  subject: string
  body: string
  variables: string[]
}

interface OutboxEmail {
  id: string
  recipient: string
  recipientEmail: string
  subject: string
  body: string
  status: EmailStatus
  sentDate: Date
  openedDate?: Date
  repliedDate?: Date
  applicationId?: string
  applicationTitle?: string
  company?: string
}

// Mock Data
const mockDetectedEmails: DetectedEmail[] = [
  {
    id: "email_001",
    date: new Date(2026, 2, 14, 9, 32),
    from: "recruiting@stripe.com",
    subject: "Update on your application - Senior Frontend Engineer",
    snippet:
      "Thank you for taking the time to interview with us. After careful consideration, we have decided to move forward with other candidates...",
    category: "rejections",
    confidence: 98,
    applicationId: "app_001",
    applicationTitle: "Senior Frontend Engineer",
    company: "Stripe",
    autoAction: "Updated application status to Rejected",
  },
  {
    id: "email_002",
    date: new Date(2026, 2, 13, 14, 15),
    from: "talent@vercel.com",
    subject: "Interview Invitation - Staff Engineer",
    snippet:
      "We were impressed by your background and would like to invite you for a technical interview. Please let us know your availability...",
    category: "interviews",
    confidence: 95,
    applicationId: "app_002",
    applicationTitle: "Staff Engineer",
    company: "Vercel",
    autoAction: "Created calendar event",
    extractedData: {
      interviewDate: new Date(2026, 2, 18, 14, 0),
      platform: "Zoom",
      interviewer: "Sarah Chen",
    },
  },
  {
    id: "email_003",
    date: new Date(2026, 2, 13, 11, 45),
    from: "recruiter@linear.app",
    subject: "Re: Application Follow-up",
    snippet:
      "Hi! Thanks for reaching out. I've reviewed your profile and think you'd be a great fit. Let me schedule some time to chat...",
    category: "recruiter",
    confidence: 92,
    applicationId: "app_003",
    applicationTitle: "Product Engineer",
    company: "Linear",
    sentiment: "positive",
    autoAction: "Follow-up sequence stopped",
  },
  {
    id: "email_004",
    date: new Date(2026, 2, 12, 16, 20),
    from: "noreply@greenhouse.io",
    subject: "Application Received - Notion",
    snippet:
      "Thank you for applying to the Senior Software Engineer position at Notion. We have received your application and will review it shortly...",
    category: "confirmations",
    confidence: 99,
    applicationId: "app_004",
    applicationTitle: "Senior Software Engineer",
    company: "Notion",
    autoAction: "Linked to application",
  },
  {
    id: "email_005",
    date: new Date(2026, 2, 12, 10, 5),
    from: "hr@figma.com",
    subject: "Thank you for your interest",
    snippet:
      "We appreciate your interest in Figma. Unfortunately, we won't be moving forward with your application at this time...",
    category: "rejections",
    confidence: 97,
    applicationId: "app_005",
    applicationTitle: "Design Engineer",
    company: "Figma",
    autoAction: "Updated application status to Rejected",
  },
  {
    id: "email_012",
    date: new Date(2026, 2, 11, 8, 30),
    from: "talent@meta.com",
    subject: "Application Update - Software Engineer",
    snippet:
      "Thank you for your patience during our review process. After careful consideration, we've decided to proceed with other candidates...",
    category: "rejections",
    confidence: 96,
    applicationId: "app_012",
    applicationTitle: "Software Engineer",
    company: "Meta",
    autoAction: "Updated application status to Rejected",
  },
  {
    id: "email_013",
    date: new Date(2026, 2, 10, 16, 45),
    from: "recruiting@netflix.com",
    subject: "Update on your Netflix application",
    snippet:
      "We appreciate your interest in Netflix. At this time, we've decided to move forward with candidates whose experience more closely matches...",
    category: "rejections",
    confidence: 94,
    applicationId: "app_013",
    applicationTitle: "Senior Backend Engineer",
    company: "Netflix",
    autoAction: "Updated application status to Rejected",
  },
  {
    id: "email_014",
    date: new Date(2026, 2, 9, 11, 20),
    from: "jobs@shopify.com",
    subject: "Regarding your application",
    snippet:
      "We wanted to follow up on your application for the Staff Engineer position. Unfortunately, we will not be moving forward...",
    category: "rejections",
    confidence: 92,
    applicationId: "app_014",
    applicationTitle: "Staff Engineer",
    company: "Shopify",
    autoAction: "Updated application status to Rejected",
  },
  {
    id: "email_006",
    date: new Date(2026, 2, 11, 15, 30),
    from: "talent@openai.com",
    subject: "Next Steps - Technical Phone Screen",
    snippet:
      "Congratulations! We'd like to move forward with a technical phone screen. Please use the link below to schedule a time...",
    category: "interviews",
    confidence: 94,
    applicationId: "app_006",
    applicationTitle: "Applied AI Engineer",
    company: "OpenAI",
    autoAction: "Created calendar event",
    extractedData: {
      interviewDate: new Date(2026, 2, 19, 10, 0),
      platform: "Google Meet",
      interviewer: "Dr. James Liu",
    },
  },
  {
    id: "email_011",
    date: new Date(2026, 2, 12, 11, 0),
    from: "recruiting@airbnb.com",
    subject: "Interview Confirmation - Senior Software Engineer",
    snippet:
      "We're excited to confirm your onsite interview for the Senior Software Engineer position. Please arrive 15 minutes early...",
    category: "interviews",
    confidence: 96,
    applicationId: "app_011",
    applicationTitle: "Senior Software Engineer",
    company: "Airbnb",
    autoAction: "Created calendar event",
    extractedData: {
      interviewDate: new Date(2026, 2, 20, 9, 0),
      platform: "Onsite",
      interviewer: "Engineering Panel",
    },
  },
  {
    id: "email_007",
    date: new Date(2026, 2, 11, 9, 15),
    from: "sarah@anthropic.com",
    subject: "Saw your profile on LinkedIn",
    snippet:
      "Hi! I came across your profile and was impressed by your work on AI tooling. We have some exciting roles that might interest you...",
    category: "recruiter",
    confidence: 88,
    applicationId: "",
    applicationTitle: "",
    company: "Anthropic",
    sentiment: "positive",
  },
  {
    id: "email_009",
    date: new Date(2026, 2, 10, 10, 30),
    from: "talent@datadog.com",
    subject: "Re: Engineering Opportunities",
    snippet:
      "Thank you for your interest. Unfortunately, we don't have any openings that match your profile at this time. We will keep your resume on file...",
    category: "recruiter",
    confidence: 85,
    applicationId: "",
    applicationTitle: "",
    company: "Datadog",
    sentiment: "negative",
  },
  {
    id: "email_010",
    date: new Date(2026, 2, 9, 14, 0),
    from: "hr@cloudflare.com",
    subject: "Following up on your application",
    snippet:
      "We received your application and are currently reviewing candidates. We'll be in touch soon with next steps...",
    category: "recruiter",
    confidence: 78,
    applicationId: "app_010",
    applicationTitle: "Systems Engineer",
    company: "Cloudflare",
    sentiment: "neutral",
  },
  {
    id: "email_008",
    date: new Date(2026, 2, 10, 14, 45),
    from: "jobs@lever.co",
    subject: "Your application to Ramp",
    snippet:
      "Your application for the Full Stack Engineer role at Ramp has been received. Our team will review your materials...",
    category: "confirmations",
    confidence: 99,
    applicationId: "app_008",
    applicationTitle: "Full Stack Engineer",
    company: "Ramp",
    autoAction: "Linked to application",
  },
  {
    id: "email_015",
    date: new Date(2026, 2, 8, 10, 0),
    from: "no-reply@workday.com",
    subject: "Application Confirmation - Coinbase",
    snippet:
      "Thank you for applying to the Infrastructure Engineer position at Coinbase. Your application has been successfully submitted...",
    category: "confirmations",
    confidence: 99,
    applicationId: "app_015",
    applicationTitle: "Infrastructure Engineer",
    company: "Coinbase",
    autoAction: "Linked to application",
  },
]

const mockTemplates: EmailTemplate[] = [
  {
    id: "tmpl_001",
    name: "Interview Follow-Up",
    category: "follow-up",
    subject: "Thank you for the conversation - {title} at {company}",
    body: "Hi {interviewer_name},\n\nThank you for taking the time to speak with me today about the {title} position at {company}. I enjoyed learning more about the team and the exciting challenges you're working on.\n\nOur conversation reinforced my enthusiasm for this opportunity. I'm particularly excited about {specific_topic}.\n\nPlease don't hesitate to reach out if you need any additional information from me.\n\nBest regards,\n{your_name}",
    variables: [
      "title",
      "company",
      "interviewer_name",
      "specific_topic",
      "your_name",
    ],
  },
  {
    id: "tmpl_002",
    name: "Thank You - Post Interview",
    category: "thank-you",
    subject: "Thank you - {title} Interview",
    body: "Dear {interviewer_name},\n\nI wanted to express my sincere gratitude for the opportunity to interview for the {title} role at {company}. It was a pleasure meeting you and the team.\n\nI remain very interested in the position and look forward to hearing about next steps.\n\nThank you again for your time and consideration.\n\nBest,\n{your_name}",
    variables: ["title", "company", "interviewer_name", "your_name"],
  },
  {
    id: "tmpl_003",
    name: "Application Withdrawal",
    category: "withdrawal",
    subject: "Withdrawal - {title} Application",
    body: "Dear {recruiter_name},\n\nI hope this email finds you well. I wanted to inform you that I am withdrawing my application for the {title} position at {company}.\n\nI have accepted another opportunity that aligns more closely with my career goals at this time.\n\nI sincerely appreciate your consideration and the time you invested in my candidacy. I hope our paths may cross again in the future.\n\nBest regards,\n{your_name}",
    variables: ["title", "company", "recruiter_name", "your_name"],
  },
  {
    id: "tmpl_004",
    name: "Referral Request",
    category: "referral",
    subject: "Referral Request - {title} at {company}",
    body: "Hi {contact_name},\n\nI hope you're doing well! I noticed that {company} is hiring for a {title} position, and I'm very interested in the opportunity.\n\nGiven your experience at {company}, I was wondering if you'd be comfortable referring me for this role? I've attached my resume for reference.\n\nI'd really appreciate any insights you could share about the team or interview process as well.\n\nThanks so much for considering this!\n\nBest,\n{your_name}",
    variables: ["title", "company", "contact_name", "your_name"],
  },
  {
    id: "tmpl_005",
    name: "Cold Outreach",
    category: "cold-email",
    subject: "Quick question about {company}",
    body: "Hi {contact_name},\n\nI came across your profile while researching {company} and was impressed by your work on {specific_project}.\n\nI'm a {your_role} with experience in {your_expertise}, and I'm very interested in learning more about opportunities at {company}.\n\nWould you have 15-20 minutes for a quick chat? I'd love to hear about your experience and any advice you might have.\n\nThanks for your time!\n\n{your_name}",
    variables: [
      "company",
      "contact_name",
      "specific_project",
      "your_role",
      "your_expertise",
      "your_name",
    ],
  },
  {
    id: "tmpl_006",
    name: "Counter Offer Response",
    category: "counter-offer",
    subject: "Re: Offer - {title} at {company}",
    body: "Dear {recruiter_name},\n\nThank you for extending the offer for the {title} position at {company}. I'm excited about the opportunity to join the team.\n\nAfter careful consideration, I'd like to discuss the compensation package. Based on my experience and market research, I was hoping we could explore a base salary of {target_salary}.\n\nI'm confident I can make significant contributions to {company} and am eager to find a package that works for both of us.\n\nLooking forward to your thoughts.\n\nBest regards,\n{your_name}",
    variables: [
      "title",
      "company",
      "recruiter_name",
      "target_salary",
      "your_name",
    ],
  },
  {
    id: "tmpl_007",
    name: "Accept Offer",
    category: "accept-offer",
    subject: "Offer Acceptance - {title}",
    body: "Dear {recruiter_name},\n\nI am thrilled to formally accept the offer for the {title} position at {company}. Thank you for this incredible opportunity.\n\nAs discussed, I understand my start date will be {start_date} and my compensation will be {salary}.\n\nPlease let me know if there's any paperwork or information you need from me before my start date.\n\nI'm looking forward to joining the team and contributing to {company}'s success.\n\nBest regards,\n{your_name}",
    variables: [
      "title",
      "company",
      "recruiter_name",
      "start_date",
      "salary",
      "your_name",
    ],
  },
]

const mockOutboxEmails: OutboxEmail[] = [
  {
    id: "out_001",
    recipient: "Sarah Chen",
    recipientEmail: "sarah.chen@vercel.com",
    subject: "Thank you for the conversation - Staff Engineer at Vercel",
    body: "Hi Sarah,\n\nThank you for taking the time to speak with me today about the Staff Engineer position at Vercel...",
    status: "opened",
    sentDate: new Date(2026, 2, 13, 16, 30),
    openedDate: new Date(2026, 2, 13, 17, 45),
    applicationId: "app_002",
    applicationTitle: "Staff Engineer",
    company: "Vercel",
  },
  {
    id: "out_002",
    recipient: "Mike Johnson",
    recipientEmail: "mike.j@stripe.com",
    subject: "Referral Request - Senior Frontend Engineer at Stripe",
    body: "Hi Mike,\n\nI hope you're doing well! I noticed that Stripe is hiring for a Senior Frontend Engineer position...",
    status: "replied",
    sentDate: new Date(2026, 2, 12, 10, 15),
    openedDate: new Date(2026, 2, 12, 11, 20),
    repliedDate: new Date(2026, 2, 12, 14, 5),
    applicationId: "app_001",
    applicationTitle: "Senior Frontend Engineer",
    company: "Stripe",
  },
  {
    id: "out_003",
    recipient: "Emily Davis",
    recipientEmail: "emily@linear.app",
    subject: "Re: Application Follow-up",
    body: "Hi Emily,\n\nThank you for getting back to me. I'm excited about the opportunity to learn more about Linear...",
    status: "sent",
    sentDate: new Date(2026, 2, 14, 8, 45),
    applicationId: "app_003",
    applicationTitle: "Product Engineer",
    company: "Linear",
  },
  {
    id: "out_004",
    recipient: "Dr. James Liu",
    recipientEmail: "james.liu@openai.com",
    subject: "Looking forward to our conversation",
    body: "Dear Dr. Liu,\n\nI wanted to confirm our scheduled technical phone screen for Thursday...",
    status: "delivered",
    sentDate: new Date(2026, 2, 13, 9, 0),
    applicationId: "app_006",
    applicationTitle: "Applied AI Engineer",
    company: "OpenAI",
  },
  {
    id: "out_005",
    recipient: "Alex Thompson",
    recipientEmail: "alex.t@notion.so",
    subject: "Quick question about Notion",
    body: "Hi Alex,\n\nI came across your profile while researching Notion and was impressed by your work...",
    status: "queued",
    sentDate: new Date(2026, 2, 14, 14, 0),
    applicationId: "app_004",
    applicationTitle: "Senior Software Engineer",
    company: "Notion",
  },
  {
    id: "out_006",
    recipient: "Jessica Wu",
    recipientEmail: "jessica.wu@figma.com",
    subject: "Thank you for the conversation - Design Engineer at Figma",
    body: "Hi Jessica,\n\nThank you for taking the time to speak with me about the Design Engineer role...",
    status: "delivered",
    sentDate: new Date(2026, 2, 11, 11, 30),
    applicationId: "app_005",
    applicationTitle: "Design Engineer",
    company: "Figma",
  },
  {
    id: "out_007",
    recipient: "David Park",
    recipientEmail: "david.p@coinbase.com",
    subject: "Referral Request - Senior Backend Engineer at Coinbase",
    body: "Hi David,\n\nI hope you're doing well! I saw your work on Coinbase's trading infrastructure...",
    status: "opened",
    sentDate: new Date(2026, 2, 10, 9, 15),
    openedDate: new Date(2026, 2, 10, 14, 30),
    applicationId: "app_007",
    applicationTitle: "Senior Backend Engineer",
    company: "Coinbase",
  },
  {
    id: "out_008",
    recipient: "Maria Santos",
    recipientEmail: "maria@ramp.com",
    subject: "Following up on our conversation",
    body: "Hi Maria,\n\nI wanted to follow up on our conversation last week about the Full Stack role...",
    status: "replied",
    sentDate: new Date(2026, 2, 9, 16, 0),
    openedDate: new Date(2026, 2, 9, 17, 15),
    repliedDate: new Date(2026, 2, 10, 10, 30),
    applicationId: "app_008",
    applicationTitle: "Full Stack Engineer",
    company: "Ramp",
  },
  {
    id: "out_009",
    recipient: "Kevin Lee",
    recipientEmail: "kevin.lee@plaid.com",
    subject: "Introduction - Software Engineer opportunity",
    body: "Hi Kevin,\n\nI'm reaching out because I'm very interested in Plaid's mission of democratizing financial services...",
    status: "sent",
    sentDate: new Date(2026, 2, 14, 10, 0),
  },
  {
    id: "out_010",
    recipient: "Rachel Kim",
    recipientEmail: "rachel.k@databricks.com",
    subject: "Thank you - Data Engineering Interview",
    body: "Dear Rachel,\n\nThank you for the opportunity to interview for the Data Engineering position...",
    status: "opened",
    sentDate: new Date(2026, 2, 8, 15, 30),
    openedDate: new Date(2026, 2, 8, 18, 45),
  },
]

// Helper functions
function getCategoryEmails(emails: DetectedEmail[], category: EmailCategory) {
  return emails.filter((e) => e.category === category)
}

function getStatusColor(status: EmailStatus) {
  switch (status) {
    case "queued":
      return "bg-muted text-muted-foreground"
    case "sent":
      return "bg-success/10 text-success border-success/20"
    case "delivered":
      return "bg-success/10 text-success border-success/20"
    case "opened":
      return "bg-primary/10 text-primary border-primary/20"
    case "replied":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getStatusIcon(status: EmailStatus) {
  switch (status) {
    case "queued":
      return <Clock className="size-3" />
    case "sent":
      return <Send className="size-3" />
    case "delivered":
      return <Check className="size-3" />
    case "opened":
      return <Eye className="size-3" />
    case "replied":
      return <Reply className="size-3" />
    default:
      return null
  }
}

function getCategoryColor(category: TemplateCategory) {
  switch (category) {
    case "follow-up":
      return "bg-primary/10 text-primary"
    case "thank-you":
      return "bg-success/10 text-success"
    case "withdrawal":
      return "bg-warning/10 text-warning-foreground"
    case "referral":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400"
    case "cold-email":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
    case "counter-offer":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
    case "accept-offer":
      return "bg-success/10 text-success"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getCategoryLabel(category: TemplateCategory) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getConfidenceBadgeColor(confidence: number) {
  if (confidence >= 95) return "bg-success/10 text-success border-success/20"
  if (confidence >= 85)
    return "bg-primary/10 text-primary border-primary/20"
  return "bg-warning/10 text-warning-foreground border-warning/20"
}

function getSentimentBadge(sentiment: Sentiment | undefined) {
  switch (sentiment) {
    case "positive":
      return { label: "Positive", className: "bg-success/10 text-success border-success/20" }
    case "negative":
      return { label: "Negative", className: "bg-destructive/10 text-destructive border-destructive/20" }
    case "neutral":
    default:
      return { label: "Neutral", className: "bg-muted text-muted-foreground" }
  }
}

function getCategoryBorderColor(category: EmailCategory) {
  switch (category) {
    case "rejections":
      return "border-l-4 border-l-destructive"
    case "interviews":
      return "border-l-4 border-l-primary"
    case "recruiter":
      return "border-l-4 border-l-success"
    case "confirmations":
      return "border-l-4 border-l-muted-foreground"
    default:
      return ""
  }
}

export default function EmailPage() {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<DetectedEmail | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(
    null
  )
  const [selectedOutbox, setSelectedOutbox] = useState<OutboxEmail | null>(null)
  const [activeCategory, setActiveCategory] =
    useState<EmailCategory>("rejections")
  const [showCreateTemplate, setShowCreateTemplate] = useState(false)
  const [outboxFilter, setOutboxFilter] = useState<EmailStatus | "all">("all")

  const handleConnectGmail = () => {
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
      toast({
        title: "Gmail connected",
        description: "Your Gmail account has been successfully connected.",
      })
    }, 2000)
  }

  const handleCopyTemplate = () => {
    if (selectedTemplate) {
      navigator.clipboard.writeText(selectedTemplate.body)
      toast({
        title: "Copied to clipboard",
        description: "Template content has been copied.",
      })
    }
  }

  const handleSendViaGmail = () => {
    toast({
      title: "Opening Gmail",
      description: "Redirecting to Gmail compose...",
    })
    setSelectedTemplate(null)
  }

  const categoryEmails = getCategoryEmails(mockDetectedEmails, activeCategory)
  const filteredOutboxEmails = outboxFilter === "all" 
    ? mockOutboxEmails 
    : mockOutboxEmails.filter(email => email.status === outboxFilter)

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="shrink-0 p-5 border-b border-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              Email Hub
            </h1>
            {isConnected ? (
              <Badge
                variant="outline"
                className="bg-success/10 text-success border-success/20 gap-1.5"
              >
                <span className="size-1.5 rounded-full bg-success animate-pulse" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 gap-1.5">
                <span className="size-1.5 rounded-full bg-destructive" />
                Not Connected
              </Badge>
            )}
          </div>
          {!isConnected && (
            <Button
              onClick={handleConnectGmail}
              disabled={isConnecting}
              className="rounded-lg gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Mail className="size-4" />
                  Connect Gmail
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          {/* Connection Status Card */}
          <Card className={cn(
            "rounded-xl border-2",
            isConnected ? "border-success/30 bg-success/5" : "border-destructive/30 bg-destructive/5"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "size-3 rounded-full",
                    isConnected ? "bg-success animate-pulse" : "bg-destructive"
                  )} />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {isConnected ? "Connected to john@gmail.com" : "Gmail Not Connected"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      We scan for job-related emails only. Nothing else is read or stored.
                    </p>
                  </div>
                </div>
                {isConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                    onClick={() => setIsConnected(false)}
                  >
                    Disconnect Gmail
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="rounded-lg gap-2"
                    onClick={handleConnectGmail}
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Mail className="size-4" />
                        Connect Gmail
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section 1: Auto-Detected Emails */}
          <Card className="rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Auto-Detected Emails</CardTitle>
              <CardDescription>
                Job-related emails automatically classified from your inbox
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Tabs
                value={activeCategory}
                onValueChange={(v) => setActiveCategory(v as EmailCategory)}
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="rejections" className="gap-1.5">
                    <X className="size-3.5 text-destructive" />
                    Rejections
                    <Badge
                      variant="secondary"
                      className="ml-1 size-5 p-0 justify-center text-xs"
                    >
                      {getCategoryEmails(mockDetectedEmails, "rejections").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="interviews" className="gap-1.5">
                    <Calendar className="size-3.5 text-primary" />
                    Interview Invites
                    <Badge
                      variant="secondary"
                      className="ml-1 size-5 p-0 justify-center text-xs"
                    >
                      {getCategoryEmails(mockDetectedEmails, "interviews").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="recruiter" className="gap-1.5">
                    <Reply className="size-3.5 text-success" />
                    Recruiter Responses
                    <Badge
                      variant="secondary"
                      className="ml-1 size-5 p-0 justify-center text-xs"
                    >
                      {getCategoryEmails(mockDetectedEmails, "recruiter").length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="confirmations" className="gap-1.5">
                    <Check className="size-3.5 text-muted-foreground" />
                    Confirmations
                    <Badge
                      variant="secondary"
                      className="ml-1 size-5 p-0 justify-center text-xs"
                    >
                      {
                        getCategoryEmails(mockDetectedEmails, "confirmations")
                          .length
                      }
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeCategory} className="mt-0">
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[120px]">Date</TableHead>
                          <TableHead className="w-[180px]">From</TableHead>
                          <TableHead>Subject</TableHead>
                          {activeCategory === "interviews" && (
                            <TableHead className="w-[160px]">Interview Details</TableHead>
                          )}
                          {activeCategory === "recruiter" && (
                            <TableHead className="w-[100px]">Sentiment</TableHead>
                          )}
                          <TableHead className="w-[100px]">Confidence</TableHead>
                          <TableHead className="w-[160px]">Application</TableHead>
                          <TableHead className="w-[180px]">Auto-Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryEmails.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={activeCategory === "interviews" || activeCategory === "recruiter" ? 7 : 6}
                              className="h-24 text-center text-muted-foreground"
                            >
                              No emails in this category
                            </TableCell>
                          </TableRow>
                        ) : (
                          categoryEmails.map((email, index) => (
                            <TableRow
                              key={email.id}
                              className={cn(
                                "cursor-pointer transition-colors",
                                getCategoryBorderColor(email.category),
                                index % 2 === 0 ? "bg-background" : "bg-surface"
                              )}
                              onClick={() => setSelectedEmail(email)}
                            >
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {format(email.date, "MMM dd, HH:mm")}
                              </TableCell>
                              <TableCell className="text-sm truncate max-w-[180px]">
                                {email.from}
                              </TableCell>
                              <TableCell className="text-sm font-medium truncate max-w-[300px]">
                                {email.subject}
                              </TableCell>
                              {activeCategory === "interviews" && (
                                <TableCell>
                                  {email.extractedData ? (
                                    <div className="text-xs space-y-0.5">
                                      {email.extractedData.interviewDate && (
                                        <p className="font-mono">{format(email.extractedData.interviewDate, "MMM dd, HH:mm")}</p>
                                      )}
                                      {email.extractedData.platform && (
                                        <p className="text-muted-foreground">{email.extractedData.platform}</p>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                              )}
                              {activeCategory === "recruiter" && (
                                <TableCell>
                                  {email.sentiment ? (
                                    <Badge
                                      variant="outline"
                                      className={cn("text-xs", getSentimentBadge(email.sentiment).className)}
                                    >
                                      {getSentimentBadge(email.sentiment).label}
                                    </Badge>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                              )}
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "font-mono text-xs",
                                    getConfidenceBadgeColor(email.confidence)
                                  )}
                                >
                                  {email.confidence}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {email.applicationId ? (
                                  <a
                                    href={`/jobs/${email.applicationId}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1 text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                                  >
                                    <Link2 className="size-3" />
                                    {email.company}
                                  </a>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    Not linked
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {email.autoAction ? (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-success/10 text-success border-success/20"
                                  >
                                    <Check className="size-3 mr-1" />
                                    {email.autoAction}
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    —
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Section 2: Email Templates */}
          <Card className="rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Email Templates</CardTitle>
                  <CardDescription>
                    Pre-written templates with smart variable insertion
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg gap-2"
                  onClick={() => setShowCreateTemplate(true)}
                >
                  <Plus className="size-4" />
                  Create Custom
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group relative rounded-xl border border-border bg-surface p-4 transition-all hover:shadow-md hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium text-foreground">
                        {template.name}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs shrink-0",
                          getCategoryColor(template.category)
                        )}
                      >
                        {getCategoryLabel(template.category)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {template.body.slice(0, 120)}...
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {template.variables.slice(0, 3).map((variable) => (
                        <span
                          key={variable}
                          className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary font-mono"
                        >
                          {`{${variable}}`}
                        </span>
                      ))}
                      {template.variables.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{template.variables.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="flex-1 rounded-lg text-xs h-8"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        Use Template
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg h-8 w-8 p-0"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Outbox */}
          <Card className="rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Outbox</CardTitle>
                  <CardDescription>
                    Emails sent through Job Application OS
                  </CardDescription>
                </div>
                <Select value={outboxFilter} onValueChange={(v) => setOutboxFilter(v as EmailStatus | "all")}>
                  <SelectTrigger className="w-[140px] rounded-lg">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="queued">Queued</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="opened">Opened</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[180px]">Recipient</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[140px]">Sent</TableHead>
                      <TableHead className="w-[80px] text-center">
                        Tracking
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOutboxEmails.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No emails with this status
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOutboxEmails.map((email, index) => (
                        <TableRow
                          key={email.id}
                          className={cn(
                            "cursor-pointer transition-colors",
                            index % 2 === 0 ? "bg-background" : "bg-surface"
                          )}
                          onClick={() => setSelectedOutbox(email)}
                        >
                          <TableCell>
                            <div>
                              <p className="text-sm font-medium">
                                {email.recipient}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {email.recipientEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm truncate max-w-[300px]">
                            {email.subject}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs capitalize gap-1",
                                getStatusColor(email.status)
                              )}
                            >
                              {getStatusIcon(email.status)}
                              {email.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {format(email.sentDate, "MMM dd, HH:mm")}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              {email.openedDate && (
                                <Eye className="size-3.5 text-primary" />
                              )}
                              {email.repliedDate && (
                                <Reply className="size-3.5 text-purple-500" />
                              )}
                              {!email.openedDate && !email.repliedDate && (
                                <span className="text-xs text-muted-foreground">
                                  —
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Privacy Note */}
          <Card className="rounded-xl border-border bg-surface">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 p-2 rounded-lg bg-muted">
                  <Lock className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    Your Privacy Matters
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We only scan for job-related emails matching specific patterns (rejections, interview invites, confirmations, recruiter replies). Nothing else is read or stored. You can disconnect at any time and all synced data will be removed.{" "}
                    <a href="#" className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                      Learn More
                    </a>
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                  onClick={() => setIsConnected(false)}
                >
                  Disconnect Gmail
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Email Detail Dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
        <DialogContent className="max-w-2xl rounded-xl">
          {selectedEmail && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  {selectedEmail.category === "rejections" && (
                    <div className="shrink-0 p-2 rounded-lg bg-destructive/10">
                      <X className="size-5 text-destructive" />
                    </div>
                  )}
                  {selectedEmail.category === "interviews" && (
                    <div className="shrink-0 p-2 rounded-lg bg-primary/10">
                      <Calendar className="size-5 text-primary" />
                    </div>
                  )}
                  {selectedEmail.category === "recruiter" && (
                    <div className="shrink-0 p-2 rounded-lg bg-success/10">
                      <Reply className="size-5 text-success" />
                    </div>
                  )}
                  {selectedEmail.category === "confirmations" && (
                    <div className="shrink-0 p-2 rounded-lg bg-muted">
                      <Check className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-base">
                      {selectedEmail.subject}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      From: {selectedEmail.from} •{" "}
                      {format(selectedEmail.date, "MMM dd, yyyy 'at' HH:mm")}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Email Snippet */}
                <div className="rounded-lg bg-surface-raised p-4">
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedEmail.snippet}
                  </p>
                </div>

                {/* Extracted Data for Interviews */}
                {selectedEmail.extractedData && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <h4 className="text-sm font-medium text-foreground mb-3">
                      Extracted Interview Details
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedEmail.extractedData.interviewDate && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Date & Time
                          </p>
                          <p className="text-sm font-mono">
                            {format(
                              selectedEmail.extractedData.interviewDate,
                              "MMM dd, HH:mm"
                            )}
                          </p>
                        </div>
                      )}
                      {selectedEmail.extractedData.platform && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Platform
                          </p>
                          <p className="text-sm">
                            {selectedEmail.extractedData.platform}
                          </p>
                        </div>
                      )}
                      {selectedEmail.extractedData.interviewer && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Interviewer
                          </p>
                          <p className="text-sm">
                            {selectedEmail.extractedData.interviewer}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Linked Application */}
                {selectedEmail.applicationId && (
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="text-xs text-muted-foreground mb-2">
                      Linked Application
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {selectedEmail.applicationTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedEmail.company}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg gap-1.5"
                        asChild
                      >
                        <a
                          href={`/jobs/${selectedEmail.applicationId}`}
                        >
                          View
                          <ExternalLink className="size-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Auto Action */}
                {selectedEmail.autoAction && (
                  <div className="flex items-center gap-2 text-sm">
                    <Badge
                      variant="outline"
                      className="bg-success/10 text-success border-success/20"
                    >
                      <Check className="size-3 mr-1" />
                      Auto-action completed
                    </Badge>
                    <span className="text-muted-foreground">
                      {selectedEmail.autoAction}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Template Detail/Edit Dialog */}
      <Dialog
        open={!!selectedTemplate}
        onOpenChange={() => setSelectedTemplate(null)}
      >
        <DialogContent className="max-w-2xl rounded-xl">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base">
                    {selectedTemplate.name}
                  </DialogTitle>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      getCategoryColor(selectedTemplate.category)
                    )}
                  >
                    {getCategoryLabel(selectedTemplate.category)}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Subject
                  </Label>
                  <Input
                    defaultValue={selectedTemplate.subject}
                    className="mt-1.5 rounded-lg font-mono text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Body</Label>
                  <div className="mt-1.5 rounded-lg border border-border bg-surface-raised p-4">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {selectedTemplate.body.split(/(\{[^}]+\})/).map((part, i) =>
                        part.startsWith("{") && part.endsWith("}") ? (
                          <span
                            key={i}
                            className="inline-flex items-center px-1 py-0.5 rounded text-xs bg-primary/10 text-primary font-mono"
                          >
                            {part}
                          </span>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </pre>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Variables
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {selectedTemplate.variables.map((variable) => (
                      <Badge
                        key={variable}
                        variant="outline"
                        className="font-mono text-xs"
                      >
                        {`{${variable}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  variant="outline"
                  className="rounded-lg gap-2"
                  onClick={handleCopyTemplate}
                >
                  <Copy className="size-4" />
                  Copy to Clipboard
                </Button>
                <Button className="rounded-lg gap-2" onClick={handleSendViaGmail}>
                  <Send className="size-4" />
                  Send via Gmail
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Outbox Email Detail Dialog */}
      <Dialog
        open={!!selectedOutbox}
        onOpenChange={() => setSelectedOutbox(null)}
      >
        <DialogContent className="max-w-2xl rounded-xl">
          {selectedOutbox && (
            <>
              <DialogHeader>
                <DialogTitle className="text-base">
                  {selectedOutbox.subject}
                </DialogTitle>
                <DialogDescription>
                  To: {selectedOutbox.recipient} ({selectedOutbox.recipientEmail}
                  )
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Status Timeline */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Send className="size-3.5 text-success" />
                    <span className="text-muted-foreground">Sent</span>
                    <span className="font-mono">
                      {format(selectedOutbox.sentDate, "MMM dd, HH:mm")}
                    </span>
                  </div>
                  {selectedOutbox.openedDate && (
                    <>
                      <span className="text-muted-foreground">→</span>
                      <div className="flex items-center gap-1.5">
                        <Eye className="size-3.5 text-primary" />
                        <span className="text-muted-foreground">Opened</span>
                        <span className="font-mono">
                          {format(selectedOutbox.openedDate, "MMM dd, HH:mm")}
                        </span>
                      </div>
                    </>
                  )}
                  {selectedOutbox.repliedDate && (
                    <>
                      <span className="text-muted-foreground">→</span>
                      <div className="flex items-center gap-1.5">
                        <Reply className="size-3.5 text-purple-500" />
                        <span className="text-muted-foreground">Replied</span>
                        <span className="font-mono">
                          {format(selectedOutbox.repliedDate, "MMM dd, HH:mm")}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Email Content */}
                <div className="rounded-lg bg-surface-raised p-4">
                  <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {selectedOutbox.body}
                  </pre>
                </div>

                {/* Linked Application */}
                {selectedOutbox.applicationId && (
                  <div className="rounded-lg border border-border bg-surface p-4">
                    <h4 className="text-xs text-muted-foreground mb-2">
                      Linked Application
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {selectedOutbox.applicationTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedOutbox.company}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg gap-1.5"
                        asChild
                      >
                        <a
                          href={`/jobs/${selectedOutbox.applicationId}`}
                        >
                          View
                          <ExternalLink className="size-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Template Dialog */}
      <Dialog open={showCreateTemplate} onOpenChange={setShowCreateTemplate}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">
              Create Custom Template
            </DialogTitle>
            <DialogDescription>
              Create a reusable email template with variable placeholders
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Template Name
                </Label>
                <Input
                  placeholder="e.g., Networking Follow-up"
                  className="mt-1.5 rounded-lg"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Category
                </Label>
                <Input
                  placeholder="e.g., follow-up"
                  className="mt-1.5 rounded-lg"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Subject</Label>
              <Input
                placeholder="Use {variable} for dynamic content"
                className="mt-1.5 rounded-lg"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Body</Label>
              <Textarea
                placeholder="Write your email template here. Use {variable} syntax for placeholders like {company}, {title}, {name}, etc."
                className="mt-1.5 rounded-lg min-h-[200px]"
              />
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Tip:</span> Use curly braces for
                variables, e.g., {"{company}"}, {"{title}"}, {"{interviewer_name}"}. These
                will be auto-filled when you use the template.
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setShowCreateTemplate(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg"
              onClick={() => {
                toast({
                  title: "Template created",
                  description: "Your custom template has been saved.",
                })
                setShowCreateTemplate(false)
              }}
            >
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
