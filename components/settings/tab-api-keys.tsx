"use client"

import * as React from "react"
import { Plus, RefreshCw, Trash2, Eye, EyeOff, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { mockAPIKeys } from "./mock-data"
import type { APIKey } from "./types"

const providerLogos: Record<string, { name: string; color: string }> = {
  anthropic: { name: "Anthropic", color: "bg-orange-500" },
  openai: { name: "OpenAI", color: "bg-emerald-500" },
  google: { name: "Google", color: "bg-blue-500" },
}

function APIKeyCard({
  apiKey,
  onValidate,
  onRemove,
  onUpdate,
}: {
  apiKey: APIKey
  onValidate: (id: string) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, newKey: string) => void
}) {
  const [showUpdateDialog, setShowUpdateDialog] = React.useState(false)
  const [newKey, setNewKey] = React.useState("")
  const [showKey, setShowKey] = React.useState(false)
  const [isValidating, setIsValidating] = React.useState(false)

  const provider = providerLogos[apiKey.provider]

  const handleValidate = async () => {
    setIsValidating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    onValidate(apiKey.id)
    setIsValidating(false)
  }

  const handleUpdate = () => {
    if (newKey.trim()) {
      onUpdate(apiKey.id, newKey)
      setNewKey("")
      setShowUpdateDialog(false)
    }
  }

  return (
    <div className="rounded-xl border bg-card p-5 transition-colors hover:bg-accent/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${provider.color} text-white font-semibold text-sm`}
          >
            {provider.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium text-foreground">{provider.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <code className="font-mono text-xs text-muted-foreground">
                {apiKey.status === "not_set"
                  ? "Not configured"
                  : showKey
                  ? apiKey.maskedKey.replace(/•/g, "*")
                  : apiKey.maskedKey}
              </code>
              {apiKey.status !== "not_set" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        <Badge
          variant={
            apiKey.status === "active"
              ? "default"
              : apiKey.status === "invalid"
              ? "destructive"
              : "secondary"
          }
          className={
            apiKey.status === "active"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : apiKey.status === "invalid"
              ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
              : ""
          }
        >
          {apiKey.status === "active" && <Check className="mr-1 h-3 w-3" />}
          {apiKey.status === "invalid" && <X className="mr-1 h-3 w-3" />}
          {apiKey.status === "active"
            ? "Active"
            : apiKey.status === "invalid"
            ? "Invalid"
            : "Not Set"}
        </Badge>
      </div>

      {apiKey.lastValidated && (
        <p className="mt-3 text-xs text-muted-foreground">
          Last validated:{" "}
          {apiKey.lastValidated.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {apiKey.status !== "not_set" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleValidate}
              disabled={isValidating}
              className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
            >
              <RefreshCw
                className={`mr-2 h-3 w-3 ${isValidating ? "animate-spin" : ""}`}
              />
              {isValidating ? "Validating..." : "Validate"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(apiKey.id)}
              className="rounded-lg text-destructive hover:bg-destructive hover:text-destructive-foreground focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Trash2 className="mr-2 h-3 w-3" />
              Remove
            </Button>
          </>
        )}
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogTrigger asChild>
            <Button
              variant={apiKey.status === "not_set" ? "default" : "outline"}
              size="sm"
              className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
            >
              {apiKey.status === "not_set" ? "Add Key" : "Update Key"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {apiKey.status === "not_set" ? "Add" : "Update"} {provider.name}{" "}
                API Key
              </DialogTitle>
              <DialogDescription>
                Enter your {provider.name} API key. It will be securely stored
                and encrypted.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="font-mono focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowUpdateDialog(false)}
                className="rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={!newKey.trim()}
                className="rounded-lg"
              >
                Save Key
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export function TabAPIKeys() {
  const [apiKeys, setApiKeys] = React.useState<APIKey[]>(mockAPIKeys)
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [newProvider, setNewProvider] = React.useState("")
  const [newKey, setNewKey] = React.useState("")

  const handleValidate = (id: string) => {
    toast.success("API key validated successfully")
  }

  const handleRemove = (id: string) => {
    setApiKeys((keys) =>
      keys.map((key) =>
        key.id === id ? { ...key, status: "not_set" as const, maskedKey: "" } : key
      )
    )
    toast.success("API key removed")
  }

  const handleUpdate = (id: string, newKeyValue: string) => {
    setApiKeys((keys) =>
      keys.map((key) =>
        key.id === id
          ? {
              ...key,
              status: "active" as const,
              maskedKey: `sk-••••••••••••••${newKeyValue.slice(-4)}`,
              lastValidated: new Date(),
            }
          : key
      )
    )
    toast.success("API key updated successfully")
  }

  const handleAddNew = () => {
    if (newProvider && newKey.trim()) {
      const newApiKey: APIKey = {
        id: Date.now().toString(),
        provider: newProvider as "anthropic" | "openai" | "google",
        maskedKey: `sk-••••••••••••••${newKey.slice(-4)}`,
        status: "active",
        lastValidated: new Date(),
      }
      setApiKeys((keys) => [...keys, newApiKey])
      setNewProvider("")
      setNewKey("")
      setShowAddDialog(false)
      toast.success("API key added successfully")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
        <p className="text-sm text-muted-foreground">
          Manage your API keys for AI providers. Keys are encrypted and stored
          securely.
        </p>
      </div>

      <div className="grid gap-4">
        {apiKeys.map((apiKey) => (
          <APIKeyCard
            key={apiKey.id}
            apiKey={apiKey}
            onValidate={handleValidate}
            onRemove={handleRemove}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add New Key
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New API Key</DialogTitle>
            <DialogDescription>
              Add a new API key for an AI provider.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value={newProvider} onValueChange={setNewProvider}>
                <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newApiKey">API Key</Label>
              <Input
                id="newApiKey"
                type="password"
                placeholder="sk-..."
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="font-mono focus-visible:ring-2 focus-visible:ring-primary"
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
              onClick={handleAddNew}
              disabled={!newProvider || !newKey.trim()}
              className="rounded-lg"
            >
              Add Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
