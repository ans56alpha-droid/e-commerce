import { z } from "zod";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format.");

export const initiatePaymentSchema = z.object({
  orderId: objectIdSchema,
});

export const jazzCashResponseSchema = z.object({
  pp_SecureHash: z.string().min(1, "Secure hash is required."),

  pp_TxnRefNo: z.string().min(1, "Transaction reference is required."),

  pp_ResponseCode: z.string().min(1, "Response code is required."),

  pp_ResponseMessage: z.string().optional().default(""),

  pp_Amount: z.string().min(1, "Payment amount is required."),

  pp_RetrievalReferenceNo: z.string().optional().default(""),

  pp_AuthCode: z.string().optional().default(""),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
