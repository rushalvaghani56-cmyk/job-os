import {
  Home,
  Briefcase,
  ClipboardCheck,
  Kanban,
  Users,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  Settings,
  UserCircle,
  Folder,
  Clock,
  Sparkles,
  Shield,
} from "lucide-react";

// Route paths
export const ROUTES = {
  // Public
  HOME: "/",
  AUTH: "/auth",
  LOGIN: "/auth",
  SIGNUP: "/auth?mode=signup",
  FORGOT_PASSWORD: "/auth/forgot-password",

  // Onboarding
  ONBOARDING: "/onboarding",
  ONBOARDING_STEP: (step: number) => `/onboarding?step=${step}`,

  // Dashboard
  DASHBOARD: "/home",
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
  FILES: "/files",
  ACTIVITY: "/activity",
  CHANGELOG: "/changelog",
  NOTIFICATIONS: "/notifications",

  // Admin
  ADMIN: "/admin",
} as const;

// Navigation items
export const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: ROUTES.DASHBOARD,
    badge: null,
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: Briefcase,
    href: ROUTES.JOBS,
    badge: "new_jobs",
  },
  {
    id: "review",
    label: "Review Queue",
    icon: ClipboardCheck,
    href: ROUTES.REVIEW,
    badge: "pending_reviews",
  },
  {
    id: "applications",
    label: "Applications",
    icon: Kanban,
    href: ROUTES.APPLICATIONS,
    badge: "active_applications",
  },
  {
    id: "outreach",
    label: "Outreach",
    icon: Users,
    href: ROUTES.OUTREACH,
    badge: null,
  },
  {
    id: "email",
    label: "Email Hub",
    icon: Mail,
    href: ROUTES.EMAIL,
    badge: null,
  },
  {
    id: "interviews",
    label: "Interviews",
    icon: Calendar,
    href: ROUTES.INTERVIEWS,
    badge: "upcoming_interviews",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: ROUTES.ANALYTICS,
    badge: null,
  },
  {
    id: "market",
    label: "Market Intel",
    icon: TrendingUp,
    href: ROUTES.MARKET,
    badge: null,
  },
] as const;

export const NAV_ITEMS_SECONDARY = [
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: ROUTES.SETTINGS,
    badge: "settings_warning",
  },
  {
    id: "profiles",
    label: "Profiles",
    icon: UserCircle,
    href: ROUTES.PROFILES,
    badge: null,
  },
  {
    id: "files",
    label: "Files",
    icon: Folder,
    href: ROUTES.FILES,
    badge: null,
  },
  {
    id: "activity",
    label: "Activity Log",
    icon: Clock,
    href: ROUTES.ACTIVITY,
    badge: null,
  },
] as const;

export const NAV_ITEMS_BOTTOM = [
  {
    id: "changelog",
    label: "What's New",
    icon: Sparkles,
    href: ROUTES.CHANGELOG,
    badge: "unread_updates",
  },
  {
    id: "admin",
    label: "Admin Panel",
    icon: Shield,
    href: ROUTES.ADMIN,
    badge: null,
    adminOnly: true,
  },
] as const;

// Mobile nav items (subset)
export const MOBILE_NAV_ITEMS = [
  NAV_ITEMS[0], // Dashboard
  NAV_ITEMS[1], // Jobs
  NAV_ITEMS[2], // Review
  NAV_ITEMS[3], // Applications
] as const;

// Breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

// Layout dimensions
export const LAYOUT = {
  SIDEBAR_WIDTH: 260,
  SIDEBAR_COLLAPSED_WIDTH: 68,
  TOPBAR_HEIGHT: 56,
  COPILOT_MIN_WIDTH: 380,
  COPILOT_MAX_WIDTH: 600,
  PAGE_PADDING: 24,
  CARD_PADDING: 20,
  CARD_GAP: 16,
  SECTION_GAP: 24,
  MOBILE_NAV_HEIGHT: 64,
} as const;

// Status colors
export const JOB_STATUS_COLORS = {
  new: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  scored: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
  content_ready: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  applied: { bg: "bg-sky-100", text: "text-sky-700", dot: "bg-sky-500" },
  interview: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  offer: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  skipped: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  bookmarked: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  ghosted: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
} as const;

export const APPLICATION_STATUS_COLORS = {
  pending: { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" },
  submitted: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  screening: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-500" },
  interview: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  offer: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  rejected: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  withdrawn: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  ghosted: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
} as const;

// Score badge colors
export const SCORE_COLORS = {
  excellent: { min: 85, bg: "bg-emerald-500", text: "text-white" },
  good: { min: 70, bg: "bg-blue-500", text: "text-white" },
  fair: { min: 60, bg: "bg-amber-500", text: "text-gray-900" },
  poor: { min: 0, bg: "bg-gray-400", text: "text-gray-700" },
} as const;

// Priority colors
export const PRIORITY_COLORS = {
  1: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300", label: "Dream" },
  2: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300", label: "High" },
  3: { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", label: "Normal" },
} as const;

// Warmth colors
export const WARMTH_COLORS = {
  cold: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  warm: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  hot: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
} as const;
