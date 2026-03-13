"use client"

import { useState } from "react"
import {
  Star,
  Target,
  FileText,
  Send,
  AlertCircle,
  Calendar,
  XCircle,
  Ghost,
  Clock,
  Key,
  Shield,
  BarChart,
  Sparkles,
  Bell,
  Plus,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NotificationType {
  id: string
  label: string
  description: string
  icon: React.ElementType
  priority: "critical" | "high" | "medium" | "low"
  enabled: boolean
}

interface CustomRule {
  id: string
  name: string
  condition: string
  action: string
  priority: "critical" | "high" | "medium" | "low"
}

const notificationTypes: NotificationType[] = [
  { id: "dream_company_match", label: "Dream Company Match", description: "When a dream company posts a matching job", icon: Star, priority: "critical", enabled: true },
  { id: "high_score_job", label: "High Score Job", description: "When a job scores above your threshold", icon: Target, priority: "high", enabled: true },
  { id: "content_ready", label: "Content Ready", description: "When AI finishes generating documents", icon: FileText, priority: "high", enabled: true },
  { id: "application_submitted", label: "Application Submitted", description: "When an application is successfully submitted", icon: Send, priority: "medium", enabled: true },
  { id: "application_failed", label: "Application Failed", description: "When an application submission fails", icon: AlertCircle, priority: "high", enabled: true },
  { id: "interview_detected", label: "Interview Detected", description: "When an interview invitation is detected in email", icon: Calendar, priority: "critical", enabled: true },
  { id: "rejection_detected", label: "Rejection Detected", description: "When a rejection email is detected", icon: XCircle, priority: "low", enabled: false },
  { id: "ghost_detected", label: "Ghost Detected", description: "When no response after expected timeframe", icon: Ghost, priority: "low", enabled: false },
  { id: "follow_up_due", label: "Follow-up Due", description: "When a scheduled follow-up is due", icon: Clock, priority: "medium", enabled: true },
  { id: "api_key_warning", label: "API Key Warning", description: "When an API key is expiring or invalid", icon: Key, priority: "high", enabled: true },
  { id: "captcha_intervention", label: "CAPTCHA Intervention", description: "When manual CAPTCHA solving is needed", icon: Shield, priority: "high", enabled: true },
  { id: "weekly_report", label: "Weekly Report", description: "Weekly summary of your job search", icon: BarChart, priority: "medium", enabled: true },
  { id: "discovery_complete", label: "Discovery Complete", description: "When a discovery run finishes", icon: Target, priority: "low", enabled: false },
  { id: "copilot_insight", label: "Copilot Insight", description: "When AI Copilot has a new insight", icon: Sparkles, priority: "medium", enabled: true },
]

const priorityConfig = {
  critical: { label: "Critical", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30" },
  medium: { label: "Medium", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  low: { label: "Low", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30" },
}

export function TabNotifications() {
  const [notifications, setNotifications] = useState<NotificationType[]>(notificationTypes)
  const [customRules, setCustomRules] = useState<CustomRule[]>([
    { id: "1", name: "FAANG Alert", condition: "company IN [Google, Meta, Apple, Amazon, Netflix]", action: "Push + Email", priority: "critical" },
  ])
  const [isAddingRule, setIsAddingRule] = useState(false)
  const [newRule, setNewRule] = useState({ name: "", condition: "", action: "push", priority: "medium" as const })

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    )
  }

  const handleAddRule = () => {
    if (newRule.name && newRule.condition) {
      setCustomRules((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          ...newRule,
          action: newRule.action === "push" ? "Push" : newRule.action === "email" ? "Email" : "Push + Email",
        },
      ])
      setNewRule({ name: "", condition: "", action: "push", priority: "medium" })
      setIsAddingRule(false)
    }
  }

  const deleteRule = (id: string) => {
    setCustomRules((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Configure which notifications you receive and how they're delivered.
        </p>
      </div>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Types</CardTitle>
          <CardDescription>
            Enable or disable specific notification types based on your preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = notification.icon
                const priority = priorityConfig[notification.priority]
                return (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between gap-4 rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-muted p-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{notification.label}</span>
                          <Badge variant="outline" className={cn("text-xs", priority.color)}>
                            {priority.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => toggleNotification(notification.id)}
                    />
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Custom Alert Rules */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Custom Alert Rules</CardTitle>
            <CardDescription>
              Create custom rules to get notified about specific conditions.
            </CardDescription>
          </div>
          <Dialog open={isAddingRule} onOpenChange={setIsAddingRule}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Rule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Alert Rule</DialogTitle>
                <DialogDescription>
                  Set up a custom notification rule based on specific conditions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    placeholder="e.g., FAANG Alert"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={newRule.condition}
                    onValueChange={(value) => setNewRule({ ...newRule, condition: value })}
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score >= 90">Score is 90 or above</SelectItem>
                      <SelectItem value="score >= 85">Score is 85 or above</SelectItem>
                      <SelectItem value="company IN [Google, Meta, Apple, Amazon, Netflix]">Company is FAANG</SelectItem>
                      <SelectItem value="salary >= target">Salary meets or exceeds target</SelectItem>
                      <SelectItem value="is_remote = true">Job is fully remote</SelectItem>
                      <SelectItem value="seniority = Staff">Seniority is Staff level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="action">Action</Label>
                  <Select
                    value={newRule.action}
                    onValueChange={(value) => setNewRule({ ...newRule, action: value })}
                  >
                    <SelectTrigger id="action">
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="both">Push + Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newRule.priority}
                    onValueChange={(value: "critical" | "high" | "medium" | "low") =>
                      setNewRule({ ...newRule, priority: value })
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingRule(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRule}>Create Rule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {customRules.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customRules.map((rule) => {
                    const priority = priorityConfig[rule.priority]
                    return (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell className="font-mono text-xs">{rule.condition}</TableCell>
                        <TableCell>{rule.action}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("text-xs", priority.color)}>
                            {priority.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteRule(rule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No custom rules yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create rules to get notified about specific conditions
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
