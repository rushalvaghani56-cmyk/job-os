/**
 * Auth Store
 * Zustand store for authentication state management
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/src/types/database";

interface AuthState {
  /** Currently authenticated user */
  user: User | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Loading state for auth operations */
  isLoading: boolean;
  /** Whether user has completed onboarding */
  hasCompletedOnboarding: boolean;
  /** Login with email and password */
  login: (email: string, password: string) => Promise<void>;
  /** Sign up with name, email, and password */
  signup: (name: string, email: string, password: string) => Promise<void>;
  /** Log out the current user */
  logout: () => void;
  /** Refresh the authentication token */
  refreshToken: () => Promise<void>;
  /** Set the current user */
  setUser: (user: User | null) => void;
  /** Set loading state */
  setIsLoading: (isLoading: boolean) => void;
}

/** Mock user for development */
const mockUser: User = {
  id: "user_1",
  email: "john@example.com",
  name: "John Doe",
  avatar_url: null,
  role: "user",
  plan: "pro",
  has_completed_onboarding: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  last_login_at: new Date().toISOString(),
  preferences: {
    theme: "system",
    email_notifications: true,
    weekly_digest: true,
    timezone: "America/Los_Angeles",
    language: "en",
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      hasCompletedOnboarding: true,

      login: async (email: string, _password: string) => {
        set({ isLoading: true });
        try {
          // Mock login with delay
          await new Promise((resolve) => setTimeout(resolve, 600));
          const user = { ...mockUser, email };
          set({
            user,
            isAuthenticated: true,
            hasCompletedOnboarding: user.has_completed_onboarding,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (name: string, email: string, _password: string) => {
        set({ isLoading: true });
        try {
          // Mock signup with delay
          await new Promise((resolve) => setTimeout(resolve, 600));
          const user: User = {
            ...mockUser,
            name,
            email,
            has_completed_onboarding: false,
          };
          set({
            user,
            isAuthenticated: true,
            hasCompletedOnboarding: false,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          hasCompletedOnboarding: false,
        });
      },

      refreshToken: async () => {
        const { user } = get();
        if (!user) return;

        // Mock token refresh
        await new Promise((resolve) => setTimeout(resolve, 200));
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          hasCompletedOnboarding: user?.has_completed_onboarding ?? false,
        });
      },

      setIsLoading: (isLoading) => {
        set({ isLoading });
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
