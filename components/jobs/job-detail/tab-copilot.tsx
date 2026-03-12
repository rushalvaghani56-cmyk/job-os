"use client"

import { useState } from "react"
import { Send, Sparkles, AlertTriangle, FileText, MessageSquare, HelpCircle, Bot } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { JobDetail } from "../types"

interface TabCopilotProps {
  job: JobDetail
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const suggestedPrompts = [
  { icon: AlertTriangle, label: "What are the risks?", prompt: "What are the main risks or concerns with this application?" },
  { icon: FileText, label: "Draft a follow-up", prompt: "Draft a professional follow-up message for this application" },
  { icon: MessageSquare, label: "Compare to similar jobs", prompt: `Compare this to my other applications at ${"{company}"}` },
  { icon: HelpCircle, label: "Practice interview", prompt: "Help me practice interview questions for this role" },
]

export function TabCopilot({ job }: TabCopilotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `I'm your AI assistant for the **${job.title}** position at **${job.company.name}**. I have full context about this job including the description, your match score, timeline, and outreach history. How can I help you?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    // Simulate AI response
    const aiResponse: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: getAIResponse(messageText, job),
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage, aiResponse])
    setInput("")
  }

  const handlePromptClick = (prompt: string) => {
    const formattedPrompt = prompt.replace("{company}", job.company.name)
    handleSend(formattedPrompt)
  }

  return (
    <div className="h-[600px] flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Job Copilot</h2>
            <p className="text-xs text-muted-foreground">
              Context: {job.title} at {job.company.name}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {suggestedPrompts.map((item, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            className="rounded-lg text-xs"
            onClick={() => handlePromptClick(item.prompt)}
          >
            <item.icon className="size-3 mr-1.5" />
            {item.label}
          </Button>
        ))}
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" && "flex-row-reverse"
                )}
              >
                <div className={cn(
                  "size-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  msg.role === "assistant" 
                    ? "bg-primary/10 text-primary" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {msg.role === "assistant" ? (
                    <Sparkles className="size-4" />
                  ) : (
                    <span className="text-xs font-medium">You</span>
                  )}
                </div>
                <div className={cn(
                  "flex-1 max-w-[80%] p-3 rounded-lg text-sm",
                  msg.role === "assistant"
                    ? "bg-muted/50"
                    : "bg-primary text-primary-foreground"
                )}>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {msg.content.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return <p key={i} className="font-semibold">{line.replace(/\*\*/g, "")}</p>
                      }
                      if (line.startsWith("- ")) {
                        return <li key={i} className="ml-4">{line.replace("- ", "")}</li>
                      }
                      return line ? <p key={i}>{line.replace(/\*\*/g, "")}</p> : <br key={i} />
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this job..."
              className="flex-1 rounded-lg"
            />
            <Button type="submit" size="icon" className="rounded-lg" disabled={!input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Context Indicator */}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="size-3" />
        <span>
          AI has access to: job description, score breakdown, timeline ({job.timeline.length} events), 
          {job.contacts.length} contacts, company dossier
        </span>
      </div>
    </div>
  )
}

// Mock AI responses based on prompt
function getAIResponse(prompt: string, job: JobDetail): string {
  const promptLower = prompt.toLowerCase()

  if (promptLower.includes("risk")) {
    return `**Risk Analysis for ${job.title} at ${job.company.name}:**

Based on my analysis, here are the key risks:

${job.riskFactors.map(r => `- ${r}`).join("\n")}

**Mitigation Strategies:**
- Emphasize transferable skills from adjacent domains
- Highlight quick learning ability in cover letter
- Connect with current employees to understand team culture

Overall, your score of ${job.score} indicates a strong match despite these concerns.`
  }

  if (promptLower.includes("follow-up") || promptLower.includes("followup")) {
    return `**Draft Follow-up Message:**

Hi [Contact Name],

I wanted to follow up on my application for the ${job.title} position at ${job.company.name}. Since submitting my application on ${job.postedAt.toLocaleDateString()}, I've continued to be excited about the opportunity to contribute to your team.

I noticed ${job.company.name} recently [mention recent news/development]. This aligns well with my experience in [relevant skill], where I [brief accomplishment].

Would you have 15 minutes this week for a brief call to discuss how my background could benefit the team?

Best regards,
[Your Name]

---
*Tip: Personalize this based on your research and any previous interactions.*`
  }

  if (promptLower.includes("compare")) {
    return `**Comparison with Previous Applications at ${job.company.name}:**

**Current Application:**
- ${job.title} - Score: ${job.score}
- Status: ${job.status}
- Strengths: ${job.skills.matched.slice(0, 3).join(", ")}

**Previous Applications:**
${job.applicationHistory.map(app => `- ${app.title} (${app.date.toLocaleDateString()}) - ${app.outcome}`).join("\n")}

**Key Differences:**
- This role has a higher match score than previous attempts
- Your skills have improved in key areas since last application
- The team/role appears different from previous positions

**Recommendation:** This application shows stronger alignment. Focus on demonstrating growth since previous applications.`
  }

  if (promptLower.includes("interview") || promptLower.includes("practice")) {
    return `**Practice Interview Questions for ${job.title}:**

**Technical Questions:**
1. "Describe your experience with ${job.skills.matched[0]} at scale."
2. "How would you approach optimizing a complex ${job.skills.matched[1]} implementation?"
3. "Walk me through a challenging bug you debugged recently."

**Behavioral Questions:**
1. "Tell me about a time you disagreed with a technical decision."
2. "How do you prioritize when working on multiple projects?"
3. "Describe your ideal engineering team culture."

**Questions for Them:**
1. "What does success look like in the first 90 days?"
2. "How does the team handle technical debt?"
3. "What's the biggest challenge the team is facing?"

*Would you like me to help you practice any of these questions?*`
  }

  return `I understand you're asking about "${prompt}" for your ${job.title} application at ${job.company.name}.

Based on your current score of ${job.score} and the timeline showing ${job.timeline.length} events, I can help you with:

- Analyzing risks and opportunities
- Drafting follow-up messages
- Comparing with similar applications
- Preparing for interviews
- Understanding company culture

What specific aspect would you like me to dive deeper into?`
}
