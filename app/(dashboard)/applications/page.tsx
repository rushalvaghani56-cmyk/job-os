"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import {
  KanbanIcon,
  Table2Icon,
  CalendarIcon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
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
import { KanbanView } from "@/components/applications/kanban-view"
import { TableView } from "@/components/applications/table-view"
import { CalendarView } from "@/components/applications/calendar-view"
import { mockApplications, mockCalendarEvents } from "@/components/applications/mock-data"
import {
  APPLICATION_COLUMNS,
  getStatusLabel,
  type Application,
  type ApplicationStatus,
  type ViewMode,
} from "@/components/applications/types"

export default function ApplicationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban")
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newApplication, setNewApplication] = useState({
    company: "",
    jobTitle: "",
    status: "pending" as ApplicationStatus,
    url: "",
  })

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handle status change with undo
  const handleStatusChange = useCallback(
    (applicationId: string, newStatus: ApplicationStatus) => {
      const app = applications.find((a) => a.id === applicationId)
      if (!app || app.status === newStatus) return

      const previousStatus = app.status

      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId
            ? { ...a, status: newStatus, daysInStage: 0, lastActivityAt: new Date() }
            : a
        )
      )

      // Show undo toast
      toast.success(
        `Moved "${app.jobTitle}" to ${getStatusLabel(newStatus)}`,
        {
          duration: 30000,
          action: {
            label: "Undo",
            onClick: () => {
              setApplications((prev) =>
                prev.map((a) =>
                  a.id === applicationId
                    ? { ...a, status: previousStatus, lastActivityAt: new Date() }
                    : a
                )
              )
              toast.info("Status change undone")
            },
          },
        }
      )
    },
    [applications]
  )

  // Handle add application
  const handleAddApplication = () => {
    if (!newApplication.company || !newApplication.jobTitle) {
      toast.error("Please fill in company and job title")
      return
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      jobId: `job-${Date.now()}`,
      jobTitle: newApplication.jobTitle,
      company: {
        name: newApplication.company,
        logo: newApplication.company.substring(0, 2),
      },
      score: 0,
      status: newApplication.status,
      lastActivityAt: new Date(),
      daysInStage: 0,
      source: "Manual",
    }

    setApplications((prev) => [newApp, ...prev])
    setAddDialogOpen(false)
    setNewApplication({
      company: "",
      jobTitle: "",
      status: "pending",
      url: "",
    })

    toast.success(`Added "${newApp.jobTitle}" at ${newApp.company.name}`)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background px-4 py-3 sm:gap-3">
        {/* View Toggle */}
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) => value && setViewMode(value as ViewMode)}
          className="shrink-0"
        >
          <ToggleGroupItem
            value="kanban"
            aria-label="Kanban view"
            className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <KanbanIcon className="size-4" />
            <span className="hidden sm:inline">Kanban</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="table"
            aria-label="Table view"
            className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Table2Icon className="size-4" />
            <span className="hidden sm:inline">Table</span>
          </ToggleGroupItem>
          <ToggleGroupItem
            value="calendar"
            aria-label="Calendar view"
            className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <CalendarIcon className="size-4" />
            <span className="hidden sm:inline">Calendar</span>
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Search */}
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as ApplicationStatus | "all")}
        >
          <SelectTrigger className="w-auto min-w-[120px] sm:w-[160px]">
            <FilterIcon className="mr-2 size-4 text-muted-foreground" />
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {APPLICATION_COLUMNS.map((col) => (
              <SelectItem key={col.id} value={col.id}>
                <div className="flex items-center gap-2">
                  <div className={`size-2 rounded-full ${col.color}`} />
                  {col.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Add Application Button */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <PlusIcon className="size-4" />
              <span className="hidden sm:inline">Add Application</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Application</DialogTitle>
              <DialogDescription>
                Manually track a job application you submitted outside of this system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="e.g., Stripe"
                  value={newApplication.company}
                  onChange={(e) =>
                    setNewApplication((prev) => ({ ...prev, company: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Senior Frontend Engineer"
                  value={newApplication.jobTitle}
                  onChange={(e) =>
                    setNewApplication((prev) => ({ ...prev, jobTitle: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newApplication.status}
                  onValueChange={(v) =>
                    setNewApplication((prev) => ({
                      ...prev,
                      status: v as ApplicationStatus,
                    }))
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_COLUMNS.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        <div className="flex items-center gap-2">
                          <div className={`size-2 rounded-full ${col.color}`} />
                          {col.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">Job URL (optional)</Label>
                <Input
                  id="url"
                  placeholder="https://..."
                  value={newApplication.url}
                  onChange={(e) =>
                    setNewApplication((prev) => ({ ...prev, url: e.target.value }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddApplication}>Add Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 border-b border-border bg-muted/30 px-4 py-2">
        <span className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {filteredApplications.length}
          </span>{" "}
          applications
        </span>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            Active:{" "}
            <span className="font-mono text-foreground">
              {
                filteredApplications.filter(
                  (a) =>
                    !["rejected", "withdrawn", "ghosted"].includes(a.status)
                ).length
              }
            </span>
          </span>
          <span>
            Interviews:{" "}
            <span className="font-mono text-foreground">
              {filteredApplications.filter((a) => a.status === "interview").length}
            </span>
          </span>
          <span>
            Offers:{" "}
            <span className="font-mono text-foreground">
              {filteredApplications.filter((a) => a.status === "offer").length}
            </span>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        {viewMode === "kanban" && (
          <KanbanView
            applications={filteredApplications}
            onStatusChange={handleStatusChange}
          />
        )}
        {viewMode === "table" && (
          <TableView
            applications={filteredApplications}
            onStatusChange={handleStatusChange}
          />
        )}
        {viewMode === "calendar" && (
          <CalendarView events={mockCalendarEvents} />
        )}
      </div>
    </div>
  )
}
