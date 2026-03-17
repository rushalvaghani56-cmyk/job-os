"use client"

import * as React from "react"
import { Save, RefreshCw, Plus, Trash2, X, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useUpdateSourceSettings } from "@/hooks/useSettings"

interface JobSource {
  id: string
  name: string
  icon: string
  enabled: boolean
  status: "healthy" | "slow" | "error"
  lastCheck: string
  responseTime: number
  keywords: string[]
  locations: string[]
}

interface CareerPage {
  id: string
  url: string
  company: string
}

const defaultSources: JobSource[] = [
  { id: "1", name: "LinkedIn", icon: "Li", enabled: true, status: "healthy", lastCheck: "2 min ago", responseTime: 245, keywords: ["React", "TypeScript"], locations: ["Remote", "San Francisco"] },
  { id: "2", name: "Google Jobs", icon: "G", enabled: true, status: "healthy", lastCheck: "5 min ago", responseTime: 180, keywords: [], locations: [] },
  { id: "3", name: "Indeed", icon: "In", enabled: true, status: "slow", lastCheck: "8 min ago", responseTime: 1200, keywords: [], locations: [] },
  { id: "4", name: "Naukri", icon: "N", enabled: false, status: "healthy", lastCheck: "1 hour ago", responseTime: 320, keywords: [], locations: [] },
  { id: "5", name: "Glassdoor", icon: "Gl", enabled: true, status: "healthy", lastCheck: "3 min ago", responseTime: 410, keywords: [], locations: [] },
  { id: "6", name: "AngelList", icon: "AL", enabled: true, status: "error", lastCheck: "15 min ago", responseTime: 0, keywords: [], locations: [] },
  { id: "7", name: "RemoteOK", icon: "R", enabled: false, status: "healthy", lastCheck: "30 min ago", responseTime: 280, keywords: [], locations: [] },
  { id: "8", name: "Career Pages", icon: "CP", enabled: true, status: "healthy", lastCheck: "10 min ago", responseTime: 350, keywords: [], locations: [] },
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
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="h-8 text-sm focus-visible:ring-2 focus-visible:ring-primary"
      />
    </div>
  )
}

function SourceCard({
  source,
  onToggle,
  onSync,
  onUpdateKeywords,
  onUpdateLocations,
}: {
  source: JobSource
  onToggle: (enabled: boolean) => void
  onSync: () => void
  onUpdateKeywords: (keywords: string[]) => void
  onUpdateLocations: (locations: string[]) => void
}) {
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)

  const handleSync = async () => {
    setIsSyncing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onSync()
    setIsSyncing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-emerald-500"
      case "slow": return "bg-amber-500"
      case "error": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <div className={cn(
        "rounded-xl border bg-card transition-colors",
        !source.enabled && "opacity-60"
      )}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                {source.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{source.name}</h3>
                  <div className={cn("h-2 w-2 rounded-full", getStatusColor(source.status))} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Last check: {source.lastCheck}
                  {source.status === "healthy" && ` · ${source.responseTime}ms`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={source.enabled}
                onCheckedChange={onToggle}
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          {source.enabled && (
            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing}
                className="h-7 rounded-lg text-xs focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RefreshCw className={cn("mr-1.5 h-3 w-3", isSyncing && "animate-spin")} />
                {isSyncing ? "Syncing..." : "Sync Now"}
              </Button>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="mr-1.5 h-3 w-3" />
                      Hide Settings
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-1.5 h-3 w-3" />
                      Configure
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          )}
        </div>

        <CollapsibleContent>
          <div className="border-t px-4 pb-4 pt-3 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Keywords</Label>
              <TagInput
                tags={source.keywords}
                onChange={onUpdateKeywords}
                placeholder="Add keyword and press Enter"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Locations</Label>
              <TagInput
                tags={source.locations}
                onChange={onUpdateLocations}
                placeholder="Add location and press Enter"
              />
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

export function TabSources() {
  const [sources, setSources] = React.useState<JobSource[]>(defaultSources)
  const [careerPages, setCareerPages] = React.useState<CareerPage[]>([
    { id: "1", url: "https://stripe.com/jobs", company: "Stripe" },
    { id: "2", url: "https://vercel.com/careers", company: "Vercel" },
  ])
  const [freshnessDays, setFreshnessDays] = React.useState(14)
  const updateMutation = useUpdateSourceSettings()

  const enabledCount = sources.filter((s) => s.enabled).length

  const handleToggle = (id: string, enabled: boolean) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    )
  }

  const handleSync = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, lastCheck: "Just now", status: "healthy" } : s))
    )
    toast.success("Source synced successfully")
  }

  const handleUpdateKeywords = (id: string, keywords: string[]) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, keywords } : s))
    )
  }

  const handleUpdateLocations = (id: string, locations: string[]) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, locations } : s))
    )
  }

  const handleAddCareerPage = () => {
    setCareerPages((prev) => [
      ...prev,
      { id: Date.now().toString(), url: "", company: "" },
    ])
  }

  const handleRemoveCareerPage = (id: string) => {
    setCareerPages((prev) => prev.filter((p) => p.id !== id))
  }

  const handleUpdateCareerPage = (id: string, field: "url" | "company", value: string) => {
    setCareerPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )
  }

  const getFreshnessLabel = (days: number) => {
    if (days === 1) return "1 day"
    if (days <= 7) return `${days} days`
    if (days <= 30) return `${days} days`
    return "All time"
  }

  const handleSave = () => {
    updateMutation.mutate({
      sources: sources.map((s) => ({
        id: s.id,
        name: s.name,
        enabled: s.enabled,
        keywords: s.keywords,
        locations: s.locations,
      })),
      career_pages: careerPages.map((p) => ({
        url: p.url,
        company: p.company,
      })),
      freshness_days: freshnessDays,
    })
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

      {/* Source Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((source) => (
          <SourceCard
            key={source.id}
            source={source}
            onToggle={(enabled) => handleToggle(source.id, enabled)}
            onSync={() => handleSync(source.id)}
            onUpdateKeywords={(keywords) => handleUpdateKeywords(source.id, keywords)}
            onUpdateLocations={(locations) => handleUpdateLocations(source.id, locations)}
          />
        ))}
      </div>

      {/* Career Page URLs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-foreground">Career Page URLs</h3>
            <p className="text-xs text-muted-foreground">
              Monitor specific company career pages directly.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCareerPage}
            className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus className="mr-2 h-3 w-3" />
            Add URL
          </Button>
        </div>
        <div className="space-y-2">
          {careerPages.map((page) => (
            <div key={page.id} className="flex items-center gap-2">
              <Input
                value={page.company}
                onChange={(e) => handleUpdateCareerPage(page.id, "company", e.target.value)}
                placeholder="Company name"
                className="w-32 shrink-0 focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Input
                value={page.url}
                onChange={(e) => handleUpdateCareerPage(page.id, "url", e.target.value)}
                placeholder="https://company.com/careers"
                className="flex-1 focus-visible:ring-2 focus-visible:ring-primary"
              />
              {page.url && (
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-9 w-9 shrink-0"
                >
                  <a href={page.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCareerPage(page.id)}
                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Job Freshness */}
      <div className="space-y-3 rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <Label htmlFor="freshness">Job Freshness</Label>
          <span className="font-mono text-sm text-muted-foreground">
            {getFreshnessLabel(freshnessDays)}
          </span>
        </div>
        <Slider
          id="freshness"
          value={[freshnessDays]}
          onValueChange={([value]) => setFreshnessDays(value)}
          min={1}
          max={31}
          step={1}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Show jobs posted within the selected time frame. Set to 31 for all time.
        </p>
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
