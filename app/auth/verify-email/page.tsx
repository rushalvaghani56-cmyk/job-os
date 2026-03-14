"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Briefcase, Mail } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/authStore"

export default function VerifyEmailPage() {
  const router = useRouter()
  const { user, isAuthenticated, hasCompletedOnboarding } = useAuthStore()
  const [cooldown, setCooldown] = React.useState(0)
  const [resendCount, setResendCount] = React.useState(0)

  // Redirect if already authenticated and onboarding complete
  React.useEffect(() => {
    if (isAuthenticated && hasCompletedOnboarding) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, hasCompletedOnboarding, router])

  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleResend = async () => {
    if (cooldown > 0) return

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 500))
    setResendCount((prev) => prev + 1)
    setCooldown(60)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/5 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <Card className="relative w-full max-w-md shadow-lg p-8 gap-0">
        <CardHeader className="p-0 pb-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-primary-foreground">
              <Briefcase className="size-5" />
            </div>
            <span className="text-xl font-semibold">Job Application OS</span>
          </Link>
        </CardHeader>

        <CardContent className="p-0">
          <div className="text-center space-y-6">
            <div className="mx-auto flex items-center justify-center size-16 rounded-full bg-primary/10">
              <Mail className="size-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We sent a verification link to{" "}
                <span className="font-medium text-foreground">
                  {user?.email || "your email address"}
                </span>
                . Click the link to activate your account.
              </p>
            </div>

            {resendCount > 0 && (
              <div className="rounded-lg bg-success-muted p-3">
                <p className="text-sm text-success">
                  Verification email sent! Check your inbox.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-lg"
                onClick={handleResend}
                disabled={cooldown > 0}
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend verification email"}
              </Button>

              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center w-full text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded py-2"
              >
                Back to login
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              {"Didn't receive the email? Check your spam folder or try a different email address."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
