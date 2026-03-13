/**
 * useProfile Hook
 * Custom hook for profile management functionality
 */

import { useProfileStore } from "@/src/stores/profileStore";

export function useProfile() {
  const {
    activeProfile,
    profiles,
    isLoading,
    switchProfile,
    setProfiles,
    setActiveProfile,
  } = useProfileStore();

  return {
    activeProfile,
    profiles,
    isLoading,
    switchProfile,
    setProfiles,
    setActiveProfile,
  };
}
