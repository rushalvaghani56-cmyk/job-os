"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/database";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
  setOnboardingComplete: (complete: boolean) => void;
}

const mockUser: User = {
  id: "user_01",
  email: "alex.chen@example.com",
  name: "Alex Chen",
  avatar_url: null,
  role: "user",
  has_completed_onboarding: true,
  timezone: "America/Los_Angeles",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-03-10T15:30:00Z",
  last_login_at: "2024-03-14T08:00:00Z",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasCompletedOnboarding: true,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        // Mock successful login
        const user: User = {
          ...mockUser,
          email,
          name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        };
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          hasCompletedOnboarding: user.has_completed_onboarding,
        });
      },

      signup: async (name: string, email: string, _password: string) => {
        set({ isLoading: true });
        
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Mock successful signup
        const user: User = {
          ...mockUser,
          id: `user_${Date.now()}`,
          email,
          name,
          has_completed_onboarding: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
        };
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          hasCompletedOnboarding: false,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      refreshToken: async () => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true });
        
        // Simulate token refresh
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        set({
          user: {
            ...user,
            last_login_at: new Date().toISOString(),
          },
          isLoading: false,
        });
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
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
