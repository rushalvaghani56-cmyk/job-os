"use client"

import { useState, useMemo } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { CalendarEvent } from "./types"

interface CalendarViewProps {
  events: CalendarEvent[]
}

const eventTypeConfig = {
  submitted: { label: "Submitted", color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-300" },
  interview: { label: "Interview", color: "bg-emerald-500", textColor: "text-emerald-700 dark:text-emerald-300" },
  follow_up: { label: "Follow-up", color: "bg-amber-500", textColor: "text-amber-700 dark:text-amber-300" },
  deadline: { label: "Deadline", color: "bg-red-500", textColor: "text-red-700 dark:text-red-300" },
}

export function CalendarView({ events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week">("month")

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = useMemo(
    () => eachDayOfInterval({ start: calendarStart, end: calendarEnd }),
    [calendarStart, calendarEnd]
  )

  const getEventsForDay = (date: Date) =>
    events.filter((event) => isSameDay(event.date, date))

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const handleToday = () => setCurrentMonth(new Date())

  return (
    <div className="flex h-full flex-col">
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handlePrevMonth}
            className="focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleNextMonth}
            className="focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
          <h2 className="text-lg font-semibold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="focus-visible:ring-2 focus-visible:ring-primary"
          >
            Today
          </Button>
          <div className="flex rounded-lg border border-border">
            <Button
              variant={viewMode === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className="rounded-r-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Month
            </Button>
            <Button
              variant={viewMode === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className="rounded-l-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Week
            </Button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 border-b border-border px-4 py-2">
        {Object.entries(eventTypeConfig).map(([type, config]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={cn("size-2.5 rounded-full", config.color)} />
            <span className="text-xs text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Day Headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayEvents = getEventsForDay(day)
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isCurrentDay = isToday(day)

              return (
                <CalendarDay
                  key={day.toISOString()}
                  day={day}
                  events={dayEvents}
                  isCurrentMonth={isCurrentMonth}
                  isCurrentDay={isCurrentDay}
                />
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

interface CalendarDayProps {
  day: Date
  events: CalendarEvent[]
  isCurrentMonth: boolean
  isCurrentDay: boolean
}

function CalendarDay({
  day,
  events,
  isCurrentMonth,
  isCurrentDay,
}: CalendarDayProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex min-h-[100px] flex-col rounded-lg border border-border p-2 text-left transition-colors",
            "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            !isCurrentMonth && "bg-muted/20 opacity-50",
            isCurrentDay && "ring-2 ring-primary"
          )}
        >
          {/* Day Number */}
          <span
            className={cn(
              "mb-1 text-sm",
              isCurrentDay
                ? "font-semibold text-primary"
                : isCurrentMonth
                  ? "text-foreground"
                  : "text-muted-foreground"
            )}
          >
            {format(day, "d")}
          </span>

          {/* Events */}
          <div className="flex flex-col gap-0.5">
            {events.slice(0, 3).map((event) => {
              const config = eventTypeConfig[event.type]
              return (
                <div
                  key={event.id}
                  className={cn(
                    "truncate rounded px-1.5 py-0.5 text-[10px] font-medium",
                    event.type === "submitted" && "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                    event.type === "interview" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                    event.type === "follow_up" && "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                    event.type === "deadline" && "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                  )}
                >
                  {event.company}
                </div>
              )
            })}
            {events.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{events.length - 3} more
              </span>
            )}
          </div>
        </button>
      </PopoverTrigger>
      {events.length > 0 && (
        <PopoverContent className="w-80" align="start">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">
              {format(day, "EEEE, MMMM d")}
            </h4>
            <div className="space-y-2">
              {events.map((event) => {
                const config = eventTypeConfig[event.type]
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-2 rounded-lg bg-muted/50 p-2"
                  >
                    <div className={cn("mt-1 size-2 shrink-0 rounded-full", config.color)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.company}
                      </p>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
}
