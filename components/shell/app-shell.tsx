"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ShellProvider, useShell } from "./shell-context"
import { SidebarNav } from "./sidebar-nav"
import { Topbar } from "./topbar"
import { CopilotPanel } from "./copilot-panel"
import { MobileNav } from "./mobile-nav"
import { CommandPalette } from "./command-palette"

interface AppShellContentProps {
  children: React.ReactNode
}

function AppShellContent({ children }: AppShellContentProps) {
  const { sidebarCollapsed, copilotOpen } = useShell()

  return (
    <div className="relative min-h-screen bg-background">
      {/* Sidebar - Hidden on mobile */}
      <SidebarNav />

      {/* Main Area */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-200",
          sidebarCollapsed ? "md:ml-[68px]" : "md:ml-[260px]"
        )}
      >
        {/* Topbar */}
        <Topbar />

        {/* Content + Copilot wrapper */}
        <div className="flex flex-1">
          {/* Main Content */}
          <main
            className={cn(
              "flex-1 overflow-y-auto px-4 py-6 transition-all duration-200",
              "md:px-6",
              "pb-20 md:pb-6" // Extra padding for mobile bottom nav
            )}
          >
            {children}
          </main>

          {/* Copilot Panel - Hidden on mobile by default, overlay when open */}
          <CopilotPanel />
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Command Palette */}
      <CommandPalette />
    </div>
  )
}

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <ShellProvider>
      <AppShellContent>{children}</AppShellContent>
    </ShellProvider>
  )
}
