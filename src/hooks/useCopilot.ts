/**
 * useCopilot Hook
 * Custom hook for AI Copilot functionality
 */

import { useCallback } from "react";
import { useCopilotStore } from "@/src/stores/copilotStore";
import type { CopilotMessage } from "@/src/types/copilot";

export function useCopilot() {
  const {
    isOpen,
    width,
    messages,
    suggestions,
    isTyping,
    model,
    toggleCopilot,
    setIsOpen,
    setWidth,
    addMessage,
    updateMessage,
    clearMessages,
    setSuggestions,
    removeSuggestion,
    setIsTyping,
    setModel,
  } = useCopilotStore();

  const sendMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: CopilotMessage = {
        id: `msg_${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };
      addMessage(userMessage);

      // Simulate AI response
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const aiMessage: CopilotMessage = {
        id: `msg_${Date.now()}_ai`,
        role: "assistant",
        content: `I understand you're asking about: "${content}". Let me help you with that. Based on your current job search data, I can provide some insights and recommendations.`,
        timestamp: new Date().toISOString(),
      };
      addMessage(aiMessage);
      setIsTyping(false);
    },
    [addMessage, setIsTyping]
  );

  return {
    isOpen,
    width,
    messages,
    suggestions,
    isTyping,
    model,
    toggleCopilot,
    setIsOpen,
    setWidth,
    sendMessage,
    updateMessage,
    clearMessages,
    setSuggestions,
    removeSuggestion,
    setModel,
  };
}
