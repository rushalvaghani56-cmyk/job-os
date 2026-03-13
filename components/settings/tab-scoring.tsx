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
import { mockScoringSettings, mockTopJobs } from "./mock-data"
import type { ScoringSettings, ScoringWeight, BonusRule } from "./types"
import { cn } from "@/lib/utils"

const defaultWeights: ScoringWeight[] = [
  { id: "1", label: "Skill Match", value: 25, color: "#6366F1" },
  { id: "2", label: "Experience Fit", value: 20, color: "#8B5CF6" },
  { id: "3", label: "Salary Range", value: 15, color: "#EC4899" },
  { id: "4", label: "Location", value: 10, color: "#F43F5E" },
  { id: "5", label: "Company Rating", value: 10, color: "#F97316" },
  { id: "6", label: "Growth Potential", value: 8, color: "#EAB308" },
  { id: "7", label: "Culture Fit", value: 7, color: "#22C55E" },
  { id: "8", label: "Benefits", value: 5, color: "#06B6D4" },
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
      <div className="w-32 shrink-0">
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
      <div className="w-12 text-right font-mono text-sm text-muted-foreground shrink-0">
        {weight.value}
      </div>
      <div className="w-16 text-right font-mono text-xs text-muted-foreground shrink-0">
        {percentage}%
      </div>
    </div>
  )
}

function LivePreview({
  weights,
}: {
  weights: ScoringWeight[]
}) {
  // Simulate re-scoring based on current weights
  const [jobs, setJobs] = React.useState(mockTopJobs)
  const [isUpdating, setIsUpdating] = React.useState(false)

  React.useEffect(() => {
    setIsUpdating(true)
    const timer = setTimeout(() => {
      // Simulate score recalculation
      const updatedJobs = mockTopJobs.map((job) => ({
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
  }, [weights])

  return (
    <div className="rounded-xl border bg-muted/50 p-4">
      <h4 className="text-sm font-medium text-foreground mb-3">Live Preview</h4>
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

export function TabScoring() {
  const [settings, setSettings] = React.useState<ScoringSettings>(mockScoringSettings)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isGettingSuggestion, setIsGettingSuggestion] = React.useState(false)

  const total = settings.weights.reduce((sum, w) => sum + w.value, 0)

  const handleWeightChange = (id: string, newValue: number) => {
    const oldWeight = settings.weights.find((w) => w.id === id)
    if (!oldWeight) return

    const diff = newValue - oldWeight.value
    const otherWeights = settings.weights.filter((w) => w.id !== id)
    const otherTotal = otherWeights.reduce((sum, w) => sum + w.value, 0)

    // Auto-normalize: distribute the diff proportionally among other weights
    const newWeights = settings.weights.map((w) => {
      if (w.id === id) {
        return { ...w, value: newValue }
      }
      if (otherTotal === 0) return w
      const proportion = w.value / otherTotal
      const adjustment = Math.round(diff * proportion)
      return { ...w, value: Math.max(0, w.value - adjustment) }
    })

    setSettings({ ...settings, weights: newWeights })
  }

  const handleBonusToggle = (id: string, enabled: boolean) => {
    setSettings({
      ...settings,
      bonusRules: settings.bonusRules.map((rule) =>
        rule.id === id ? { ...rule, enabled } : rule
      ),
    })
  }

  const handleBonusChange = (id: string, field: keyof BonusRule, value: string | number) => {
    setSettings({
      ...settings,
      bonusRules: settings.bonusRules.map((rule) =>
        rule.id === id ? { ...rule, [field]: value } : rule
      ),
    })
  }

  const handleRemoveBonus = (id: string) => {
    setSettings({
      ...settings,
      bonusRules: settings.bonusRules.filter((rule) => rule.id !== id),
    })
  }

  const handleAddBonus = () => {
    const newRule: BonusRule = {
      id: Date.now().toString(),
      condition: "New Rule",
      field: "custom_field",
      operator: ">",
      value: "0",
      bonus: 5,
      enabled: true,
    }
    setSettings({
      ...settings,
      bonusRules: [...settings.bonusRules, newRule],
    })
  }

  const handleReset = () => {
    setSettings({ ...settings, weights: defaultWeights })
    toast.success("Weights reset to defaults")
  }

  const handleAISuggestion = async () => {
    setIsGettingSuggestion(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // Simulate AI suggestion
    const suggestedWeights = settings.weights.map((w) => ({
      ...w,
      value: Math.floor(Math.random() * 20) + 5,
    }))
    // Normalize to 100
    const suggestedTotal = suggestedWeights.reduce((sum, w) => sum + w.value, 0)
    const normalizedWeights = suggestedWeights.map((w) => ({
      ...w,
      value: Math.round((w.value / suggestedTotal) * 100),
    }))
    setSettings({ ...settings, weights: normalizedWeights })
    setIsGettingSuggestion(false)
    toast.success("AI-optimized weights applied")
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success("Scoring settings saved")
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
              <span className="font-mono text-xs text-muted-foreground">
                Total: {total}
              </span>
            </div>
            <div className="space-y-3">
              {settings.weights.map((weight) => (
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
              <h3 className="text-sm font-medium text-foreground">Bonus Rules</h3>
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
                    <TableHead className="w-20">Op</TableHead>
                    <TableHead className="w-24">Value</TableHead>
                    <TableHead className="w-20">Bonus</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.bonusRules.map((rule) => (
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
                        <Select
                          value={rule.operator}
                          onValueChange={(value) =>
                            handleBonusChange(rule.id, "operator", value)
                          }
                        >
                          <SelectTrigger className="h-8 w-full focus-visible:ring-2 focus-visible:ring-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=">">{">"}</SelectItem>
                            <SelectItem value="<">{"<"}</SelectItem>
                            <SelectItem value="=">{"="}</SelectItem>
                            <SelectItem value=">=">{">="}</SelectItem>
                            <SelectItem value="<=">{"<="}</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={rule.value}
                          onChange={(e) =>
                            handleBonusChange(rule.id, "value", e.target.value)
                          }
                          className="h-8 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={rule.bonus}
                          onChange={(e) =>
                            handleBonusChange(rule.id, "bonus", parseInt(e.target.value) || 0)
                          }
                          className="h-8 w-16 text-sm font-mono focus-visible:ring-2 focus-visible:ring-primary"
                        />
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
          <LivePreview weights={settings.weights} />
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
          disabled={isSaving}
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Weights"}
        </Button>
      </div>
    </div>
  )
}
