"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, ExternalLink, Check, X, Loader2, PartyPopper } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProgressStepper } from "@/components/onboarding/progress-stepper"
import { useOnboardingStore } from "@/stores/onboardingStore"
import { useAuthStore } from "@/stores/authStore"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Import" },
  { id: 3, label: "Deep Profile" },
  { id: 4, label: "Resumes" },
  { id: 5, label: "AI Keys" },
]

const providers = [
  {
    id: "anthropic" as const,
    name: "Anthropic",
    subtitle: "Claude models",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    borderColor: "border-orange-500/50",
    bgMuted: "bg-orange-50 dark:bg-orange-950/20",
    helpUrl: "https://console.anthropic.com/settings/keys",
    models: ["claude-3-opus-20240229", "claude-3-sonnet-20240229", "claude-3-haiku-20240307"],
  },
  {
    id: "openai" as const,
    name: "OpenAI",
    subtitle: "GPT models",
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
    borderColor: "border-emerald-500/50",
    bgMuted: "bg-emerald-50 dark:bg-emerald-950/20",
    helpUrl: "https://platform.openai.com/api-keys",
    models: ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo"],
  },
  {
    id: "google" as const,
    name: "Google",
    subtitle: "Gemini models",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderColor: "border-blue-500/50",
    bgMuted: "bg-blue-50 dark:bg-blue-950/20",
    helpUrl: "https://aistudio.google.com/app/apikey",
    models: ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-pro"],
  },
]

const tasks = [
  { id: "scoring", name: "Scoring" },
  { id: "resumeGeneration", name: "Resume Generation" },
  { id: "coverLetter", name: "Cover Letter" },
  { id: "qaCheck", name: "QA Check" },
  { id: "copilotChat", name: "Copilot Chat" },
] as const

type ProviderId = "anthropic" | "openai" | "google"

interface ApiKeyState {
  key: string
  valid: boolean | null
  testing: boolean
}

interface ModelAssignment {
  provider: string
  model: string
}

export default function OnboardingStep5() {
  const router = useRouter()
  const { data, updateData, completedSteps, markStepComplete, reset } = useOnboardingStore()
  const { setOnboardingComplete } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})

  const [apiKeys, setApiKeys] = useState<Record<ProviderId, ApiKeyState>>({
    anthropic: { key: data.apiKeys.anthropic.key || "", valid: data.apiKeys.anthropic.valid, testing: false },
    openai: { key: data.apiKeys.openai.key || "", valid: data.apiKeys.openai.valid, testing: false },
    google: { key: data.apiKeys.google.key || "", valid: data.apiKeys.google.valid, testing: false },
  })

  const [modelAssignments, setModelAssignments] = useState<Record<string, ModelAssignment>>({
    scoring: { provider: "", model: "" },
    resumeGeneration: { provider: "", model: "" },
    coverLetter: { provider: "", model: "" },
    qaCheck: { provider: "", model: "" },
    copilotChat: { provider: "", model: "" },
  })

  const toggleShowKey = (providerId: string) => {
    setShowKeys((prev) => ({ ...prev, [providerId]: !prev[providerId] }))
  }

  const handleKeyChange = (providerId: ProviderId, key: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [providerId]: { key, valid: null, testing: false },
    }))
  }

  const testKey = async (providerId: ProviderId) => {
    setApiKeys((prev) => ({
      ...prev,
      [providerId]: { ...prev[providerId], testing: true },
    }))

    // Simulate API key validation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const isValid = apiKeys[providerId].key.length > 10
    setApiKeys((prev) => ({
      ...prev,
      [providerId]: { ...prev[providerId], valid: isValid, testing: false },
    }))
  }

  const hasValidKey = Object.values(apiKeys).some((k) => k.valid === true)

  const getAvailableProviders = () =>
    providers.filter((p) => apiKeys[p.id].valid === true)

  const getModelsForProvider = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId)
    return provider?.models || []
  }

  const handleBack = () => {
    router.push("/onboarding/step-4")
  }

  const handleComplete = async () => {
    if (!hasValidKey) return

    setIsSubmitting(true)

    // Save to store
    updateData({
      apiKeys: {
        anthropic: { key: apiKeys.anthropic.key, valid: apiKeys.anthropic.valid },
        openai: { key: apiKeys.openai.key, valid: apiKeys.openai.valid },
        google: { key: apiKeys.google.key, valid: apiKeys.google.valid },
      },
    })

    // Simulate completion
    await new Promise((resolve) => setTimeout(resolve, 800))

    markStepComplete(5)
    setOnboardingComplete(true)

    // Show success animation
    setShowSuccess(true)

    // Redirect after animation
    setTimeout(() => {
      reset()
      router.push("/home")
    }, 2000)
  }

  const handleResetDefaults = () => {
    setModelAssignments({
      scoring: { provider: "", model: "" },
      resumeGeneration: { provider: "", model: "" },
      coverLetter: { provider: "", model: "" },
      qaCheck: { provider: "", model: "" },
      copilotChat: { provider: "", model: "" },
    })
  }

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center size-20 rounded-full bg-success/10">
                <PartyPopper className="size-10 text-success" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">You're all set!</h2>
                <p className="text-muted-foreground">
                  Your Job Application OS is ready. Let's find your dream job!
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Redirecting to dashboard...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <ProgressStepper steps={steps} currentStep={5} completedSteps={completedSteps} />
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Connect AI Providers</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Add at least one API key to enable AI features
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {providers.map((provider) => {
              const keyData = apiKeys[provider.id]
              const isValid = keyData.valid === true
              const isInvalid = keyData.valid === false
              const isTesting = keyData.testing

              return (
                <div
                  key={provider.id}
                  className={cn(
                    "rounded-xl border-2 p-5 transition-all",
                    isValid && provider.borderColor,
                    !isValid && "border-border",
                    provider.bgMuted
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("h-10 w-10 rounded-lg", provider.color)} />
                    <div>
                      <p className="font-semibold">{provider.name}</p>
                      <p className="text-xs text-muted-foreground">{provider.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        type={showKeys[provider.id] ? "text" : "password"}
                        placeholder="sk-..."
                        value={keyData.key}
                        onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                        className={cn(
                          "pr-10 font-mono text-sm",
                          isValid && "border-success",
                          isInvalid && "border-destructive"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShowKey(provider.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showKeys[provider.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <a
                      href={provider.helpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 transition-colors"
                    >
                      How to get a key
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testKey(provider.id)}
                        disabled={!keyData.key || isTesting}
                        className="flex-1"
                      >
                        {isTesting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          "Test Key"
                        )}
                      </Button>
                      {isValid && (
                        <div className="flex items-center gap-1 text-success">
                          <Check className="h-4 w-4" />
                          <span className="text-xs font-medium">Valid</span>
                        </div>
                      )}
                      {isInvalid && (
                        <div className="flex items-center gap-1 text-destructive">
                          <X className="h-4 w-4" />
                          <span className="text-xs font-medium">Invalid</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {!hasValidKey && (
            <p className="text-sm text-destructive text-center mb-6">
              At least one valid API key is required to continue
            </p>
          )}

          {hasValidKey && (
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Default Model Assignments</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose which provider and model to use for each task
                  </p>
                </div>
                <Button variant="link" size="sm" onClick={handleResetDefaults} className="text-muted-foreground">
                  Reset to Defaults
                </Button>
              </div>

              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Task</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Model</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => {
                      const assignment = modelAssignments[task.id]
                      return (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">
                            {task.name}
                            {task.id === "copilotChat" && (
                              <p className="text-xs text-muted-foreground font-normal">
                                Powers your AI assistant
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={assignment.provider}
                              onValueChange={(value) =>
                                setModelAssignments((prev) => ({
                                  ...prev,
                                  [task.id]: { provider: value, model: "" },
                                }))
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailableProviders().map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={assignment.model}
                              onValueChange={(value) =>
                                setModelAssignments((prev) => ({
                                  ...prev,
                                  [task.id]: { ...assignment, model: value },
                                }))
                              }
                              disabled={!assignment.provider}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select model" />
                              </SelectTrigger>
                              <SelectContent>
                                {getModelsForProvider(assignment.provider).map((model) => (
                                  <SelectItem key={model} value={model}>
                                    {model}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t">
            <Button variant="ghost" onClick={handleBack}>
              Back
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!hasValidKey || isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Completing...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
