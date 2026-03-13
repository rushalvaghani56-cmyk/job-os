"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Sparkles, BarChart3, MessageSquare } from "lucide-react"
import { useCopilotStore } from "@/stores/copilotStore"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface QuickActionsProps {
  isLoading?: boolean
}

export function QuickActions({ isLoading = false }: QuickActionsProps) {
  const router = useRouter()
  const { toggleCopilot } = useCopilotStore()

  const handleDiscoverNow = () => {
    toast.info("Discovery started...", {
      description: "Scanning job boards for new matches",
    })
  }

  const handleGenerateForTopJobs = () => {
    toast.info("Generating content for 3 jobs...", {
      description: "Creating tailored resumes and cover letters",
    })
  }

  const handleViewWeeklyReport = () => {
    router.push("/analytics")
  }

  const handleOpenCopilot = () => {
    toggleCopilot()
  }

  const actions = [
    {
      id: "discover",
      label: "Discover Now",
      icon: Search,
      onClick: handleDiscoverNow,
    },
    {
      id: "generate",
      label: "Generate for Top Jobs",
      icon: Sparkles,
      onClick: handleGenerateForTopJobs,
    },
    {
      id: "report",
      label: "View Weekly Report",
      icon: BarChart3,
      onClick: handleViewWeeklyReport,
    },
    {
      id: "copilot",
      label: "Open Copilot",
      icon: MessageSquare,
      onClick: handleOpenCopilot,
    },
  ]

  if (isLoading) {
    return (
      <Card className="p-5 h-full flex flex-col">
        <CardHeader className="p-0 pb-4">
          <Skeleton className="h-5 w-28" />
        </CardHeader>
        <CardContent className="p-0 flex-1">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-5 h-full flex flex-col">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon

            return (
              <Button
                key={action.id}
                variant="outline"
                onClick={action.onClick}
                className={cn(
                  "h-auto flex-col gap-2 p-4 rounded-xl",
                  "hover:bg-muted/50"
                )}
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
