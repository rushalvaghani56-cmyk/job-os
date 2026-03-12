"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles, Send, ArrowRight, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useShell } from "@/components/shell/shell-context"

const insights = [
  {
    id: "1",
    icon: Zap,
    message: "3 jobs >85% match unprocessed",
    actionLabel: "Review now",
    actionHref: "/dashboard/jobs?filter=high-match",
  },
  {
    id: "2",
    icon: TrendingUp,
    message: "Your fintech CLs get 2x responses",
    actionLabel: null,
    actionHref: null,
  },
]

export function CopilotPreview() {
  const { setCopilotOpen } = useShell()

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
        <div className="relative">
          <Input
            placeholder="Ask me anything..."
            className="pr-10 focus-visible:ring-2 focus-visible:ring-primary"
            onFocus={() => setCopilotOpen(true)}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setCopilotOpen(true)}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Open copilot</span>
          </Button>
        </div>

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
                  <Link
                    href={insight.actionHref}
                    className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                  >
                    {insight.actionLabel}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Open Full Copilot Link */}
        <button
          onClick={() => setCopilotOpen(true)}
          className="flex items-center justify-center gap-1 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
        >
          Open full Copilot
          <ArrowRight className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  )
}
