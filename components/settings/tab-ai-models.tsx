"use client"

import * as React from "react"
import { Save, RotateCcw, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
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
import { cn } from "@/lib/utils"

type Provider = "anthropic" | "openai" | "google"

interface TaskModel {
  id: string
  task: string
  provider: Provider
  model: string
  temperature: number
  maxTokens: number
  testStatus?: "idle" | "testing" | "success" | "error"
  responseTime?: number
}

const providers = [
  { value: "anthropic", label: "Anthropic" },
  { value: "openai", label: "OpenAI" },
  { value: "google", label: "Google" },
]

const modelsByProvider: Record<Provider, { value: string; label: string }[]> = {
  anthropic: [
    { value: "claude-4", label: "Claude 4" },
    { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
    { value: "claude-3-opus", label: "Claude 3 Opus" },
  ],
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { value: "gpt-4", label: "GPT-4" },
  ],
  google: [
    { value: "gemini-2", label: "Gemini 2" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
    { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
  ],
}

const defaultTasks: TaskModel[] = [
  { id: "1", task: "Job Scoring", provider: "anthropic", model: "claude-4", temperature: 0.3, maxTokens: 4000 },
  { id: "2", task: "Resume Generation", provider: "anthropic", model: "claude-4", temperature: 0.7, maxTokens: 4000 },
  { id: "3", task: "Cover Letter", provider: "anthropic", model: "claude-3.5-sonnet", temperature: 0.7, maxTokens: 2000 },
  { id: "4", task: "QA Verification", provider: "openai", model: "gpt-4o", temperature: 0.1, maxTokens: 1000 },
  { id: "5", task: "Application Answers", provider: "anthropic", model: "claude-3.5-sonnet", temperature: 0.5, maxTokens: 2000 },
  { id: "6", task: "Outreach Messages", provider: "openai", model: "gpt-4o", temperature: 0.6, maxTokens: 1500 },
]

export function TabAIModels() {
  const [tasks, setTasks] = React.useState<TaskModel[]>(defaultTasks)
  const [copilot, setCopilot] = React.useState({
    provider: "anthropic" as Provider,
    model: "claude-4",
    temperature: 0.7,
  })
  const [isSaving, setIsSaving] = React.useState(false)

  const updateTask = (id: string, updates: Partial<TaskModel>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task
        const updated = { ...task, ...updates }
        // Reset model when provider changes
        if (updates.provider && updates.provider !== task.provider) {
          updated.model = modelsByProvider[updates.provider][0].value
        }
        return updated
      })
    )
  }

  const handleTest = async (id: string) => {
    updateTask(id, { testStatus: "testing" })
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    const success = Math.random() > 0.2
    const responseTime = Math.floor(200 + Math.random() * 800)
    
    updateTask(id, {
      testStatus: success ? "success" : "error",
      responseTime: success ? responseTime : undefined,
    })

    if (success) {
      toast.success(`Model test passed (${responseTime}ms)`)
    } else {
      toast.error("Model test failed. Check your API key.")
    }
  }

  const handleReset = () => {
    setTasks(defaultTasks)
    setCopilot({
      provider: "anthropic",
      model: "claude-4",
      temperature: 0.7,
    })
    toast.success("Settings reset to defaults")
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success("AI model settings saved")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">AI Model Configuration</h2>
        <p className="text-sm text-muted-foreground">
          Configure the AI models used for each task. Different tasks may benefit from different models.
        </p>
      </div>

      {/* Task Models Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Task</TableHead>
              <TableHead className="w-32">Provider</TableHead>
              <TableHead className="w-36">Model</TableHead>
              <TableHead className="w-28">Temp</TableHead>
              <TableHead className="w-24">Tokens</TableHead>
              <TableHead className="w-24">Test</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.task}</TableCell>
                <TableCell>
                  <Select
                    value={task.provider}
                    onValueChange={(value) =>
                      updateTask(task.id, { provider: value as Provider })
                    }
                  >
                    <SelectTrigger className="h-8 w-full focus-visible:ring-2 focus-visible:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {providers.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={task.model}
                    onValueChange={(value) =>
                      updateTask(task.id, { model: value })
                    }
                  >
                    <SelectTrigger className="h-8 w-full focus-visible:ring-2 focus-visible:ring-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modelsByProvider[task.provider].map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[task.temperature]}
                      onValueChange={([value]) =>
                        updateTask(task.id, { temperature: value })
                      }
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-16"
                    />
                    <span className="font-mono text-xs text-muted-foreground w-6">
                      {task.temperature.toFixed(1)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={task.maxTokens}
                    onChange={(e) =>
                      updateTask(task.id, { maxTokens: parseInt(e.target.value) || 1000 })
                    }
                    min={500}
                    max={16000}
                    step={500}
                    className="h-8 w-20 font-mono text-xs focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTest(task.id)}
                    disabled={task.testStatus === "testing"}
                    className={cn(
                      "h-8 w-16 gap-1 rounded-lg focus-visible:ring-2 focus-visible:ring-primary",
                      task.testStatus === "success" && "border-emerald-500 text-emerald-600",
                      task.testStatus === "error" && "border-red-500 text-red-600"
                    )}
                  >
                    {task.testStatus === "testing" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : task.testStatus === "success" ? (
                      <>
                        <Check className="h-3 w-3" />
                        {task.responseTime}ms
                      </>
                    ) : task.testStatus === "error" ? (
                      <>
                        <X className="h-3 w-3" />
                        Fail
                      </>
                    ) : (
                      "Test"
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Copilot Model Section */}
      <div className="space-y-4 rounded-xl border bg-card p-5">
        <div>
          <h3 className="font-medium text-foreground">Copilot Model</h3>
          <p className="text-sm text-muted-foreground">
            This model powers your AI assistant. A more capable model provides better advice.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="copilot-provider">Provider</Label>
            <Select
              value={copilot.provider}
              onValueChange={(value) => {
                const newProvider = value as Provider
                setCopilot({
                  ...copilot,
                  provider: newProvider,
                  model: modelsByProvider[newProvider][0].value,
                })
              }}
            >
              <SelectTrigger id="copilot-provider" className="focus-visible:ring-2 focus-visible:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="copilot-model">Model</Label>
            <Select
              value={copilot.model}
              onValueChange={(value) =>
                setCopilot({ ...copilot, model: value })
              }
            >
              <SelectTrigger id="copilot-model" className="focus-visible:ring-2 focus-visible:ring-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {modelsByProvider[copilot.provider].map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="copilot-temp">Temperature</Label>
              <span className="font-mono text-sm text-muted-foreground">
                {copilot.temperature.toFixed(1)}
              </span>
            </div>
            <Slider
              id="copilot-temp"
              value={[copilot.temperature]}
              onValueChange={([value]) =>
                setCopilot({ ...copilot, temperature: value })
              }
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
          </div>
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
