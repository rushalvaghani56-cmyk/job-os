"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  APPLICATION_COLUMNS,
  type Application,
  type ApplicationStatus,
} from "./types"

interface KanbanViewProps {
  applications: Application[]
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void
}

export function KanbanView({ applications, onStatusChange }: KanbanViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const applicationId = active.id as string
    const overId = over.id as string

    // Check if dropped on a column
    const isColumn = APPLICATION_COLUMNS.some((col) => col.id === overId)
    if (isColumn) {
      onStatusChange(applicationId, overId as ApplicationStatus)
      return
    }

    // Check if dropped on another card - get that card's status
    const overApplication = applications.find((app) => app.id === overId)
    if (overApplication) {
      onStatusChange(applicationId, overApplication.status)
    }
  }

  const activeApplication = activeId
    ? applications.find((app) => app.id === activeId)
    : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="h-full w-full">
        <div className="flex gap-4 p-4 pb-6">
          {APPLICATION_COLUMNS.map((column) => {
            const columnApps = applications.filter(
              (app) => app.status === column.id
            )
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                applications={columnApps}
              />
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <DragOverlay>
        {activeApplication && (
          <ApplicationCard application={activeApplication} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  )
}

interface KanbanColumnProps {
  column: (typeof APPLICATION_COLUMNS)[number]
  applications: Application[]
}

function KanbanColumn({ column, applications }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useSortable({
    id: column.id,
    data: { type: "column" },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-[280px] shrink-0 flex-col rounded-xl bg-muted/30 transition-colors",
        isOver && "ring-2 ring-primary ring-dashed"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className={cn("size-2 rounded-full", column.color)} />
        <span className="text-sm font-medium text-foreground">
          {column.label}
        </span>
        <Badge variant="secondary" className="ml-auto font-mono text-xs">
          {applications.length}
        </Badge>
      </div>

      {/* Column Content */}
      <SortableContext
        items={applications.map((app) => app.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-1 flex-col gap-2 px-2 pb-2">
          {applications.length === 0 ? (
            <div className="flex min-h-[80px] items-center justify-center rounded-lg border border-dashed border-border">
              <span className="text-xs text-muted-foreground">
                No applications
              </span>
            </div>
          ) : (
            applications.map((app) => (
              <SortableApplicationCard key={app.id} application={app} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

interface SortableApplicationCardProps {
  application: Application
}

function SortableApplicationCard({ application }: SortableApplicationCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(isDragging && "opacity-50")}
    >
      <ApplicationCard application={application} />
    </div>
  )
}

interface ApplicationCardProps {
  application: Application
  isDragging?: boolean
}

function ApplicationCard({ application, isDragging }: ApplicationCardProps) {
  return (
    <Link
      href={`/jobs/${application.jobId}`}
      className={cn(
        "block rounded-lg bg-card p-3 shadow-sm ring-1 ring-border transition-all",
        "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isDragging && "rotate-2 shadow-lg"
      )}
    >
      {/* Company */}
      <div className="mb-1.5 flex items-center gap-2">
        <div className="flex size-5 items-center justify-center rounded bg-secondary text-[10px] font-medium text-secondary-foreground">
          {application.company.logo}
        </div>
        <span className="truncate text-xs text-muted-foreground">
          {application.company.name}
        </span>
      </div>

      {/* Title */}
      <p className="mb-2 truncate text-sm font-medium text-foreground">
        {application.jobTitle}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Score */}
        <Badge
          variant="outline"
          className={cn(
            "font-mono text-xs",
            application.score >= 90
              ? "border-success bg-success/10 text-success"
              : application.score >= 80
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted-foreground"
          )}
        >
          {application.score}
        </Badge>

        {/* Days in stage */}
        <span className="text-xs text-muted-foreground">
          {application.daysInStage === 0
            ? "Today"
            : `${application.daysInStage}d`}
        </span>

        {/* Interview probability */}
        {application.interviewProbability && (
          <Badge variant="secondary" className="text-[10px]">
            {application.interviewProbability}% int
          </Badge>
        )}
      </div>
    </Link>
  )
}
