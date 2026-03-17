"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/stores/authStore"
import { realtimeManager } from "@/lib/realtimeManager"

export function AuthListener() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      initialize()

      if (session?.user?.id) {
        realtimeManager.initialize(session.user.id)
      } else {
        realtimeManager.cleanup()
      }
    })

    return () => {
      subscription.unsubscribe()
      realtimeManager.cleanup()
    }
  }, [initialize])

  return null
}
