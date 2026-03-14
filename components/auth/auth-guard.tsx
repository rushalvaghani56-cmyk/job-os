"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/authStore"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: ReactNode
  requireAdmin?: boolean
  requireOnboarding?: boolean
}

function LoadingScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <span className="font-mono text-lg font-bold text-primary-foreground">JO</span>
        </div>
        <span className="text-xl font-semibold text-foreground">Job App OS</span>
      </div>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}

function AccessDenied() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <span className="text-2xl">🔒</span>
      </div>
      <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
      <p className="max-w-md text-center text-muted-foreground">
        You don&apos;t have permission to access this page. Please contact an administrator if you believe this is an error.
      </p>
    </div>
  )
}

export function AuthGuard({ 
  children, 
  requireAdmin = false,
  requireOnboarding = true 
}: AuthGuardProps) {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, hasCompletedOnboarding } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
        return
      }
      
      if (requireOnboarding && !hasCompletedOnboarding) {
        router.push("/onboarding/step-1")
        return
      }
    }
  }, [isLoading, isAuthenticated, hasCompletedOnboarding, requireOnboarding, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <LoadingScreen />
  }

  if (requireOnboarding && !hasCompletedOnboarding) {
    return <LoadingScreen />
  }

  if (requireAdmin && user?.role !== "super_admin") {
    return <AccessDenied />
  }

  return <>{children}</>
}
