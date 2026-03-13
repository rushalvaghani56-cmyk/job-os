"use client";

import { useProfileStore } from "@/stores/profileStore";

export function useProfile() {
  const {
    activeProfile,
    profiles,
    isLoading,
    isSwitching,
    switchProfile,
    setProfiles,
    setActiveProfile,
  } = useProfileStore();

  return {
    activeProfile,
    profiles,
    isLoading,
    isSwitching,
    switchProfile,
    setProfiles,
    setActiveProfile,
  };
}
