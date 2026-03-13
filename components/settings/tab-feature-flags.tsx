"use client"

import * as React from "react"
import { Save, Beaker } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { mockFeatureFlags } from "./mock-data"
import type { FeatureFlag } from "./types"
import { cn } from "@/lib/utils"

function FeatureFlagCard({
  flag,
  onToggle,
}: {
  flag: FeatureFlag
  onToggle: (enabled: boolean) => void
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        flag.enabled ? "bg-card" : "bg-muted/30"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Label
              htmlFor={`flag-${flag.id}`}
              className={cn(
                "font-medium cursor-pointer",
                flag.enabled ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {flag.name}
            </Label>
            {flag.beta && (
              <Badge
                variant="secondary"
                className="gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              >
                <Beaker className="h-3 w-3" />
                Beta
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {flag.description}
          </p>
        </div>
        <Switch
          id={`flag-${flag.id}`}
          checked={flag.enabled}
          onCheckedChange={onToggle}
          className="focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
    </div>
  )
}

export function TabFeatureFlags() {
  const [flags, setFlags] = React.useState<FeatureFlag[]>(mockFeatureFlags)
  const [isSaving, setIsSaving] = React.useState(false)

  const enabledCount = flags.filter((f) => f.enabled).length
  const betaCount = flags.filter((f) => f.beta).length

  const handleToggle = (id: string, enabled: boolean) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled } : f))
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success("Feature flags saved")
  }

  const stableFlags = flags.filter((f) => !f.beta)
  const betaFlags = flags.filter((f) => f.beta)

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Feature Flags</h2>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {enabledCount} enabled
            </Badge>
            <Badge variant="secondary" className="gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
              <Beaker className="h-3 w-3" />
              {betaCount} beta
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Enable or disable features in Job OS. Beta features may be unstable.
        </p>
      </div>

      {/* Stable Features */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Stable Features</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {stableFlags.map((flag) => (
            <FeatureFlagCard
              key={flag.id}
              flag={flag}
              onToggle={(enabled) => handleToggle(flag.id, enabled)}
            />
          ))}
        </div>
      </div>

      {/* Beta Features */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-foreground">Beta Features</h3>
          <Badge variant="outline" className="text-xs">
            Experimental
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          These features are still in development. They may change or be removed.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {betaFlags.map((flag) => (
            <FeatureFlagCard
              key={flag.id}
              flag={flag}
              onToggle={(enabled) => handleToggle(flag.id, enabled)}
            />
          ))}
        </div>
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
