"use client";

import { create } from "zustand";
import apiClient from "@/lib/api";
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

export const useProfileStore = create<ProfileState>()((set, get) => ({
  activeProfile: null,
  profiles: [],
  isLoading: false,
  isSwitching: false,

  switchProfile: async (profileId: string) => {
    const { profiles } = get();
    const targetProfile = profiles.find((p) => p.id === profileId);

    if (!targetProfile) return;

    set({ isSwitching: true });

    try {
      await apiClient.put(`/api/v1/profiles/${profileId}/activate`);

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
    } catch {
      set({ isSwitching: false });
    }
  },

  setProfiles: (profiles: ProfileListItem[]) => {
    const activeProfile = profiles.find((p) => p.is_active) || profiles[0] || null;
    set({ profiles, activeProfile });
  },

  setActiveProfile: (profile: ProfileListItem | null) => {
    set({ activeProfile: profile });
  },
}));
