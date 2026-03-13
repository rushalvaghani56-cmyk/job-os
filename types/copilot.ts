/**
 * Copilot message role
 */
export type CopilotRole = "user" | "assistant" | "system";

/**
 * Copilot message
 */
export interface CopilotMessage {
  /** Unique message ID */
  id: string;
  /** Message role */
  role: CopilotRole;
  /** Message content */
  content: string;
  /** Timestamp */
  timestamp: string;
  /** Associated context (job ID, etc.) */
  context?: CopilotContext;
  /** Actions suggested/taken */
  actions?: CopilotAction[];
  /** Is streaming */
  isStreaming?: boolean;
}

/**
 * Context for copilot message
 */
export interface CopilotContext {
  /** Current page/route */
  page?: string;
  /** Selected job ID */
  job_id?: string;
  /** Selected application ID */
  application_id?: string;
  /** Selected contact ID */
  contact_id?: string;
  /** Selected profile ID */
  profile_id?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Copilot action
 */
export interface CopilotAction {
  /** Action type */
  type: CopilotActionType;
  /** Action label */
  label: string;
  /** Action data */
  data?: Record<string, unknown>;
  /** Whether action was executed */
  executed?: boolean;
  /** Execution result */
  result?: string;
}

/**
 * Types of actions copilot can perform
 */
export type CopilotActionType =
  | "navigate"
  | "generate_resume"
  | "generate_cover_letter"
  | "generate_outreach"
  | "score_job"
  | "apply_job"
  | "schedule_interview"
  | "create_follow_up"
  | "analyze_rejection"
  | "compare_offers"
  | "suggest_improvements";

/**
 * Copilot suggestion (proactive insight)
 */
export interface CopilotSuggestion {
  /** Unique ID */
  id: string;
  /** Suggestion title */
  title: string;
  /** Suggestion description */
  description: string;
  /** Suggestion type */
  type: "insight" | "action" | "reminder" | "tip";
  /** Priority */
  priority: "high" | "medium" | "low";
  /** Associated action */
  action?: CopilotAction;
  /** Dismissable */
  dismissable: boolean;
  /** Created timestamp */
  created_at: string;
  /** Expires at */
  expires_at?: string;
}

/**
 * Slash command
 */
export interface SlashCommand {
  /** Command trigger (e.g., "/apply") */
  command: string;
  /** Command description */
  description: string;
  /** Required arguments */
  args?: Array<{
    name: string;
    description: string;
    required: boolean;
  }>;
  /** Example usage */
  example: string;
}

/**
 * Available slash commands
 */
export const SLASH_COMMANDS: SlashCommand[] = [
  {
    command: "/apply",
    description: "Generate application materials for a job",
    args: [{ name: "job_id", description: "Job to apply for", required: false }],
    example: "/apply",
  },
  {
    command: "/generate",
    description: "Generate content (resume, cover letter, outreach)",
    args: [{ name: "type", description: "Type of content to generate", required: true }],
    example: "/generate cover_letter",
  },
  {
    command: "/score",
    description: "Score a job against your profile",
    args: [{ name: "job_id", description: "Job to score", required: false }],
    example: "/score",
  },
  {
    command: "/summarize",
    description: "Summarize a job posting or company",
    args: [{ name: "target", description: "What to summarize", required: false }],
    example: "/summarize",
  },
  {
    command: "/compare",
    description: "Compare multiple jobs or offers",
    args: [{ name: "job_ids", description: "Jobs to compare", required: true }],
    example: "/compare job1,job2",
  },
];

/**
 * Copilot settings
 */
export interface CopilotSettings {
  /** Preferred AI model */
  model: string;
  /** Temperature for generation */
  temperature: number;
  /** Show proactive suggestions */
  show_suggestions: boolean;
  /** Suggestion frequency */
  suggestion_frequency: "high" | "medium" | "low" | "off";
  /** Auto-expand on relevant pages */
  auto_expand: boolean;
  /** Voice input enabled */
  voice_input: boolean;
}
