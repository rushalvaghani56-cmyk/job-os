"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { reports } from "./mock-data"
import { 
  Plus, 
  FileText, 
  Calendar, 
  Mail, 
  Download, 
  MoreVertical,
  Play,
  Trash2,
  Edit,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-1 h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-5">
            <Skeleton className="mb-4 h-10 w-10 rounded-lg" />
            <Skeleton className="mb-2 h-5 w-32" />
            <Skeleton className="mb-4 h-4 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}

const typeConfig = {
  weekly: {
    label: "Weekly",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  monthly: {
    label: "Monthly",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  custom: {
    label: "Custom",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
}

export function TabReports() {
  const { toast } = useToast()
  const [createReportOpen, setCreateReportOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 550)
    return () => clearTimeout(timer)
  }, [])

  const handleExport = (format: string) => {
    toast({
      title: `Exporting as ${format}`,
      description: `Your ${format} report is being generated and will download shortly.`,
    })
  }

  if (isLoading) {
    return <ReportsSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Weekly Report Summary Card */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h3 className="mb-1 text-base font-semibold">Week of March 7-13, 2026</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <p className="text-2xl font-bold text-foreground">23</p>
                <p className="text-xs text-muted-foreground">Applied</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Interviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">67%</p>
                <p className="text-xs text-muted-foreground">ATS Pass Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">$4.20</p>
                <p className="text-xs text-muted-foreground">AI Cost</p>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              <p className="text-sm">
                <span className="font-medium text-primary">Highlight:</span>{" "}
                Best match: Stripe Platform Engineer (91)
              </p>
              <p className="text-sm">
                <span className="font-medium text-primary">Upcoming:</span>{" "}
                Interview at Meta on March 15
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => handleExport("PDF")}
          >
            <Download className="h-4 w-4" />
            Export as PDF
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Reports</h3>
          <p className="text-xs text-muted-foreground">
            Schedule and export analytics reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-lg gap-1 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Download className="h-4 w-4" />
            Export All
          </Button>
          <Dialog open={createReportOpen} onOpenChange={setCreateReportOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="rounded-lg gap-1 focus-visible:ring-2 focus-visible:ring-primary">
                <Plus className="h-4 w-4" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Set up an automated report to track your job search progress
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input 
                    id="report-name" 
                    placeholder="e.g. Weekly Summary" 
                    className="focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select>
                    <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                      <SelectItem value="monthly">Monthly Performance</SelectItem>
                      <SelectItem value="custom">Custom Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Select>
                    <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly (Monday)</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly (1st)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="recipients">Recipients</Label>
                  <Input 
                    id="recipients" 
                    placeholder="email@example.com" 
                    className="focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple emails with commas
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateReportOpen(false)} className="rounded-lg">
                  Cancel
                </Button>
                <Button onClick={() => setCreateReportOpen(false)} className="rounded-lg">
                  Create Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid gap-4">
        {reports.map((report) => (
          <div key={report.id} className="rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{report.name}</h4>
                    <Badge variant="secondary" className={typeConfig[report.type].color}>
                      {typeConfig[report.type].label}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.schedule}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {report.recipients.length} recipient{report.recipients.length !== 1 && "s"}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-primary">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Play className="h-4 w-4" />
                    Run Now
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Last
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <span className="text-xs text-muted-foreground">Last generated</span>
              <span className="text-xs font-mono">{report.lastGenerated}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Export */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold">Quick Export</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Export your analytics data in various formats
        </p>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-lg gap-1 focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => handleExport("CSV")}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-lg gap-1 focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => handleExport("PDF")}
          >
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-lg gap-1 focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => handleExport("JSON")}
          >
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
        </div>
      </div>
    </div>
  )
}
