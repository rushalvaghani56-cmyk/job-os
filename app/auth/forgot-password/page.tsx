"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Briefcase, Mail } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FieldGroup, Field } from "@/components/ui/field"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [email, setEmail] = React.useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsSubmitted(true)
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
            <span className="text-xl font-semibold">Job OS</span>
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            Reset your password
          </p>
        </CardHeader>
        
        <CardContent className="p-0">
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center size-12 rounded-full bg-primary/10">
                <Mail className="size-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Check your email</h2>
                <p className="text-sm text-muted-foreground">
                  {"We've sent a password reset link to "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {"Didn't receive the email? Check your spam folder or "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:text-primary/80 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  try again
                </button>
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                <ArrowLeft className="size-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {"Enter your email address and we'll send you a link to reset your password."}
              </p>
              
              <FieldGroup>
                <Field>
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <Link
                href="/auth"
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
