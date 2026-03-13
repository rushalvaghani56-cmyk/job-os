"use client";

import { create } from "zustand";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  action: () => void;
  category: "navigation" | "action" | "profile" | "recent";
}

interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  results: CommandItem[];
  allCommands: CommandItem[];
  recentCommands: string[];
  selectedIndex: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (query: string) => void;
  setResults: (results: CommandItem[]) => void;
  setCommands: (commands: CommandItem[]) => void;
  addToRecent: (commandId: string) => void;
  setSelectedIndex: (index: number) => void;
  executeSelected: () => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>((set, get) => ({
  isOpen: false,
  query: "",
  results: [],
  allCommands: [],
  recentCommands: [],
  selectedIndex: 0,

  open: () => {
    set({ isOpen: true, query: "", selectedIndex: 0 });
    // Show all commands when first opened
    const { allCommands } = get();
    set({ results: allCommands });
  },

  close: () => {
    set({ isOpen: false, query: "", selectedIndex: 0 });
  },

  toggle: () => {
    const { isOpen } = get();
    if (isOpen) {
      get().close();
    } else {
      get().open();
    }
  },

  setQuery: (query: string) => {
    const { allCommands } = get();
    
    if (!query.trim()) {
      set({ query, results: allCommands, selectedIndex: 0 });
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = allCommands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(lowerQuery) ||
        cmd.description?.toLowerCase().includes(lowerQuery) ||
        cmd.category.toLowerCase().includes(lowerQuery)
    );
    
    set({ query, results: filtered, selectedIndex: 0 });
  },

  setResults: (results: CommandItem[]) => {
    set({ results });
  },

  setCommands: (commands: CommandItem[]) => {
    set({ allCommands: commands, results: commands });
  },

  addToRecent: (commandId: string) => {
    set((state) => ({
      recentCommands: [
        commandId,
        ...state.recentCommands.filter((id) => id !== commandId),
      ].slice(0, 5),
    }));
  },

  setSelectedIndex: (index: number) => {
    const { results } = get();
    const maxIndex = results.length - 1;
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    set({ selectedIndex: newIndex });
  },

  executeSelected: () => {
    const { results, selectedIndex } = get();
    const selected = results[selectedIndex];
    if (selected) {
      get().addToRecent(selected.id);
      selected.action();
      get().close();
    }
  },
}));
