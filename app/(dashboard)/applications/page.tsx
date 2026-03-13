"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import {
  KanbanIcon,
  Table2Icon,
  CalendarIcon,
  SearchIcon,
  FilterIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [undoStack, setUndoStack] = useState<
    { applicationId: string; previousStatus: ApplicationStatus }[]
  >([])

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
      const toastId = toast.success(
        `Moved "${app.jobTitle}" to ${getStatusLabel(newStatus)}`,
        {
          duration: 5000,
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
