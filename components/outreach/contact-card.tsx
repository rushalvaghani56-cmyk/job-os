"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Snowflake,
  Flame,
  Zap,
  Linkedin,
  Mail,
  MessageSquare,
} from "lucide-react"
import type { Contact, Channel, WarmthLevel, ContactStatus } from "@/lib/outreach-types"

interface ContactCardProps {
  contact: Contact
  isSelected: boolean
  onClick: () => void
}

const warmthConfig: Record<WarmthLevel, { icon: React.ElementType; color: string; bg: string }> = {
  cold: { icon: Snowflake, color: "text-blue-500", bg: "bg-blue-500/10" },
  warm: { icon: Flame, color: "text-amber-500", bg: "bg-amber-500/10" },
  hot: { icon: Zap, color: "text-red-500", bg: "bg-red-500/10" },
}

const channelConfig: Record<Channel, { icon: React.ElementType; label: string }> = {
  "linkedin-dm": { icon: Linkedin, label: "DM" },
  inmail: { icon: MessageSquare, label: "InMail" },
  email: { icon: Mail, label: "Email" },
}

const statusConfig: Record<ContactStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  draft: { label: "Draft", variant: "secondary" },
  queued: { label: "Queued", variant: "outline" },
  sent: { label: "Sent", variant: "default" },
  opened: { label: "Opened", variant: "default" },
  replied: { label: "Replied", variant: "default" },
  "no-response": { label: "No Response", variant: "secondary" },
  "do-not-contact": { label: "Do Not Contact", variant: "destructive" },
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export function ContactCard({ contact, isSelected, onClick }: ContactCardProps) {
  const warmth = warmthConfig[contact.warmth]
  const WarmthIcon = warmth.icon
  const status = statusConfig[contact.status]

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 border-b border-border transition-colors",
        "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
        isSelected && "bg-primary/5 border-l-2 border-l-primary"
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src={contact.avatarUrl} alt={contact.name} />
          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
            {getInitials(contact.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground truncate">
              {contact.name}
            </span>
            <div className={cn("p-1 rounded-full", warmth.bg)}>
              <WarmthIcon className={cn("h-3 w-3", warmth.color)} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground truncate">
            {contact.title} at {contact.company}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              {contact.channels.map((channel) => {
                const config = channelConfig[channel]
                const Icon = config.icon
                return (
                  <div
                    key={channel}
                    className="p-1 rounded bg-muted"
                    title={config.label}
                  >
                    <Icon className="h-3 w-3 text-muted-foreground" />
                  </div>
                )
              })}
            </div>

            <Badge
              variant={status.variant}
              className={cn(
                "text-[10px] px-1.5 py-0",
                contact.status === "replied" && "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
                contact.status === "opened" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
              )}
            >
              {status.label}
            </Badge>
          </div>
        </div>

        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {formatRelativeTime(contact.lastActivityAt)}
        </span>
      </div>
    </button>
  )
}
