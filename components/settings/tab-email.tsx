"use client"

import * as React from "react"
import { Save, Plus, Trash2, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { mockEmailSettings } from "./mock-data"
import type { EmailSettings, EmailTemplate } from "./types"

const templateTypes = [
  { value: "follow_up", label: "Follow Up" },
  { value: "thank_you", label: "Thank You" },
  { value: "cold_outreach", label: "Cold Outreach" },
  { value: "referral", label: "Referral" },
]

function TemplateCard({
  template,
  onEdit,
  onDelete,
}: {
  template: EmailTemplate
  onEdit: () => void
  onDelete: () => void
}) {
  const typeLabel = templateTypes.find((t) => t.value === template.type)?.label || template.type

  return (
    <div className="rounded-xl border bg-card p-4 transition-colors hover:bg-accent/50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground truncate">{template.name}</h4>
            <Badge variant="secondary" className="text-xs shrink-0">
              {typeLabel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {template.subject}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export function TabEmail() {
  const [settings, setSettings] = React.useState<EmailSettings>(mockEmailSettings)
  const [isSaving, setIsSaving] = React.useState(false)
  const [showTemplateDialog, setShowTemplateDialog] = React.useState(false)
  const [editingTemplate, setEditingTemplate] = React.useState<EmailTemplate | null>(null)
  const [templateForm, setTemplateForm] = React.useState<Partial<EmailTemplate>>({
    name: "",
    subject: "",
    body: "",
    type: "follow_up",
  })

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template)
    setTemplateForm(template)
    setShowTemplateDialog(true)
  }

  const handleDeleteTemplate = (id: string) => {
    setSettings({
      ...settings,
      templates: settings.templates.filter((t) => t.id !== id),
    })
    toast.success("Template deleted")
  }

  const handleSaveTemplate = () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.body) return

    if (editingTemplate) {
      setSettings({
        ...settings,
        templates: settings.templates.map((t) =>
          t.id === editingTemplate.id
            ? { ...t, ...templateForm } as EmailTemplate
            : t
        ),
      })
      toast.success("Template updated")
    } else {
      const newTemplate: EmailTemplate = {
        id: Date.now().toString(),
        name: templateForm.name,
        subject: templateForm.subject,
        body: templateForm.body,
        type: templateForm.type as EmailTemplate["type"],
      }
      setSettings({
        ...settings,
        templates: [...settings.templates, newTemplate],
      })
      toast.success("Template created")
    }

    setEditingTemplate(null)
    setTemplateForm({ name: "", subject: "", body: "", type: "follow_up" })
    setShowTemplateDialog(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success("Email settings saved")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Email Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure email preferences and manage your outreach templates.
        </p>
      </div>

      {/* General Email Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">General Settings</h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="replyTo">Reply-To Address</Label>
            <Input
              id="replyTo"
              type="email"
              value={settings.replyTo}
              onChange={(e) =>
                setSettings({ ...settings, replyTo: e.target.value })
              }
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signature">Default Signature</Label>
          <Textarea
            id="signature"
            value={settings.defaultSignature}
            onChange={(e) =>
              setSettings({ ...settings, defaultSignature: e.target.value })
            }
            rows={3}
            className="resize-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border bg-card p-4">
            <div>
              <Label htmlFor="sendCopy">Send Copy to Self</Label>
              <p className="text-xs text-muted-foreground">
                Receive a copy of all outgoing emails.
              </p>
            </div>
            <Switch
              id="sendCopy"
              checked={settings.sendCopyToSelf}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, sendCopyToSelf: checked })
              }
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border bg-card p-4">
            <div>
              <Label htmlFor="trackOpens">Track Email Opens</Label>
              <p className="text-xs text-muted-foreground">
                Know when recipients open your emails.
              </p>
            </div>
            <Switch
              id="trackOpens"
              checked={settings.trackOpens}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, trackOpens: checked })
              }
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border bg-card p-4">
            <div>
              <Label htmlFor="trackClicks">Track Link Clicks</Label>
              <p className="text-xs text-muted-foreground">
                Know when recipients click links in your emails.
              </p>
            </div>
            <Switch
              id="trackClicks"
              checked={settings.trackClicks}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, trackClicks: checked })
              }
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Email Templates</h3>
          <Dialog open={showTemplateDialog} onOpenChange={(open) => {
            setShowTemplateDialog(open)
            if (!open) {
              setEditingTemplate(null)
              setTemplateForm({ name: "", subject: "", body: "", type: "follow_up" })
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary">
                <Plus className="mr-2 h-3 w-3" />
                Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? "Edit Template" : "Create Template"}
                </DialogTitle>
                <DialogDescription>
                  Create reusable email templates for your outreach. Use {"{{name}}"}, {"{{company}}"}, {"{{position}}"} as placeholders.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="templateName">Name</Label>
                    <Input
                      id="templateName"
                      value={templateForm.name || ""}
                      onChange={(e) =>
                        setTemplateForm({ ...templateForm, name: e.target.value })
                      }
                      placeholder="e.g., Initial Outreach"
                      className="focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="templateType">Type</Label>
                    <Select
                      value={templateForm.type}
                      onValueChange={(value) =>
                        setTemplateForm({ ...templateForm, type: value as EmailTemplate["type"] })
                      }
                    >
                      <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {templateTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateSubject">Subject</Label>
                  <Input
                    id="templateSubject"
                    value={templateForm.subject || ""}
                    onChange={(e) =>
                      setTemplateForm({ ...templateForm, subject: e.target.value })
                    }
                    placeholder="e.g., Following up on {{position}} role"
                    className="focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="templateBody">Body</Label>
                  <Textarea
                    id="templateBody"
                    value={templateForm.body || ""}
                    onChange={(e) =>
                      setTemplateForm({ ...templateForm, body: e.target.value })
                    }
                    placeholder="Hi {{name}},&#10;&#10;I wanted to reach out about..."
                    rows={8}
                    className="resize-none font-mono text-sm focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowTemplateDialog(false)}
                  className="rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveTemplate}
                  disabled={!templateForm.name || !templateForm.subject || !templateForm.body}
                  className="rounded-lg"
                >
                  {editingTemplate ? "Update Template" : "Create Template"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {settings.templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => handleEditTemplate(template)}
              onDelete={() => handleDeleteTemplate(template.id)}
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
