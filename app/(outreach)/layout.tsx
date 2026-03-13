"use client"

import { AppShell } from "@/components/shell/app-shell"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function OutreachLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireOnboarding={true}>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  )
}
