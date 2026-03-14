"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CopilotMessage, CopilotSuggestion, CopilotContext } from "@/types/copilot";

interface CopilotState {
  isOpen: boolean;
  width: number;
  messages: CopilotMessage[];
  suggestions: CopilotSuggestion[];
  isStreaming: boolean;
  context: CopilotContext | null;
  toggleCopilot: () => void;
  setOpen: (open: boolean) => void;
  setWidth: (width: number) => void;
  addMessage: (message: CopilotMessage) => void;
  updateMessage: (id: string, content: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  clearMessages: () => void;
  setContext: (context: CopilotContext | null) => void;
  addSuggestion: (suggestion: CopilotSuggestion) => void;
  dismissSuggestion: (id: string) => void;
  clearSuggestions: () => void;
}

const initialSuggestions: CopilotSuggestion[] = [
  {
    id: "sug_01",
    title: "Review pending content",
    description: "You have 5 items waiting for review in your queue",
    type: "action",
    priority: "high",
    action: {
      type: "navigate",
      label: "Go to Review Queue",
      data: { path: "/review" },
    },
    dismissable: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "sug_02",
    title: "New jobs match your profile",
    description: "12 new jobs discovered today with 80%+ match scores",
    type: "insight",
    priority: "medium",
    action: {
      type: "navigate",
      label: "View Jobs",
      data: { path: "/jobs?filter=new" },
    },
    dismissable: true,
    created_at: new Date().toISOString(),
  },
];

export const useCopilotStore = create<CopilotState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      width: 380,
      messages: [],
      suggestions: initialSuggestions,
      isStreaming: false,
      context: null,

      toggleCopilot: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setOpen: (open: boolean) => {
        set({ isOpen: open });
      },

      setWidth: (width: number) => {
        // Clamp width between min and max
        const clampedWidth = Math.min(Math.max(width, 320), 600);
        set({ width: clampedWidth });
      },

      addMessage: (message: CopilotMessage) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      },

      updateMessage: (id: string, content: string) => {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, content, isStreaming: false } : m
          ),
        }));
      },

      setStreaming: (isStreaming: boolean) => {
        set({ isStreaming });
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      setContext: (context: CopilotContext | null) => {
        set({ context });
      },

      addSuggestion: (suggestion: CopilotSuggestion) => {
        set((state) => ({
          suggestions: [suggestion, ...state.suggestions].slice(0, 5),
        }));
      },

      dismissSuggestion: (id: string) => {
        set((state) => ({
          suggestions: state.suggestions.filter((s) => s.id !== id),
        }));
      },

      clearSuggestions: () => {
        set({ suggestions: [] });
      },
    }),
    {
      name: "copilot-storage",
      partialize: (state) => ({
        width: state.width,
        messages: state.messages.slice(-50), // Keep last 50 messages
      }),
    }
  )
);
