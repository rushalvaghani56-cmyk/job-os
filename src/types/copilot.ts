/**
 * Copilot Types
 * Types for the AI Copilot assistant in Job Application OS
 */

/** Message role in conversation */
export type CopilotRole = "user" | "assistant" | "system";

/** Action status */
export type ActionStatus = "pending" | "confirmed" | "cancelled" | "executing" | "completed" | "failed";

/** Copilot message */
export interface CopilotMessage {
  /** Unique identifier */
  id: string;
  /** Message role */
  role: CopilotRole;
  /** Message content */
  content: string;
  /** Timestamp */
  timestamp: string;
  /** Whether content is still streaming */
  is_streaming?: boolean;
  /** Associated action if any */
  action?: CopilotAction;
  /** Attached context */
  context?: CopilotContext;
}

/** Context attached to a message */
export interface CopilotContext {
  /** Type of context */
  type: "job" | "application" | "contact" | "profile" | "document";
  /** Context ID */
  id: string;
  /** Display title */
  title: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/** Action that can be executed by Copilot */
export interface CopilotAction {
  /** Unique identifier */
  id: string;
  /** Action type */
  type: CopilotActionType;
  /** Action title */
  title: string;
  /** Action description */
  description: string;
  /** Items involved in the action */
  items?: string[];
  /** Current status */
  status: ActionStatus;
  /** Result if completed */
  result?: {
    success: boolean;
    message: string;
    data?: unknown;
  };
  /** Requires confirmation */
  requires_confirmation: boolean;
  /** Estimated duration */
  estimated_duration?: string;
}

/** Types of actions Copilot can perform */
export type CopilotActionType =
  | "apply_to_jobs"
  | "generate_resume"
  | "generate_cover_letter"
  | "generate_outreach"
  | "score_jobs"
  | "run_discovery"
  | "schedule_follow_up"
  | "prepare_interview"
  | "analyze_job"
  | "compare_jobs"
  | "export_data"
  | "update_profile";

/** Proactive suggestion from Copilot */
export interface CopilotSuggestion {
  /** Unique identifier */
  id: string;
  /** Suggestion type */
  type: "insight" | "action" | "reminder" | "tip";
  /** Icon name */
  icon: string;
  /** Short text */
  text: string;
  /** Full action description */
  action_text: string;
  /** Priority (1 = highest) */
  priority: 1 | 2 | 3;
  /** Associated data */
  data?: Record<string, unknown>;
  /** When suggestion was created */
  created_at: string;
  /** Expiration time */
  expires_at?: string;
}

/** Slash command definition */
export interface SlashCommand {
  /** Command name (e.g., "/apply") */
  name: string;
  /** Command description */
  description: string;
  /** Icon name */
  icon: string;
  /** Required arguments */
  args?: Array<{
    name: string;
    type: "string" | "number" | "job_id" | "profile_id";
    required: boolean;
    description: string;
  }>;
  /** Example usage */
  example: string;
}

/** Copilot conversation state */
export interface CopilotState {
  /** Whether panel is open */
  is_open: boolean;
  /** Panel width */
  width: number;
  /** Conversation messages */
  messages: CopilotMessage[];
  /** Active suggestions */
  suggestions: CopilotSuggestion[];
  /** Whether AI is typing */
  is_typing: boolean;
  /** Current model */
  model: string;
  /** Conversation ID */
  conversation_id: string | null;
}

/** Copilot preferences */
export interface CopilotPreferences {
  /** Preferred response style */
  response_style: "concise" | "detailed" | "balanced";
  /** Auto-suggestions enabled */
  auto_suggestions: boolean;
  /** Proactive insights enabled */
  proactive_insights: boolean;
  /** Default model */
  default_model: string;
  /** Keyboard shortcut */
  keyboard_shortcut: string;
}
