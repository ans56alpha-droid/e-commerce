import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .min(1, "Coupon code is required")
    .max(50, "Code is too long")
    .toUpperCase(),
  description: z
    .string()
    .max(200, "Description is too long")
    .optional()
    .default(""),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z
    .number()
    .min(0, "Discount must be positive"),
  minOrderAmount: z
    .number()
    .min(0, "Must be positive")
    .optional()
    .default(0),
  maxDiscount: z
    .number()
    .min(0, "Must be positive")
    .optional()
    .default(0),
  usageLimit: z
    .number()
    .min(0, "Must be positive")
    .optional()
    .default(0),
  perUserLimit: z
    .number()
    .min(0, "Must be positive")
    .optional()
    .default(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isActive: z.boolean().optional().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;
