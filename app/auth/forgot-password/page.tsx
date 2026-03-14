"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Briefcase, Loader2, Mail } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FieldGroup, Field, FieldError } from "@/components/ui/field"
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validators/auth"
import { useAuthStore } from "@/stores/authStore"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = React.useState(false)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [error, setError] = React.useState("")
  const [submittedEmail, setSubmittedEmail] = React.useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmittedEmail(data.email)
      setIsSubmitted(true)
    } catch {
      setError("Failed to send reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTryAgain = () => {
    setIsSubmitted(false)
    setSubmittedEmail("")
    reset()
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
          <p className="text-center text-sm text-muted-foreground">
            Reset your password
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center size-12 rounded-full bg-success-muted">
                <Mail className="size-6 text-success" />
              </div>
              <div className="space-y-2">
                <Alert className="bg-success-muted border-success text-success">
                  <AlertDescription>
                    Check your email for a reset link
                  </AlertDescription>
                </Alert>
                <p className="text-sm text-muted-foreground">
                  {"We've sent a password reset link to "}
                  <span className="font-medium text-foreground">
                    {submittedEmail}
                  </span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {"Didn't receive the email? Check your spam folder or "}
                <button
                  onClick={handleTryAgain}
                  className="text-primary hover:text-primary/80 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  try again
                </button>
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <ArrowLeft className="size-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {
                  "Enter your email address and we'll send you a link to reset your password."
                }
              </p>

              {error && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <FieldGroup>
                <Field>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full rounded-lg"
                disabled={!isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <ArrowLeft className="size-4" />
                Back to login
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
