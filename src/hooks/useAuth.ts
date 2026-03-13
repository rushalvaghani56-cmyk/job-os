/**
 * useAuth Hook
 * Custom hook for authentication functionality
 */

import { useAuthStore } from "@/src/stores/authStore";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasCompletedOnboarding,
    login,
    signup,
    logout,
    refreshToken,
    setUser,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    hasCompletedOnboarding,
    login,
    signup,
    logout,
    refreshToken,
    setUser,
  };
}
