"use client"

import * as React from "react"

interface ShellContextValue {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  copilotOpen: boolean
  setCopilotOpen: (open: boolean) => void
  toggleCopilot: () => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (open: boolean) => void
  profileSwitcherOpen: boolean
  setProfileSwitcherOpen: (open: boolean) => void
}

const ShellContext = React.createContext<ShellContextValue | undefined>(undefined)

export function useShell() {
  const context = React.useContext(ShellContext)
  if (!context) {
    throw new Error("useShell must be used within a ShellProvider")
  }
  return context
}

interface ShellProviderProps {
  children: React.ReactNode
}

export function ShellProvider({ children }: ShellProviderProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [copilotOpen, setCopilotOpen] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false)
  const [profileSwitcherOpen, setProfileSwitcherOpen] = React.useState(false)

  const toggleSidebar = React.useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const toggleCopilot = React.useCallback(() => {
    setCopilotOpen((prev) => !prev)
  }, [])

  // Global keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K - Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
      }
      // Cmd+J or Ctrl+J - Toggle Copilot
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault()
        setCopilotOpen((prev) => !prev)
      }
      // Cmd+/ or Ctrl+/ - Toggle Sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault()
        setSidebarCollapsed((prev) => !prev)
      }
      // Cmd+Shift+P - Profile Switcher
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "P") {
        e.preventDefault()
        setProfileSwitcherOpen((prev) => !prev)
      }
      // Escape - Close modals/panels
      if (e.key === "Escape") {
        if (commandPaletteOpen) {
          setCommandPaletteOpen(false)
        } else if (profileSwitcherOpen) {
          setProfileSwitcherOpen(false)
        } else if (copilotOpen) {
          setCopilotOpen(false)
        } else if (mobileMenuOpen) {
          setMobileMenuOpen(false)
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [commandPaletteOpen, copilotOpen, mobileMenuOpen, profileSwitcherOpen])

  return (
    <ShellContext.Provider
      value={{
        sidebarCollapsed,
        setSidebarCollapsed,
        toggleSidebar,
        copilotOpen,
        setCopilotOpen,
        toggleCopilot,
        mobileMenuOpen,
        setMobileMenuOpen,
        commandPaletteOpen,
        setCommandPaletteOpen,
        profileSwitcherOpen,
        setProfileSwitcherOpen,
      }}
    >
      {children}
    </ShellContext.Provider>
  )
}
