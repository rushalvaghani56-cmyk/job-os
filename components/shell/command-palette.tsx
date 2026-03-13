"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  Briefcase,
  ClipboardCheck,
  Send,
  Mail,
  Inbox,
  Calendar,
  BarChart2,
  TrendingUp,
  Settings,
  Users,
  Folder,
  ScrollText,
  Sparkles,
  Play,
  FileText,
  Pause,
  Sun,
  Moon,
  Download,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useShell } from "./shell-context"

interface Profile {
  id: string
  name: string
  role: string
}

const pages = [
  { name: "Home", href: "/dashboard", icon: Home, keywords: ["dashboard", "overview"] },
  { name: "Jobs", href: "/jobs", icon: Briefcase, keywords: ["browse", "discover", "opportunities"] },
  { name: "Review Queue", href: "/review", icon: ClipboardCheck, keywords: ["pending", "approve", "content"] },
  { name: "Applications", href: "/applications", icon: Send, keywords: ["track", "status", "pipeline"] },
  { name: "Outreach", href: "/outreach", icon: Mail, keywords: ["contacts", "networking", "messages"] },
  { name: "Email Hub", href: "/email", icon: Inbox, keywords: ["inbox", "gmail", "messages"] },
  { name: "Analytics", href: "/analytics", icon: BarChart2, keywords: ["stats", "metrics", "reports"] },
  { name: "Market Intel", href: "/market", icon: TrendingUp, keywords: ["trends", "salary", "skills"] },
  { name: "Interviews", href: "/interviews", icon: Calendar, keywords: ["schedule", "meetings", "prep"] },
  { name: "Profiles", href: "/profiles", icon: Users, keywords: ["resume", "target", "persona"] },
  { name: "Files", href: "/documents", icon: Folder, keywords: ["files", "resumes", "templates"] },
  { name: "Settings", href: "/settings", icon: Settings, keywords: ["preferences", "config", "api"] },
  { name: "Activity Log", href: "/activity", icon: ScrollText, keywords: ["history", "audit", "events"] },
]

const actions = [
  { name: "Run Discovery Now", icon: Play, keywords: ["scan", "find", "search jobs"], action: "discovery" },
  { name: "Open Copilot", icon: Sparkles, keywords: ["ai", "assistant", "chat"], shortcut: "⌘J", action: "copilot" },
  { name: "Pause Automation", icon: Pause, keywords: ["stop", "disable", "halt"], action: "pause" },
  { name: "Toggle Dark Mode", icon: Moon, keywords: ["theme", "light", "dark"], action: "toggle_theme" },
  { name: "Export Data", icon: Download, keywords: ["download", "backup", "csv"], action: "export" },
]

const mockProfiles: Profile[] = [
  { id: "1", name: "Senior Frontend", role: "Senior Frontend Engineer" },
  { id: "2", name: "Full Stack", role: "Full Stack Developer" },
  { id: "3", name: "Tech Lead", role: "Engineering Manager" },
]

export function CommandPalette() {
  const router = useRouter()
  const { commandPaletteOpen, setCommandPaletteOpen, toggleCopilot } = useShell()
  const [search, setSearch] = React.useState("")

  const runCommand = React.useCallback(
    (command: () => void) => {
      setCommandPaletteOpen(false)
      command()
    },
    [setCommandPaletteOpen]
  )

  const handleAction = React.useCallback(
    (action: string) => {
      switch (action) {
        case "copilot":
          runCommand(() => toggleCopilot())
          break
        case "discovery":
          runCommand(() => {
            // Mock: trigger discovery
            console.log("Running discovery...")
          })
          break
        case "generate":
          runCommand(() => {
            router.push("/review")
          })
          break
        case "score":
          runCommand(() => {
            router.push("/jobs")
          })
          break
        case "pause":
        case "resume":
          runCommand(() => {
            console.log(`Automation ${action}d`)
          })
          break
        default:
          break
      }
    },
    [runCommand, toggleCopilot, router]
  )

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
      title="Command Palette"
      description="Search for pages, actions, profiles, and more"
    >
      <CommandInput
        placeholder="Type a command or search..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Pages">
          {pages.map((page) => (
            <CommandItem
              key={page.href}
              value={`${page.name} ${page.keywords.join(" ")}`}
              onSelect={() => runCommand(() => router.push(page.href))}
              className="flex items-center gap-2"
            >
              <page.icon className="h-4 w-4 text-muted-foreground" />
              <span>Go to {page.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          {actions.map((action) => (
            <CommandItem
              key={action.name}
              value={`${action.name} ${action.keywords.join(" ")}`}
              onSelect={() => handleAction(action.action)}
              className="flex items-center gap-2"
            >
              <action.icon className="h-4 w-4 text-muted-foreground" />
              <span>{action.name}</span>
              {action.shortcut && (
                <CommandShortcut>{action.shortcut}</CommandShortcut>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Switch Profile">
          {mockProfiles.map((profile) => (
            <CommandItem
              key={profile.id}
              value={`switch profile ${profile.name} ${profile.role}`}
              onSelect={() =>
                runCommand(() => {
                  console.log(`Switched to profile: ${profile.name}`)
                })
              }
              className="flex items-center gap-2"
            >
              <UserCircle className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span>Switch to {profile.name}</span>
                <span className="text-xs text-muted-foreground">{profile.role}</span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
