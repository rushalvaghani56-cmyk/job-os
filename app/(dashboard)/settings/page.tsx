"use client"

import * as React from "react"
import {
  Settings,
  Bot,
  Key,
  Zap,
  Target,
  Globe,
  Calendar,
  Mail,
  Flag,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TabGeneral } from "@/components/settings/tab-general"
import { TabAIModels } from "@/components/settings/tab-ai-models"
import { TabAPIKeys } from "@/components/settings/tab-api-keys"
import { TabAutomation } from "@/components/settings/tab-automation"
import { TabScoring } from "@/components/settings/tab-scoring"
import { TabSources } from "@/components/settings/tab-sources"
import { TabSchedules } from "@/components/settings/tab-schedules"
import { TabEmail } from "@/components/settings/tab-email"
import { TabFeatureFlags } from "@/components/settings/tab-feature-flags"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "general", label: "General", icon: Settings, component: TabGeneral },
  { id: "ai-models", label: "AI Models", icon: Bot, component: TabAIModels },
  { id: "api-keys", label: "API Keys", icon: Key, component: TabAPIKeys },
  { id: "automation", label: "Automation", icon: Zap, component: TabAutomation },
  { id: "scoring", label: "Scoring", icon: Target, component: TabScoring },
  { id: "sources", label: "Sources", icon: Globe, component: TabSources },
  { id: "schedules", label: "Schedules", icon: Calendar, component: TabSchedules },
  { id: "email", label: "Email", icon: Mail, component: TabEmail },
  { id: "feature-flags", label: "Feature Flags", icon: Flag, component: TabFeatureFlags },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("general")

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.component || TabGeneral

  return (
    <div className="flex h-full flex-col">
      {/* Page Header */}
      <div className="border-b bg-background px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your Job OS configuration and preferences.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-56 shrink-0 border-r bg-muted/30">
          <ScrollArea className="h-full py-4">
            <div className="space-y-1 px-3">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </nav>

        {/* Tab Content */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <ActiveComponent />
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
