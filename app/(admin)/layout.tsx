"use client"

import { AppShell } from "@/components/shell/app-shell"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAdmin={true} requireOnboarding={true}>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  )
}
