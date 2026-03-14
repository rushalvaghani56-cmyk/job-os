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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
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
  ArrowLeft,
  CheckCircle,
  StickyNote,
  Trash2,
  Loader2,
  CalendarX,
  CalendarClock,
} from "lucide-react"
import type { Contact, Message, Channel, WarmthLevel } from "@/lib/outreach-types"

interface ContactDetailProps {
  contact: Contact
  messages: Message[]
  onBack?: () => void
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

export function ContactDetail({ contact, messages, onBack }: ContactDetailProps) {
  const { toast } = useToast()
  const [newMessage, setNewMessage] = useState("")
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState("")
  const [noteText, setNoteText] = useState(contact.notes || "")
  const [selectedChannel, setSelectedChannel] = useState<Channel>("linkedin-dm")
  const [selectedTone, setSelectedTone] = useState("professional")
  
  const warmth = warmthConfig[contact.warmth]
  const WarmthIcon = warmth.icon

  const contactMessages = messages.filter((m) => m.contactId === contact.id)

  const handleGenerateMessage = () => {
    setIsGenerating(true)
    setGeneratedMessage("")
    // Simulate AI generation
    setTimeout(() => {
      const messages: Record<string, string> = {
        professional: `Hi ${contact.name.split(" ")[0]},\n\nI came across your profile and was impressed by the work ${contact.company} is doing. With my background in software engineering and distributed systems, I believe I could contribute meaningfully to your team.\n\nWould you be open to a brief conversation about opportunities at ${contact.company}?\n\nBest regards`,
        casual: `Hey ${contact.name.split(" ")[0]}!\n\nLove what ${contact.company} is building. I'm a software engineer looking to make my next move and thought I'd reach out.\n\nAny chance we could chat sometime?\n\nCheers`,
        direct: `${contact.name.split(" ")[0]},\n\nI'm interested in opportunities at ${contact.company}. I have 6+ years of experience in backend systems and would like to discuss how I can add value to your team.\n\nAvailable for a call this week?\n\nThanks`,
      }
      setGeneratedMessage(messages[selectedTone] || messages.professional)
      setIsGenerating(false)
    }, 1000)
  }

  const handleMarkAsReplied = () => {
    toast({
      title: "Contact updated",
      description: `${contact.name} has been marked as replied.`,
    })
  }

  const handleSaveNote = () => {
    toast({
      title: "Note saved",
      description: "Your note has been added to this contact.",
    })
    setShowNoteDialog(false)
  }

  const handleRemoveContact = () => {
    toast({
      title: "Contact removed",
      description: `${contact.name} has been removed from your outreach list.`,
      variant: "destructive",
    })
    setShowRemoveDialog(false)
    onBack?.()
  }

  const handleRescheduleFollowUp = () => {
    toast({
      title: "Follow-up rescheduled",
      description: "The follow-up has been rescheduled for 3 days from now.",
    })
  }

  const handleCancelFollowUp = () => {
    toast({
      title: "Follow-up cancelled",
      description: "The scheduled follow-up has been cancelled.",
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border md:p-5">
        {/* Mobile back button */}
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-3 -ml-2 md:hidden"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 md:h-14 md:w-14">
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
            <div className="flex flex-col gap-2">
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
              <div className="flex items-center gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs rounded-lg gap-1"
                  onClick={handleRescheduleFollowUp}
                >
                  <CalendarClock className="h-3 w-3" />
                  Reschedule
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs rounded-lg gap-1 text-destructive hover:text-destructive"
                  onClick={handleCancelFollowUp}
                >
                  <CalendarX className="h-3 w-3" />
                  Cancel Follow-up
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
            onClick={handleMarkAsReplied}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Mark as Replied
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg gap-1.5"
            onClick={() => setShowNoteDialog(true)}
          >
            <StickyNote className="h-3.5 w-3.5" />
            Add Note
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setShowRemoveDialog(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </Button>
        </div>
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
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 rounded-lg"
              onClick={() => setShowGenerateDialog(true)}
            >
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

      {/* Generate Message Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">Generate New Message</DialogTitle>
            <DialogDescription>
              AI will create a personalized message for {contact.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Channel</Label>
                <Select value={selectedChannel} onValueChange={(v) => setSelectedChannel(v as Channel)}>
                  <SelectTrigger className="mt-1.5 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin-dm">LinkedIn DM</SelectItem>
                    <SelectItem value="inmail">InMail</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Tone</Label>
                <Select value={selectedTone} onValueChange={setSelectedTone}>
                  <SelectTrigger className="mt-1.5 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!generatedMessage && !isGenerating && (
              <Button 
                className="w-full rounded-lg gap-2" 
                onClick={handleGenerateMessage}
              >
                <Sparkles className="h-4 w-4" />
                Generate Message
              </Button>
            )}

            {isGenerating && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-sm text-muted-foreground">Generating...</span>
              </div>
            )}

            {generatedMessage && !isGenerating && (
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-surface-raised p-4">
                  <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {generatedMessage}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-lg"
                    onClick={handleGenerateMessage}
                  >
                    Regenerate
                  </Button>
                  <Button
                    className="flex-1 rounded-lg"
                    onClick={() => {
                      setNewMessage(generatedMessage)
                      setShowGenerateDialog(false)
                      setGeneratedMessage("")
                    }}
                  >
                    Use This Message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-base">Add Note</DialogTitle>
            <DialogDescription>
              Add a note about {contact.name}
            </DialogDescription>
          </DialogHeader>

          <Textarea
            placeholder="Enter your note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="min-h-[120px] rounded-lg mt-4"
          />

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              className="rounded-lg"
              onClick={() => setShowNoteDialog(false)}
            >
              Cancel
            </Button>
            <Button className="rounded-lg" onClick={handleSaveNote}>
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Contact Confirmation */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {contact.name} from your outreach list? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRemoveContact}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

interface EmptyContactDetailProps {
  hasContacts?: boolean
}

export function EmptyContactDetail({ hasContacts = true }: EmptyContactDetailProps) {
  if (!hasContacts) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="p-4 rounded-full bg-primary/10 mb-4">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-foreground">
          No outreach contacts yet
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Start prospecting! Add contacts from companies you are interested in.
        </p>
        <Button className="mt-4 gap-2 rounded-lg">
          <Plus className="h-4 w-4" />
          Find Contacts
        </Button>
      </div>
    )
  }

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
