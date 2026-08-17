import { z } from "zod";

export const returnRequestSchema = z.object({
  orderId: z
    .string()
    .min(1, "Order ID is required"),
  reason: z
    .string()
    .min(10, "Please provide a reason (at least 10 characters)")
    .max(500, "Reason is too long"),
});

export type ReturnRequestInput = z.infer<
  typeof returnRequestSchema
>;
