"use client"

import * as React from "react"
import { Save, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { mockJobSources } from "./mock-data"
import type { JobSource } from "./types"

function SourceCard({
  source,
  onToggle,
  onRateLimitChange,
  onSync,
}: {
  source: JobSource
  onToggle: (enabled: boolean) => void
  onRateLimitChange: (limit: number) => void
  onSync: () => void
}) {
  const [isSyncing, setIsSyncing] = React.useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onSync()
    setIsSyncing(false)
  }

  return (
    <div className="rounded-xl border bg-card p-5 transition-colors hover:bg-accent/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
            {source.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium text-foreground">{source.name}</h3>
            {source.lastSync && (
              <p className="text-xs text-muted-foreground">
                Last sync:{" "}
                {source.lastSync.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        </div>
        <Switch
          checked={source.enabled}
          onCheckedChange={onToggle}
          className="focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`rate-${source.id}`} className="text-xs">
            Rate Limit (requests/hour)
          </Label>
          <Input
            id={`rate-${source.id}`}
            type="number"
            min={1}
            max={500}
            value={source.rateLimit}
            onChange={(e) => onRateLimitChange(parseInt(e.target.value) || 1)}
            disabled={!source.enabled}
            className="h-8 focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={!source.enabled || isSyncing}
            className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RefreshCw className={`mr-2 h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync Now"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function TabSources() {
  const [sources, setSources] = React.useState<JobSource[]>(mockJobSources)
  const [isSaving, setIsSaving] = React.useState(false)

  const enabledCount = sources.filter((s) => s.enabled).length

  const handleToggle = (id: string, enabled: boolean) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    )
  }

  const handleRateLimitChange = (id: string, limit: number) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rateLimit: limit } : s))
    )
  }

  const handleSync = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, lastSync: new Date() } : s))
    )
    toast.success("Source synced successfully")
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success("Source settings saved")
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Job Sources</h2>
          <Badge variant="secondary">
            {enabledCount} of {sources.length} enabled
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure which job boards and sources to monitor for new opportunities.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {sources.map((source) => (
          <SourceCard
            key={source.id}
            source={source}
            onToggle={(enabled) => handleToggle(source.id, enabled)}
            onRateLimitChange={(limit) => handleRateLimitChange(source.id, limit)}
            onSync={() => handleSync(source.id)}
          />
        ))}
      </div>

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
