/**
 * UI Store
 * Zustand store for UI state management
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  /** Whether sidebar is collapsed */
  sidebarCollapsed: boolean;
  /** Current theme */
  theme: "light" | "dark" | "system";
  /** Mobile menu open state */
  mobileMenuOpen: boolean;
  /** Toggle sidebar collapsed state */
  toggleSidebar: () => void;
  /** Set sidebar collapsed state */
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** Set theme */
  setTheme: (theme: "light" | "dark" | "system") => void;
  /** Set mobile menu open state */
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: "system",
      mobileMenuOpen: false,

      toggleSidebar: () => {
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      setMobileMenuOpen: (open) => {
        set({ mobileMenuOpen: open });
      },
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
      }),
    }
  )
);
