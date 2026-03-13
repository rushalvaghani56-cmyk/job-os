/**
 * Review Validators
 * Zod schemas for review queue actions
 */

import { z } from "zod";

/** Review type values */
const reviewTypeValues = ["resume", "cover_letter", "outreach", "answer", "email"] as const;

/** Quality level values */
const qualityLevelValues = ["excellent", "good", "needs_improvement", "poor"] as const;

/** Review approval schema */
export const approveReviewSchema = z.object({
  review_id: z.string().min(1, "Review ID is required"),
  feedback: z.string().max(1000, "Feedback is too long").optional(),
});

export type ApproveReviewInput = z.infer<typeof approveReviewSchema>;

/** Review rejection schema */
export const rejectReviewSchema = z.object({
  review_id: z.string().min(1, "Review ID is required"),
  reason: z.string().min(1, "Rejection reason is required").max(500, "Reason is too long"),
  regenerate: z.boolean().default(false),
  regeneration_instructions: z.string().max(1000, "Instructions are too long").optional(),
});

export type RejectReviewInput = z.infer<typeof rejectReviewSchema>;

/** Review regeneration schema */
export const regenerateReviewSchema = z.object({
  review_id: z.string().min(1, "Review ID is required"),
  instructions: z.string().min(1, "Instructions are required").max(1000, "Instructions are too long"),
  focus_areas: z.array(z.string()).default([]),
  tone: z.enum(["professional", "casual", "formal", "enthusiastic"]).optional(),
});

export type RegenerateReviewInput = z.infer<typeof regenerateReviewSchema>;

/** Review edit schema */
export const editReviewSchema = z.object({
  review_id: z.string().min(1, "Review ID is required"),
  content: z.string().min(1, "Content is required"),
  section_id: z.string().optional(),
});

export type EditReviewInput = z.infer<typeof editReviewSchema>;

/** Review filter schema */
export const reviewFilterSchema = z.object({
  type: z.array(z.enum(reviewTypeValues)).optional(),
  status: z.array(z.enum(["pending", "approved", "rejected", "regenerating"])).optional(),
  quality: z.array(z.enum(qualityLevelValues)).optional(),
  job_id: z.string().optional(),
  priority: z.array(z.union([z.literal(1), z.literal(2), z.literal(3)])).optional(),
  sort_by: z.enum(["created_at", "priority", "quality", "deadline"]).optional(),
  sort_direction: z.enum(["asc", "desc"]).optional(),
});

export type ReviewFilterInput = z.infer<typeof reviewFilterSchema>;

/** Bulk review action schema */
export const bulkReviewActionSchema = z.object({
  review_ids: z.array(z.string()).min(1, "Select at least one review"),
  action: z.enum(["approve", "reject", "regenerate"]),
  feedback: z.string().max(1000, "Feedback is too long").optional(),
  regeneration_instructions: z.string().max(1000, "Instructions are too long").optional(),
});

export type BulkReviewActionInput = z.infer<typeof bulkReviewActionSchema>;
