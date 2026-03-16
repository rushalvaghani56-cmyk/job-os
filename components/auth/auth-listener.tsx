"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuthStore } from "@/stores/authStore"

export function AuthListener() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      initialize()
    })

    return () => subscription.unsubscribe()
  }, [initialize])

  return null
}
