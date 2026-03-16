import type { JobFilter } from "@/types/jobs";

/**
 * Centralized query key factory for TanStack Query
 */
export const queryKeys = {
  // Jobs
  jobs: {
    all: ["jobs"] as const,
    lists: () => [...queryKeys.jobs.all, "list"] as const,
    list: (filters?: JobFilter) => [...queryKeys.jobs.lists(), filters] as const,
    details: () => [...queryKeys.jobs.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.jobs.details(), id] as const,
    stats: () => [...queryKeys.jobs.all, "stats"] as const,
  },

  // Profiles
  profiles: {
    all: ["profiles"] as const,
    lists: () => [...queryKeys.profiles.all, "list"] as const,
    list: () => [...queryKeys.profiles.lists()] as const,
    details: () => [...queryKeys.profiles.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.profiles.details(), id] as const,
    completeness: (id: string) => [...queryKeys.profiles.all, "completeness", id] as const,
  },

  // Applications
  applications: {
    all: ["applications"] as const,
    lists: () => [...queryKeys.applications.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.applications.lists(), filters] as const,
    details: () => [...queryKeys.applications.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.applications.details(), id] as const,
    kanban: () => [...queryKeys.applications.all, "kanban"] as const,
    stats: () => [...queryKeys.applications.all, "stats"] as const,
    timeline: (id: string) => [...queryKeys.applications.all, "timeline", id] as const,
  },

  // Review Queue
  reviews: {
    all: ["reviews"] as const,
    lists: () => [...queryKeys.reviews.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.reviews.lists(), filters] as const,
    details: () => [...queryKeys.reviews.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.reviews.details(), id] as const,
    stats: () => [...queryKeys.reviews.all, "stats"] as const,
  },

  // Outreach
  contacts: {
    all: ["contacts"] as const,
    lists: () => [...queryKeys.contacts.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.contacts.lists(), filters] as const,
    details: () => [...queryKeys.contacts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.contacts.details(), id] as const,
    stats: () => [...queryKeys.contacts.all, "stats"] as const,
    followUps: () => [...queryKeys.contacts.all, "followups"] as const,
  },

  // Analytics
  analytics: {
    all: ["analytics"] as const,
    dashboard: () => [...queryKeys.analytics.all, "dashboard"] as const,
    funnel: (period: string) => [...queryKeys.analytics.all, "funnel", period] as const,
    sources: (period: string) => [...queryKeys.analytics.all, "sources", period] as const,
    rejections: (period: string) => [...queryKeys.analytics.all, "rejections", period] as const,
    goals: () => [...queryKeys.analytics.all, "goals"] as const,
    abTests: () => [...queryKeys.analytics.all, "abtests"] as const,
    skills: () => [...queryKeys.analytics.all, "skills"] as const,
    timing: () => [...queryKeys.analytics.all, "timing"] as const,
    aiCost: (period: string) => [...queryKeys.analytics.all, "aicost", period] as const,
  },

  // Notifications
  notifications: {
    all: ["notifications"] as const,
    lists: () => [...queryKeys.notifications.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.notifications.lists(), filters] as const,
    unreadCount: () => [...queryKeys.notifications.all, "unreadCount"] as const,
  },

  // Settings
  settings: {
    all: ["settings"] as const,
    user: () => [...queryKeys.settings.all, "user"] as const,
    aiModels: () => [...queryKeys.settings.all, "aiModels"] as const,
    automation: () => [...queryKeys.settings.all, "automation"] as const,
    scoring: () => [...queryKeys.settings.all, "scoring"] as const,
    sources: () => [...queryKeys.settings.all, "sources"] as const,
    notifications: () => [...queryKeys.settings.all, "notifications"] as const,
  },

  // User
  user: {
    all: ["user"] as const,
    current: () => [...queryKeys.user.all, "current"] as const,
    activity: () => [...queryKeys.user.all, "activity"] as const,
  },

  // Files
  files: {
    all: ["files"] as const,
    lists: () => [...queryKeys.files.all, "list"] as const,
    list: (folder?: string) => [...queryKeys.files.lists(), folder] as const,
    detail: (id: string) => [...queryKeys.files.all, "detail", id] as const,
  },

  // Market Intel
  market: {
    all: ["market"] as const,
    trends: () => [...queryKeys.market.all, "trends"] as const,
    salaries: (filters?: Record<string, unknown>) => [...queryKeys.market.all, "salaries", filters] as const,
    companies: () => [...queryKeys.market.all, "companies"] as const,
  },

  // Interviews
  interviews: {
    all: ["interviews"] as const,
    lists: () => [...queryKeys.interviews.all, "list"] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.interviews.lists(), filters] as const,
    upcoming: () => [...queryKeys.interviews.all, "upcoming"] as const,
    detail: (id: string) => [...queryKeys.interviews.all, "detail", id] as const,
  },

  // Content
  content: {
    all: ["content"] as const,
    variants: (jobId: string) => [...queryKeys.content.all, "variants", jobId] as const,
  },

  // Skills
  skills: {
    all: ["skills"] as const,
    byProfile: (profileId: string) => [...queryKeys.skills.all, profileId] as const,
  },

  // Experience
  experience: {
    all: ["experience"] as const,
    byProfile: (profileId: string) => [...queryKeys.experience.all, profileId] as const,
  },

  // Education
  education: {
    all: ["education"] as const,
    byProfile: (profileId: string) => [...queryKeys.education.all, profileId] as const,
  },
} as const;
