import { createClient } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

/**
 * GET /auth/callback
 *
 * Handles the PKCE code exchange after Supabase email verification
 * (or OAuth, magic-link, etc.). Supabase redirects here with ?code=xxx,
 * we exchange it for a session, then redirect the user to the app.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/onboarding/step-1"

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { flowType: "pkce", persistSession: false } }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If code exchange fails, redirect to login with error
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
