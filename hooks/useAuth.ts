"use client";

import { useAuthStore } from "@/stores/authStore";

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
    setOnboardingComplete,
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
    setOnboardingComplete,
  };
}
