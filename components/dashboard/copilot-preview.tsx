"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles, Send, ArrowRight, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useCopilotStore } from "@/stores/copilotStore"

const insights = [
  {
    id: "1",
    icon: Zap,
    message: "3 jobs scored >85 are unprocessed",
    actionLabel: "Generate Content",
    actionHref: "/review?filter=high-score&action=generate",
  },
  {
    id: "2",
    icon: TrendingUp,
    message: "Your fintech cover letters get 2x more responses",
    actionLabel: null,
    actionHref: null,
  },
]

interface CopilotPreviewProps {
  isLoading?: boolean
}

export function CopilotPreview({ isLoading = false }: CopilotPreviewProps) {
  const [query, setQuery] = React.useState("")
  const { toggleCopilot } = useCopilotStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toggleCopilot()
  }

  const handleFocus = () => {
    toggleCopilot()
  }

  if (isLoading) {
    return (
      <Card className="p-5 h-full flex flex-col">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-24" />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col gap-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
          <Skeleton className="h-5 w-32 mx-auto" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-5 h-full flex flex-col">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">AI Copilot</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col gap-4">
        {/* Input */}
        <form onSubmit={handleSubmit} className="relative">
          <Input
            placeholder="Ask me anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            className="pr-10"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Open copilot</span>
          </Button>
        </form>

        {/* Proactive Insights */}
        <div className="space-y-2 flex-1">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="flex items-start gap-3 rounded-lg border p-3 bg-muted/30"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <insight.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{insight.message}</p>
                {insight.actionLabel && insight.actionHref && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-auto p-0 text-xs text-primary hover:underline"
                  >
                    <Link href={insight.actionHref}>{insight.actionLabel}</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Open Full Copilot Link */}
        <button
          onClick={() => toggleCopilot()}
          className="flex items-center justify-center gap-1 text-sm text-primary hover:underline"
        >
          Open full Copilot
          <ArrowRight className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  )
}
