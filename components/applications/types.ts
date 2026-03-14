export type ApplicationStatus =
  | "pending"
  | "submitted"
  | "screening"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn"
  | "ghosted"

export type ViewMode = "kanban" | "table" | "calendar"

export interface Application {
  id: string
  jobId: string
  jobTitle: string
  company: {
    name: string
    logo?: string
  }
  score: number
  status: ApplicationStatus
  submittedAt?: Date
  lastActivityAt: Date
  daysInStage: number
  interviewDate?: Date
  interviewProbability?: number
  notes?: string
  source?: string
}

export interface ApplicationColumn {
  id: ApplicationStatus
  label: string
  color: string
}

export interface CalendarEvent {
  id: string
  applicationId: string
  type: "submitted" | "interview" | "follow_up" | "deadline"
  date: Date
  title: string
  company: string
}

export const APPLICATION_COLUMNS: ApplicationColumn[] = [
  { id: "pending", label: "Pending", color: "bg-slate-500" },
  { id: "submitted", label: "Submitted", color: "bg-blue-500" },
  { id: "screening", label: "Screening", color: "bg-amber-500" },
  { id: "interview", label: "Interview", color: "bg-emerald-500" },
  { id: "offer", label: "Offer", color: "bg-green-500" },
  { id: "rejected", label: "Rejected", color: "bg-red-500" },
  { id: "withdrawn", label: "Withdrawn", color: "bg-gray-500" },
  { id: "ghosted", label: "Ghosted", color: "bg-gray-400" },
]

export function getStatusLabel(status: ApplicationStatus): string {
  const column = APPLICATION_COLUMNS.find((c) => c.id === status)
  return column?.label ?? status
}

export function getStatusColor(status: ApplicationStatus): string {
  const column = APPLICATION_COLUMNS.find((c) => c.id === status)
  return column?.color ?? "bg-gray-500"
}
