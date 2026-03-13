"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  ArrowUpDownIcon,
  DownloadIcon,
  MoreHorizontalIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  APPLICATION_COLUMNS,
  getStatusLabel,
  getStatusColor,
  type Application,
  type ApplicationStatus,
} from "./types"

interface TableViewProps {
  applications: Application[]
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void
}

type SortKey = "company" | "title" | "score" | "status" | "submitted" | "daysInStage"
type SortDirection = "asc" | "desc"

export function TableView({ applications, onStatusChange }: TableViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("score")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("desc")
    }
  }

  const sortedApplications = [...applications].sort((a, b) => {
    let comparison = 0

    switch (sortKey) {
      case "company":
        comparison = a.company.name.localeCompare(b.company.name)
        break
      case "title":
        comparison = a.jobTitle.localeCompare(b.jobTitle)
        break
      case "score":
        comparison = a.score - b.score
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
      case "submitted":
        const aDate = a.submittedAt?.getTime() ?? 0
        const bDate = b.submittedAt?.getTime() ?? 0
        comparison = aDate - bDate
        break
      case "daysInStage":
        comparison = a.daysInStage - b.daysInStage
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  const handleExportCSV = () => {
    const headers = [
      "Company",
      "Title",
      "Score",
      "Status",
      "Submitted",
      "Days in Stage",
      "Interview Date",
      "Last Activity",
    ]

    const rows = applications.map((app) => [
      app.company.name,
      app.jobTitle,
      app.score.toString(),
      getStatusLabel(app.status),
      app.submittedAt ? format(app.submittedAt, "yyyy-MM-dd") : "",
      app.daysInStage.toString(),
      app.interviewDate ? format(app.interviewDate, "yyyy-MM-dd") : "",
      format(app.lastActivityAt, "yyyy-MM-dd"),
    ])

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `applications-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const SortableHeader = ({
    children,
    sortKeyName,
    className,
  }: {
    children: React.ReactNode
    sortKeyName: SortKey
    className?: string
  }) => (
    <TableHead className={className}>
      <button
        onClick={() => handleSort(sortKeyName)}
        className="flex items-center gap-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
      >
        {children}
        <ArrowUpDownIcon
          className={cn(
            "size-3",
            sortKey === sortKeyName ? "text-foreground" : "text-muted-foreground"
          )}
        />
      </button>
    </TableHead>
  )

  return (
    <div className="flex h-full flex-col">
      {/* Export Button */}
      <div className="flex justify-end border-b border-border px-4 py-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="gap-1.5 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <DownloadIcon className="size-4" />
          Export CSV
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader sortKeyName="company">Company</SortableHeader>
              <SortableHeader sortKeyName="title">Title</SortableHeader>
              <SortableHeader sortKeyName="score" className="w-[80px]">
                Score
              </SortableHeader>
              <SortableHeader sortKeyName="status" className="w-[140px]">
                Status
              </SortableHeader>
              <SortableHeader sortKeyName="submitted" className="w-[120px]">
                Submitted
              </SortableHeader>
              <SortableHeader sortKeyName="daysInStage" className="w-[100px]">
                Days
              </SortableHeader>
              <TableHead className="w-[120px]">Interview</TableHead>
              <TableHead className="w-[120px]">Last Activity</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedApplications.map((app, index) => (
              <TableRow
                key={app.id}
                className={cn(index % 2 === 0 ? "bg-transparent" : "bg-muted/30")}
              >
                {/* Company */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded bg-secondary text-xs font-medium text-secondary-foreground">
                      {app.company.logo}
                    </div>
                    <span className="text-sm">{app.company.name}</span>
                  </div>
                </TableCell>

                {/* Title */}
                <TableCell>
                  <Link
                    href={`/jobs/${app.jobId}`}
                    className="text-sm font-medium text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded"
                  >
                    {app.jobTitle}
                  </Link>
                </TableCell>

                {/* Score */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-mono text-xs",
                      app.score >= 90
                        ? "border-success bg-success/10 text-success"
                        : app.score >= 80
                          ? "border-primary bg-primary/10 text-primary"
                          : ""
                    )}
                  >
                    {app.score}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Select
                    value={app.status}
                    onValueChange={(value) =>
                      onStatusChange(app.id, value as ApplicationStatus)
                    }
                  >
                    <SelectTrigger className="h-8 w-[130px] text-xs focus:ring-2 focus:ring-primary">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "size-2 rounded-full",
                            getStatusColor(app.status)
                          )}
                        />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {APPLICATION_COLUMNS.map((col) => (
                        <SelectItem key={col.id} value={col.id}>
                          <div className="flex items-center gap-2">
                            <div className={cn("size-2 rounded-full", col.color)} />
                            {col.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* Submitted */}
                <TableCell className="text-xs text-muted-foreground">
                  {app.submittedAt ? format(app.submittedAt, "MMM d") : "-"}
                </TableCell>

                {/* Days in Stage */}
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {app.daysInStage}d
                </TableCell>

                {/* Interview Date */}
                <TableCell className="text-xs text-muted-foreground">
                  {app.interviewDate ? format(app.interviewDate, "MMM d") : "-"}
                </TableCell>

                {/* Last Activity */}
                <TableCell className="text-xs text-muted-foreground">
                  {format(app.lastActivityAt, "MMM d")}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <MoreHorizontalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/jobs/${app.jobId}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Add Note</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Follow-up</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  )
}
