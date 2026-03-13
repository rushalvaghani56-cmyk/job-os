/**
 * Command Palette Store
 * Zustand store for command palette state
 */

import { create } from "zustand";

interface CommandResult {
  id: string;
  type: "page" | "action" | "profile" | "job" | "application";
  title: string;
  description?: string;
  icon?: string;
  href?: string;
  action?: () => void;
}

interface CommandPaletteState {
  /** Whether command palette is open */
  isOpen: boolean;
  /** Current search query */
  query: string;
  /** Search results */
  results: CommandResult[];
  /** Selected result index */
  selectedIndex: number;
  /** Open command palette */
  open: () => void;
  /** Close command palette */
  close: () => void;
  /** Toggle command palette */
  toggle: () => void;
  /** Set search query */
  setQuery: (query: string) => void;
  /** Set results */
  setResults: (results: CommandResult[]) => void;
  /** Set selected index */
  setSelectedIndex: (index: number) => void;
  /** Move selection up */
  moveSelectionUp: () => void;
  /** Move selection down */
  moveSelectionDown: () => void;
  /** Execute selected result */
  executeSelected: () => void;
}

export const useCommandPaletteStore = create<CommandPaletteState>((set, get) => ({
  isOpen: false,
  query: "",
  results: [],
  selectedIndex: 0,

  open: () => {
    set({ isOpen: true, query: "", selectedIndex: 0 });
  },

  close: () => {
    set({ isOpen: false, query: "", selectedIndex: 0 });
  },

  toggle: () => {
    set((state) => ({
      isOpen: !state.isOpen,
      query: state.isOpen ? "" : state.query,
      selectedIndex: 0,
    }));
  },

  setQuery: (query) => {
    set({ query, selectedIndex: 0 });
  },

  setResults: (results) => {
    set({ results });
  },

  setSelectedIndex: (index) => {
    set({ selectedIndex: index });
  },

  moveSelectionUp: () => {
    const { selectedIndex, results } = get();
    if (selectedIndex > 0) {
      set({ selectedIndex: selectedIndex - 1 });
    } else {
      set({ selectedIndex: results.length - 1 });
    }
  },

  moveSelectionDown: () => {
    const { selectedIndex, results } = get();
    if (selectedIndex < results.length - 1) {
      set({ selectedIndex: selectedIndex + 1 });
    } else {
      set({ selectedIndex: 0 });
    }
  },

  executeSelected: () => {
    const { results, selectedIndex } = get();
    const selected = results[selectedIndex];
    if (selected?.action) {
      selected.action();
    }
    set({ isOpen: false, query: "", selectedIndex: 0 });
  },
}));
