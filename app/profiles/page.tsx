"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/profiles/profile-card";
import { ProfileComparison } from "@/components/profiles/profile-comparison";
import { mockProfiles, CandidateProfile } from "@/lib/profile-types";
import { Plus, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<CandidateProfile[]>(mockProfiles);
  const [comparisonOpen, setComparisonOpen] = useState(false);

  const handleEdit = (id: string) => {
    router.push(`/onboarding?profile=${id}`);
  };

  const handleClone = (id: string) => {
    const profile = profiles.find((p) => p.id === id);
    if (!profile) return;

    const clonedProfile: CandidateProfile = {
      ...profile,
      id: `${Date.now()}`,
      name: `${profile.name} (Copy)`,
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProfiles([...profiles, clonedProfile]);
  };

  const handleSwitch = (id: string) => {
    setProfiles(
      profiles.map((p) => ({
        ...p,
        isActive: p.id === id,
      }))
    );
  };

  const handleToggleActive = (id: string) => {
    setProfiles(
      profiles.map((p) => {
        if (p.id === id) {
          return { ...p, isActive: !p.isActive };
        }
        // If activating this profile, deactivate others
        if (profiles.find((profile) => profile.id === id)?.isActive === false) {
          return { ...p, isActive: false };
        }
        return p;
      })
    );
  };

  const handleDelete = (id: string) => {
    setProfiles(profiles.filter((p) => p.id !== id));
  };

  const handleCreateNew = () => {
    router.push("/onboarding");
  };

  // Sort profiles: active first, then by last active
  const sortedProfiles = [...profiles].sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Profiles</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your candidate profiles for different job searches
            </p>
          </div>
          <div className="flex gap-3">
            {profiles.length > 1 && (
              <Button
                variant="outline"
                onClick={() => setComparisonOpen(true)}
                className="gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Compare Profiles
              </Button>
            )}
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Create New Profile
            </Button>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProfiles.map((profile) => (
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
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No profiles yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first profile to start discovering job matches
            </p>
            <Button onClick={handleCreateNew} className="mt-6 gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Profile
            </Button>
          </div>
        )}

        {/* Comparison Dialog */}
        <ProfileComparison
          profiles={profiles}
          open={comparisonOpen}
          onOpenChange={setComparisonOpen}
        />
      </div>
    </div>
  );
}
