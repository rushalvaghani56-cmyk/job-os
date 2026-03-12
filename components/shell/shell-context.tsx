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

  const toggleSidebar = React.useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const toggleCopilot = React.useCallback(() => {
    setCopilotOpen((prev) => !prev)
  }, [])

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
      }}
    >
      {children}
    </ShellContext.Provider>
  )
}
