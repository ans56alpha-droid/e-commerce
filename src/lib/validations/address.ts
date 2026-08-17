import { z } from "zod";

export const addressSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(30, "Phone is too long"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(300, "Address is too long"),
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City is too long"),
  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State is too long"),
  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .max(20, "Postal code is too long"),
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country is too long"),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;
