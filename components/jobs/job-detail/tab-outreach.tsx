"use client"

import { useState } from "react"
import { 
  User, 
  Linkedin, 
  Mail, 
  UserPlus, 
  MessageSquare,
  Flame,
  Snowflake,
  ThermometerSun,
  Calendar,
  Plus,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { Contact, Message } from "../types"

interface TabOutreachProps {
  contacts: Contact[]
  messages: Message[]
}

const warmthIcons = {
  cold: Snowflake,
  warm: ThermometerSun,
  hot: Flame,
}

const warmthStyles = {
  cold: "text-blue-500",
  warm: "text-amber-500",
  hot: "text-orange-500",
}

const channelIcons = {
  linkedin: Linkedin,
  email: Mail,
  referral: UserPlus,
}

const statusStyles = {
  not_contacted: "bg-muted text-muted-foreground",
  contacted: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  replied: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
  connected: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
}

const statusLabels = {
  not_contacted: "Not Contacted",
  contacted: "Contacted",
  replied: "Replied",
  connected: "Connected",
}

function ContactCard({ 
  contact, 
  messages 
}: { 
  contact: Contact
  messages: Message[]
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const WarmthIcon = warmthIcons[contact.warmth]
  const ChannelIcon = channelIcons[contact.channel]
  const contactMessages = messages.filter(m => m.contactId === contact.id).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="size-12">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {contact.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{contact.name}</span>
              <WarmthIcon className={cn("size-4", warmthStyles[contact.warmth])} />
            </div>
            <p className="text-xs text-muted-foreground">
              {contact.title} at {contact.company}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={cn("text-xs", statusStyles[contact.status])}>
                {statusLabels[contact.status]}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ChannelIcon className="size-3" />
                <span className="capitalize">{contact.channel}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" asChild>
              <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon-sm">
              <MessageSquare className="size-4" />
            </Button>
          </div>
        </div>

        {/* Contact Dates */}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          {contact.lastContact && (
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              Last: {formatDate(contact.lastContact)}
            </span>
          )}
          {contact.nextFollowUp && (
            <span className="flex items-center gap-1 text-primary">
              <Calendar className="size-3" />
              Follow-up: {formatDate(contact.nextFollowUp)}
            </span>
          )}
        </div>

        {/* Message History */}
        {contactMessages.length > 0 && (
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-between text-xs">
                <span>{contactMessages.length} message{contactMessages.length > 1 ? "s" : ""}</span>
                {isExpanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-3 space-y-3 border-l-2 border-muted pl-4">
                {contactMessages.map((msg) => (
                  <div key={msg.id} className={cn(
                    "p-3 rounded-lg text-sm",
                    msg.direction === "sent" 
                      ? "bg-primary/5 border border-primary/20" 
                      : "bg-muted/50"
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">
                        {msg.direction === "sent" ? "You" : contact.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{msg.content}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}

export function TabOutreach({ contacts, messages }: TabOutreachProps) {
  // Calculate follow-up schedule
  const upcomingFollowUps = contacts
    .filter(c => c.nextFollowUp)
    .sort((a, b) => (a.nextFollowUp?.getTime() || 0) - (b.nextFollowUp?.getTime() || 0))

  return (
    <div className="p-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Contacts & Outreach</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg">
            <Plus className="size-4 mr-1.5" />
            Add Contact
          </Button>
          <Button size="sm" className="rounded-lg">
            <RefreshCw className="size-4 mr-1.5" />
            Generate Message
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="col-span-2 space-y-4">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} messages={messages} />
          ))}

          {contacts.length === 0 && (
            <div className="text-center py-12 border border-dashed rounded-xl">
              <User className="size-12 mx-auto mb-3 text-muted-foreground/50" />
              <h3 className="text-base font-medium mb-1">No contacts yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add contacts at this company to track your outreach
              </p>
              <Button className="rounded-lg">
                <Plus className="size-4 mr-1.5" />
                Add Contact
              </Button>
            </div>
          )}
        </div>

        {/* Follow-up Schedule */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="size-4" />
                Follow-up Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingFollowUps.length > 0 ? (
                <div className="space-y-3">
                  {upcomingFollowUps.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {contact.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact.nextFollowUp?.toLocaleDateString("en-US", { 
                            month: "short", 
                            day: "numeric" 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No scheduled follow-ups
                </p>
              )}
            </CardContent>
          </Card>

          {/* Outreach Stats */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Outreach Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total Contacts</span>
                <span className="font-mono">{contacts.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Response Rate</span>
                <span className="font-mono">
                  {contacts.length > 0 
                    ? Math.round((contacts.filter(c => c.status === "replied" || c.status === "connected").length / contacts.filter(c => c.status !== "not_contacted").length) * 100) || 0
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Messages Sent</span>
                <span className="font-mono">{messages.filter(m => m.direction === "sent").length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
