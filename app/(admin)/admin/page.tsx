"use client"

import * as React from "react"
import { useState } from "react"
import {
  Search,
  Users,
  BarChart3,
  Flag,
  Activity,
  Megaphone,
  Shield,
  ChevronDown,
  MoreHorizontal,
  Ban,
  UserCheck,
  Eye,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Types
interface User {
  id: string
  name: string
  email: string
  plan: "free" | "pro" | "enterprise"
  status: "active" | "suspended" | "pending"
  createdAt: Date
  lastActive: Date
  profileCount: number
  jobsDiscovered: number
  applications: number
}

interface FeatureFlag {
  id: string
  name: string
  description: string
  enabled: boolean
  rolloutPercentage: number
}

interface Service {
  name: string
  status: "operational" | "degraded" | "outage"
  uptime: number
  lastIncident: string | null
}

interface AuditLog {
  id: string
  timestamp: Date
  actor: string
  action: string
  target: string
  details: string
}

// Mock Data
const mockUsers: User[] = [
  {
    id: "usr_001",
    name: "John Doe",
    email: "john@example.com",
    plan: "pro",
    status: "active",
    createdAt: new Date("2024-01-15"),
    lastActive: new Date("2026-03-14"),
    profileCount: 3,
    jobsDiscovered: 247,
    applications: 38,
  },
  {
    id: "usr_002",
    name: "Jane Smith",
    email: "jane@example.com",
    plan: "enterprise",
    status: "active",
    createdAt: new Date("2024-02-20"),
    lastActive: new Date("2026-03-13"),
    profileCount: 5,
    jobsDiscovered: 512,
    applications: 67,
  },
  {
    id: "usr_003",
    name: "Bob Wilson",
    email: "bob@example.com",
    plan: "free",
    status: "suspended",
    createdAt: new Date("2024-06-10"),
    lastActive: new Date("2026-02-28"),
    profileCount: 1,
    jobsDiscovered: 45,
    applications: 8,
  },
  {
    id: "usr_004",
    name: "Alice Brown",
    email: "alice@example.com",
    plan: "pro",
    status: "pending",
    createdAt: new Date("2026-03-10"),
    lastActive: new Date("2026-03-10"),
    profileCount: 0,
    jobsDiscovered: 0,
    applications: 0,
  },
]

const mockFeatureFlags: FeatureFlag[] = [
  {
    id: "ff_001",
    name: "ai_copilot_v2",
    description: "New AI Copilot with enhanced context awareness",
    enabled: true,
    rolloutPercentage: 100,
  },
  {
    id: "ff_002",
    name: "auto_apply",
    description: "Automatic job application submission",
    enabled: true,
    rolloutPercentage: 75,
  },
  {
    id: "ff_003",
    name: "email_detection",
    description: "Gmail integration for email detection",
    enabled: true,
    rolloutPercentage: 100,
  },
  {
    id: "ff_004",
    name: "market_intel_beta",
    description: "Beta market intelligence features",
    enabled: false,
    rolloutPercentage: 0,
  },
  {
    id: "ff_005",
    name: "interview_prep_ai",
    description: "AI-powered interview preparation",
    enabled: true,
    rolloutPercentage: 50,
  },
]

const mockServices: Service[] = [
  { name: "API Gateway", status: "operational", uptime: 99.99, lastIncident: null },
  { name: "Job Discovery", status: "operational", uptime: 99.95, lastIncident: "2026-02-15" },
  { name: "AI Services", status: "operational", uptime: 99.87, lastIncident: "2026-03-01" },
  { name: "Email Processing", status: "degraded", uptime: 98.5, lastIncident: "2026-03-14" },
  { name: "Database", status: "operational", uptime: 99.99, lastIncident: null },
  { name: "File Storage", status: "operational", uptime: 99.97, lastIncident: "2026-01-20" },
]

const mockAuditLogs: AuditLog[] = [
  {
    id: "log_001",
    timestamp: new Date("2026-03-14T10:30:00"),
    actor: "admin@jobos.com",
    action: "user.suspended",
    target: "usr_003",
    details: "User suspended for TOS violation",
  },
  {
    id: "log_002",
    timestamp: new Date("2026-03-14T09:15:00"),
    actor: "admin@jobos.com",
    action: "feature_flag.updated",
    target: "ff_002",
    details: "Rollout increased from 50% to 75%",
  },
  {
    id: "log_003",
    timestamp: new Date("2026-03-13T16:45:00"),
    actor: "system",
    action: "announcement.published",
    target: "ann_001",
    details: "New feature announcement sent to all users",
  },
]

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

function getStatusBadge(status: User["status"]) {
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Active</Badge>
    case "suspended":
      return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">Suspended</Badge>
    case "pending":
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Pending</Badge>
  }
}

function getPlanBadge(plan: User["plan"]) {
  switch (plan) {
    case "free":
      return <Badge variant="outline">Free</Badge>
    case "pro":
      return <Badge className="bg-primary/10 text-primary border-primary/20">Pro</Badge>
    case "enterprise":
      return <Badge className="bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20">Enterprise</Badge>
  }
}

function getServiceStatusIcon(status: Service["status"]) {
  switch (status) {
    case "operational":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    case "degraded":
      return <AlertCircle className="h-4 w-4 text-amber-500" />
    case "outage":
      return <XCircle className="h-4 w-4 text-red-500" />
  }
}

// Components
function UsersTab() {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [impersonateDialogOpen, setImpersonateDialogOpen] = useState(false)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSuspend = (user: User) => {
    setSelectedUser(user)
    setSuspendDialogOpen(true)
  }

  const confirmSuspend = () => {
    if (selectedUser) {
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? { ...u, status: u.status === "suspended" ? "active" : "suspended" }
            : u
        )
      )
    }
    setSuspendDialogOpen(false)
    setSelectedUser(null)
  }

  const handleImpersonate = (user: User) => {
    setSelectedUser(user)
    setImpersonateDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Profiles</TableHead>
                <TableHead className="text-right">Jobs</TableHead>
                <TableHead className="text-right">Apps</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getPlanBadge(user.plan)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{user.profileCount}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{user.jobsDiscovered}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{user.applications}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.lastActive)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleImpersonate(user)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Impersonate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleSuspend(user)}
                          className={user.status === "suspended" ? "text-emerald-600" : "text-destructive"}
                        >
                          {user.status === "suspended" ? (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Reactivate
                            </>
                          ) : (
                            <>
                              <Ban className="mr-2 h-4 w-4" />
                              Suspend
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "suspended" ? "Reactivate User" : "Suspend User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.status === "suspended"
                ? `Are you sure you want to reactivate ${selectedUser?.name}? They will regain access to their account.`
                : `Are you sure you want to suspend ${selectedUser?.name}? They will lose access to their account.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSuspend}
              className={selectedUser?.status === "suspended" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-destructive hover:bg-destructive/90"}
            >
              {selectedUser?.status === "suspended" ? "Reactivate" : "Suspend"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={impersonateDialogOpen} onOpenChange={setImpersonateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Impersonate User</DialogTitle>
            <DialogDescription>
              You are about to impersonate {selectedUser?.name}. This action is logged for security purposes.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-600 dark:text-amber-400">
            Warning: All actions taken while impersonating will be attributed to your admin account in the audit log.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImpersonateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setImpersonateDialogOpen(false)}>
              Start Impersonation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FeatureFlagsTab() {
  const [flags, setFlags] = useState(mockFeatureFlags)

  const toggleFlag = (id: string) => {
    setFlags(
      flags.map((f) =>
        f.id === id ? { ...f, enabled: !f.enabled } : f
      )
    )
  }

  const updateRollout = (id: string, percentage: number) => {
    setFlags(
      flags.map((f) =>
        f.id === id ? { ...f, rolloutPercentage: percentage } : f
      )
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">Rollout %</TableHead>
              <TableHead className="w-[100px]">Enabled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flags.map((flag) => (
              <TableRow key={flag.id}>
                <TableCell className="font-mono text-sm">{flag.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{flag.description}</TableCell>
                <TableCell>
                  <Select
                    value={String(flag.rolloutPercentage)}
                    onValueChange={(v) => updateRollout(flag.id, Number(v))}
                    disabled={!flag.enabled}
                  >
                    <SelectTrigger className="h-8 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 10, 25, 50, 75, 100].map((p) => (
                        <SelectItem key={p} value={String(p)}>
                          {p}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={flag.enabled}
                    onCheckedChange={() => toggleFlag(flag.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

function SystemHealthTab() {
  const [services] = useState(mockServices)

  const overallStatus = services.some((s) => s.status === "outage")
    ? "outage"
    : services.some((s) => s.status === "degraded")
    ? "degraded"
    : "operational"

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className={cn(
        "border-2",
        overallStatus === "operational" && "border-emerald-500/20 bg-emerald-500/5",
        overallStatus === "degraded" && "border-amber-500/20 bg-amber-500/5",
        overallStatus === "outage" && "border-red-500/20 bg-red-500/5"
      )}>
        <CardContent className="flex items-center gap-4 py-4">
          {overallStatus === "operational" ? (
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          ) : overallStatus === "degraded" ? (
            <AlertCircle className="h-8 w-8 text-amber-500" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
          <div>
            <h3 className="font-semibold">
              {overallStatus === "operational"
                ? "All Systems Operational"
                : overallStatus === "degraded"
                ? "Partial Service Disruption"
                : "Major Outage"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Last updated: {formatDateTime(new Date())}
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {services.map((service) => (
            <div key={service.name} className="flex items-center gap-4">
              {getServiceStatusIcon(service.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{service.name}</span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {service.uptime.toFixed(2)}% uptime
                  </span>
                </div>
                {service.lastIncident && (
                  <span className="text-xs text-muted-foreground">
                    Last incident: {service.lastIncident}
                  </span>
                )}
              </div>
              {/* 90-day uptime bar */}
              <div className="flex gap-0.5">
                {Array.from({ length: 30 }).map((_, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger>
                      <div
                        className={cn(
                          "h-6 w-1 rounded-sm",
                          i === 29 && service.status === "degraded"
                            ? "bg-amber-500"
                            : i === 29 && service.status === "outage"
                            ? "bg-red-500"
                            : "bg-emerald-500"
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      Day {30 - i}: 100% uptime
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function AnnouncementsTab() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState("all")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create Announcement</CardTitle>
          <CardDescription>
            Send an announcement to users. This will appear in their notification center.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Announcement title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your announcement..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label>Audience</Label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="pro">Pro Users Only</SelectItem>
                <SelectItem value="enterprise">Enterprise Users Only</SelectItem>
                <SelectItem value="free">Free Users Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Preview</Button>
            <Button disabled={!title || !message}>
              <Megaphone className="mr-2 h-4 w-4" />
              Publish Announcement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AuditLogTab() {
  const [logs] = useState(mockAuditLogs)

  return (
    <div className="space-y-4">
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {formatDateTime(log.timestamp)}
                  </TableCell>
                  <TableCell className="text-sm">{log.actor}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.target}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Admin Panel</h1>
        <Badge variant="secondary" className="text-xs">Owner Only</Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="flags" className="gap-2">
            <Flag className="h-4 w-4" />
            <span className="hidden sm:inline">Feature Flags</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">System Health</span>
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-2">
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">Announcements</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Audit Log</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>
                Platform-wide usage statistics and metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold font-mono">1,247</div>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold font-mono">847</div>
                    <p className="text-xs text-muted-foreground">Active This Week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold font-mono">12,456</div>
                    <p className="text-xs text-muted-foreground">Jobs Discovered</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold font-mono">3,891</div>
                    <p className="text-xs text-muted-foreground">Applications Sent</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flags">
          <FeatureFlagsTab />
        </TabsContent>

        <TabsContent value="health">
          <SystemHealthTab />
        </TabsContent>

        <TabsContent value="announcements">
          <AnnouncementsTab />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
