"use client"

import { AuthGuard } from "@/components/auth/auth-guard"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireOnboarding={false}>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Progress bar placeholder - will be implemented in onboarding chunk */}
          {children}
        </div>
      </div>
    </AuthGuard>
  )
}
