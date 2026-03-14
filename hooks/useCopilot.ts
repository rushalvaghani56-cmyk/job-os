"use client";

import { useCallback } from "react";
import { useCopilotStore } from "@/stores/copilotStore";
import type { CopilotMessage, CopilotContext } from "@/types/copilot";

export function useCopilot() {
  const {
    isOpen,
    width,
    messages,
    suggestions,
    isStreaming,
    context,
    toggleCopilot,
    setOpen,
    setWidth,
    addMessage,
    updateMessage,
    setStreaming,
    clearMessages,
    setContext,
    addSuggestion,
    dismissSuggestion,
    clearSuggestions,
  } = useCopilotStore();

  const sendMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: CopilotMessage = {
        id: `msg_${Date.now()}_user`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
        context,
      };
      addMessage(userMessage);

      // Create placeholder for AI response
      const aiMessageId = `msg_${Date.now()}_ai`;
      const aiMessage: CopilotMessage = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        isStreaming: true,
      };
      addMessage(aiMessage);
      setStreaming(true);

      // Simulate streaming response
      const responses = [
        "I'd be happy to help you with that! ",
        "Let me analyze the information you've provided. ",
        "Based on your profile and the job requirements, ",
        "here are my recommendations:\n\n",
        "1. **Highlight your relevant experience** - Your backend development skills align well with this role.\n\n",
        "2. **Customize your resume** - Focus on the technologies mentioned in the job posting.\n\n",
        "3. **Consider reaching out** - I noticed you have a connection at this company.",
      ];

      let fullContent = "";
      for (const chunk of responses) {
        await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 150));
        fullContent += chunk;
        updateMessage(aiMessageId, fullContent);
      }

      setStreaming(false);
    },
    [context, addMessage, updateMessage, setStreaming]
  );

  return {
    isOpen,
    width,
    messages,
    suggestions,
    isStreaming,
    context,
    toggleCopilot,
    setOpen,
    setWidth,
    sendMessage,
    clearMessages,
    setContext,
    addSuggestion,
    dismissSuggestion,
    clearSuggestions,
  };
}
