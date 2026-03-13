"use client"

import { PublicGuard } from "@/components/auth/public-guard"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PublicGuard>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </PublicGuard>
  )
}
