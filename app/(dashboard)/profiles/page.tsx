"use client"

import { useState } from "react"
import { Plus, GitCompare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileCard } from "@/components/profiles/profile-card"
import { ProfileComparison } from "@/components/profiles/profile-comparison"
import { mockProfiles, type CandidateProfile } from "@/lib/profile-types"

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<CandidateProfile[]>(mockProfiles)
  const [comparisonOpen, setComparisonOpen] = useState(false)

  const handleEdit = (id: string) => {
    // Navigate to edit page or open edit dialog
    console.log("Edit profile:", id)
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
    }
  }

  const handleSwitch = (id: string) => {
    setProfiles(
      profiles.map((p) => ({
        ...p,
        isActive: p.id === id,
      }))
    )
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
  }

  const handleCreateNew = () => {
    // Navigate to create page or open create dialog
    console.log("Create new profile")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Profiles</h1>
        <div className="flex items-center gap-3">
          {profiles.length > 1 && (
            <Button
              variant="outline"
              onClick={() => setComparisonOpen(true)}
              className="gap-2 focus-visible:ring-2 focus-visible:ring-primary"
            >
              <GitCompare className="h-4 w-4" />
              Compare Profiles
            </Button>
          )}
          <Button
            onClick={handleCreateNew}
            className="gap-2 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Plus className="h-4 w-4" />
            Create New Profile
          </Button>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
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
          <Button onClick={handleCreateNew} className="gap-2">
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
    </div>
  )
}
