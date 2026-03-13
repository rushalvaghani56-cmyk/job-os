"use client"

import * as React from "react"
import { Save, Plus, Trash2, Play, Pause, Clock, Search, Send, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { mockSchedules } from "./mock-data"
import type { ScheduleItem } from "./types"
import { cn } from "@/lib/utils"

const scheduleTypes = [
  { value: "discovery", label: "Discovery", icon: Search },
  { value: "apply", label: "Apply", icon: Send },
  { value: "outreach", label: "Outreach", icon: Send },
  { value: "sync", label: "Sync", icon: RefreshCw },
]

const frequencies = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

function ScheduleCard({
  schedule,
  onToggle,
  onDelete,
  onRunNow,
}: {
  schedule: ScheduleItem
  onToggle: (enabled: boolean) => void
  onDelete: () => void
  onRunNow: () => void
}) {
  const [isRunning, setIsRunning] = React.useState(false)
  const typeConfig = scheduleTypes.find((t) => t.value === schedule.type)
  const Icon = typeConfig?.icon || Clock

  const handleRunNow = async () => {
    setIsRunning(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onRunNow()
    setIsRunning(false)
  }

  const formatTime = (date?: Date) => {
    if (!date) return "—"
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="rounded-xl border bg-card p-5 transition-colors hover:bg-accent/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              schedule.enabled
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{schedule.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {typeConfig?.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {schedule.frequency === "weekly" && schedule.days
                  ? schedule.days.join(", ")
                  : schedule.frequency}
                {schedule.time && ` at ${schedule.time}`}
              </span>
            </div>
          </div>
        </div>
        <Switch
          checked={schedule.enabled}
          onCheckedChange={onToggle}
          className="focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Last run:</span>
          <span className="font-mono">{formatTime(schedule.lastRun)}</span>
        </div>
        <div className="flex justify-between">
          <span>Next run:</span>
          <span className="font-mono">{formatTime(schedule.nextRun)}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRunNow}
          disabled={!schedule.enabled || isRunning}
          className="rounded-lg flex-1 focus-visible:ring-2 focus-visible:ring-primary"
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
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function TabSchedules() {
  const [schedules, setSchedules] = React.useState<ScheduleItem[]>(mockSchedules)
  const [isSaving, setIsSaving] = React.useState(false)
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [newSchedule, setNewSchedule] = React.useState<Partial<ScheduleItem>>({
    name: "",
    type: "discovery",
    frequency: "daily",
    time: "09:00",
    enabled: true,
  })

  const handleToggle = (id: string, enabled: boolean) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    )
  }

  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id))
    toast.success("Schedule deleted")
  }

  const handleRunNow = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, lastRun: new Date() } : s))
    )
    toast.success("Schedule executed successfully")
  }

  const handleAddSchedule = () => {
    if (!newSchedule.name || !newSchedule.type) return

    const schedule: ScheduleItem = {
      id: Date.now().toString(),
      name: newSchedule.name,
      type: newSchedule.type as ScheduleItem["type"],
      frequency: newSchedule.frequency as ScheduleItem["frequency"],
      time: newSchedule.time,
      days: newSchedule.days,
      enabled: true,
      nextRun: new Date(Date.now() + 3600000),
    }
    setSchedules((prev) => [...prev, schedule])
    setNewSchedule({
      name: "",
      type: "discovery",
      frequency: "daily",
      time: "09:00",
      enabled: true,
    })
    setShowAddDialog(false)
    toast.success("Schedule created")
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success("Schedule settings saved")
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Schedules</h2>
          <Badge variant="secondary">
            {schedules.filter((s) => s.enabled).length} active
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure automated schedules for job discovery, applications, and outreach.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {schedules.map((schedule) => (
          <ScheduleCard
            key={schedule.id}
            schedule={schedule}
            onToggle={(enabled) => handleToggle(schedule.id, enabled)}
            onDelete={() => handleDelete(schedule.id)}
            onRunNow={() => handleRunNow(schedule.id)}
          />
        ))}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Schedule
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Schedule</DialogTitle>
            <DialogDescription>
              Set up a new automated schedule for your job search activities.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="scheduleName">Name</Label>
              <Input
                id="scheduleName"
                value={newSchedule.name || ""}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, name: e.target.value })
                }
                placeholder="e.g., Morning Discovery"
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="scheduleType">Type</Label>
                <Select
                  value={newSchedule.type}
                  onValueChange={(value) =>
                    setNewSchedule({ ...newSchedule, type: value as ScheduleItem["type"] })
                  }
                >
                  <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {scheduleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduleFrequency">Frequency</Label>
                <Select
                  value={newSchedule.frequency}
                  onValueChange={(value) =>
                    setNewSchedule({ ...newSchedule, frequency: value as ScheduleItem["frequency"] })
                  }
                >
                  <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleTime">Time</Label>
              <Input
                id="scheduleTime"
                type="time"
                value={newSchedule.time || ""}
                onChange={(e) =>
                  setNewSchedule({ ...newSchedule, time: e.target.value })
                }
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSchedule}
              disabled={!newSchedule.name}
              className="rounded-lg"
            >
              Create Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
