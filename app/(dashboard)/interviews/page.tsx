"use client"

import { useState, useMemo } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isToday,
  parseISO,
} from "date-fns"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  VideoIcon,
  LinkedinIcon,
  FileTextIcon,
  StarIcon,
  CalendarDaysIcon,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

// Interview round types with colors
type RoundType =
  | "phone_screen"
  | "technical"
  | "system_design"
  | "hiring_manager"
  | "final_round"
  | "culture_fit"

const roundTypeConfig: Record<
  RoundType,
  { label: string; bgColor: string; textColor: string; borderColor: string }
> = {
  phone_screen: {
    label: "Phone Screen",
    bgColor: "bg-blue-100 dark:bg-blue-950",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700",
  },
  technical: {
    label: "Technical",
    bgColor: "bg-orange-100 dark:bg-orange-950",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-300 dark:border-orange-700",
  },
  system_design: {
    label: "System Design",
    bgColor: "bg-teal-100 dark:bg-teal-950",
    textColor: "text-teal-700 dark:text-teal-300",
    borderColor: "border-teal-300 dark:border-teal-700",
  },
  hiring_manager: {
    label: "Hiring Manager",
    bgColor: "bg-purple-100 dark:bg-purple-950",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700",
  },
  final_round: {
    label: "Final Round",
    bgColor: "bg-red-100 dark:bg-red-950",
    textColor: "text-red-700 dark:text-red-300",
    borderColor: "border-red-300 dark:border-red-700",
  },
  culture_fit: {
    label: "Culture Fit",
    bgColor: "bg-green-100 dark:bg-green-950",
    textColor: "text-green-700 dark:text-green-300",
    borderColor: "border-green-300 dark:border-green-700",
  },
}

type Platform = "zoom" | "google_meet" | "teams"

const platformConfig: Record<Platform, { label: string; icon: string }> = {
  zoom: { label: "Zoom", icon: "Z" },
  google_meet: { label: "Google Meet", icon: "M" },
  teams: { label: "Microsoft Teams", icon: "T" },
}

interface Interview {
  id: string
  companyName: string
  companyLogo?: string
  role: string
  roundType: RoundType
  dateTime: Date
  timezone: string
  platform: Platform
  meetingLink: string
  interviewer: {
    name: string
    title: string
    linkedinUrl?: string
    avatarUrl?: string
  }
  prepPackUrl?: string
  checklist: {
    prepReviewed: boolean
    starAnswersReady: boolean
    questionsPrepared: boolean
    techSetupTested: boolean
    salaryAnchorMemorized: boolean
  }
  notes: string
  postInterview?: {
    difficulty: number
    performance: number
    questionsAsked: string
    nextSteps: string
  }
}

// Mock data
const mockInterviews: Interview[] = [
  {
    id: "int_001",
    companyName: "Stripe",
    companyLogo: "/logos/stripe.svg",
    role: "Senior Software Engineer",
    roundType: "technical",
    dateTime: new Date(2026, 2, 16, 10, 0),
    timezone: "PST",
    platform: "zoom",
    meetingLink: "https://zoom.us/j/123456789",
    interviewer: {
      name: "Sarah Chen",
      title: "Staff Engineer",
      linkedinUrl: "https://linkedin.com/in/sarahchen",
    },
    prepPackUrl: "/prep/stripe-technical",
    checklist: {
      prepReviewed: true,
      starAnswersReady: true,
      questionsPrepared: false,
      techSetupTested: false,
      salaryAnchorMemorized: true,
    },
    notes: "Focus on system design patterns and scalability.",
  },
  {
    id: "int_002",
    companyName: "Vercel",
    companyLogo: "/logos/vercel.svg",
    role: "Full Stack Engineer",
    roundType: "phone_screen",
    dateTime: new Date(2026, 2, 14, 14, 30),
    timezone: "PST",
    platform: "google_meet",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    interviewer: {
      name: "Mike Johnson",
      title: "Recruiting Lead",
      linkedinUrl: "https://linkedin.com/in/mikejohnson",
    },
    prepPackUrl: "/prep/vercel-phone",
    checklist: {
      prepReviewed: true,
      starAnswersReady: true,
      questionsPrepared: true,
      techSetupTested: true,
      salaryAnchorMemorized: true,
    },
    notes: "Be ready to discuss Next.js experience.",
    postInterview: {
      difficulty: 3,
      performance: 4,
      questionsAsked: "Tell me about yourself. Why Vercel? Describe a challenging project.",
      nextSteps: "Technical round scheduled for next week.",
    },
  },
  {
    id: "int_003",
    companyName: "Linear",
    companyLogo: "/logos/linear.svg",
    role: "Product Engineer",
    roundType: "system_design",
    dateTime: new Date(2026, 2, 18, 11, 0),
    timezone: "PST",
    platform: "zoom",
    meetingLink: "https://zoom.us/j/987654321",
    interviewer: {
      name: "Alex Rivera",
      title: "Engineering Manager",
      linkedinUrl: "https://linkedin.com/in/alexrivera",
    },
    prepPackUrl: "/prep/linear-system-design",
    checklist: {
      prepReviewed: false,
      starAnswersReady: false,
      questionsPrepared: false,
      techSetupTested: false,
      salaryAnchorMemorized: false,
    },
    notes: "",
  },
  {
    id: "int_004",
    companyName: "Notion",
    companyLogo: "/logos/notion.svg",
    role: "Senior Frontend Engineer",
    roundType: "hiring_manager",
    dateTime: new Date(2026, 2, 20, 15, 0),
    timezone: "PST",
    platform: "teams",
    meetingLink: "https://teams.microsoft.com/meet/123",
    interviewer: {
      name: "Emily Watson",
      title: "VP of Engineering",
      linkedinUrl: "https://linkedin.com/in/emilywatson",
    },
    prepPackUrl: "/prep/notion-hm",
    checklist: {
      prepReviewed: false,
      starAnswersReady: false,
      questionsPrepared: false,
      techSetupTested: false,
      salaryAnchorMemorized: false,
    },
    notes: "",
  },
  {
    id: "int_005",
    companyName: "Figma",
    companyLogo: "/logos/figma.svg",
    role: "Staff Engineer",
    roundType: "final_round",
    dateTime: new Date(2026, 2, 25, 9, 0),
    timezone: "PST",
    platform: "zoom",
    meetingLink: "https://zoom.us/j/111222333",
    interviewer: {
      name: "David Kim",
      title: "CTO",
      linkedinUrl: "https://linkedin.com/in/davidkim",
    },
    checklist: {
      prepReviewed: false,
      starAnswersReady: false,
      questionsPrepared: false,
      techSetupTested: false,
      salaryAnchorMemorized: false,
    },
    notes: "",
  },
  {
    id: "int_006",
    companyName: "Airbnb",
    companyLogo: "/logos/airbnb.svg",
    role: "Senior Engineer",
    roundType: "culture_fit",
    dateTime: new Date(2026, 2, 14, 16, 0),
    timezone: "PST",
    platform: "google_meet",
    meetingLink: "https://meet.google.com/xyz-uvwx-rst",
    interviewer: {
      name: "Jessica Lee",
      title: "People Partner",
      linkedinUrl: "https://linkedin.com/in/jessicalee",
    },
    checklist: {
      prepReviewed: true,
      starAnswersReady: true,
      questionsPrepared: true,
      techSetupTested: true,
      salaryAnchorMemorized: true,
    },
    notes: "Review Airbnb's core values.",
    postInterview: {
      difficulty: 2,
      performance: 5,
      questionsAsked: "Describe a time you handled conflict. How do you approach collaboration?",
      nextSteps: "Awaiting feedback from the team.",
    },
  },
  // More future interviews
  {
    id: "int_007",
    companyName: "Shopify",
    companyLogo: "/logos/shopify.svg",
    role: "Staff Engineer",
    roundType: "technical",
    dateTime: new Date(2026, 2, 17, 13, 0),
    timezone: "PST",
    platform: "zoom",
    meetingLink: "https://zoom.us/j/444555666",
    interviewer: {
      name: "Ryan Park",
      title: "Principal Engineer",
      linkedinUrl: "https://linkedin.com/in/ryanpark",
    },
    checklist: {
      prepReviewed: false,
      starAnswersReady: false,
      questionsPrepared: false,
      techSetupTested: false,
      salaryAnchorMemorized: false,
    },
    notes: "",
  },
  {
    id: "int_008",
    companyName: "Datadog",
    companyLogo: "/logos/datadog.svg",
    role: "Senior Backend Engineer",
    roundType: "phone_screen",
    dateTime: new Date(2026, 2, 19, 10, 30),
    timezone: "PST",
    platform: "google_meet",
    meetingLink: "https://meet.google.com/ddd-eee-fff",
    interviewer: {
      name: "Priya Sharma",
      title: "Recruiter",
      linkedinUrl: "https://linkedin.com/in/priyasharma",
    },
    checklist: {
      prepReviewed: false,
      starAnswersReady: false,
      questionsPrepared: false,
      techSetupTested: false,
      salaryAnchorMemorized: false,
    },
    notes: "",
  },
  // Past interviews
  {
    id: "int_009",
    companyName: "Coinbase",
    companyLogo: "/logos/coinbase.svg",
    role: "Senior Software Engineer",
    roundType: "technical",
    dateTime: new Date(2026, 2, 10, 11, 0),
    timezone: "PST",
    platform: "zoom",
    meetingLink: "https://zoom.us/j/777888999",
    interviewer: {
      name: "James Wilson",
      title: "Engineering Manager",
      linkedinUrl: "https://linkedin.com/in/jameswilson",
    },
    checklist: {
      prepReviewed: true,
      starAnswersReady: true,
      questionsPrepared: true,
      techSetupTested: true,
      salaryAnchorMemorized: true,
    },
    notes: "Good discussion about distributed systems.",
    postInterview: {
      difficulty: 4,
      performance: 3,
      questionsAsked: "System design for a payment processing pipeline.",
      nextSteps: "Waiting on feedback.",
    },
  },
  {
    id: "int_010",
    companyName: "Plaid",
    companyLogo: "/logos/plaid.svg",
    role: "Backend Engineer",
    roundType: "hiring_manager",
    dateTime: new Date(2026, 2, 7, 14, 0),
    timezone: "PST",
    platform: "teams",
    meetingLink: "https://teams.microsoft.com/meet/456",
    interviewer: {
      name: "Michelle Chen",
      title: "Director of Engineering",
      linkedinUrl: "https://linkedin.com/in/michellechen",
    },
    checklist: {
      prepReviewed: true,
      starAnswersReady: true,
      questionsPrepared: true,
      techSetupTested: true,
      salaryAnchorMemorized: true,
    },
    notes: "Discussed team culture and growth opportunities.",
    postInterview: {
      difficulty: 3,
      performance: 4,
      questionsAsked: "Leadership experience and career goals.",
      nextSteps: "Final round scheduled.",
    },
  },
]

export default function InterviewsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week">("month")
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews)

  // Calculate calendar range based on view mode
  const calendarRange = useMemo(() => {
    if (viewMode === "month") {
      const monthStart = startOfMonth(currentDate)
      const monthEnd = endOfMonth(currentDate)
      return {
        start: startOfWeek(monthStart),
        end: endOfWeek(monthEnd),
      }
    } else {
      return {
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      }
    }
  }, [currentDate, viewMode])

  const days = useMemo(
    () => eachDayOfInterval(calendarRange),
    [calendarRange]
  )

  const getInterviewsForDay = (date: Date) =>
    interviews.filter((interview) => isSameDay(interview.dateTime, date))

  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else {
      setCurrentDate(subWeeks(currentDate, 1))
    }
  }

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else {
      setCurrentDate(addWeeks(currentDate, 1))
    }
  }

  const handleToday = () => setCurrentDate(new Date())

  const updateInterviewChecklist = (
    interviewId: string,
    key: keyof Interview["checklist"],
    value: boolean
  ) => {
    setInterviews((prev) =>
      prev.map((interview) =>
        interview.id === interviewId
          ? {
              ...interview,
              checklist: { ...interview.checklist, [key]: value },
            }
          : interview
      )
    )
    if (selectedInterview?.id === interviewId) {
      setSelectedInterview((prev) =>
        prev
          ? {
              ...prev,
              checklist: { ...prev.checklist, [key]: value },
            }
          : null
      )
    }
  }

  const updateInterviewNotes = (interviewId: string, notes: string) => {
    setInterviews((prev) =>
      prev.map((interview) =>
        interview.id === interviewId ? { ...interview, notes } : interview
      )
    )
    if (selectedInterview?.id === interviewId) {
      setSelectedInterview((prev) => (prev ? { ...prev, notes } : null))
    }
  }

  const updatePostInterview = (
    interviewId: string,
    postInterview: Interview["postInterview"]
  ) => {
    setInterviews((prev) =>
      prev.map((interview) =>
        interview.id === interviewId ? { ...interview, postInterview } : interview
      )
    )
    if (selectedInterview?.id === interviewId) {
      setSelectedInterview((prev) => (prev ? { ...prev, postInterview } : null))
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">Interviews</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-border">
            <Button
              variant={viewMode === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="rounded-r-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Month
            </Button>
            <Button
              variant={viewMode === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="rounded-l-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Week
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-primary sm:hidden"
              aria-label="Previous"
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              className="hidden focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex"
            >
              <ChevronLeftIcon className="mr-1 size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="focus-visible:ring-2 focus-visible:ring-primary"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-primary sm:hidden"
              aria-label="Next"
            >
              <ChevronRightIcon className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="hidden focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex"
            >
              Next
              <ChevronRightIcon className="ml-1 size-4" />
            </Button>
          </div>

          {/* Current Period Label */}
          <h2 className="text-base font-semibold text-foreground sm:min-w-[160px] sm:text-lg">
            {viewMode === "month"
              ? format(currentDate, "MMMM yyyy")
              : `Week of ${format(calendarRange.start, "MMM d")}`}
          </h2>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2 sm:gap-4 md:px-6">
        {Object.entries(roundTypeConfig).map(([type, config]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className={cn(
                "size-3 rounded-sm",
                config.bgColor,
                config.borderColor,
                "border"
              )}
            />
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid or Empty State */}
      {interviews.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <CalendarDaysIcon className="mb-4 size-16 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            No interviews scheduled yet
          </h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Keep applying! When you land interviews, they will appear here.
          </p>
          <Button asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-4">
            {/* Day Headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => {
                const dayInterviews = getInterviewsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isCurrentDay = isToday(day)

                return (
                  <CalendarDay
                    key={day.toISOString()}
                    day={day}
                    interviews={dayInterviews}
                    isCurrentMonth={isCurrentMonth}
                    isCurrentDay={isCurrentDay}
                    onSelectInterview={setSelectedInterview}
                    viewMode={viewMode}
                  />
                )
              })}
            </div>
          </div>
        </ScrollArea>
      )}

      {/* Interview Detail Modal */}
      <Dialog
        open={!!selectedInterview}
        onOpenChange={(open) => !open && setSelectedInterview(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          {selectedInterview && (
            <InterviewDetail
              interview={selectedInterview}
              onUpdateChecklist={(key, value) =>
                updateInterviewChecklist(selectedInterview.id, key, value)
              }
              onUpdateNotes={(notes) =>
                updateInterviewNotes(selectedInterview.id, notes)
              }
              onUpdatePostInterview={(postInterview) =>
                updatePostInterview(selectedInterview.id, postInterview)
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CalendarDayProps {
  day: Date
  interviews: Interview[]
  isCurrentMonth: boolean
  isCurrentDay: boolean
  onSelectInterview: (interview: Interview) => void
  viewMode: "month" | "week"
}

function CalendarDay({
  day,
  interviews,
  isCurrentMonth,
  isCurrentDay,
  onSelectInterview,
  viewMode,
}: CalendarDayProps) {
  const minHeight = viewMode === "week" ? "min-h-[200px]" : "min-h-[120px]"

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-border p-2 transition-colors",
        minHeight,
        !isCurrentMonth && "bg-muted/20 opacity-50",
        isCurrentDay && "ring-2 ring-primary"
      )}
    >
      {/* Day Number */}
      <span
        className={cn(
          "mb-1.5 text-sm",
          isCurrentDay
            ? "font-semibold text-primary"
            : isCurrentMonth
              ? "text-foreground"
              : "text-muted-foreground"
        )}
      >
        {format(day, "d")}
      </span>

      {/* Interview Pills */}
      <div className="flex flex-col gap-1">
        {interviews.slice(0, viewMode === "week" ? 5 : 3).map((interview) => {
          const config = roundTypeConfig[interview.roundType]
          return (
            <button
              key={interview.id}
              onClick={() => onSelectInterview(interview)}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2 py-1 text-left transition-all",
                "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                config.bgColor,
                config.borderColor,
                config.textColor
              )}
            >
              {/* Company Logo */}
              <Avatar className="size-4 shrink-0">
                <AvatarImage src={interview.companyLogo} alt={interview.companyName} />
                <AvatarFallback className="text-[8px]">
                  {interview.companyName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Role + Time */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-medium leading-tight">
                  {interview.role}
                </p>
                <p className="font-mono text-[9px] opacity-80">
                  {format(interview.dateTime, "h:mm a")}
                </p>
              </div>
            </button>
          )
        })}
        {interviews.length > (viewMode === "week" ? 5 : 3) && (
          <span className="text-[10px] text-muted-foreground">
            +{interviews.length - (viewMode === "week" ? 5 : 3)} more
          </span>
        )}
      </div>
    </div>
  )
}

interface InterviewDetailProps {
  interview: Interview
  onUpdateChecklist: (key: keyof Interview["checklist"], value: boolean) => void
  onUpdateNotes: (notes: string) => void
  onUpdatePostInterview: (postInterview: Interview["postInterview"]) => void
}

function InterviewDetail({
  interview,
  onUpdateChecklist,
  onUpdateNotes,
  onUpdatePostInterview,
}: InterviewDetailProps) {
  const { toast } = useToast()
  const config = roundTypeConfig[interview.roundType]
  const platform = platformConfig[interview.platform]
  const isPast = interview.dateTime < new Date()

  const [postInterview, setPostInterview] = useState<
    NonNullable<Interview["postInterview"]>
  >(
    interview.postInterview ?? {
      difficulty: 0,
      performance: 0,
      questionsAsked: "",
      nextSteps: "",
    }
  )

  return (
    <>
      <DialogHeader>
        <div className="flex items-start gap-4">
          <Avatar className="size-12">
            <AvatarImage src={interview.companyLogo} alt={interview.companyName} />
            <AvatarFallback className="text-lg">
              {interview.companyName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <DialogTitle className="text-lg">{interview.role}</DialogTitle>
            <p className="text-sm text-muted-foreground">{interview.companyName}</p>
            <Badge
              variant="outline"
              className={cn("mt-2", config.bgColor, config.textColor, config.borderColor)}
            >
              {config.label}
            </Badge>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-6">
        {/* Date/Time/Timezone */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h4 className="mb-2 text-sm font-medium text-foreground">Schedule</h4>
          <p className="font-mono text-sm text-foreground">
            {format(interview.dateTime, "EEEE, MMMM d, yyyy")}
          </p>
          <p className="font-mono text-sm text-foreground">
            {format(interview.dateTime, "h:mm a")} {interview.timezone}
          </p>
        </div>

        {/* Platform + Join Meeting */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h4 className="mb-2 text-sm font-medium text-foreground">Meeting</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <VideoIcon className="size-4 text-muted-foreground" />
              </div>
              <span className="text-sm text-foreground">{platform.label}</span>
            </div>
            <Button
              size="sm"
              asChild
              className="focus-visible:ring-2 focus-visible:ring-primary"
            >
              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Meeting
                <ExternalLinkIcon className="ml-1.5 size-3" />
              </a>
            </Button>
          </div>
        </div>

        {/* Interviewer */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h4 className="mb-2 text-sm font-medium text-foreground">Interviewer</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarImage
                  src={interview.interviewer.avatarUrl}
                  alt={interview.interviewer.name}
                />
                <AvatarFallback>
                  {interview.interviewer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {interview.interviewer.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {interview.interviewer.title}
                </p>
              </div>
            </div>
            {interview.interviewer.linkedinUrl && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="focus-visible:ring-2 focus-visible:ring-primary"
              >
                <a
                  href={interview.interviewer.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedinIcon className="mr-1.5 size-4" />
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Prep Pack */}
        {interview.prepPackUrl && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <h4 className="mb-2 text-sm font-medium text-foreground">
              Preparation
            </h4>
            <Button
              variant="outline"
              asChild
              className="w-full justify-start focus-visible:ring-2 focus-visible:ring-primary"
            >
              <a href={interview.prepPackUrl}>
                <FileTextIcon className="mr-2 size-4" />
                View Prep Pack
                <ChevronRightIcon className="ml-auto size-4" />
              </a>
            </Button>
          </div>
        )}

        {/* Checklist */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h4 className="mb-3 text-sm font-medium text-foreground">
            Pre-Interview Checklist
          </h4>
          <div className="space-y-3">
            {[
              { key: "prepReviewed" as const, label: "Prep materials reviewed?" },
              { key: "starAnswersReady" as const, label: "STAR answers ready?" },
              { key: "questionsPrepared" as const, label: "Questions prepared?" },
              { key: "techSetupTested" as const, label: "Tech setup tested?" },
              { key: "salaryAnchorMemorized" as const, label: "Salary anchor memorized?" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <Checkbox
                  id={`checklist-${key}`}
                  checked={interview.checklist[key]}
                  onCheckedChange={(checked) =>
                    onUpdateChecklist(key, checked === true)
                  }
                  className="transition-transform data-[state=checked]:scale-105"
                />
                <Label
                  htmlFor={`checklist-${key}`}
                  className={cn(
                    "text-sm transition-colors",
                    interview.checklist[key]
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  )}
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h4 className="mb-2 text-sm font-medium text-foreground">Notes</h4>
          <Textarea
            value={interview.notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder="Add notes for this interview..."
            className="min-h-[80px] resize-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Post-Interview Section (only for past interviews) */}
        {isPast && (
          <div className="rounded-xl border border-border bg-surface-raised p-4">
            <h4 className="mb-4 text-sm font-medium text-foreground">
              How did it go?
            </h4>

            <div className="space-y-4">
              {/* Difficulty Rating */}
              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">
                  Difficulty
                </Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        const updated = { ...postInterview, difficulty: rating }
                        setPostInterview(updated)
                        onUpdatePostInterview(updated)
                      }}
                      className="rounded p-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <StarIcon
                        className={cn(
                          "size-5",
                          rating <= postInterview.difficulty
                            ? "fill-warning text-warning"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Performance Rating */}
              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">
                  Your Performance
                </Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => {
                        const updated = { ...postInterview, performance: rating }
                        setPostInterview(updated)
                        onUpdatePostInterview(updated)
                      }}
                      className="rounded p-1 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <StarIcon
                        className={cn(
                          "size-5",
                          rating <= postInterview.performance
                            ? "fill-success text-success"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions Asked */}
              <div>
                <Label
                  htmlFor="questions-asked"
                  className="mb-2 block text-xs text-muted-foreground"
                >
                  Questions Asked
                </Label>
                <Textarea
                  id="questions-asked"
                  value={postInterview.questionsAsked}
                  onChange={(e) => {
                    const updated = {
                      ...postInterview,
                      questionsAsked: e.target.value,
                    }
                    setPostInterview(updated)
                    onUpdatePostInterview(updated)
                  }}
                  placeholder="What questions were you asked?"
                  className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              {/* Next Steps */}
              <div>
                <Label
                  htmlFor="next-steps"
                  className="mb-2 block text-xs text-muted-foreground"
                >
                  Next Steps
                </Label>
                <Textarea
                  id="next-steps"
                  value={postInterview.nextSteps}
                  onChange={(e) => {
                    const updated = {
                      ...postInterview,
                      nextSteps: e.target.value,
                    }
                    setPostInterview(updated)
                    onUpdatePostInterview(updated)
                  }}
                  placeholder="What are the next steps?"
                  className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={() => {
                  onUpdatePostInterview(postInterview)
                  toast({
                    title: "Feedback saved",
                    description: "Your interview feedback has been saved successfully.",
                  })
                }}
                className="w-full focus-visible:ring-2 focus-visible:ring-primary"
              >
                Save Feedback
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
