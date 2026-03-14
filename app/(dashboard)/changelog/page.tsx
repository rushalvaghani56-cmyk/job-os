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
    version: "2.5.0",
    date: "March 13, 2026",
    title: "Interview Calendar",
    type: "feature",
    description: "Track all your interviews with color-coded calendar views, prep checklists, and post-interview logging.",
    highlights: [
      "Color-coded calendar view by interview stage",
      "Pre-interview preparation checklists",
      "Post-interview notes and rating system",
      "Automated interview reminders",
    ],
    isNew: true,
  },
  {
    id: "2",
    version: "2.4.5",
    date: "March 12, 2026",
    title: "Market Intelligence Dashboard",
    type: "feature",
    description: "See trending skills, hot companies, salary benchmarks, and competition analysis all in one place.",
    highlights: [
      "Real-time skill demand tracking",
      "Hot companies hiring now widget",
      "Salary benchmarks by role and location",
      "Competition analysis for applications",
    ],
    isNew: true,
  },
  {
    id: "3",
    version: "2.4.4",
    date: "March 11, 2026",
    title: "Faster Resume Generation",
    type: "improvement",
    description: "Resume generation now completes 40% faster with improved caching and parallel processing.",
    highlights: [
      "40% faster resume generation",
      "Improved caching for repeated content",
      "Parallel processing for multiple variants",
      "Reduced API token usage",
    ],
    isNew: true,
  },
  {
    id: "4",
    version: "2.4.3",
    date: "March 10, 2026",
    title: "A/B Resume Testing",
    type: "feature",
    description: "Every job now gets two resume variants. Track which performs better with detailed analytics.",
    highlights: [
      "Automatic A/B variant generation",
      "Performance tracking per variant",
      "Statistical significance indicators",
      "Recommendations based on results",
    ],
  },
  {
    id: "5",
    version: "2.4.2",
    date: "March 9, 2026",
    title: "Kanban Drag-and-Drop Fix",
    type: "fix",
    description: "Fixed issue where cards would snap back after dragging on mobile devices.",
    highlights: [
      "Fixed mobile drag-and-drop behavior",
      "Improved touch responsiveness",
      "Better visual feedback during drag",
      "Smoother animations on all devices",
    ],
  },
  {
    id: "6",
    version: "2.4.1",
    date: "March 8, 2026",
    title: "Dark Mode Polish",
    type: "improvement",
    description: "Improved chart readability and contrast in dark mode across all analytics pages.",
    highlights: [
      "Better chart colors for dark mode",
      "Improved text contrast",
      "Fixed border visibility issues",
      "Enhanced tooltip readability",
    ],
  },
  {
    id: "7",
    version: "2.4.0",
    date: "March 7, 2026",
    title: "Email Intelligence",
    type: "feature",
    description: "Automatic detection of rejections, interview invites, and recruiter replies from your Gmail inbox.",
    highlights: [
      "Automatic rejection detection",
      "Interview invite parsing",
      "Recruiter reply identification",
      "Auto-link emails to applications",
    ],
  },
  {
    id: "8",
    version: "2.3.5",
    date: "March 6, 2026",
    title: "Score Breakdown Detail",
    type: "improvement",
    description: "Score breakdown now shows bonus points separately with explanations for each factor.",
    highlights: [
      "Detailed score factor breakdown",
      "Bonus points section",
      "Factor explanations on hover",
      "Historical score tracking",
    ],
  },
  {
    id: "9",
    version: "2.3.4",
    date: "March 5, 2026",
    title: "Filter Persistence",
    type: "fix",
    description: "Job browser filters now persist in URL when navigating away and back.",
    highlights: [
      "Filters saved in URL parameters",
      "Back button restores filters",
      "Shareable filtered views",
      "Filter state preserved on refresh",
    ],
  },
  {
    id: "10",
    version: "2.3.3",
    date: "March 4, 2026",
    title: "Profile Comparison",
    type: "feature",
    description: "Compare performance metrics across your profiles side by side.",
    highlights: [
      "Side-by-side profile metrics",
      "Response rate comparisons",
      "Application funnel by profile",
      "Export comparison reports",
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
