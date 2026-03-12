"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Sparkles, BarChart3, MessageSquare } from "lucide-react"
import { useShell } from "@/components/shell/shell-context"
import { cn } from "@/lib/utils"

interface QuickAction {
  id: string
  label: string
  icon: typeof Search
  href?: string
  variant: "outline" | "secondary"
  onClick?: () => void
}

export function QuickActions() {
  const { setCopilotOpen } = useShell()

  const actions: QuickAction[] = [
    {
      id: "discover",
      label: "Discover Now",
      icon: Search,
      href: "/dashboard/jobs/discover",
      variant: "outline",
    },
    {
      id: "generate",
      label: "Generate for Top Jobs",
      icon: Sparkles,
      href: "/dashboard/jobs?action=generate",
      variant: "outline",
    },
    {
      id: "report",
      label: "View Weekly Report",
      icon: BarChart3,
      href: "/dashboard/reports/weekly",
      variant: "outline",
    },
    {
      id: "copilot",
      label: "Open Copilot",
      icon: MessageSquare,
      variant: "secondary",
      onClick: () => setCopilotOpen(true),
    },
  ]

  return (
    <Card className="p-5 h-full flex flex-col">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon

            if (action.href) {
              return (
                <Button
                  key={action.id}
                  variant={action.variant}
                  asChild
                  className={cn(
                    "h-auto flex-col gap-2 p-4 rounded-xl",
                    "hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary"
                  )}
                >
                  <Link href={action.href}>
                    <Icon className="h-5 w-5" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </Link>
                </Button>
              )
            }

            return (
              <Button
                key={action.id}
                variant={action.variant}
                onClick={action.onClick}
                className={cn(
                  "h-auto flex-col gap-2 p-4 rounded-xl",
                  "hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
