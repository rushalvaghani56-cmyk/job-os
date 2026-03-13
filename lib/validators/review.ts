import { z } from "zod";

export const reviewTypeSchema = z.enum([
  "resume",
  "cover_letter",
  "outreach",
  "answer",
  "email",
]);

export const approvalSchema = z.object({
  item_id: z.string().min(1, "Item ID is required"),
  notes: z.string().optional(),
});

export type ApprovalFormData = z.infer<typeof approvalSchema>;

export const rejectionSchema = z.object({
  item_id: z.string().min(1, "Item ID is required"),
  reason: z.string().min(1, "Rejection reason is required"),
  feedback: z.string().optional(),
});

export type RejectionFormData = z.infer<typeof rejectionSchema>;

export const regenerationSchema = z.object({
  item_id: z.string().min(1, "Item ID is required"),
  feedback: z.string().min(1, "Feedback is required"),
  focus_areas: z
    .array(z.enum(["tone", "length", "keywords", "specificity", "creativity"]))
    .min(1, "Select at least one focus area"),
});

export type RegenerationFormData = z.infer<typeof regenerationSchema>;

export const editContentSchema = z.object({
  item_id: z.string().min(1, "Item ID is required"),
  content: z.string().min(1, "Content is required"),
});

export type EditContentFormData = z.infer<typeof editContentSchema>;

export const batchReviewSchema = z.object({
  item_ids: z.array(z.string()).min(1, "Select at least one item"),
  action: z.enum(["approve", "reject"]),
  notes: z.string().optional(),
});

export type BatchReviewFormData = z.infer<typeof batchReviewSchema>;

export const reviewFilterSchema = z.object({
  type: z.array(reviewTypeSchema).optional(),
  status: z.array(z.enum(["pending", "approved", "rejected", "regenerating"])).optional(),
  priority: z.array(z.enum(["high", "medium", "low"])).optional(),
  min_quality_score: z.number().min(0).max(100).optional(),
  sort_by: z.enum(["created_at", "quality_score", "priority", "due_date"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
});

export type ReviewFilterFormData = z.infer<typeof reviewFilterSchema>;
