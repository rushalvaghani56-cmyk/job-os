"use client"

import { useState } from "react"
import { 
  Search, 
  Sparkles, 
  FileText, 
  Eye, 
  CheckCircle2, 
  Send, 
  Mail, 
  MessageSquare, 
  Reply, 
  RefreshCw,
  CalendarDays,
  Trophy,
  StickyNote,
  Plus,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { TimelineEvent, TimelineEventType, TimelineActor } from "../types"

interface TabTimelineProps {
  events: TimelineEvent[]
}

const eventIcons: Record<TimelineEventType, typeof Search> = {
  discovered: Search,
  scored: Sparkles,
  generated: FileText,
  reviewed: Eye,
  approved: CheckCircle2,
  submitted: Send,
  confirmation: Mail,
  follow_up: MessageSquare,
  reply: Reply,
  status_change: RefreshCw,
  interview: CalendarDays,
  outcome: Trophy,
  note: StickyNote,
}

const eventColors: Record<TimelineEventType, string> = {
  discovered: "bg-blue-500 text-blue-50",
  scored: "bg-purple-500 text-purple-50",
  generated: "bg-indigo-500 text-indigo-50",
  reviewed: "bg-cyan-500 text-cyan-50",
  approved: "bg-green-500 text-green-50",
  submitted: "bg-primary text-primary-foreground",
  confirmation: "bg-emerald-500 text-emerald-50",
  follow_up: "bg-amber-500 text-amber-50",
  reply: "bg-teal-500 text-teal-50",
  status_change: "bg-orange-500 text-orange-50",
  interview: "bg-pink-500 text-pink-50",
  outcome: "bg-yellow-500 text-yellow-900",
  note: "bg-slate-500 text-slate-50",
}

const actorStyles: Record<TimelineActor, string> = {
  system: "bg-muted text-muted-foreground",
  user: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ai: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
}

const actorLabels: Record<TimelineActor, string> = {
  system: "System",
  user: "You",
  ai: "AI",
}

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const Icon = eventIcons[event.type]

  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <div className="flex gap-4">
      {/* Timeline Line & Icon */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "size-8 rounded-full flex items-center justify-center flex-shrink-0",
          eventColors[event.type]
        )}>
          <Icon className="size-4" />
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-border my-2" />
        )}
      </div>

      {/* Content */}
      <div className={cn("flex-1 pb-6", isLast && "pb-0")}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">{event.title}</span>
              <Badge className={cn("text-xs", actorStyles[event.actor])}>
                {actorLabels[event.actor]}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatTime(event.timestamp)}
            </span>
          </div>
        </div>

        {event.detail && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="mt-2 h-auto p-0 text-xs text-muted-foreground hover:text-foreground">
                {isExpanded ? (
                  <>Hide details <ChevronUp className="size-3 ml-1" /></>
                ) : (
                  <>Show details <ChevronDown className="size-3 ml-1" /></>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="mt-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                {event.detail}
              </p>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  )
}

export function TabTimeline({ events }: TabTimelineProps) {
  // Sort events by timestamp descending (most recent first)
  const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Application Timeline</h2>
        <Button size="sm" variant="outline" className="rounded-lg">
          <Plus className="size-4 mr-1.5" />
          Add Note
        </Button>
      </div>

      {/* Timeline */}
      <div className="max-w-2xl">
        {sortedEvents.map((event, index) => (
          <TimelineItem 
            key={event.id} 
            event={event} 
            isLast={index === sortedEvents.length - 1}
          />
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-xl">
          <CalendarDays className="size-12 mx-auto mb-3 text-muted-foreground/50" />
          <h3 className="text-base font-medium mb-1">No activity yet</h3>
          <p className="text-sm text-muted-foreground">
            Events will appear here as you progress with this application
          </p>
        </div>
      )}
    </div>
  )
}
