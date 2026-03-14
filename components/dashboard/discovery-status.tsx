"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Play, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useProfileStore } from "@/stores/profileStore"

type SourceStatus = "healthy" | "slow" | "error"

interface Source {
  name: string
  status: SourceStatus
  lastResponse?: string
}

const sources: Source[] = [
  { name: "LinkedIn", status: "healthy", lastResponse: "45ms" },
  { name: "Google Jobs", status: "healthy", lastResponse: "120ms" },
  { name: "Indeed", status: "slow", lastResponse: "2.3s" },
  { name: "Naukri", status: "healthy", lastResponse: "180ms" },
  { name: "Glassdoor", status: "error", lastResponse: "Timeout" },
  { name: "CareerPages", status: "healthy", lastResponse: "95ms" },
]

const statusColors: Record<SourceStatus, string> = {
  healthy: "bg-green-500",
  slow: "bg-amber-500",
  error: "bg-red-500",
}

const statusLabels: Record<SourceStatus, string> = {
  healthy: "Healthy",
  slow: "Slow",
  error: "Error",
}

interface DiscoveryStatusProps {
  isLoading?: boolean
}

export function DiscoveryStatus({ isLoading = false }: DiscoveryStatusProps) {
  const [isRunning, setIsRunning] = React.useState(false)
  const { activeProfile } = useProfileStore()

  const handleRunNow = async () => {
    setIsRunning(true)
    // Simulate discovery running
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsRunning(false)
    toast.success("Discovery complete", {
      description: "12 new jobs found",
    })
  }

  if (isLoading) {
    return (
      <Card className="p-5 h-full flex flex-col">
        <CardHeader className="p-0 pb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-32" />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col gap-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-36" />
          <div className="flex flex-wrap gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>
          <Skeleton className="h-9 w-full mt-auto" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-5 h-full flex flex-col">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">Discovery Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col gap-4">
        {/* Timing Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Last run:</span>
            <span className="font-medium">2 hours ago</span>
          </div>
          <span className="text-muted-foreground hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Next:</span>
            <span className="font-medium">in 4 hours</span>
          </div>
        </div>

        {/* Active Profile */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active profile:</span>
          <Badge variant="secondary" className="text-xs">
            {activeProfile?.name || "No profile"}
          </Badge>
        </div>

        {/* Source Health */}
        <div className="space-y-2 flex-1">
          <p className="text-xs text-muted-foreground">Source health</p>
          <div className="flex flex-wrap gap-3">
            {sources.map((source) => (
              <Tooltip key={source.name}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors",
                      "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        statusColors[source.status]
                      )}
                    />
                    <span className="text-muted-foreground">{source.name}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{statusLabels[source.status]}</p>
                  <p className="text-xs text-muted-foreground">
                    Last response: {source.lastResponse}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Run Now Button */}
        <Button
          className="w-full"
          size="sm"
          onClick={handleRunNow}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Discovery Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
