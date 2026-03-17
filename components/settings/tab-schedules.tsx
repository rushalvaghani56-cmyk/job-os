"use client"

import * as React from "react"
import { Save, Play, RefreshCw, Search, Sparkles, FileText, Mail, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useUpdateScheduleSettings } from "@/hooks/useSettings"
import { useTriggerDiscovery } from "@/hooks/useDiscovery"
import { useProfileStore } from "@/stores/profileStore"
import type { LucideIcon } from "lucide-react"

interface ScheduleTask {
  id: string
  name: string
  icon: LucideIcon
  frequency: string
  timezone: string
  lastRun: Date | null
  nextRun: Date | null
  enabled: boolean
}

const frequencyOptions = [
  { value: "2h", label: "Every 2 hours" },
  { value: "4h", label: "Every 4 hours" },
  { value: "6h", label: "Every 6 hours" },
  { value: "12h", label: "Every 12 hours" },
  { value: "daily", label: "Daily" },
  { value: "manual", label: "Manual only" },
]

const defaultTasks: ScheduleTask[] = [
  {
    id: "1",
    name: "Job Discovery",
    icon: Search,
    frequency: "6h",
    timezone: "America/Los_Angeles",
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000),
    enabled: true,
  },
  {
    id: "2",
    name: "Job Scoring",
    icon: Sparkles,
    frequency: "after_discovery",
    timezone: "America/Los_Angeles",
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    nextRun: null,
    enabled: true,
  },
  {
    id: "3",
    name: "Content Generation",
    icon: FileText,
    frequency: "auto_82",
    timezone: "America/Los_Angeles",
    lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000),
    nextRun: null,
    enabled: true,
  },
  {
    id: "4",
    name: "Email Scanning",
    icon: Mail,
    frequency: "30m",
    timezone: "America/Los_Angeles",
    lastRun: new Date(Date.now() - 15 * 60 * 1000),
    nextRun: new Date(Date.now() + 15 * 60 * 1000),
    enabled: true,
  },
  {
    id: "5",
    name: "Follow-up Check",
    icon: MessageSquare,
    frequency: "daily_9am",
    timezone: "America/Los_Angeles",
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000),
    enabled: true,
  },
]

function formatDateTime(date: Date | null) {
  if (!date) return "—"
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getFrequencyLabel(frequency: string) {
  switch (frequency) {
    case "after_discovery":
      return "After each discovery"
    case "auto_82":
      return "Auto for score ≥82"
    case "30m":
      return "Every 30 minutes"
    case "daily_9am":
      return "Daily at 9:00 AM"
    default:
      return frequencyOptions.find((f) => f.value === frequency)?.label || frequency
  }
}

function ScheduleCard({
  task,
  onFrequencyChange,
  onRunNow,
}: {
  task: ScheduleTask
  onFrequencyChange: (frequency: string) => void
  onRunNow: () => void
}) {
  const [isRunning, setIsRunning] = React.useState(false)
  const Icon = task.icon

  const handleRunNow = async () => {
    setIsRunning(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onRunNow()
    setIsRunning(false)
  }

  const isSpecialFrequency = ["after_discovery", "auto_82", "30m", "daily_9am"].includes(task.frequency)

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{task.name}</h3>
            <p className="text-xs text-muted-foreground">
              {task.timezone.replace("_", " ")}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          {getFrequencyLabel(task.frequency)}
        </Badge>
      </div>

      <div className="mt-4 space-y-3">
        {/* Frequency Selector */}
        {!isSpecialFrequency && (
          <div className="space-y-1.5">
            <Label className="text-xs">Frequency</Label>
            <Select value={task.frequency} onValueChange={onFrequencyChange}>
              <SelectTrigger className="h-9 focus-visible:ring-2 focus-visible:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Last run:</span>
            <p className="font-mono text-foreground">{formatDateTime(task.lastRun)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Next run:</span>
            <p className="font-mono text-foreground">{formatDateTime(task.nextRun)}</p>
          </div>
        </div>

        {/* Run Now Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleRunNow}
          disabled={isRunning}
          className="w-full rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isRunning ? (
            <>
              <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="mr-2 h-3 w-3" />
              Run Now
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export function TabSchedules() {
  const [tasks, setTasks] = React.useState<ScheduleTask[]>(defaultTasks)
  const updateMutation = useUpdateScheduleSettings()
  const triggerDiscovery = useTriggerDiscovery()
  const { activeProfile } = useProfileStore()

  const handleFrequencyChange = (id: string, frequency: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, frequency } : t))
    )
  }

  const handleRunNow = (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (task?.name === "Job Discovery" && activeProfile?.id) {
      triggerDiscovery.mutate(activeProfile.id)
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, lastRun: new Date() }
          : t
      )
    )
  }

  const handleSave = () => {
    updateMutation.mutate({
      tasks: tasks.map((t) => ({
        id: t.id,
        name: t.name,
        frequency: t.frequency,
        timezone: t.timezone,
        enabled: t.enabled,
      })),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Schedules</h2>
        <p className="text-sm text-muted-foreground">
          Configure when automated tasks run. All times shown in your local timezone.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <ScheduleCard
            key={task.id}
            task={task}
            onFrequencyChange={(frequency) => handleFrequencyChange(task.id, frequency)}
            onRunNow={() => handleRunNow(task.id)}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Save className="mr-2 h-4 w-4" />
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
