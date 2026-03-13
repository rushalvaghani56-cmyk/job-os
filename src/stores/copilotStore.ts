/**
 * Copilot Store
 * Zustand store for AI Copilot state management
 */

import { create } from "zustand";
import type { CopilotMessage, CopilotSuggestion } from "@/src/types/copilot";

interface CopilotState {
  /** Whether copilot panel is open */
  isOpen: boolean;
  /** Panel width in pixels */
  width: number;
  /** Conversation messages */
  messages: CopilotMessage[];
  /** Active suggestions */
  suggestions: CopilotSuggestion[];
  /** Whether AI is typing */
  isTyping: boolean;
  /** Current AI model */
  model: string;
  /** Toggle copilot panel */
  toggleCopilot: () => void;
  /** Set copilot open state */
  setIsOpen: (isOpen: boolean) => void;
  /** Set panel width */
  setWidth: (width: number) => void;
  /** Add a message */
  addMessage: (message: CopilotMessage) => void;
  /** Update a message */
  updateMessage: (id: string, updates: Partial<CopilotMessage>) => void;
  /** Clear all messages */
  clearMessages: () => void;
  /** Set suggestions */
  setSuggestions: (suggestions: CopilotSuggestion[]) => void;
  /** Remove a suggestion */
  removeSuggestion: (id: string) => void;
  /** Set typing state */
  setIsTyping: (isTyping: boolean) => void;
  /** Set AI model */
  setModel: (model: string) => void;
}

/** Initial welcome message */
const initialMessage: CopilotMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm your AI Copilot. I can help you with job search, resume tailoring, cover letters, and interview prep. How can I help you today?",
  timestamp: new Date().toISOString(),
};

/** Initial suggestions */
const initialSuggestions: CopilotSuggestion[] = [
  {
    id: "sug_1",
    type: "action",
    icon: "Briefcase",
    text: "3 jobs >85 unprocessed",
    action_text: "Generate resumes for 3 high-scoring jobs?",
    priority: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "sug_2",
    type: "insight",
    icon: "TrendingUp",
    text: "Fintech CLs get 2x responses",
    action_text: "Adjust your cover letter strategy for fintech?",
    priority: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "sug_3",
    type: "reminder",
    icon: "Bell",
    text: "Follow-up due for Stripe",
    action_text: "Draft follow-up for Sarah at Stripe?",
    priority: 2,
    created_at: new Date().toISOString(),
  },
];

export const useCopilotStore = create<CopilotState>((set) => ({
  isOpen: false,
  width: 380,
  messages: [initialMessage],
  suggestions: initialSuggestions,
  isTyping: false,
  model: "Claude Sonnet",

  toggleCopilot: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  setIsOpen: (isOpen) => {
    set({ isOpen });
  },

  setWidth: (width) => {
    // Clamp width between 320 and 600
    const clampedWidth = Math.min(Math.max(width, 320), 600);
    set({ width: clampedWidth });
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    }));
  },

  clearMessages: () => {
    set({ messages: [initialMessage] });
  },

  setSuggestions: (suggestions) => {
    set({ suggestions });
  },

  removeSuggestion: (id) => {
    set((state) => ({
      suggestions: state.suggestions.filter((s) => s.id !== id),
    }));
  },

  setIsTyping: (isTyping) => {
    set({ isTyping });
  },

  setModel: (model) => {
    set({ model });
  },
}));
