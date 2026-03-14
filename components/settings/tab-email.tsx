"use client"

import * as React from "react"
import { Save, Mail, Link2, Unlink, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
import { cn } from "@/lib/utils"

export function TabEmail() {
  const [isConnected, setIsConnected] = React.useState(true)
  const [connectedEmail, setConnectedEmail] = React.useState("alex.johnson@gmail.com")
  const [showDisconnectDialog, setShowDisconnectDialog] = React.useState(false)
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  // Detection toggles
  const [rejectionDetection, setRejectionDetection] = React.useState(true)
  const [interviewDetection, setInterviewDetection] = React.useState(true)
  const [confirmationDetection, setConfirmationDetection] = React.useState(true)

  // Outreach config
  const [emailDelay, setEmailDelay] = React.useState(3)
  const [dailyOutreachLimit, setDailyOutreachLimit] = React.useState(20)
  const [trackOpens, setTrackOpens] = React.useState(true)

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnected(true)
    setConnectedEmail("alex.johnson@gmail.com")
    setIsConnecting(false)
    toast.success("Gmail connected successfully")
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setConnectedEmail("")
    setShowDisconnectDialog(false)
    toast.success("Gmail disconnected")
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
    toast.success("Email settings saved")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Email Settings</h2>
        <p className="text-sm text-muted-foreground">
          Connect your email account and configure auto-detection patterns.
        </p>
      </div>

      {/* Gmail OAuth Connection Card */}
      <div className={cn(
        "rounded-xl border p-6",
        isConnected ? "bg-card" : "bg-muted/30"
      )}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10">
            <Mail className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Gmail Account</h3>
              {isConnected ? (
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  <Check className="mr-1 h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="destructive" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                  Not Connected
                </Badge>
              )}
            </div>
            {isConnected ? (
              <p className="mt-1 text-sm text-muted-foreground">
                Connected as <span className="font-medium text-foreground">{connectedEmail}</span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">
                Connect your Gmail to send outreach emails and detect responses.
              </p>
            )}
          </div>
          {isConnected ? (
            <Button
              variant="outline"
              onClick={() => setShowDisconnectDialog(true)}
              className="shrink-0 rounded-lg text-destructive hover:bg-destructive hover:text-destructive-foreground focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Unlink className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              className="shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isConnecting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin">⌛</span>
                  Connecting...
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Connect Gmail
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Auto-Detection Patterns */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Auto-Detection Patterns</h3>
          <p className="text-xs text-muted-foreground">
            Automatically detect and categorize incoming emails.
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border bg-card p-4">
            <div>
              <Label htmlFor="rejectionDetection" className="font-medium">
                Rejection Detection
              </Label>
              <p className="text-xs text-muted-foreground">
                Detect rejection emails and update application status.
              </p>
            </div>
            <Switch
              id="rejectionDetection"
              checked={rejectionDetection}
              onCheckedChange={setRejectionDetection}
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border bg-card p-4">
            <div>
              <Label htmlFor="interviewDetection" className="font-medium">
                Interview Detection
              </Label>
              <p className="text-xs text-muted-foreground">
                Detect interview invitations and add to calendar.
              </p>
            </div>
            <Switch
              id="interviewDetection"
              checked={interviewDetection}
              onCheckedChange={setInterviewDetection}
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border bg-card p-4">
            <div>
              <Label htmlFor="confirmationDetection" className="font-medium">
                Confirmation Detection
              </Label>
              <p className="text-xs text-muted-foreground">
                Detect application confirmations and update status.
              </p>
            </div>
            <Switch
              id="confirmationDetection"
              checked={confirmationDetection}
              onCheckedChange={setConfirmationDetection}
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Outreach Sending Config */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Outreach Sending Configuration</h3>
          <p className="text-xs text-muted-foreground">
            Control how outreach emails are sent.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="emailDelay">Delay Between Emails (minutes)</Label>
            <Input
              id="emailDelay"
              type="number"
              min={1}
              max={60}
              value={emailDelay}
              onChange={(e) => setEmailDelay(parseInt(e.target.value) || 1)}
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Random delay of 1-{emailDelay} min between emails.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dailyLimit">Daily Outreach Limit</Label>
            <Input
              id="dailyLimit"
              type="number"
              min={1}
              max={100}
              value={dailyOutreachLimit}
              onChange={(e) => setDailyOutreachLimit(parseInt(e.target.value) || 1)}
              className="focus-visible:ring-2 focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Maximum emails sent per day.
            </p>
          </div>
        </div>
      </div>

      {/* Open Tracking */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-4">
        <div>
          <Label htmlFor="trackOpens" className="font-medium">
            Open Tracking
          </Label>
          <p className="text-xs text-muted-foreground">
            Track when recipients open your emails.
          </p>
        </div>
        <Switch
          id="trackOpens"
          checked={trackOpens}
          onCheckedChange={setTrackOpens}
          className="focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>

      {/* Template Management Link */}
      <div className="flex items-center justify-between rounded-xl border bg-muted/30 p-4">
        <div>
          <h3 className="font-medium text-foreground">Email Templates</h3>
          <p className="text-xs text-muted-foreground">
            Manage your outreach email templates.
          </p>
        </div>
        <Button
          variant="outline"
          asChild
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
        >
          <a href="/email-hub">
            Manage Templates
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
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

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Gmail?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect your Gmail account from Job OS. You will no longer be able to send outreach emails or detect email responses automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
