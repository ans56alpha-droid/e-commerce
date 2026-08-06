import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, "Please select a rating.").max(5),

  title: z.string().trim().max(100, "Title must be at most 100 characters."),

  comment: z
    .string()
    .trim()
    .min(1, "Please write a review.")
    .max(500, "Comment must be at most 500 characters."),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
