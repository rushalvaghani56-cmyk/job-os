"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Briefcase,
  CheckSquare,
  Kanban,
  Users,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  Settings,
  UserCircle,
  Folder,
  Clock,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useShell } from "./shell-context"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
  badgeVariant?: "default" | "destructive"
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Jobs", href: "/jobs", icon: Briefcase, badge: 12 },
  { label: "Review Queue", href: "/review", icon: CheckSquare, badge: 24, badgeVariant: "destructive" },
  { label: "Applications", href: "/applications", icon: Kanban, badge: 8 },
  { label: "Outreach", href: "/outreach", icon: Users },
  { label: "Email Hub", href: "/email", icon: Mail },
  { label: "Interviews", href: "/interviews", icon: Calendar, badge: 3 },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Market Intel", href: "/market", icon: TrendingUp },
]

const secondaryNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Profiles", href: "/profiles", icon: UserCircle },
  { label: "Files", href: "/files", icon: Folder },
  { label: "Activity Log", href: "/activity", icon: Clock },
]

const bottomNavItems: NavItem[] = [
  { label: "What's New", href: "/changelog", icon: Sparkles },
]

function NavItemComponent({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

  const content = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200",
        "hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        isActive && "bg-primary/10 text-primary font-medium border-l-2 border-primary -ml-[2px] pl-[calc(0.75rem+2px)]",
        !isActive && "text-muted-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined && item.badge > 0 && (
            <span
              className={cn(
                "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-mono font-medium",
                item.badgeVariant === "destructive"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              )}
            >
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {item.label}
          {item.badge !== undefined && item.badge > 0 && (
            <span
              className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-mono font-medium",
                item.badgeVariant === "destructive"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              )}
            >
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

export function SidebarNav() {
  const { sidebarCollapsed, toggleSidebar } = useShell()
  const hasWhatsNewDot = true // Mock: would come from API

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-card transition-all duration-200 ease-in-out",
        "hidden md:flex",
        sidebarCollapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-14 items-center border-b px-4",
          sidebarCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!sidebarCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="text-sm">Job App OS</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 shrink-0"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}
        </div>

        <div className="my-4 border-t" />

        <div className="space-y-1">
          {secondaryNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} collapsed={sidebarCollapsed} />
          ))}
        </div>

        <div className="my-4 border-t" />

        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <div key={item.href} className="relative">
              <NavItemComponent item={item} collapsed={sidebarCollapsed} />
              {item.label === "What's New" && hasWhatsNewDot && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className={cn("border-t p-3", sidebarCollapsed && "flex justify-center")}>
        {sidebarCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">John Doe</TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback className="text-xs">JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs font-medium truncate max-w-[120px]">John Doe</span>
                <span className="text-xs text-muted-foreground">Free Plan</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-primary">
              <Zap className="h-3 w-3" />
              Upgrade
            </Button>
          </div>
        )}
      </div>
    </aside>
  )
}
