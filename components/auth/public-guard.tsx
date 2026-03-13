"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/stores/authStore"
import { Loader2 } from "lucide-react"

interface PublicGuardProps {
  children: ReactNode
}

function LoadingScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export function PublicGuard({ children }: PublicGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/home")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <LoadingScreen />
  }

  return <>{children}</>
}
