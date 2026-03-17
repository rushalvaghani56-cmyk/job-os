"use client"

import * as React from "react"
import { Save, RotateCcw, Sparkles, Plus, Trash2 } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useScoringSettings, useUpdateScoringSettings } from "@/hooks/useSettings"
import type { BonusRule } from "./types"
import { cn } from "@/lib/utils"

interface ScoringWeight {
  id: string
  label: string
  value: number
  color: string
}

// 8 weights from spec with correct defaults
const defaultWeights: ScoringWeight[] = [
  { id: "1", label: "Skill Match", value: 30, color: "#6366F1" },
  { id: "2", label: "Title Match", value: 20, color: "#8B5CF6" },
  { id: "3", label: "Seniority Fit", value: 15, color: "#EC4899" },
  { id: "4", label: "Location", value: 10, color: "#F43F5E" },
  { id: "5", label: "Salary", value: 10, color: "#F97316" },
  { id: "6", label: "Company", value: 8, color: "#EAB308" },
  { id: "7", label: "Culture", value: 4, color: "#22C55E" },
  { id: "8", label: "Freshness", value: 3, color: "#06B6D4" },
]

const defaultBonusRules: BonusRule[] = [
  { id: "1", condition: "Glassdoor rating > 4.0", field: "glassdoor_rating", operator: ">", value: "4.0", bonus: 5, enabled: true },
  { id: "2", condition: "Company size 100-1000", field: "employee_count", operator: ">=", value: "100", bonus: 3, enabled: true },
  { id: "3", condition: "Remote work", field: "remote", operator: "=", value: "true", bonus: 2, enabled: true },
]

function WeightSlider({
  weight,
  total,
  onChange,
}: {
  weight: ScoringWeight
  total: number
  onChange: (newValue: number) => void
}) {
  const percentage = total > 0 ? ((weight.value / total) * 100).toFixed(1) : "0.0"

  return (
    <div className="flex items-center gap-4">
      <div
        className="h-3 w-3 rounded-full shrink-0"
        style={{ backgroundColor: weight.color }}
      />
      <div className="w-28 shrink-0">
        <span className="text-sm text-foreground">{weight.label}</span>
      </div>
      <div className="flex-1">
        <Slider
          value={[weight.value]}
          onValueChange={([value]) => onChange(value)}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
      <div className="w-10 text-right font-mono text-sm text-muted-foreground shrink-0">
        {weight.value}
      </div>
      <div className="w-14 text-right font-mono text-xs text-muted-foreground shrink-0">
        {percentage}%
      </div>
    </div>
  )
}

const defaultTopJobs = [
  { id: "1", title: "Senior Frontend Engineer", company: "Stripe", currentScore: 92 },
  { id: "2", title: "Staff Engineer", company: "Vercel", currentScore: 89 },
  { id: "3", title: "Tech Lead", company: "Linear", currentScore: 87 },
  { id: "4", title: "Senior SWE", company: "Notion", currentScore: 85 },
  { id: "5", title: "Principal Engineer", company: "Figma", currentScore: 83 },
]

function LivePreview({
  weights,
  topJobs: initialJobs,
}: {
  weights: ScoringWeight[]
  topJobs?: { id: string; title: string; company: string; currentScore: number }[]
}) {
  const baseJobs = initialJobs?.length ? initialJobs : defaultTopJobs
  const [jobs, setJobs] = React.useState(baseJobs)
  const [isUpdating, setIsUpdating] = React.useState(false)

  React.useEffect(() => {
    setIsUpdating(true)
    const timer = setTimeout(() => {
      // Simulate score recalculation based on weights
      const updatedJobs = baseJobs.map((job) => ({
        ...job,
        currentScore: Math.min(
          100,
          Math.max(
            0,
            job.currentScore + Math.floor(Math.random() * 10) - 5
          )
        ),
      }))
      setJobs(updatedJobs.sort((a, b) => b.currentScore - a.currentScore))
      setIsUpdating(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [weights, baseJobs])

  return (
    <div className="rounded-xl border bg-muted/50 p-4">
      <h4 className="text-sm font-medium text-foreground mb-3">
        Top 5 Jobs with These Weights
      </h4>
      <div
        className={cn(
          "space-y-2 transition-opacity duration-200",
          isUpdating ? "opacity-50" : "opacity-100"
        )}
      >
        {jobs.map((job, index) => (
          <div
            key={job.id}
            className="flex items-center justify-between rounded-lg bg-background p-2"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground w-4">
                {index + 1}.
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{job.title}</p>
                <p className="text-xs text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                "font-mono",
                job.currentScore >= 90
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : job.currentScore >= 80
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              )}
            >
              {job.currentScore}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Map API scoring settings to local shapes */
function mapScoringData(apiData: Record<string, unknown> | undefined) {
  if (!apiData) return { weights: defaultWeights, bonusRules: defaultBonusRules, topJobs: defaultTopJobs }

  const apiWeights = (apiData.weights ?? apiData.scoring_weights) as any[] | undefined
  const apiBonusRules = (apiData.bonus_rules ?? apiData.bonusRules) as any[] | undefined
  const apiTopJobs = (apiData.top_jobs ?? apiData.topJobs) as any[] | undefined

  const colors = ["#6366F1", "#8B5CF6", "#EC4899", "#F43F5E", "#F97316", "#EAB308", "#22C55E", "#06B6D4"]

  const weights: ScoringWeight[] = apiWeights?.length
    ? apiWeights.map((w: any, i: number) => ({
        id: String(w.id ?? i + 1),
        label: (w.label ?? w.name ?? `Weight ${i + 1}`) as string,
        value: (w.value ?? w.weight ?? 0) as number,
        color: colors[i % colors.length],
      }))
    : defaultWeights

  const bonusRules: BonusRule[] = apiBonusRules?.length
    ? apiBonusRules.map((r: any) => ({
        id: String(r.id ?? Date.now()),
        condition: (r.condition ?? "") as string,
        field: (r.field ?? "") as string,
        operator: (r.operator ?? ">") as BonusRule["operator"],
        value: String(r.value ?? "0"),
        bonus: (r.bonus ?? r.points ?? 0) as number,
        enabled: (r.enabled ?? true) as boolean,
      }))
    : defaultBonusRules

  const topJobs = apiTopJobs?.length
    ? apiTopJobs.map((j: any) => ({
        id: String(j.id ?? ""),
        title: (j.title ?? "") as string,
        company: (j.company ?? "") as string,
        currentScore: (j.current_score ?? j.currentScore ?? j.score ?? 0) as number,
      }))
    : defaultTopJobs

  return { weights, bonusRules, topJobs }
}

export function TabScoring() {
  const { data: apiData, isLoading, error } = useScoringSettings()
  const updateMutation = useUpdateScoringSettings()
  const [initialized, setInitialized] = React.useState(false)
  const [weights, setWeights] = React.useState<ScoringWeight[]>(defaultWeights)
  const [bonusRules, setBonusRules] = React.useState<BonusRule[]>(defaultBonusRules)
  const [topJobs, setTopJobs] = React.useState(defaultTopJobs)
  const [isGettingSuggestion, setIsGettingSuggestion] = React.useState(false)

  React.useEffect(() => {
    if (apiData && !initialized) {
      const mapped = mapScoringData(apiData)
      setWeights(mapped.weights)
      setBonusRules(mapped.bonusRules)
      setTopJobs(mapped.topJobs)
      setInitialized(true)
    }
  }, [apiData, initialized])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-card p-10">
        <p className="text-sm text-destructive">Failed to load scoring settings. Please try again later.</p>
      </div>
    )
  }

  const total = weights.reduce((sum, w) => sum + w.value, 0)

  const handleWeightChange = (id: string, newValue: number) => {
    const oldWeight = weights.find((w) => w.id === id)
    if (!oldWeight) return

    const diff = newValue - oldWeight.value
    const otherWeights = weights.filter((w) => w.id !== id)
    const otherTotal = otherWeights.reduce((sum, w) => sum + w.value, 0)

    // Auto-normalize: distribute the diff proportionally among other weights
    const newWeights = weights.map((w) => {
      if (w.id === id) {
        return { ...w, value: newValue }
      }
      if (otherTotal === 0) return w
      const proportion = w.value / otherTotal
      const adjustment = Math.round(diff * proportion)
      return { ...w, value: Math.max(0, w.value - adjustment) }
    })

    setWeights(newWeights)
  }

  const handleBonusToggle = (id: string, enabled: boolean) => {
    setBonusRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, enabled } : rule))
    )
  }

  const handleRemoveBonus = (id: string) => {
    setBonusRules((prev) => prev.filter((rule) => rule.id !== id))
  }

  const handleAddBonus = () => {
    const newRule: BonusRule = {
      id: Date.now().toString(),
      condition: "New condition",
      field: "custom_field",
      operator: ">",
      value: "0",
      bonus: 5,
      enabled: true,
    }
    setBonusRules((prev) => [...prev, newRule])
  }

  const handleBonusChange = (id: string, field: keyof BonusRule, value: string | number) => {
    setBonusRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, [field]: value } : rule))
    )
  }

  const handleReset = () => {
    setWeights(defaultWeights)
    setBonusRules(defaultBonusRules)
    toast.success("Weights reset to defaults")
  }

  const handleAISuggestion = async () => {
    setIsGettingSuggestion(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Simulate AI suggestion with reasoning
    const suggestedWeights: ScoringWeight[] = [
      { id: "1", label: "Skill Match", value: 35, color: "#6366F1" },
      { id: "2", label: "Title Match", value: 18, color: "#8B5CF6" },
      { id: "3", label: "Seniority Fit", value: 12, color: "#EC4899" },
      { id: "4", label: "Location", value: 8, color: "#F43F5E" },
      { id: "5", label: "Salary", value: 12, color: "#F97316" },
      { id: "6", label: "Company", value: 7, color: "#EAB308" },
      { id: "7", label: "Culture", value: 5, color: "#22C55E" },
      { id: "8", label: "Freshness", value: 3, color: "#06B6D4" },
    ]
    
    setWeights(suggestedWeights)
    setIsGettingSuggestion(false)
    toast.success("AI-optimized weights applied: Increased skill match emphasis based on your profile strengths")
  }

  const handleSave = () => {
    updateMutation.mutate({
      weights: weights.map((w) => ({ id: w.id, label: w.label, value: w.value })),
      bonus_rules: bonusRules.map((r) => ({
        id: r.id,
        condition: r.condition,
        field: r.field,
        operator: r.operator,
        value: r.value,
        bonus: r.bonus,
        enabled: r.enabled,
      })),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Scoring Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Adjust the weights used to calculate job match scores. Weights auto-normalize to 100%.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,300px]">
        {/* Weights Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Weight Sliders</h3>
              <span className={cn(
                "font-mono text-xs",
                total === 100 ? "text-emerald-600" : "text-amber-600"
              )}>
                Total: {total}%
              </span>
            </div>
            <div className="space-y-3">
              {weights.map((weight) => (
                <WeightSlider
                  key={weight.id}
                  weight={weight}
                  total={total}
                  onChange={(newValue) => handleWeightChange(weight.id, newValue)}
                />
              ))}
            </div>
          </div>

          {/* Bonus Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Bonus Point Rules</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddBonus}
                className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Plus className="mr-2 h-3 w-3" />
                Add Rule
              </Button>
            </div>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">On</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead className="w-20">Points</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bonusRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(checked) =>
                            handleBonusToggle(rule.id, checked)
                          }
                          className="focus-visible:ring-2 focus-visible:ring-primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={rule.condition}
                          onChange={(e) =>
                            handleBonusChange(rule.id, "condition", e.target.value)
                          }
                          className="h-8 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-emerald-600">+</span>
                          <Input
                            type="number"
                            value={rule.bonus}
                            onChange={(e) =>
                              handleBonusChange(rule.id, "bonus", parseInt(e.target.value) || 0)
                            }
                            className="h-8 w-14 text-sm font-mono focus-visible:ring-2 focus-visible:ring-primary"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveBonus(rule.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <LivePreview weights={weights} topJobs={topJobs} />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          variant="ghost"
          onClick={handleReset}
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
        <Button
          variant="outline"
          onClick={handleAISuggestion}
          disabled={isGettingSuggestion}
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Sparkles className={cn("mr-2 h-4 w-4", isGettingSuggestion && "animate-pulse")} />
          {isGettingSuggestion ? "Analyzing..." : "AI Suggestion"}
        </Button>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Save className="mr-2 h-4 w-4" />
          {updateMutation.isPending ? "Saving..." : "Save Weights"}
        </Button>
      </div>
    </div>
  )
}
