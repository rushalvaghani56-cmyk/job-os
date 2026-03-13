"use client"

import Link from "next/link"
import { Briefcase } from "lucide-react"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireOnboarding={false}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg group-hover:text-primary transition-colors">
                Job Application OS
              </span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
