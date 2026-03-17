"use client"

import * as React from "react"
import { Save, X, Hand, CheckCircle2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useAutomationSettings, useUpdateAutomationSettings } from "@/hooks/useSettings"
import type { AutomationSettings } from "./types"
import { cn } from "@/lib/utils"

const cooldownOptions = [
  { value: "0min", label: "No delay" },
  { value: "15min", label: "15 minutes" },
  { value: "30min", label: "30 minutes" },
  { value: "1hr", label: "1 hour" },
  { value: "2hr", label: "2 hours" },
  { value: "4hr", label: "4 hours" },
  { value: "12hr", label: "12 hours" },
  { value: "24hr", label: "24 hours" },
]

const operatingModes = [
  {
    value: "manual",
    label: "Manual",
    description: "All actions require manual execution",
    icon: Hand,
  },
  {
    value: "approval_required",
    label: "Approval Required",
    description: "Actions are queued for your approval",
    icon: CheckCircle2,
  },
  {
    value: "full_auto",
    label: "Full Auto",
    description: "Automatically execute within limits",
    icon: Zap,
  },
]

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder: string
}) {
  const [inputValue, setInputValue] = React.useState("")

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      if (!tags.includes(inputValue.trim())) {
        onChange([...tags, inputValue.trim()])
      }
      setInputValue("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="gap-1 pr-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="focus-visible:ring-2 focus-visible:ring-primary"
      />
    </div>
  )
}

/** Map API response to local AutomationSettings shape */
function mapAutomationSettings(apiData: Record<string, unknown> | undefined): AutomationSettings {
  const dl = (apiData?.daily_limits ?? apiData?.dailyLimits ?? {}) as Record<string, unknown>
  return {
    autoApplyEnabled: (apiData?.auto_apply_enabled ?? apiData?.autoApplyEnabled ?? false) as boolean,
    scoreThreshold: (apiData?.score_threshold ?? apiData?.scoreThreshold ?? 75) as number,
    confidenceThreshold: (apiData?.confidence_threshold ?? apiData?.confidenceThreshold ?? 0.8) as number,
    riskThreshold: (apiData?.risk_threshold ?? apiData?.riskThreshold ?? 0.3) as number,
    cooldownDelay: (apiData?.cooldown_delay ?? apiData?.cooldownDelay ?? "30min") as string,
    dailyLimits: {
      applications: (dl?.applications ?? 25) as number,
      outreach: (dl?.outreach ?? 15) as number,
      easyApply: (dl?.easy_apply ?? dl?.easyApply ?? 50) as number,
    },
    operatingMode: (apiData?.operating_mode ?? apiData?.operatingMode ?? "approval_required") as AutomationSettings["operatingMode"],
    dreamCompanies: (apiData?.dream_companies ?? apiData?.dreamCompanies ?? []) as string[],
    blacklist: (apiData?.blacklist ?? []) as string[],
  }
}

export function TabAutomation() {
  const { data: apiData, isLoading, error } = useAutomationSettings()
  const updateMutation = useUpdateAutomationSettings()
  const [settings, setSettings] = React.useState<AutomationSettings | null>(null)

  React.useEffect(() => {
    if (apiData && !settings) {
      setSettings(mapAutomationSettings(apiData))
    }
  }, [apiData, settings])

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-card p-10">
        <p className="text-sm text-destructive">Failed to load automation settings. Please try again later.</p>
      </div>
    )
  }

  const handleSave = () => {
    if (!settings) return
    updateMutation.mutate({
      auto_apply_enabled: settings.autoApplyEnabled,
      score_threshold: settings.scoreThreshold,
      confidence_threshold: settings.confidenceThreshold,
      risk_threshold: settings.riskThreshold,
      cooldown_delay: settings.cooldownDelay,
      daily_limits: settings.dailyLimits,
      operating_mode: settings.operatingMode,
      dream_companies: settings.dreamCompanies,
      blacklist: settings.blacklist,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Automation Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure how Job OS automates your job search activities.
        </p>
      </div>

      {/* Master Toggle */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-5">
        <div className="space-y-0.5">
          <Label htmlFor="autoApply" className="text-base font-medium">
            Auto-Apply
          </Label>
          <p className="text-sm text-muted-foreground">
            Enable automated job applications based on your settings.
          </p>
        </div>
        <Switch
          id="autoApply"
          checked={settings.autoApplyEnabled}
          onCheckedChange={(checked) =>
            setSettings({ ...settings, autoApplyEnabled: checked })
          }
          className="scale-125 focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {/* Thresholds */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Thresholds</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="scoreThreshold">Score Threshold</Label>
            <span className="font-mono text-sm text-muted-foreground">
              {settings.scoreThreshold}
            </span>
          </div>
          <Slider
            id="scoreThreshold"
            value={[settings.scoreThreshold]}
            onValueChange={([value]) =>
              setSettings({ ...settings, scoreThreshold: value })
            }
            min={0}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="confidenceThreshold">Confidence Threshold</Label>
            <span className="font-mono text-sm text-muted-foreground">
              {settings.confidenceThreshold.toFixed(1)}
            </span>
          </div>
          <Slider
            id="confidenceThreshold"
            value={[settings.confidenceThreshold]}
            onValueChange={([value]) =>
              setSettings({ ...settings, confidenceThreshold: value })
            }
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="riskThreshold">Risk Threshold</Label>
            <span className="font-mono text-sm text-muted-foreground">
              {settings.riskThreshold.toFixed(1)}
            </span>
          </div>
          <Slider
            id="riskThreshold"
            value={[settings.riskThreshold]}
            onValueChange={([value]) =>
              setSettings({ ...settings, riskThreshold: value })
            }
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>

      {/* Cooldown */}
      <div className="space-y-2">
        <Label htmlFor="cooldown">Cool-down Delay</Label>
        <Select
          value={settings.cooldownDelay}
          onValueChange={(value) =>
            setSettings({ ...settings, cooldownDelay: value })
          }
        >
          <SelectTrigger id="cooldown" className="w-full max-w-xs focus-visible:ring-2 focus-visible:ring-primary">
            <SelectValue placeholder="Select delay" />
          </SelectTrigger>
          <SelectContent>
            {cooldownOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Daily Limits */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Daily Limits</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="limitApplications">Applications</Label>
            <Input
              id="limitApplications"
              type="number"
              min={0}
              max={100}
              value={settings.dailyLimits.applications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  dailyLimits: {
                    ...settings.dailyLimits,
                    applications: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="limitOutreach">Outreach</Label>
            <Input
              id="limitOutreach"
              type="number"
              min={0}
              max={100}
              value={settings.dailyLimits.outreach}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  dailyLimits: {
                    ...settings.dailyLimits,
                    outreach: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="limitEasyApply">Easy Apply</Label>
            <Input
              id="limitEasyApply"
              type="number"
              min={0}
              max={200}
              value={settings.dailyLimits.easyApply}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  dailyLimits: {
                    ...settings.dailyLimits,
                    easyApply: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Operating Mode */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Operating Mode</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {operatingModes.map((mode) => {
            const Icon = mode.icon
            const isSelected = settings.operatingMode === mode.value
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    operatingMode: mode.value as AutomationSettings["operatingMode"],
                  })
                }
                className={cn(
                  "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {mode.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {mode.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dream Companies */}
      <div className="space-y-2">
        <Label>Dream Companies</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Jobs from these companies will be prioritized and auto-approved.
        </p>
        <TagInput
          tags={settings.dreamCompanies}
          onChange={(tags) =>
            setSettings({ ...settings, dreamCompanies: tags })
          }
          placeholder="Type company name and press Enter"
        />
      </div>

      {/* Blacklist */}
      <div className="space-y-2">
        <Label>Blacklist</Label>
        <p className="text-xs text-muted-foreground mb-2">
          Jobs from these companies will be automatically hidden.
        </p>
        <TagInput
          tags={settings.blacklist}
          onChange={(tags) => setSettings({ ...settings, blacklist: tags })}
          placeholder="Type company name and press Enter"
        />
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
