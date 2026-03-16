"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import apiClient from "@/lib/api";
import type { User } from "@/types/database";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setOnboardingComplete: (complete: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasCompletedOnboarding: false,
  error: null,

  initialize: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const response = await apiClient.get<{ user: User }>("/api/v1/auth/me");
        const user = response.data.user;
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          hasCompletedOnboarding: user.has_completed_onboarding,
        });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const response = await apiClient.get<{ user: User }>("/api/v1/auth/me");
      const user = response.data.user;
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        hasCompletedOnboarding: user.has_completed_onboarding,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    }
  },

  signup: async (fullName: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding/step-1`,
        },
      });
      if (error) throw error;

      if (data.session) {
        const response = await apiClient.get<{ user: User }>("/api/v1/auth/me");
        const user = response.data.user;
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          hasCompletedOnboarding: false,
        });
      } else {
        // Email verification required
        set({ isLoading: false });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Signup failed",
      });
      throw error;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasCompletedOnboarding: false,
      error: null,
    });
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
      hasCompletedOnboarding: user?.has_completed_onboarding ?? false,
    });
  },

  setOnboardingComplete: (complete: boolean) => {
    const { user } = get();
    if (user) {
      set({
        user: { ...user, has_completed_onboarding: complete },
        hasCompletedOnboarding: complete,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
