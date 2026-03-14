"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProfileListItem } from "@/types/profiles";

interface ProfileState {
  activeProfile: ProfileListItem | null;
  profiles: ProfileListItem[];
  isLoading: boolean;
  isSwitching: boolean;
  switchProfile: (profileId: string) => Promise<void>;
  setProfiles: (profiles: ProfileListItem[]) => void;
  setActiveProfile: (profile: ProfileListItem | null) => void;
}

const mockProfiles: ProfileListItem[] = [
  {
    id: "profile_01",
    name: "Backend Engineer Search",
    target_role: "Senior Backend Engineer",
    is_active: true,
    completeness: 92,
    updated_at: "2024-03-14T10:00:00Z",
  },
  {
    id: "profile_02",
    name: "ML Engineer Search",
    target_role: "Machine Learning Engineer",
    is_active: false,
    completeness: 78,
    updated_at: "2024-03-10T15:30:00Z",
  },
];

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      activeProfile: mockProfiles[0],
      profiles: mockProfiles,
      isLoading: false,
      isSwitching: false,

      switchProfile: async (profileId: string) => {
        const { profiles } = get();
        const targetProfile = profiles.find((p) => p.id === profileId);
        
        if (!targetProfile) return;
        
        set({ isSwitching: true });
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 400));
        
        // Update profiles with new active state
        const updatedProfiles = profiles.map((p) => ({
          ...p,
          is_active: p.id === profileId,
        }));
        
        set({
          activeProfile: { ...targetProfile, is_active: true },
          profiles: updatedProfiles,
          isSwitching: false,
        });
      },

      setProfiles: (profiles: ProfileListItem[]) => {
        const activeProfile = profiles.find((p) => p.is_active) || profiles[0] || null;
        set({ profiles, activeProfile });
      },

      setActiveProfile: (profile: ProfileListItem | null) => {
        set({ activeProfile: profile });
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
