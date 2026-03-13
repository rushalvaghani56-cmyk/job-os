"use client"

import * as React from "react"
import {
  X,
  Send,
  Sparkles,
  User,
  Slash,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Bell,
  FileText,
  Target,
  Search,
  BarChart3,
  Scale,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronRight,
  GripVertical,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useShell } from "./shell-context"

// Types
interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  isStreaming?: boolean
  action?: ActionCard
}

interface ActionCard {
  id: string
  title: string
  description: string
  items?: string[]
  status: "pending" | "confirmed" | "cancelled" | "completed"
}

interface ProactiveSuggestion {
  id: string
  icon: React.ElementType
  text: string
  action: string
}

interface SlashCommand {
  name: string
  description: string
  icon: React.ElementType
}

// Data
const slashCommands: SlashCommand[] = [
  { name: "/apply", description: "Apply to top N jobs", icon: Briefcase },
  { name: "/generate", description: "Generate content", icon: FileText },
  { name: "/score", description: "Re-score jobs", icon: Target },
  { name: "/discover", description: "Run discovery", icon: Search },
  { name: "/stats", description: "Show quick stats", icon: BarChart3 },
  { name: "/compare", description: "Compare jobs", icon: Scale },
  { name: "/mock", description: "Start mock interview", icon: MessageSquare },
  { name: "/negotiate", description: "Negotiation roleplay", icon: TrendingUp },
  { name: "/help", description: "Show all commands", icon: HelpCircle },
]

const proactiveSuggestions: ProactiveSuggestion[] = [
  {
    id: "1",
    icon: Briefcase,
    text: "3 jobs >85 unprocessed",
    action: "Generate resumes for 3 high-scoring jobs?",
  },
  {
    id: "2",
    icon: TrendingUp,
    text: "Fintech CLs get 2x responses",
    action: "Adjust your cover letter strategy for fintech?",
  },
  {
    id: "3",
    icon: Bell,
    text: "Follow-up due for Stripe",
    action: "Draft follow-up for Sarah at Stripe?",
  },
]

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! I'm your AI Copilot. I can help you with job search, resume tailoring, cover letters, and interview prep. How can I help you today?",
    timestamp: new Date(),
  },
]

// Streaming text effect component
function StreamingText({ content, onComplete }: { content: string; onComplete?: () => void }) {
  const [displayedContent, setDisplayedContent] = React.useState("")
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + 1))
        index++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, 20)

    return () => clearInterval(interval)
  }, [content, onComplete])

  return (
    <span>
      {displayedContent}
      {!isComplete && <span className="animate-pulse">|</span>}
    </span>
  )
}

// Action card component
function ActionCardComponent({
  action,
  onConfirm,
  onCancel,
}: {
  action: ActionCard
  onConfirm: () => void
  onCancel: () => void
}) {
  const [isExecuting, setIsExecuting] = React.useState(false)

  const handleConfirm = async () => {
    setIsExecuting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onConfirm()
  }

  if (action.status === "completed") {
    return (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">Action completed</span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{action.title}</p>
      </div>
    )
  }

  if (action.status === "cancelled") {
    return (
      <div className="rounded-xl border border-muted bg-muted/50 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <XCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Action cancelled</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h4 className="font-medium text-foreground">{action.title}</h4>
      {action.items && action.items.length > 0 && (
        <ul className="mt-2 space-y-1">
          {action.items.map((item, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <ChevronRight className="h-3 w-3" />
              {item}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-xs text-muted-foreground">{action.description}</p>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          onClick={handleConfirm}
          disabled={isExecuting}
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Executing...
            </>
          ) : (
            "Confirm"
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          disabled={isExecuting}
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

// Proactive suggestion card
function SuggestionCard({
  suggestion,
  onClick,
}: {
  suggestion: ProactiveSuggestion
  onClick: () => void
}) {
  const Icon = suggestion.icon

  return (
    <button
      onClick={onClick}
      className="flex min-w-[200px] shrink-0 flex-col gap-2 rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-3 text-left transition-all hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-medium text-foreground">{suggestion.text}</span>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span>{suggestion.action}</span>
        <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  )
}

export function CopilotPanel() {
  const { copilotOpen, setCopilotOpen } = useShell()
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [showCommands, setShowCommands] = React.useState(false)
  const [panelWidth, setPanelWidth] = React.useState(380)
  const [isResizing, setIsResizing] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Keyboard shortcut to toggle copilot (Cmd+J)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault()
        setCopilotOpen(!copilotOpen)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [copilotOpen, setCopilotOpen])

  // Handle resize
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    const startX = e.clientX
    const startWidth = panelWidth

    const handleMouseMove = (e: MouseEvent) => {
      const diff = startX - e.clientX
      const newWidth = Math.min(Math.max(startWidth + diff, 320), 600)
      setPanelWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Check for slash command
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInput(value)
    setShowCommands(value === "/" || (value.startsWith("/") && !value.includes(" ")))
  }

  const handleCommandSelect = (command: string) => {
    setInput(command + " ")
    setShowCommands(false)
    textareaRef.current?.focus()
  }

  const handleSuggestionClick = (suggestion: ProactiveSuggestion) => {
    // Add the suggestion as a user message and trigger AI response
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: suggestion.action,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    simulateAIResponse(suggestion.action)
  }

  const simulateAIResponse = (userInput: string) => {
    setIsLoading(true)

    // Check if it's an action-triggering command
    const isActionCommand = userInput.toLowerCase().includes("apply") || 
                           userInput.toLowerCase().includes("generate") ||
                           userInput.toLowerCase().includes("draft")

    setTimeout(() => {
      if (isActionCommand) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: "I'll help you with that. Here's what I'm proposing:",
          timestamp: new Date(),
          action: {
            id: Date.now().toString(),
            title: "Apply to 5 high-scoring jobs",
            description: "This will generate tailored resumes and cover letters for each position.",
            items: [
              "Senior Frontend Engineer at Stripe (92)",
              "Staff Engineer at Vercel (89)",
              "Tech Lead at Linear (87)",
              "Senior SWE at Notion (85)",
              "Principal Engineer at Figma (83)",
            ],
            status: "pending",
          },
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        const aiMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: "I understand you're looking for help. Based on your current job search data, I can see you have several high-scoring opportunities. Would you like me to help you prioritize them or generate application materials?",
          timestamp: new Date(),
          isStreaming: true,
        }
        setMessages((prev) => [...prev, aiMessage])
      }
      setIsLoading(false)
    }, 800)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const userInput = input.trim()
    setInput("")
    setShowCommands(false)

    simulateAIResponse(userInput)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleActionConfirm = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.action
          ? { ...msg, action: { ...msg.action, status: "completed" as const } }
          : msg
      )
    )
    // Add completion message
    const completionMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "Done! I've queued the applications for review. You can find them in the Review Queue.",
      timestamp: new Date(),
      isStreaming: true,
    }
    setTimeout(() => {
      setMessages((prev) => [...prev, completionMessage])
    }, 500)
  }

  const handleActionCancel = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.action
          ? { ...msg, action: { ...msg.action, status: "cancelled" as const } }
          : msg
      )
    )
  }

  const handleStreamingComplete = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isStreaming: false } : msg
      )
    )
  }

  if (!copilotOpen) return null

  const showSuggestions = messages.length <= 1

  return (
    <aside
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background",
        "md:relative md:inset-auto md:right-0 md:top-0 md:h-full md:border-l md:shrink-0 md:w-[380px]",
        isResizing && "select-none"
      )}
      style={{ ['--panel-width' as string]: `${panelWidth}px` }}
    >
      {/* Resize Handle */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute left-0 top-0 z-10 hidden h-full w-1 cursor-ew-resize items-center justify-center hover:bg-primary/20 md:flex"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 hover:opacity-100" />
      </div>

      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">AI Copilot</h2>
          <Badge variant="outline" className="text-xs font-mono h-5">
            Claude 4
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCopilotOpen(false)}
          className="h-7 w-7 focus-visible:ring-2 focus-visible:ring-primary"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close copilot</span>
        </Button>
      </div>

      {/* Proactive Suggestions */}
      {showSuggestions && (
        <div className="border-b p-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {proactiveSuggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
            if (message.role === "system") {
              return (
                <div key={message.id} className="text-center">
                  <span className="text-xs text-muted-foreground">{message.content}</span>
                </div>
              )
            }

            return (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    message.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.role === "assistant" ? (
                    <Sparkles className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                </div>
                <div
                  className={cn(
                    "flex max-w-[85%] flex-col gap-2",
                    message.role === "user" && "items-end"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-xl px-3 py-2 shadow-sm",
                      message.role === "assistant"
                        ? "rounded-bl-md bg-muted"
                        : "rounded-br-md bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="text-sm">
                      {message.isStreaming ? (
                        <StreamingText
                          content={message.content}
                          onComplete={() => handleStreamingComplete(message.id)}
                        />
                      ) : (
                        message.content
                      )}
                    </p>
                  </div>
                  {message.action && (
                    <ActionCardComponent
                      action={message.action}
                      onConfirm={() => handleActionConfirm(message.id)}
                      onCancel={() => handleActionCancel(message.id)}
                    />
                  )}
                  <span
                    className={cn(
                      "text-xs",
                      message.role === "assistant"
                        ? "text-muted-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            )
          })}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-1 rounded-xl rounded-bl-md bg-muted px-3 py-2 shadow-sm">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-3">
        <div className="relative">
          <Popover open={showCommands} onOpenChange={setShowCommands}>
            <PopoverTrigger asChild>
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your job search..."
                className="min-h-[60px] max-h-[120px] resize-none pr-12 pb-6 text-sm focus-visible:ring-2 focus-visible:ring-primary"
                disabled={isLoading}
                rows={1}
              />
            </PopoverTrigger>
            <PopoverContent
              className="w-[280px] p-0"
              align="start"
              side="top"
              sideOffset={8}
            >
              <Command>
                <CommandList>
                  <CommandEmpty>No command found.</CommandEmpty>
                  <CommandGroup heading="Commands">
                    {slashCommands
                      .filter((cmd) =>
                        cmd.name.toLowerCase().includes(input.toLowerCase())
                      )
                      .map((cmd) => {
                        const Icon = cmd.icon
                        return (
                          <CommandItem
                            key={cmd.name}
                            value={cmd.name}
                            onSelect={() => handleCommandSelect(cmd.name)}
                            className="gap-2"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="font-mono text-sm">{cmd.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {cmd.description}
                              </span>
                            </div>
                          </CommandItem>
                        )
                      })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="absolute bottom-1.5 left-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Slash className="h-3 w-3" />
            <span>commands</span>
            <span className="mx-1">·</span>
            <kbd className="rounded border bg-muted px-1 text-[10px]">⌘J</kbd>
            <span>to toggle</span>
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="absolute bottom-1.5 right-2 h-7 w-7 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </aside>
  )
}
