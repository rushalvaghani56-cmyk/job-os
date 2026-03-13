/**
 * Query Keys
 * Centralized query key factory for TanStack Query
 */

import type { JobFilter } from "@/src/types/jobs";
import type { ReviewFilter } from "@/src/types/review";
import type { ContactFilter } from "@/src/types/outreach";
import type { NotificationFilter } from "@/src/types/notifications";
import type { AnalyticsPeriod } from "@/src/types/analytics";

export const queryKeys = {
  /** Job-related query keys */
  jobs: {
    all: ["jobs"] as const,
    lists: () => [...queryKeys.jobs.all, "list"] as const,
    list: (filters: JobFilter) => [...queryKeys.jobs.lists(), filters] as const,
    details: () => [...queryKeys.jobs.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.jobs.details(), id] as const,
    score: (id: string) => [...queryKeys.jobs.all, "score", id] as const,
    similar: (id: string) => [...queryKeys.jobs.all, "similar", id] as const,
    stats: () => [...queryKeys.jobs.all, "stats"] as const,
  },

  /** Profile-related query keys */
  profiles: {
    all: ["profiles"] as const,
    lists: () => [...queryKeys.profiles.all, "list"] as const,
    list: () => [...queryKeys.profiles.lists()] as const,
    details: () => [...queryKeys.profiles.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.profiles.details(), id] as const,
    active: () => [...queryKeys.profiles.all, "active"] as const,
  },

  /** Application-related query keys */
  applications: {
    all: ["applications"] as const,
    lists: () => [...queryKeys.applications.all, "list"] as const,
    list: (status?: string) => [...queryKeys.applications.lists(), status] as const,
    details: () => [...queryKeys.applications.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.applications.details(), id] as const,
    kanban: () => [...queryKeys.applications.all, "kanban"] as const,
    stats: () => [...queryKeys.applications.all, "stats"] as const,
  },

  /** Review queue query keys */
  reviews: {
    all: ["reviews"] as const,
    lists: () => [...queryKeys.reviews.all, "list"] as const,
    list: (filters?: ReviewFilter) => [...queryKeys.reviews.lists(), filters] as const,
    details: () => [...queryKeys.reviews.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.reviews.details(), id] as const,
    stats: () => [...queryKeys.reviews.all, "stats"] as const,
  },

  /** Outreach/contact query keys */
  contacts: {
    all: ["contacts"] as const,
    lists: () => [...queryKeys.contacts.all, "list"] as const,
    list: (filters?: ContactFilter) => [...queryKeys.contacts.lists(), filters] as const,
    details: () => [...queryKeys.contacts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.contacts.details(), id] as const,
    messages: (contactId: string) => [...queryKeys.contacts.all, "messages", contactId] as const,
    stats: () => [...queryKeys.contacts.all, "stats"] as const,
  },

  /** Interview query keys */
  interviews: {
    all: ["interviews"] as const,
    lists: () => [...queryKeys.interviews.all, "list"] as const,
    list: (upcoming?: boolean) => [...queryKeys.interviews.lists(), upcoming] as const,
    details: () => [...queryKeys.interviews.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.interviews.details(), id] as const,
    calendar: (month: string) => [...queryKeys.interviews.all, "calendar", month] as const,
  },

  /** Analytics query keys */
  analytics: {
    all: ["analytics"] as const,
    dashboard: (period: AnalyticsPeriod) => [...queryKeys.analytics.all, "dashboard", period] as const,
    funnel: (period: AnalyticsPeriod) => [...queryKeys.analytics.all, "funnel", period] as const,
    sources: (period: AnalyticsPeriod) => [...queryKeys.analytics.all, "sources", period] as const,
    rejections: (period: AnalyticsPeriod) => [...queryKeys.analytics.all, "rejections", period] as const,
    goals: () => [...queryKeys.analytics.all, "goals"] as const,
    abTests: () => [...queryKeys.analytics.all, "ab-tests"] as const,
    skills: () => [...queryKeys.analytics.all, "skills"] as const,
    timing: () => [...queryKeys.analytics.all, "timing"] as const,
  },

  /** Notification query keys */
  notifications: {
    all: ["notifications"] as const,
    lists: () => [...queryKeys.notifications.all, "list"] as const,
    list: (filters?: NotificationFilter) => [...queryKeys.notifications.lists(), filters] as const,
    unread: () => [...queryKeys.notifications.all, "unread"] as const,
    stats: () => [...queryKeys.notifications.all, "stats"] as const,
  },

  /** Settings query keys */
  settings: {
    all: ["settings"] as const,
    user: () => [...queryKeys.settings.all, "user"] as const,
    section: (section: string) => [...queryKeys.settings.all, section] as const,
  },

  /** User query keys */
  user: {
    all: ["user"] as const,
    current: () => [...queryKeys.user.all, "current"] as const,
    preferences: () => [...queryKeys.user.all, "preferences"] as const,
  },
};
