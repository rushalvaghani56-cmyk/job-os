"use client";

import {
  Clock,
  CheckCircle2,
  Mail,
  FileText,
  Eye,
  Sparkles,
  Send,
  Calendar,
  MessageSquare,
  AlertCircle,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { MockJob } from "@/lib/mock-data/jobs";

interface TimelineTabProps {
  job: MockJob;
}

type TimelineEventType = 
  | "discovered" 
  | "scored" 
  | "content_generated" 
  | "viewed" 
  | "applied" 
  | "email_sent" 
  | "response" 
  | "interview_scheduled" 
  | "note";

interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  timestamp: Date;
  metadata?: Record<string, string>;
}

// Generate mock timeline events
function generateTimelineEvents(job: MockJob): TimelineEvent[] {
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;

  const events: TimelineEvent[] = [
    {
      id: "1",
      type: "discovered",
      title: "Job Discovered",
      description: `Found via ${job.source.replace(/_/g, " ")}`,
      timestamp: new Date(now.getTime() - job.days_since_posted * dayMs),
    },
    {
      id: "2",
      type: "scored",
      title: "AI Scored",
      description: `Match score: ${job.match_score}%`,
      timestamp: new Date(now.getTime() - (job.days_since_posted - 0.5) * dayMs),
      metadata: {
        score: `${job.match_score}`,
        decision: job.ai_decision || "consider",
      },
    },
  ];

  if (job.status !== "new" && job.status !== "scored") {
    events.push({
      id: "3",
      type: "content_generated",
      title: "Content Generated",
      description: "Cover letter and resume tailored",
      timestamp: new Date(now.getTime() - (job.days_since_posted - 1) * dayMs),
    });
  }

  if (["applied", "interview", "offer", "rejected", "ghosted"].includes(job.status)) {
    events.push(
      {
        id: "4",
        type: "viewed",
        title: "Reviewed Details",
        description: "Spent 5 minutes reviewing job details",
        timestamp: new Date(now.getTime() - (job.days_since_posted - 1.5) * dayMs),
      },
      {
        id: "5",
        type: "applied",
        title: "Application Submitted",
        description: "Applied through company website",
        timestamp: new Date(now.getTime() - (job.days_since_posted - 2) * dayMs),
      }
    );
  }

  if (["interview", "offer", "rejected"].includes(job.status)) {
    events.push({
      id: "6",
      type: "response",
      title: "Recruiter Responded",
      description: "Received email from hiring team",
      timestamp: new Date(now.getTime() - (job.days_since_posted - 5) * dayMs),
    });
  }

  if (["interview", "offer"].includes(job.status)) {
    events.push({
      id: "7",
      type: "interview_scheduled",
      title: "Interview Scheduled",
      description: "Technical interview with engineering team",
      timestamp: new Date(now.getTime() - (job.days_since_posted - 7) * dayMs),
      metadata: {
        date: new Date(now.getTime() + 2 * dayMs).toLocaleDateString(),
        time: "2:00 PM PST",
      },
    });
  }

  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

const eventIcons: Record<TimelineEventType, React.ReactNode> = {
  discovered: <Eye className="h-4 w-4" />,
  scored: <Sparkles className="h-4 w-4" />,
  content_generated: <FileText className="h-4 w-4" />,
  viewed: <Eye className="h-4 w-4" />,
  applied: <Send className="h-4 w-4" />,
  email_sent: <Mail className="h-4 w-4" />,
  response: <MessageSquare className="h-4 w-4" />,
  interview_scheduled: <Calendar className="h-4 w-4" />,
  note: <FileText className="h-4 w-4" />,
};

const eventColors: Record<TimelineEventType, string> = {
  discovered: "bg-blue-500/20 text-blue-600",
  scored: "bg-violet-500/20 text-violet-600",
  content_generated: "bg-green-500/20 text-green-600",
  viewed: "bg-slate-500/20 text-slate-600",
  applied: "bg-emerald-500/20 text-emerald-600",
  email_sent: "bg-amber-500/20 text-amber-600",
  response: "bg-cyan-500/20 text-cyan-600",
  interview_scheduled: "bg-pink-500/20 text-pink-600",
  note: "bg-slate-500/20 text-slate-600",
};

function formatTimestamp(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function TimelineTab({ job }: TimelineTabProps) {
  const events = generateTimelineEvents(job);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{job.days_since_posted}</p>
              <p className="text-xs text-muted-foreground">Days in Pipeline</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{events.length}</p>
              <p className="text-xs text-muted-foreground">Total Activities</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {events.filter((e) => e.type === "response").length}
              </p>
              <p className="text-xs text-muted-foreground">Responses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <Badge
                variant="outline"
                className={cn(
                  job.status === "interview" || job.status === "offer"
                    ? "border-green-500 bg-green-500/10 text-green-600"
                    : job.status === "rejected"
                      ? "border-red-500 bg-red-500/10 text-red-600"
                      : ""
                )}
              >
                {job.status.replace(/_/g, " ")}
              </Badge>
              <p className="mt-1 text-xs text-muted-foreground">Current Status</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Note */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Add a note about this job..."
            className="min-h-[80px]"
          />
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-blue-500" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {events.map((event, idx) => (
              <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                {/* Timeline line */}
                {idx < events.length - 1 && (
                  <div className="absolute left-[17px] top-10 h-[calc(100%-28px)] w-px bg-border" />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                    eventColors[event.type]
                  )}
                >
                  {eventIcons[event.type]}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(event.timestamp)}
                    </span>
                  </div>

                  {/* Metadata */}
                  {event.metadata && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {key}: {value}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                No activity recorded yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
