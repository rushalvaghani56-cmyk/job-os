"use client"

import { useState } from "react"
import { Plus, GitCompare, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProfileCard } from "@/components/profiles/profile-card"
import { ProfileComparison } from "@/components/profiles/profile-comparison"
import { mockProfiles, type CandidateProfile } from "@/lib/profile-types"
import { toast } from "sonner"

// Use only 3 profiles per spec
const initialProfiles = mockProfiles.slice(0, 3)

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<CandidateProfile[]>(initialProfiles)
  const [comparisonOpen, setComparisonOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  
  // Create profile form state
  const [newProfileName, setNewProfileName] = useState("")
  const [newTargetRole, setNewTargetRole] = useState("")
  const [cloneFromId, setCloneFromId] = useState<string | null>(null)
  const [cloneOptions, setCloneOptions] = useState({
    skills: true,
    experience: true,
    settings: false,
    keywords: true,
  })

  const handleEdit = (id: string) => {
    toast.info("Opening profile editor...")
  }

  const handleClone = (id: string) => {
    const profileToClone = profiles.find((p) => p.id === id)
    if (profileToClone) {
      const clonedProfile: CandidateProfile = {
        ...profileToClone,
        id: `${Date.now()}`,
        name: `${profileToClone.name} (Copy)`,
        isActive: false,
        stats: {
          jobsFound: 0,
          applications: 0,
          interviews: 0,
          responses: 0,
          lastActive: "Just now",
        },
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }
      setProfiles([...profiles, clonedProfile])
      toast.success("Profile cloned successfully")
    }
  }

  const handleSwitch = (id: string) => {
    setProfiles(
      profiles.map((p) => ({
        ...p,
        isActive: p.id === id,
      }))
    )
    toast.success("Switched to profile")
  }

  const handleToggleActive = (id: string) => {
    setProfiles(
      profiles.map((p) =>
        p.id === id ? { ...p, isActive: !p.isActive } : p
      )
    )
  }

  const handleDelete = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id))
    toast.success("Profile deleted")
  }

  const handleExport = (id: string) => {
    toast.success("Profile exported as JSON")
  }

  const handleCreateProfile = () => {
    if (!newProfileName.trim() || !newTargetRole.trim()) return

    const cloneSource = cloneFromId ? profiles.find((p) => p.id === cloneFromId) : null

    const newProfile: CandidateProfile = {
      id: `${Date.now()}`,
      name: newProfileName,
      targetRole: newTargetRole,
      seniority: cloneSource?.seniority || "Mid-Level",
      isActive: false,
      stats: {
        jobsFound: 0,
        applications: 0,
        interviews: 0,
        responses: 0,
        lastActive: "Just now",
      },
      completeness: cloneSource && cloneOptions.skills
        ? { ...cloneSource.completeness }
        : {
            percentage: 25,
            missingItems: [
              { label: "Add skills", boost: 15 },
              { label: "Add experience", boost: 20 },
              { label: "Add education", boost: 10 },
            ],
          },
      marketFitScore: cloneSource ? Math.round(cloneSource.marketFitScore * 0.7) : 35,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    setProfiles([...profiles, newProfile])
    setCreateDialogOpen(false)
    setNewProfileName("")
    setNewTargetRole("")
    setCloneFromId(null)
    setCloneOptions({ skills: true, experience: true, settings: false, keywords: true })
    toast.success("Profile created successfully")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">Profiles</h1>
        <div className="flex items-center gap-3">
          {profiles.length > 1 && (
            <Button
              variant="outline"
              onClick={() => setComparisonOpen(true)}
              className="gap-2 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <GitCompare className="h-4 w-4" />
              <span className="hidden sm:inline">Compare</span>
            </Button>
          )}
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="gap-2 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus className="h-4 w-4" />
            Create New Profile
          </Button>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            onEdit={handleEdit}
            onClone={handleClone}
            onSwitch={handleSwitch}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Empty State */}
      {profiles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No profiles yet</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Create your first candidate profile to start discovering jobs tailored to your career goals.
          </p>
          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Your First Profile
          </Button>
        </div>
      )}

      {/* Profile Comparison Dialog */}
      <ProfileComparison
        profiles={profiles}
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
      />

      {/* Create Profile Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Set up a new candidate profile for your job search.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profileName">Profile Name</Label>
              <Input
                id="profileName"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="e.g., Backend Engineer Search"
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role</Label>
              <Input
                id="targetRole"
                value={newTargetRole}
                onChange={(e) => setNewTargetRole(e.target.value)}
                placeholder="e.g., Senior Backend Engineer"
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {profiles.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="cloneFrom">Clone from existing profile (optional)</Label>
                  <Select
                    value={cloneFromId || "none"}
                    onValueChange={(value) => setCloneFromId(value === "none" ? null : value)}
                  >
                    <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary">
                      <SelectValue placeholder="Start from scratch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Start from scratch</SelectItem>
                      {profiles.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {cloneFromId && (
                  <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
                    <Label className="text-xs text-muted-foreground">Copy from source profile:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cloneSkills"
                          checked={cloneOptions.skills}
                          onCheckedChange={(checked) =>
                            setCloneOptions({ ...cloneOptions, skills: !!checked })
                          }
                        />
                        <Label htmlFor="cloneSkills" className="text-sm font-normal">
                          Skills
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cloneExperience"
                          checked={cloneOptions.experience}
                          onCheckedChange={(checked) =>
                            setCloneOptions({ ...cloneOptions, experience: !!checked })
                          }
                        />
                        <Label htmlFor="cloneExperience" className="text-sm font-normal">
                          Experience
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cloneSettings"
                          checked={cloneOptions.settings}
                          onCheckedChange={(checked) =>
                            setCloneOptions({ ...cloneOptions, settings: !!checked })
                          }
                        />
                        <Label htmlFor="cloneSettings" className="text-sm font-normal">
                          Settings
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cloneKeywords"
                          checked={cloneOptions.keywords}
                          onCheckedChange={(checked) =>
                            setCloneOptions({ ...cloneOptions, keywords: !!checked })
                          }
                        />
                        <Label htmlFor="cloneKeywords" className="text-sm font-normal">
                          Keywords
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProfile}
              disabled={!newProfileName.trim() || !newTargetRole.trim()}
              className="rounded-lg"
            >
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
