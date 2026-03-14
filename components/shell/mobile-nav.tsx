"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Briefcase,
  ClipboardCheck,
  Send,
  MoreHorizontal,
  Settings,
  Users,
  Folder,
  ScrollText,
  Mail,
  Inbox,
  Calendar,
  BarChart2,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useShell } from "./shell-context"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}

const bottomNavItems: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Jobs", href: "/jobs", icon: Briefcase, badge: 12 },
  { label: "Review", href: "/review", icon: ClipboardCheck, badge: 24 },
  { label: "Applications", href: "/applications", icon: Send },
]

const moreNavItems: NavItem[] = [
  { label: "Outreach", href: "/outreach", icon: Mail },
  { label: "Email Hub", href: "/email", icon: Inbox },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Market Intel", href: "/market", icon: TrendingUp },
  { label: "Interviews", href: "/interviews", icon: Calendar, badge: 3 },
  { label: "Profiles", href: "/profiles", icon: Users },
  { label: "Files", href: "/files", icon: Folder },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Activity Log", href: "/activity", icon: ScrollText },
  { label: "Notifications", href: "/notifications", icon: Bell, badge: 4 },
  { label: "What's New", href: "/changelog", icon: Sparkles },
]

export function MobileNav() {
  const pathname = usePathname()
  const { mobileMenuOpen, setMobileMenuOpen, toggleCopilot } = useShell()
  const [moreOpen, setMoreOpen] = React.useState(false)

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-surface md:hidden">
        <div className="flex h-16 items-center justify-around">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span>{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-3 py-2 text-xs text-muted-foreground"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span>More</span>
          </button>
        </div>
      </nav>

      {/* More Menu Sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
          <SheetHeader className="text-left">
            <SheetTitle>More</SheetTitle>
          </SheetHeader>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {moreNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl p-4 transition-colors",
                    "hover:bg-muted",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <div className="relative">
                    <item.icon className="h-6 w-6" />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium text-destructive-foreground">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs">{item.label}</span>
                </Link>
              )
            })}
            <button
              onClick={() => {
                setMoreOpen(false)
                toggleCopilot()
              }}
              className="flex flex-col items-center gap-2 rounded-xl p-4 transition-colors hover:bg-muted"
            >
              <MessageSquare className="h-6 w-6" />
              <span className="text-xs">AI Copilot</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Briefcase className="h-4 w-4" />
              </div>
              <SheetTitle>Job App OS</SheetTitle>
            </div>
          </SheetHeader>
          <nav className="p-4">
            <div className="space-y-1">
              {[...bottomNavItems, ...moreNavItems].map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      "hover:bg-accent",
                      isActive && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs font-mono font-medium text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}
