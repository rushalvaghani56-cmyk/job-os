"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Snowflake,
  Flame,
  Zap,
  Linkedin,
  Mail,
  MessageSquare,
  ExternalLink,
  Calendar,
  Clock,
  Sparkles,
  Send,
  Check,
  Eye,
  Reply,
  Plus,
} from "lucide-react"
import type { Contact, Message, Channel, WarmthLevel } from "@/lib/outreach-types"

interface ContactDetailProps {
  contact: Contact
  messages: Message[]
}

const warmthConfig: Record<WarmthLevel, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  cold: { icon: Snowflake, label: "Cold", color: "text-blue-500", bg: "bg-blue-500/10" },
  warm: { icon: Flame, label: "Warm", color: "text-amber-500", bg: "bg-amber-500/10" },
  hot: { icon: Zap, label: "Hot", color: "text-red-500", bg: "bg-red-500/10" },
}

const channelConfig: Record<Channel, { icon: React.ElementType; label: string; color: string }> = {
  "linkedin-dm": { icon: Linkedin, label: "LinkedIn DM", color: "text-blue-600" },
  inmail: { icon: MessageSquare, label: "InMail", color: "text-indigo-500" },
  email: { icon: Mail, label: "Email", color: "text-muted-foreground" },
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatFollowUpDate(date: Date): string {
  const now = new Date()
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays < 7) return `In ${diffDays} days`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function ContactDetail({ contact, messages }: ContactDetailProps) {
  const [newMessage, setNewMessage] = useState("")
  const warmth = warmthConfig[contact.warmth]
  const WarmthIcon = warmth.icon

  const contactMessages = messages.filter((m) => m.contactId === contact.id)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={contact.avatarUrl} alt={contact.name} />
            <AvatarFallback className="bg-muted text-muted-foreground text-lg">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">
                {contact.name}
              </h2>
              <Badge variant="outline" className={cn("gap-1", warmth.bg, warmth.color)}>
                <WarmthIcon className="h-3 w-3" />
                {warmth.label}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              {contact.title} at {contact.company}
            </p>

            <div className="flex items-center gap-3 mt-2">
              {contact.linkedinUrl && (
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <Linkedin className="h-3 w-3" />
                  LinkedIn
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <Mail className="h-3 w-3" />
                  {contact.email}
                </a>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              {contact.channels.map((channel) => {
                const config = channelConfig[channel]
                const Icon = config.icon
                return (
                  <Badge key={channel} variant="secondary" className="gap-1 text-xs">
                    <Icon className={cn("h-3 w-3", config.color)} />
                    {config.label}
                  </Badge>
                )
              })}
            </div>
          </div>
        </div>

        {contact.nextFollowUp && (
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  Follow-up: {formatFollowUpDate(contact.nextFollowUp)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                <Clock className="h-3 w-3" />
                <span>Best: Tue 9-11am</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Thread */}
      <ScrollArea className="flex-1 p-5">
        <div className="space-y-4">
          {contactMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">
                No messages yet
              </p>
              <p className="text-xs text-muted-foreground/60">
                Start the conversation with this contact
              </p>
            </div>
          ) : (
            contactMessages.map((message) => {
              const channel = channelConfig[message.channel]
              const ChannelIcon = channel.icon

              return (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[85%] p-3 rounded-xl",
                    message.isOutgoing
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "mr-auto bg-muted"
                  )}
                >
                  <p className={cn(
                    "text-sm leading-relaxed",
                    message.isOutgoing ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {message.content}
                  </p>

                  <div className={cn(
                    "flex items-center justify-between mt-2 pt-2 border-t",
                    message.isOutgoing 
                      ? "border-primary-foreground/20" 
                      : "border-border"
                  )}>
                    <div className="flex items-center gap-1.5">
                      <ChannelIcon className={cn(
                        "h-3 w-3",
                        message.isOutgoing ? "text-primary-foreground/70" : channel.color
                      )} />
                      <span className={cn(
                        "text-[10px]",
                        message.isOutgoing ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {formatDate(message.sentAt)}
                      </span>
                    </div>

                    <div className={cn(
                      "flex items-center gap-1 text-[10px]",
                      message.isOutgoing ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}>
                      {message.status === "sent" && (
                        <>
                          <Check className="h-3 w-3" />
                          Sent
                        </>
                      )}
                      {message.status === "opened" && (
                        <>
                          <Eye className="h-3 w-3" />
                          Opened
                        </>
                      )}
                      {message.status === "replied" && (
                        <>
                          <Reply className="h-3 w-3" />
                          Replied
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Compose Area */}
      <div className="p-4">
        <Textarea
          placeholder="Write a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="min-h-[80px] resize-none rounded-lg"
        />

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg">
              <Sparkles className="h-3.5 w-3.5" />
              Generate Message
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 rounded-lg">
              <Calendar className="h-3.5 w-3.5" />
              Schedule Follow-Up
            </Button>
          </div>

          <Button size="sm" className="gap-1.5 rounded-lg">
            <Send className="h-3.5 w-3.5" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

export function EmptyContactDetail() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="p-4 rounded-full bg-muted mb-4">
        <MessageSquare className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-foreground">
        Select a contact
      </h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
        Choose a contact from the list to view their details and message history
      </p>
      <Button variant="outline" className="mt-4 gap-2 rounded-lg">
        <Plus className="h-4 w-4" />
        Add Contact Manually
      </Button>
    </div>
  )
}
