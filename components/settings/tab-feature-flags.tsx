"use client"

import * as React from "react"
import { Save, GraduationCap, Users, TrendingUp, Linkedin, Github, Heart, MailSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: LucideIcon
}

const defaultFlags: FeatureFlag[] = [
  {
    id: "1",
    name: "Interview Preparation",
    description: "Generate prep packs and practice questions",
    enabled: true,
    icon: GraduationCap,
  },
  {
    id: "2",
    name: "Recruiter Outreach",
    description: "Discover and contact recruiters automatically",
    enabled: true,
    icon: Users,
  },
  {
    id: "3",
    name: "Market Intelligence",
    description: "Trending skills, salary data, and hiring velocity",
    enabled: true,
    icon: TrendingUp,
  },
  {
    id: "4",
    name: "LinkedIn Optimizer",
    description: "Audit and improve your LinkedIn profile",
    enabled: false,
    icon: Linkedin,
  },
  {
    id: "5",
    name: "GitHub Intelligence",
    description: "Analyze and improve your GitHub presence",
    enabled: false,
    icon: Github,
  },
  {
    id: "6",
    name: "Wellbeing Shield",
    description: "Activity monitoring and burnout prevention",
    enabled: true,
    icon: Heart,
  },
  {
    id: "7",
    name: "Email Intelligence",
    description: "Detect rejections, interviews, and recruiter replies",
    enabled: true,
    icon: MailSearch,
  },
]

function FeatureFlagCard({
  flag,
  onToggle,
}: {
  flag: FeatureFlag
  onToggle: (enabled: boolean) => void
}) {
  const Icon = flag.icon

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-all",
        flag.enabled
          ? "bg-card border-border"
          : "bg-muted/30 border-muted"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
            flag.enabled
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <Label
              htmlFor={`flag-${flag.id}`}
              className={cn(
                "font-medium cursor-pointer",
                flag.enabled ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {flag.name}
            </Label>
            <p className="text-sm text-muted-foreground mt-0.5">
              {flag.description}
            </p>
          </div>
        </div>
        <Switch
          id={`flag-${flag.id}`}
          checked={flag.enabled}
          onCheckedChange={onToggle}
          className="shrink-0 focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
    </div>
  )
}

export function TabFeatureFlags() {
  const [flags, setFlags] = React.useState<FeatureFlag[]>(defaultFlags)
  const [isSaving, setIsSaving] = React.useState(false)

  const enabledCount = flags.filter((f) => f.enabled).length

  const handleToggle = (id: string, enabled: boolean) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled } : f))
    )
    
    const flag = flags.find((f) => f.id === id)
    if (flag) {
      if (enabled) {
        toast.success(`${flag.name} enabled. Added to navigation.`)
      } else {
        toast.success(`${flag.name} disabled. Hidden from navigation.`)
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success("Feature flags saved")
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Feature Flags</h2>
          <span className="text-sm text-muted-foreground">
            {enabledCount} of {flags.length} enabled
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Enable or disable feature modules. Disabled modules are hidden from navigation but data is preserved.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {flags.map((flag) => (
          <FeatureFlagCard
            key={flag.id}
            flag={flag}
            onToggle={(enabled) => handleToggle(flag.id, enabled)}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Disabled modules are hidden from navigation. Data is preserved.
      </p>

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
