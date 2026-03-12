"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Search,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  Clock,
  LogOut,
  Plus,
  Check,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Kbd } from "@/components/ui/kbd"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useShell } from "./shell-context"

interface Profile {
  id: string
  name: string
  role: string
  isActive: boolean
}

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
}

const mockProfiles: Profile[] = [
  { id: "1", name: "Senior Frontend", role: "Senior Frontend Engineer", isActive: true },
  { id: "2", name: "Full Stack", role: "Full Stack Developer", isActive: false },
  { id: "3", name: "Tech Lead", role: "Engineering Manager", isActive: false },
]

const mockNotifications: Notification[] = [
  { id: "1", title: "New job match", description: "15 new jobs match your Senior Frontend profile", time: "2m ago", read: false },
  { id: "2", title: "Application viewed", description: "Stripe viewed your application", time: "1h ago", read: false },
  { id: "3", title: "Interview scheduled", description: "Interview with Vercel on Friday at 2pm", time: "3h ago", read: true },
  { id: "4", title: "Resume feedback", description: "AI completed resume optimization", time: "1d ago", read: true },
  { id: "5", title: "Weekly summary", description: "Your job search stats for this week", time: "2d ago", read: true },
]

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const { sidebarCollapsed, toggleCopilot, copilotOpen, setMobileMenuOpen } = useShell()
  const [activeProfile, setActiveProfile] = React.useState(mockProfiles[0])
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 transition-all duration-200",
        "md:px-6",
        sidebarCollapsed ? "md:ml-[68px]" : "md:ml-[260px]"
      )}
    >
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search jobs, applications..."
          className="h-9 pl-9 pr-12 bg-muted/50 border-transparent focus:border-input focus:bg-background"
        />
        <Kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex">
          <span className="text-xs">Cmd</span>K
        </Kbd>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1">
        {/* Profile Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
              <span className="max-w-[120px] truncate text-sm">{activeProfile.name}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Switch Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockProfiles.map((profile) => (
              <DropdownMenuItem
                key={profile.id}
                onClick={() => setActiveProfile(profile)}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{profile.name}</span>
                  <span className="text-xs text-muted-foreground">{profile.role}</span>
                </div>
                {profile.id === activeProfile.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              Create New Profile
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profiles">Manage Profiles</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h4 className="font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex gap-3 border-b px-4 py-3 last:border-0 cursor-pointer hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "mt-1 h-2 w-2 shrink-0 rounded-full",
                      notification.read ? "bg-transparent" : "bg-primary"
                    )}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full justify-center text-xs">
                View All Notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Copilot Toggle */}
        <Button
          variant={copilotOpen ? "secondary" : "ghost"}
          size="icon"
          onClick={toggleCopilot}
          className="hidden sm:flex"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Toggle AI Copilot</span>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>John Doe</span>
                <span className="text-xs font-normal text-muted-foreground">john@example.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/activity">
                <Clock className="mr-2 h-4 w-4" />
                Activity Log
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
