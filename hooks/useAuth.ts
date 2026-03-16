"use client";

import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    hasCompletedOnboarding,
    error,
    initialize,
    login,
    signup,
    logout,
    setUser,
    setOnboardingComplete,
    clearError,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    hasCompletedOnboarding,
    error,
    initialize,
    login,
    signup,
    logout,
    setUser,
    setOnboardingComplete,
    clearError,
  };
}
