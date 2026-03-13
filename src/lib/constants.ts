/**
 * Application Constants
 * Centralized constants for routes, enums, and configuration
 */

/** Route paths */
export const ROUTES = {
  // Public routes
  HOME: "/",
  AUTH: {
    LOGIN: "/auth",
    SIGNUP: "/auth",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  STATUS: "/status",

  // Onboarding routes
  ONBOARDING: {
    ROOT: "/onboarding",
    STEP: (step: number) => `/onboarding/step-${step}`,
  },

  // Dashboard routes
  DASHBOARD: "/dashboard",
  JOBS: "/jobs",
  JOB_DETAIL: (id: string) => `/jobs/${id}`,
  REVIEW: "/review",
  APPLICATIONS: "/applications",
  OUTREACH: "/outreach",
  EMAIL: "/email",
  INTERVIEWS: "/interviews",
  ANALYTICS: "/analytics",
  MARKET: "/market",
  SETTINGS: "/settings",
  PROFILES: "/profiles",
  DOCUMENTS: "/documents",
  ACTIVITY: "/activity",
  NOTIFICATIONS: "/notifications",
  CHANGELOG: "/changelog",
  ADMIN: "/admin",
} as const;

/** Navigation items for sidebar */
export const NAV_ITEMS = {
  MAIN: [
    { label: "Home", href: ROUTES.DASHBOARD, icon: "Home" },
    { label: "Jobs", href: ROUTES.JOBS, icon: "Briefcase", badgeKey: "newJobs" },
    { label: "Review Queue", href: ROUTES.REVIEW, icon: "ClipboardCheck", badgeKey: "pendingReviews" },
    { label: "Applications", href: ROUTES.APPLICATIONS, icon: "Send", badgeKey: "activeApplications" },
    { label: "Outreach", href: ROUTES.OUTREACH, icon: "Mail", badgeKey: "pendingOutreach" },
    { label: "Email Hub", href: ROUTES.EMAIL, icon: "Inbox", badgeKey: "unreadEmails" },
    { label: "Interviews", href: ROUTES.INTERVIEWS, icon: "Calendar", badgeKey: "upcomingInterviews" },
    { label: "Analytics", href: ROUTES.ANALYTICS, icon: "BarChart2" },
    { label: "Market Intel", href: ROUTES.MARKET, icon: "TrendingUp" },
  ],
  SECONDARY: [
    { label: "Settings", href: ROUTES.SETTINGS, icon: "Settings", warningKey: "invalidApiKey" },
    { label: "Profiles", href: ROUTES.PROFILES, icon: "Users" },
    { label: "Files", href: ROUTES.DOCUMENTS, icon: "Folder" },
    { label: "Activity Log", href: ROUTES.ACTIVITY, icon: "ScrollText" },
  ],
  BOTTOM: [
    { label: "What's New", href: ROUTES.CHANGELOG, icon: "Sparkles", dotKey: "hasWhatsNew" },
  ],
  ADMIN: [
    { label: "Admin Panel", href: ROUTES.ADMIN, icon: "Shield" },
  ],
} as const;

/** Job status values */
export const JOB_STATUS = {
  NEW: "new",
  SCORED: "scored",
  CONTENT_READY: "content_ready",
  APPLIED: "applied",
  INTERVIEW: "interview",
  OFFER: "offer",
  REJECTED: "rejected",
  SKIPPED: "skipped",
  BOOKMARKED: "bookmarked",
  GHOSTED: "ghosted",
} as const;

/** Application status values */
export const APPLICATION_STATUS = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  SCREENING: "screening",
  INTERVIEW: "interview",
  OFFER: "offer",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
  GHOSTED: "ghosted",
} as const;

/** Job decision values */
export const JOB_DECISION = {
  AUTO_APPLY: "auto_apply",
  REVIEW: "review",
  SKIP: "skip",
} as const;

/** Notification priority values */
export const NOTIFICATION_PRIORITY = {
  CRITICAL: "critical",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

/** Score badge colors */
export const SCORE_COLORS = {
  EXCELLENT: { min: 85, color: "#10B981", bg: "bg-emerald-500", text: "text-white" },
  GOOD: { min: 70, max: 84, color: "#3B82F6", bg: "bg-blue-500", text: "text-white" },
  FAIR: { min: 60, max: 69, color: "#F59E0B", bg: "bg-amber-500", text: "text-amber-950" },
  POOR: { max: 59, color: "#94A3B8", bg: "bg-slate-400", text: "text-slate-700" },
  DREAM: { color: "#8B5CF6", bg: "bg-violet-500", text: "text-white" },
} as const;

/** Breakpoints matching Tailwind */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

/** UI dimensions */
export const UI_DIMENSIONS = {
  SIDEBAR_EXPANDED: 260,
  SIDEBAR_COLLAPSED: 68,
  TOPBAR_HEIGHT: 56,
  COPILOT_MIN_WIDTH: 380,
  COPILOT_MAX_WIDTH: 600,
  PAGE_PADDING: 24,
  CARD_PADDING: 20,
  CARD_GAP: 16,
  SECTION_GAP: 24,
} as const;

/** Animation durations */
export const ANIMATION = {
  FAST: 100,
  NORMAL: 200,
  SLOW: 300,
} as const;
