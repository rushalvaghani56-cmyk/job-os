/**
 * Profile Store
 * Zustand store for user profile management
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileListItem } from "@/src/types/profiles";

interface ProfileState {
  /** Currently active profile */
  activeProfile: ProfileListItem | null;
  /** All user profiles */
  profiles: ProfileListItem[];
  /** Loading state */
  isLoading: boolean;
  /** Switch to a different profile */
  switchProfile: (profileId: string) => Promise<void>;
  /** Set profiles list */
  setProfiles: (profiles: ProfileListItem[]) => void;
  /** Set active profile */
  setActiveProfile: (profile: ProfileListItem | null) => void;
  /** Set loading state */
  setIsLoading: (isLoading: boolean) => void;
}

/** Mock profiles for development */
const mockProfiles: ProfileListItem[] = [
  {
    id: "profile_1",
    name: "Backend Engineer Search",
    target_role: "Senior Backend Engineer",
    is_active: true,
    completeness: 85,
    job_count: 45,
    application_count: 12,
    updated_at: new Date().toISOString(),
  },
  {
    id: "profile_2",
    name: "ML Engineer Search",
    target_role: "Machine Learning Engineer",
    is_active: false,
    completeness: 72,
    job_count: 28,
    application_count: 5,
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      activeProfile: mockProfiles[0],
      profiles: mockProfiles,
      isLoading: false,

      switchProfile: async (profileId: string) => {
        set({ isLoading: true });
        try {
          // Mock profile switch with delay
          await new Promise((resolve) => setTimeout(resolve, 400));

          const { profiles } = get();
          const newActiveProfile = profiles.find((p) => p.id === profileId);

          if (newActiveProfile) {
            const updatedProfiles = profiles.map((p) => ({
              ...p,
              is_active: p.id === profileId,
            }));

            set({
              activeProfile: { ...newActiveProfile, is_active: true },
              profiles: updatedProfiles,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      setProfiles: (profiles) => {
        const activeProfile = profiles.find((p) => p.is_active) || profiles[0] || null;
        set({ profiles, activeProfile });
      },

      setActiveProfile: (profile) => {
        set({ activeProfile: profile });
      },

      setIsLoading: (isLoading) => {
        set({ isLoading });
      },
    }),
    {
      name: "profile-storage",
      partialize: (state) => ({
        activeProfile: state.activeProfile,
        profiles: state.profiles,
      }),
    }
  )
);
