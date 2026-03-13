"use client"

import { useState } from "react"
import { 
  Sparkles, 
  Bug, 
  Rocket, 
  Zap, 
  Shield, 
  CheckCircle2,
  Clock,
  ArrowRight,
  Bell,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface ChangelogEntry {
  id: string
  version: string
  date: string
  title: string
  type: "feature" | "improvement" | "fix" | "security"
  description: string
  highlights: string[]
  isNew?: boolean
}

const changelogEntries: ChangelogEntry[] = [
  {
    id: "1",
    version: "2.4.0",
    date: "March 14, 2026",
    title: "AI-Powered Interview Prep",
    type: "feature",
    description: "Introducing our new AI-powered interview preparation system with mock interviews, personalized feedback, and company-specific question banks.",
    highlights: [
      "Mock interview simulations with AI interviewer",
      "Real-time feedback on your responses",
      "Company-specific question banks from 500+ companies",
      "Interview performance analytics dashboard",
    ],
    isNew: true,
  },
  {
    id: "2",
    version: "2.3.2",
    date: "March 10, 2026",
    title: "Performance Improvements",
    type: "improvement",
    description: "Significant performance optimizations across the application, with faster page loads and reduced memory usage.",
    highlights: [
      "50% faster job discovery processing",
      "Reduced memory usage by 30%",
      "Improved dashboard loading speed",
      "Better caching for frequently accessed data",
    ],
  },
  {
    id: "3",
    version: "2.3.1",
    date: "March 5, 2026",
    title: "Bug Fixes",
    type: "fix",
    description: "Various bug fixes and stability improvements based on user feedback.",
    highlights: [
      "Fixed email detection for Gmail accounts",
      "Resolved issue with duplicate job entries",
      "Fixed timezone display in interview calendar",
      "Corrected score calculation for certain job types",
    ],
  },
  {
    id: "4",
    version: "2.3.0",
    date: "February 28, 2026",
    title: "Market Intelligence 2.0",
    type: "feature",
    description: "Enhanced market intelligence with real-time salary data, company hiring trends, and skill demand forecasting.",
    highlights: [
      "Real-time salary benchmarking",
      "Company hiring velocity tracking",
      "Skill demand 8-week forecasting",
      "Competitive analysis for target companies",
    ],
  },
  {
    id: "5",
    version: "2.2.5",
    date: "February 20, 2026",
    title: "Security Update",
    type: "security",
    description: "Important security updates and infrastructure improvements.",
    highlights: [
      "Enhanced API key encryption",
      "Improved session management",
      "Additional rate limiting protections",
      "Audit logging improvements",
    ],
  },
  {
    id: "6",
    version: "2.2.0",
    date: "February 10, 2026",
    title: "Outreach Automation",
    type: "feature",
    description: "Automated LinkedIn outreach with personalized messaging and follow-up sequences.",
    highlights: [
      "AI-generated personalized messages",
      "Multi-step follow-up sequences",
      "Warmth scoring for contacts",
      "Response tracking and analytics",
    ],
  },
  {
    id: "7",
    version: "2.1.0",
    date: "January 25, 2026",
    title: "Multi-Profile Support",
    type: "feature",
    description: "Create and manage multiple job search profiles with different target roles, locations, and preferences.",
    highlights: [
      "Create unlimited search profiles",
      "Profile cloning with customization",
      "Shared data pool across profiles",
      "Per-profile analytics and reporting",
    ],
  },
]

const typeConfig = {
  feature: {
    icon: Rocket,
    label: "New Feature",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  improvement: {
    icon: Zap,
    label: "Improvement",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  },
  fix: {
    icon: Bug,
    label: "Bug Fix",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  security: {
    icon: Shield,
    label: "Security",
    color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
  },
}

export default function ChangelogPage() {
  const [notifyUpdates, setNotifyUpdates] = useState(true)
  const [filterType, setFilterType] = useState<string | null>(null)

  const filteredEntries = filterType
    ? changelogEntries.filter((e) => e.type === filterType)
    : changelogEntries

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            What's New
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay up to date with the latest features, improvements, and fixes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="notify-updates"
            checked={notifyUpdates}
            onCheckedChange={setNotifyUpdates}
          />
          <label
            htmlFor="notify-updates"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Notify me of updates
          </label>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterType === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType(null)}
        >
          All Updates
        </Button>
        {Object.entries(typeConfig).map(([type, config]) => {
          const Icon = config.icon
          return (
            <Button
              key={type}
              variant={filterType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(type)}
              className="gap-1.5"
            >
              <Icon className="h-3.5 w-3.5" />
              {config.label}
            </Button>
          )
        })}
      </div>

      {/* Changelog Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry, index) => {
          const config = typeConfig[entry.type]
          const Icon = config.icon

          return (
            <Card key={entry.id} className={cn(entry.isNew && "border-primary/50 shadow-md")}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={cn("gap-1", config.color)}>
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                      <Badge variant="secondary" className="font-mono text-xs">
                        v{entry.version}
                      </Badge>
                      {entry.isNew && (
                        <Badge className="bg-primary text-primary-foreground gap-1">
                          <Star className="h-3 w-3 fill-current" />
                          New
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {entry.date}
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {entry.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {entry.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Load More */}
      {filteredEntries.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" className="gap-2">
            View Older Updates
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <Card className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">No updates found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No updates match the selected filter.
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={() => setFilterType(null)}
              className="mt-2"
            >
              View all updates
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
