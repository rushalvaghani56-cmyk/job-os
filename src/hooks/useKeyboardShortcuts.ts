/**
 * useKeyboardShortcuts Hook
 * Global keyboard shortcuts for the application
 */

import { useEffect } from "react";
import { useCommandPaletteStore } from "@/src/stores/commandPaletteStore";
import { useCopilotStore } from "@/src/stores/copilotStore";
import { useUIStore } from "@/src/stores/uiStore";
import { useProfileStore } from "@/src/stores/profileStore";

interface ShortcutConfig {
  /** Enable command palette shortcut (Cmd+K) */
  commandPalette?: boolean;
  /** Enable copilot shortcut (Cmd+J) */
  copilot?: boolean;
  /** Enable sidebar shortcut (Cmd+/) */
  sidebar?: boolean;
  /** Enable profile switcher shortcut (Cmd+Shift+P) */
  profileSwitcher?: boolean;
  /** Enable escape to close */
  escape?: boolean;
}

const defaultConfig: ShortcutConfig = {
  commandPalette: true,
  copilot: true,
  sidebar: true,
  profileSwitcher: true,
  escape: true,
};

export function useKeyboardShortcuts(config: ShortcutConfig = defaultConfig) {
  const { toggle: toggleCommandPalette, isOpen: commandPaletteOpen, close: closeCommandPalette } =
    useCommandPaletteStore();
  const { toggleCopilot, isOpen: copilotOpen, setIsOpen: setCopilotOpen } = useCopilotStore();
  const { toggleSidebar } = useUIStore();
  const { profiles } = useProfileStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;

      // Cmd+K - Command Palette
      if (config.commandPalette && isMeta && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
      }

      // Cmd+J - Toggle Copilot
      if (config.copilot && isMeta && e.key === "j") {
        e.preventDefault();
        toggleCopilot();
      }

      // Cmd+/ - Toggle Sidebar
      if (config.sidebar && isMeta && e.key === "/") {
        e.preventDefault();
        toggleSidebar();
      }

      // Cmd+Shift+P - Profile Switcher
      if (config.profileSwitcher && isMeta && e.shiftKey && e.key === "P") {
        e.preventDefault();
        // Open command palette with profile filter
        toggleCommandPalette();
      }

      // Escape - Close modals/panels
      if (config.escape && e.key === "Escape") {
        if (commandPaletteOpen) {
          closeCommandPalette();
        } else if (copilotOpen) {
          setCopilotOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    config,
    toggleCommandPalette,
    toggleCopilot,
    toggleSidebar,
    commandPaletteOpen,
    copilotOpen,
    closeCommandPalette,
    setCopilotOpen,
    profiles,
  ]);
}
