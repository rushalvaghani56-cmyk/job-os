"use client"

import * as React from "react"
import Link from "next/link"
import { Check, ChevronDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface Profile {
  id: string
  name: string
  role: string
  completeness: number
  isActive: boolean
}

const mockProfiles: Profile[] = [
  { id: "1", name: "Senior Frontend", role: "Senior Frontend Engineer", completeness: 85, isActive: true },
  { id: "2", name: "Full Stack", role: "Full Stack Developer", completeness: 62, isActive: false },
  { id: "3", name: "Tech Lead", role: "Engineering Manager", completeness: 45, isActive: false },
]

interface MiniCompletenessRingProps {
  percentage: number
  size?: number
}

function MiniCompletenessRing({ percentage, size = 32 }: MiniCompletenessRingProps) {
  const strokeWidth = 3
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const getColor = (pct: number) => {
    if (pct >= 80) return "stroke-emerald-500"
    if (pct >= 50) return "stroke-amber-500"
    return "stroke-red-500"
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={cn(getColor(percentage), "transition-all duration-300")}
      />
    </svg>
  )
}

interface ProfileSwitcherProps {
  collapsed?: boolean
}

export function ProfileSwitcher({ collapsed = false }: ProfileSwitcherProps) {
  const [activeProfile, setActiveProfile] = React.useState(mockProfiles[0])

  const content = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 px-2 py-6 hover:bg-accent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="relative flex items-center justify-center">
            <MiniCompletenessRing percentage={activeProfile.completeness} size={collapsed ? 36 : 32} />
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center text-xs font-semibold",
                collapsed ? "text-[10px]" : "text-[9px]"
              )}
            >
              {activeProfile.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <>
              <div className="flex flex-1 flex-col items-start text-left">
                <span className="text-sm font-medium truncate max-w-[130px]">
                  {activeProfile.name}
                </span>
                <span className="text-xs text-muted-foreground truncate max-w-[130px]">
                  {activeProfile.completeness}% complete
                </span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={collapsed ? "center" : "start"}
        side={collapsed ? "right" : "bottom"}
        className="w-64"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Switch Profile
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockProfiles.map((profile) => (
          <DropdownMenuItem
            key={profile.id}
            onClick={() => setActiveProfile(profile)}
            className="flex items-center gap-3 py-2 cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <MiniCompletenessRing percentage={profile.completeness} size={28} />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-semibold">
                {profile.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium">{profile.name}</span>
              <span className="text-xs text-muted-foreground">{profile.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {profile.completeness}%
              </span>
              {profile.id === activeProfile.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profiles" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create New Profile</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          <span>{activeProfile.name}</span>
          <span className="font-mono text-xs text-muted-foreground">
            {activeProfile.completeness}%
          </span>
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}
