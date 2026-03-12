"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Search, Play } from "lucide-react"
import { cn } from "@/lib/utils"

type SourceStatus = "healthy" | "slow" | "error"

interface Source {
  name: string
  status: SourceStatus
}

const sources: Source[] = [
  { name: "LinkedIn", status: "healthy" },
  { name: "Indeed", status: "healthy" },
  { name: "Greenhouse", status: "slow" },
  { name: "Lever", status: "healthy" },
  { name: "Workday", status: "error" },
  { name: "Ashby", status: "healthy" },
]

const statusColors: Record<SourceStatus, string> = {
  healthy: "bg-green-500",
  slow: "bg-amber-500",
  error: "bg-red-500",
}

export function DiscoveryStatus() {
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
          <span className="text-muted-foreground">|</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Next:</span>
            <span className="font-medium">in 4 hours</span>
          </div>
        </div>

        {/* Active Profile */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active profile:</span>
          <Badge variant="secondary" className="text-xs">
            Senior Frontend
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
                  <p className="capitalize">{source.status}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Run Now Button */}
        <Button
          className="w-full focus-visible:ring-2 focus-visible:ring-primary"
          size="sm"
        >
          <Play className="h-4 w-4" />
          Run Now
        </Button>
      </CardContent>
    </Card>
  )
}
