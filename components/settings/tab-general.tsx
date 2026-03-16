"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Save, Upload, Shield, AlertTriangle, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { useGeneralSettings } from "@/hooks/useSettings"
import type { GeneralSettings } from "./types"

const timezones = [
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Singapore", label: "Singapore Time (SGT)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
]

/** Map API response to local GeneralSettings shape */
function mapGeneralSettings(apiData: Record<string, unknown> | undefined): GeneralSettings {
  return {
    displayName: (apiData?.display_name as string) ?? (apiData?.displayName as string) ?? "",
    email: (apiData?.email as string) ?? "",
    timezone: (apiData?.timezone as string) ?? "America/Los_Angeles",
    language: (apiData?.language as string) ?? "en",
    dateFormat: (apiData?.date_format as string) ?? (apiData?.dateFormat as string) ?? "MM/DD/YYYY",
    theme: (apiData?.theme as "light" | "dark" | "system") ?? "system",
  }
}

export function TabGeneral() {
  const { theme, setTheme } = useTheme()
  const { data: apiSettings, isLoading, error } = useGeneralSettings()
  const [settings, setSettings] = React.useState<GeneralSettings | null>(null)

  // Seed local state once API data arrives
  React.useEffect(() => {
    if (apiSettings && !settings) {
      const mapped = mapGeneralSettings(apiSettings)
      setSettings({
        ...mapped,
        theme: (theme as "light" | "dark" | "system") || mapped.theme,
      })
    }
  }, [apiSettings, theme, settings])

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-card p-10">
        <p className="text-sm text-destructive">Failed to load settings. Please try again later.</p>
      </div>
    )
  }
  const [isSaving, setIsSaving] = React.useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false)
  const [show2FADialog, setShow2FADialog] = React.useState(false)
  const [verificationCode, setVerificationCode] = React.useState("")
  const [killSwitchEnabled, setKillSwitchEnabled] = React.useState(false)
  const [showKillSwitchDialog, setShowKillSwitchDialog] = React.useState(false)
  const [showChangelog, setShowChangelog] = React.useState(true)
  const [avatarUrl, setAvatarUrl] = React.useState("/placeholder-avatar.jpg")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleThemeChange = (value: string) => {
    setSettings({ ...settings, theme: value as "light" | "dark" | "system" })
    setTheme(value)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
      toast.success("Avatar updated")
    }
  }

  const handle2FAToggle = (checked: boolean) => {
    if (checked) {
      setShow2FADialog(true)
    } else {
      setTwoFactorEnabled(false)
      toast.success("Two-factor authentication disabled")
    }
  }

  const handle2FASetup = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true)
      setShow2FADialog(false)
      setVerificationCode("")
      toast.success("Two-factor authentication enabled")
    }
  }

  const handleKillSwitchToggle = (checked: boolean) => {
    if (checked) {
      setShowKillSwitchDialog(true)
    } else {
      setKillSwitchEnabled(false)
      toast.success("Automation resumed")
    }
  }

  const confirmKillSwitch = () => {
    setKillSwitchEnabled(true)
    setShowKillSwitchDialog(false)
    toast.warning("All automation has been paused")
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success("General settings saved")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure your account preferences and display settings.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatarUrl} alt="Profile avatar" />
          <AvatarFallback className="text-lg">
            {settings.displayName.split(" ").map(n => n[0]).join("").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-medium text-foreground">Profile Photo</h3>
          <p className="text-sm text-muted-foreground">
            This will be displayed on your profile and applications.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Upload className="h-4 w-4" />
          Change Avatar
        </Button>
      </div>

      {/* Name and Email */}
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="displayName">Full Name</Label>
            <Input
              id="displayName"
              value={settings.displayName}
              onChange={(e) =>
                setSettings({ ...settings, displayName: e.target.value })
              }
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              readOnly
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Cannot be changed</p>
          </div>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select
            value={settings.timezone}
            onValueChange={(value) =>
              setSettings({ ...settings, timezone: value })
            }
          >
            <SelectTrigger id="timezone" className="w-full max-w-xs focus-visible:ring-2 focus-visible:ring-primary">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Theme Preference */}
      <div className="space-y-3">
        <Label>Theme Preference</Label>
        <RadioGroup
          value={settings.theme}
          onValueChange={handleThemeChange}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light" className="font-normal cursor-pointer">Light</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark" className="font-normal cursor-pointer">Dark</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system" className="font-normal cursor-pointer">System</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Two-Factor Authentication */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-5">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 text-primary" />
          <div className="space-y-0.5">
            <Label htmlFor="2fa" className="text-base font-medium">
              Two-Factor Authentication
            </Label>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account.
            </p>
          </div>
        </div>
        <Switch
          id="2fa"
          checked={twoFactorEnabled}
          onCheckedChange={handle2FAToggle}
          className="focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {/* Emergency Kill Switch */}
      <div className="flex items-center justify-between rounded-xl border border-destructive/50 bg-destructive/5 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
          <div className="space-y-0.5">
            <Label htmlFor="killSwitch" className="text-base font-medium text-destructive">
              Emergency Kill Switch
            </Label>
            <p className="text-sm text-muted-foreground">
              Pause all automation immediately. No jobs will be discovered, generated, or submitted.
            </p>
          </div>
        </div>
        <Switch
          id="killSwitch"
          checked={killSwitchEnabled}
          onCheckedChange={handleKillSwitchToggle}
          className="data-[state=checked]:bg-destructive focus-visible:ring-2 focus-visible:ring-destructive"
        />
      </div>

      {/* Changelog Preferences */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-5">
        <div className="flex items-start gap-3">
          <Megaphone className="mt-0.5 h-5 w-5 text-muted-foreground" />
          <div className="space-y-0.5">
            <Label htmlFor="changelog" className="text-base font-medium">
              Changelog Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Show banner for new updates on login.
            </p>
          </div>
        </div>
        <Switch
          id="changelog"
          checked={showChangelog}
          onCheckedChange={setShowChangelog}
          className="focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* 2FA Setup Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app, then enter the verification code.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Mock QR Code */}
            <div className="flex justify-center">
              <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed bg-muted">
                <div className="text-center text-sm text-muted-foreground">
                  <div className="mb-2 text-4xl">📱</div>
                  QR Code Placeholder
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="font-mono text-center text-lg tracking-widest focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FADialog(false)}>
              Cancel
            </Button>
            <Button onClick={handle2FASetup} disabled={verificationCode.length !== 6}>
              Verify & Enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Kill Switch Confirmation Dialog */}
      <AlertDialog open={showKillSwitchDialog} onOpenChange={setShowKillSwitchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pause All Automation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately stop all job discovery, content generation, and auto-apply processes.
              No new applications will be submitted until you disable the kill switch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmKillSwitch}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Pause Automation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
