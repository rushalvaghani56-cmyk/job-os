# Implementation Tracker — Frontend-Backend Integration

## Status: Complete

### Phase 0: Backend CORS & Env Hardening
- [x] Add `cors_origins_list` property to Settings (`app/config.py`)
- [x] Enhance CORS middleware with `X-Request-ID`, `expose_headers`, `max_age` (`app/main.py`)
- [x] Create frontend `.env.example`

### Phase 1: Centralized API Client
- [x] Install axios
- [x] Rewrite `lib/api.ts` — Axios-based client with JWT interceptors
- [x] Create `lib/apiHelpers.ts` — error extraction helpers
- [x] Update `types/api.ts` — add SuccessResponse, TaskResponse, FieldError
- [x] Update `components/providers/query-provider.tsx` — use shared queryClient

### Phase 2: Auth Flow Wiring
- [x] Rewrite `stores/authStore.ts` — Supabase auth (login, signup, logout, initialize)
- [x] Update `types/database.ts` — User.name → User.full_name
- [x] Wire `components/auth/login-form.tsx` — real auth + Google OAuth
- [x] Wire `components/auth/signup-form.tsx` — real auth + Google OAuth
- [x] Update `components/auth/auth-guard.tsx` — add initialize() on mount
- [x] Create `components/auth/auth-listener.tsx` — Supabase onAuthStateChange
- [x] Add AuthListener to `app/layout.tsx`

### Phase 3: TanStack Query Hooks
- [x] Update `lib/queryKeys.ts` — add skills, experience, education, content keys
- [x] Create `hooks/useJobs.ts` (8 hooks)
- [x] Create `hooks/useApplications.ts` (5 hooks)
- [x] Create `hooks/useProfiles.ts` (8 hooks)
- [x] Create `hooks/useReview.ts` (5 hooks)
- [x] Create `hooks/useAnalytics.ts` (9 hooks)
- [x] Create `hooks/useNotifications.ts` (4 hooks)
- [x] Create `hooks/useSettings.ts` (6 hooks)
- [x] Create `hooks/useOutreach.ts` (4 hooks)
- [x] Create `hooks/useContent.ts` (3 hooks)
- [x] Create `hooks/useSkills.ts` (2 hooks)
- [x] Create `hooks/useExperience.ts` (3 hooks)
- [x] Create `hooks/useEducation.ts` (3 hooks)
- [x] Update `hooks/index.ts` — export all hooks

### Phase 4: Page Rewiring (Mock Replacement)
- [x] `app/(dashboard)/home/page.tsx` — useDashboardMetrics
- [x] `app/(dashboard)/jobs/page.tsx` — useJobs
- [x] `app/(dashboard)/jobs/[id]/page.tsx` — useJob
- [x] `app/(dashboard)/applications/page.tsx` — useApplications
- [x] `app/(dashboard)/review/page.tsx` — useReviewQueue
- [x] `app/(dashboard)/profiles/page.tsx` — useProfiles
- [x] `app/(dashboard)/notifications/page.tsx` — useNotifications
- [x] `app/(dashboard)/outreach/page.tsx` — useContacts (partial — messages/stats still inline)
- [x] `components/analytics/tab-*.tsx` (9 files) — useAnalytics hooks
- [x] `components/settings/tab-*.tsx` (4 files) — useSettings hooks
- [x] `components/jobs/filter-sidebar.tsx` — useJobStats
- [x] `components/dashboard/goal-progress.tsx` — useGoals
- [x] `components/shared/notification-bell.tsx` — useUnreadCount
- [x] `components/shell/topbar.tsx` — useProfiles, useNotifications
- [x] `components/shell/profile-switcher.tsx` — useProfiles
- [x] `components/shell/command-palette.tsx` — useProfiles
- [x] `stores/profileStore.ts` — removed inline mocks, wired to API

### Phase 5: Data Contract Alignment
- [x] Add `has_completed_onboarding`, `last_login_at` to User model (`app/models/user.py`)
- [x] Add `updated_at`, `has_completed_onboarding`, `last_login_at` to UserSchema (`app/schemas/auth.py`)
- [x] Create Alembic migration `0002_add_user_onboarding_fields`

### Phase 6: Mock Data Deletion
- [x] `components/analytics/mock-data.ts` — DELETED
- [x] `components/applications/mock-data.ts` — DELETED
- [x] `components/approval/mock-data.ts` — DELETED
- [x] `components/jobs/mock-data.ts` — DELETED
- [x] `components/jobs/job-detail-mock.ts` — DELETED
- [x] `components/settings/mock-data.ts` — DELETED
- [x] `lib/mock-data/jobs.ts` — DELETED
- [x] `lib/profile-types.ts` — removed `mockProfiles` export

### Phase 7: Verification
- [x] `npx tsc --noEmit` — zero errors
- [x] `npm run build` — successful (all 31 pages compiled)
- [x] Backend committed and pushed to `claude/integrate-nextjs-backend-L4vN4`
- [x] Frontend committed and pushed to `claude/integrate-nextjs-backend-L4vN4`

---

### Remaining Mock Data (Out of Scope)
These pages have inline mocks for features without backend endpoints yet:
- `app/(admin)/admin/page.tsx` — admin panel mock users/flags/services
- `app/status/page.tsx` — status page mock services/incidents
- `app/(dashboard)/interviews/page.tsx` — interview mock data
- `app/(dashboard)/email/page.tsx` — email hub mock data
- `app/(dashboard)/activity/page.tsx` — activity log mock data
- `app/(settings)/files/page.tsx` — file manager mock folder tree
- `lib/outreach-types.ts` — mock messages/stats/prospects (contacts wired)
- `lib/application-types.ts` — unused mock data (no imports)

### File Summary
- **74 files changed** in frontend
- **24 files changed** in backend
- **7 mock files deleted**
- **14 new files created** (13 hooks + auth-listener)
- **Net: -1,478 lines** (3,294 added, 4,772 removed)
