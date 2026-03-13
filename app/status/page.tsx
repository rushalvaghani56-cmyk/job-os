"use client"

import { useState } from "react"
import { format, subDays } from "date-fns"
import { CheckCircle2Icon, AlertTriangleIcon, XCircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Types
type ServiceStatus = "operational" | "degraded" | "outage" | "unknown"
type IncidentSeverity = "minor" | "major" | "critical"

interface Service {
  id: string
  name: string
  description: string
  status: ServiceStatus
  uptime: number // percentage
  dailyStatuses: ServiceStatus[] // 90 days, newest first
}

interface Incident {
  id: string
  date: Date
  title: string
  severity: IncidentSeverity
  description: string
  resolution?: string
  affectedServices: string[]
  resolvedAt?: Date
}

// Generate 90 days of mostly operational status with some variety
function generateDailyStatuses(): ServiceStatus[] {
  const statuses: ServiceStatus[] = []
  for (let i = 0; i < 90; i++) {
    const rand = Math.random()
    if (rand < 0.95) {
      statuses.push("operational")
    } else if (rand < 0.98) {
      statuses.push("degraded")
    } else {
      statuses.push("outage")
    }
  }
  return statuses
}

// Mock services
const mockServices: Service[] = [
  {
    id: "api",
    name: "API Server",
    description: "Core API endpoints and authentication",
    status: "operational",
    uptime: 99.98,
    dailyStatuses: generateDailyStatuses(),
  },
  {
    id: "workers",
    name: "Celery Workers",
    description: "Background job processing",
    status: "operational",
    uptime: 99.95,
    dailyStatuses: generateDailyStatuses(),
  },
  {
    id: "database",
    name: "Database (PostgreSQL)",
    description: "Primary data storage",
    status: "operational",
    uptime: 99.99,
    dailyStatuses: generateDailyStatuses(),
  },
  {
    id: "storage",
    name: "R2 Storage",
    description: "File and document storage",
    status: "operational",
    uptime: 99.97,
    dailyStatuses: generateDailyStatuses(),
  },
  {
    id: "gmail",
    name: "Gmail Integration",
    description: "Email sync and sending",
    status: "degraded",
    uptime: 99.85,
    dailyStatuses: (() => {
      const statuses = generateDailyStatuses()
      statuses[0] = "degraded"
      return statuses
    })(),
  },
  {
    id: "realtime",
    name: "Supabase Realtime",
    description: "Live updates and notifications",
    status: "operational",
    uptime: 99.92,
    dailyStatuses: generateDailyStatuses(),
  },
]

// Mock incidents
const mockIncidents: Incident[] = [
  {
    id: "inc_001",
    date: new Date("2026-03-14T08:30:00"),
    title: "Gmail API Rate Limiting",
    severity: "minor",
    description:
      "Some users may experience delays in email synchronization due to rate limiting from Gmail API.",
    affectedServices: ["gmail"],
  },
  {
    id: "inc_002",
    date: new Date("2026-03-10T14:15:00"),
    title: "Database Connection Pool Exhaustion",
    severity: "major",
    description:
      "High traffic caused connection pool exhaustion resulting in slow API responses for approximately 15 minutes.",
    resolution:
      "Increased connection pool size and implemented connection queuing. All systems now operating normally.",
    affectedServices: ["database", "api"],
    resolvedAt: new Date("2026-03-10T14:32:00"),
  },
  {
    id: "inc_003",
    date: new Date("2026-02-28T03:00:00"),
    title: "Scheduled Maintenance",
    severity: "minor",
    description:
      "Planned database maintenance window for performance optimizations and security updates.",
    resolution: "Maintenance completed successfully. No data loss or service impact beyond the planned window.",
    affectedServices: ["database"],
    resolvedAt: new Date("2026-02-28T04:30:00"),
  },
  {
    id: "inc_004",
    date: new Date("2026-02-15T11:45:00"),
    title: "R2 Storage Connectivity Issues",
    severity: "critical",
    description:
      "Complete outage of file storage service affecting document uploads and resume generation.",
    resolution:
      "Root cause identified as a configuration error during deployment. Rolled back changes and restored service.",
    affectedServices: ["storage"],
    resolvedAt: new Date("2026-02-15T12:20:00"),
  },
]

function getStatusColor(status: ServiceStatus) {
  switch (status) {
    case "operational":
      return "bg-success"
    case "degraded":
      return "bg-warning"
    case "outage":
      return "bg-destructive"
    case "unknown":
      return "bg-muted"
  }
}

function getStatusText(status: ServiceStatus) {
  switch (status) {
    case "operational":
      return "Operational"
    case "degraded":
      return "Degraded"
    case "outage":
      return "Outage"
    case "unknown":
      return "Unknown"
  }
}

function getSeverityStyles(severity: IncidentSeverity) {
  switch (severity) {
    case "minor":
      return "bg-warning/10 text-warning border-warning/20"
    case "major":
      return "bg-chart-5/10 text-chart-5 border-chart-5/20"
    case "critical":
      return "bg-destructive/10 text-destructive border-destructive/20"
  }
}

function StatusDot({
  status,
  animate = false,
}: {
  status: ServiceStatus
  animate?: boolean
}) {
  return (
    <span className="relative flex size-3">
      {animate && status === "operational" && (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            getStatusColor(status)
          )}
        />
      )}
      <span
        className={cn("relative inline-flex size-3 rounded-full", getStatusColor(status))}
      />
    </span>
  )
}

function UptimeBar({
  dailyStatuses,
  serviceName,
}: {
  dailyStatuses: ServiceStatus[]
  serviceName: string
}) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  return (
    <div className="relative">
      <div className="flex gap-[2px]">
        {dailyStatuses.map((status, index) => {
          const date = subDays(new Date(), index)
          return (
            <div
              key={index}
              className={cn(
                "h-6 w-1 rounded-sm transition-opacity cursor-pointer",
                getStatusColor(status),
                hoveredDay === index && "ring-2 ring-foreground ring-offset-1 ring-offset-background"
              )}
              onMouseEnter={() => setHoveredDay(index)}
              onMouseLeave={() => setHoveredDay(null)}
            />
          )
        })}
      </div>
      {hoveredDay !== null && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
          <div className="font-medium text-foreground">
            {format(subDays(new Date(), hoveredDay), "MMM dd, yyyy")}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StatusDot status={dailyStatuses[hoveredDay]} />
            <span className="text-muted-foreground">
              {getStatusText(dailyStatuses[hoveredDay])}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function ServiceRow({ service }: { service: Service }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <StatusDot status={service.status} animate />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{service.name}</span>
            <span className="text-sm text-muted-foreground">
              {getStatusText(service.status)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{service.description}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">90-day uptime</span>
          <span className="font-mono text-sm text-foreground">
            {service.uptime.toFixed(2)}%
          </span>
        </div>
        <UptimeBar dailyStatuses={service.dailyStatuses} serviceName={service.name} />
      </div>
    </div>
  )
}

function IncidentCard({ incident }: { incident: Incident }) {
  const isResolved = !!incident.resolvedAt

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {isResolved ? (
            <CheckCircle2Icon className="size-5 text-success shrink-0" />
          ) : incident.severity === "critical" ? (
            <XCircleIcon className="size-5 text-destructive shrink-0" />
          ) : (
            <AlertTriangleIcon className="size-5 text-warning shrink-0" />
          )}
          <div>
            <h3 className="font-medium text-foreground">{incident.title}</h3>
            <span className="text-xs text-muted-foreground">
              {format(incident.date, "MMM dd, yyyy 'at' HH:mm")}
            </span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={cn("capitalize", getSeverityStyles(incident.severity))}
        >
          {incident.severity}
        </Badge>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{incident.description}</p>
      {incident.resolution && (
        <div className="mt-3 rounded-lg bg-surface p-3">
          <span className="text-xs font-medium text-success">Resolved</span>
          <p className="mt-1 text-sm text-foreground">{incident.resolution}</p>
          {incident.resolvedAt && (
            <span className="mt-2 block text-xs text-muted-foreground">
              Resolved at {format(incident.resolvedAt, "HH:mm")} (
              {Math.round(
                (incident.resolvedAt.getTime() - incident.date.getTime()) / 60000
              )}{" "}
              minutes)
            </span>
          )}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {incident.affectedServices.map((serviceId) => {
          const service = mockServices.find((s) => s.id === serviceId)
          return (
            <Badge key={serviceId} variant="secondary" className="text-xs">
              {service?.name || serviceId}
            </Badge>
          )
        })}
      </div>
    </div>
  )
}

export default function StatusPage() {
  const hasIssues = mockServices.some((s) => s.status !== "operational")
  const overallStatus = hasIssues ? "degraded" : "operational"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
              J
            </div>
            <span className="text-lg font-semibold text-foreground">
              Job OS Status
            </span>
          </div>
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            Back to App
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {/* Overall Status */}
        <div
          className={cn(
            "rounded-xl p-6 mb-8",
            overallStatus === "operational"
              ? "bg-success/10 border border-success/20"
              : "bg-warning/10 border border-warning/20"
          )}
        >
          <div className="flex items-center gap-4">
            {overallStatus === "operational" ? (
              <CheckCircle2Icon className="size-8 text-success" />
            ) : (
              <AlertTriangleIcon className="size-8 text-warning" />
            )}
            <div>
              <h1 className="text-xl font-semibold text-foreground md:text-2xl">
                {overallStatus === "operational"
                  ? "All Systems Operational"
                  : "Partial Service Disruption"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {overallStatus === "operational"
                  ? "All services are running smoothly."
                  : "Some services are experiencing issues. See details below."}
              </p>
            </div>
          </div>
        </div>

        {/* Services */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Services
          </h2>
          <div className="flex flex-col gap-4">
            {mockServices.map((service) => (
              <ServiceRow key={service.id} service={service} />
            ))}
          </div>
        </section>

        {/* Legend */}
        <div className="mb-8 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-success" />
            <span>Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-warning" />
            <span>Degraded</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-destructive" />
            <span>Outage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-muted" />
            <span>No Data</span>
          </div>
        </div>

        {/* Incident History */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Incident History
          </h2>
          <div className="flex flex-col gap-4">
            {mockIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Last updated:{" "}
            <span className="font-mono">{format(new Date(), "MMM dd, yyyy HH:mm:ss")}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            For urgent issues, contact{" "}
            <a
              href="mailto:support@jobos.app"
              className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              support@jobos.app
            </a>
          </p>
        </footer>
      </main>
    </div>
  )
}
