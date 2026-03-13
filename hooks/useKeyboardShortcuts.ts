"use client";

import { useEffect, useCallback } from "react";
import { useCommandPaletteStore } from "@/stores/commandPaletteStore";
import { useCopilotStore } from "@/stores/copilotStore";
import { useUIStore } from "@/stores/uiStore";

interface ShortcutHandlers {
  onCommandPalette?: () => void;
  onToggleCopilot?: () => void;
  onToggleSidebar?: () => void;
  onProfileSwitcher?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(customHandlers?: ShortcutHandlers) {
  const { toggle: toggleCommandPalette, isOpen: isPaletteOpen, close: closePalette } = useCommandPaletteStore();
  const { toggleCopilot, isOpen: isCopilotOpen, setOpen: setCopilotOpen } = useCopilotStore();
  const { toggleSidebar, setProfileSwitcherOpen, profileSwitcherOpen } = useUIStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;
      const target = event.target as HTMLElement;
      
      // Don't trigger shortcuts when typing in inputs
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Escape - close modals/panels
      if (event.key === "Escape") {
        if (customHandlers?.onEscape) {
          customHandlers.onEscape();
          return;
        }
        if (isPaletteOpen) {
          closePalette();
          event.preventDefault();
          return;
        }
        if (profileSwitcherOpen) {
          setProfileSwitcherOpen(false);
          event.preventDefault();
          return;
        }
        if (isCopilotOpen) {
          setCopilotOpen(false);
          event.preventDefault();
          return;
        }
      }

      // Cmd+K - open command palette
      if (modifier && event.key === "k") {
        event.preventDefault();
        if (customHandlers?.onCommandPalette) {
          customHandlers.onCommandPalette();
        } else {
          toggleCommandPalette();
        }
        return;
      }

      // Cmd+J - toggle copilot
      if (modifier && event.key === "j" && !isInputFocused) {
        event.preventDefault();
        if (customHandlers?.onToggleCopilot) {
          customHandlers.onToggleCopilot();
        } else {
          toggleCopilot();
        }
        return;
      }

      // Cmd+/ - toggle sidebar
      if (modifier && event.key === "/" && !isInputFocused) {
        event.preventDefault();
        if (customHandlers?.onToggleSidebar) {
          customHandlers.onToggleSidebar();
        } else {
          toggleSidebar();
        }
        return;
      }

      // Cmd+Shift+P - open profile switcher
      if (modifier && event.shiftKey && event.key === "P") {
        event.preventDefault();
        if (customHandlers?.onProfileSwitcher) {
          customHandlers.onProfileSwitcher();
        } else {
          setProfileSwitcherOpen(true);
        }
        return;
      }
    },
    [
      customHandlers,
      isPaletteOpen,
      isCopilotOpen,
      profileSwitcherOpen,
      toggleCommandPalette,
      closePalette,
      toggleCopilot,
      setCopilotOpen,
      toggleSidebar,
      setProfileSwitcherOpen,
    ]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Hook for registering a single keyboard shortcut
 */
export function useShortcut(
  key: string,
  callback: () => void,
  options?: { modifier?: boolean; shift?: boolean; disabled?: boolean }
) {
  const { modifier = false, shift = false, disabled = false } = options || {};

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifierPressed = isMac ? event.metaKey : event.ctrlKey;

      if (modifier && !modifierPressed) return;
      if (shift && !event.shiftKey) return;
      if (event.key.toLowerCase() !== key.toLowerCase()) return;

      event.preventDefault();
      callback();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [key, callback, modifier, shift, disabled]);
}
