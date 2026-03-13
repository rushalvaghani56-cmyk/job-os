"use client"

import * as React from "react"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { mockAIModelSettings } from "./mock-data"
import type { AIModelSettings } from "./types"

const models = [
  { value: "claude-4", label: "Claude 4 (Anthropic)" },
  { value: "claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "gpt-4o", label: "GPT-4o (OpenAI)" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gemini-2", label: "Gemini 2 (Google)" },
]

export function TabAIModels() {
  const [settings, setSettings] = React.useState<AIModelSettings>(mockAIModelSettings)
  const [isSaving, setIsSaving] = React.useState(false)

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
          Configure the AI models used for content generation and analysis.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="defaultModel">Default Model</Label>
            <Select
              value={settings.defaultModel}
              onValueChange={(value) =>
                setSettings({ ...settings, defaultModel: value })
              }
            >
              <SelectTrigger id="defaultModel" className="w-full focus-visible:ring-2 focus-visible:ring-primary">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fallbackModel">Fallback Model</Label>
            <Select
              value={settings.fallbackModel}
              onValueChange={(value) =>
                setSettings({ ...settings, fallbackModel: value })
              }
            >
              <SelectTrigger id="fallbackModel" className="w-full focus-visible:ring-2 focus-visible:ring-primary">
                <SelectValue placeholder="Select fallback model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="font-mono text-sm text-muted-foreground">
                {settings.temperature.toFixed(1)}
              </span>
            </div>
            <Slider
              id="temperature"
              value={[settings.temperature]}
              onValueChange={([value]) =>
                setSettings({ ...settings, temperature: value })
              }
              min={0}
              max={1}
              step={0.1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Lower values produce more focused outputs, higher values more creative.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxTokens">Max Tokens</Label>
              <span className="font-mono text-sm text-muted-foreground">
                {settings.maxTokens.toLocaleString()}
              </span>
            </div>
            <Slider
              id="maxTokens"
              value={[settings.maxTokens]}
              onValueChange={([value]) =>
                setSettings({ ...settings, maxTokens: value })
              }
              min={1024}
              max={16384}
              step={1024}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of tokens in AI responses.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          <div className="space-y-0.5">
            <Label htmlFor="streamResponses">Stream Responses</Label>
            <p className="text-xs text-muted-foreground">
              Show AI responses as they are generated in real-time.
            </p>
          </div>
          <Switch
            id="streamResponses"
            checked={settings.streamResponses}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, streamResponses: checked })
            }
            className="focus-visible:ring-2 focus-visible:ring-primary"
          />
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
