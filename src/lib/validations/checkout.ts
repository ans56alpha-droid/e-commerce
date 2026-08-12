import { z } from "zod";

export const checkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your full name.")
    .max(100, "Name must be at most 100 characters."),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(200, "Email must be at most 200 characters."),

  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number.")
    .max(30, "Phone number must be at most 30 characters."),

  address: z
    .string()
    .trim()
    .min(1, "Please enter your street address.")
    .max(300, "Address must be at most 300 characters."),

  city: z
    .string()
    .trim()
    .min(1, "Please enter your city.")
    .max(100, "City must be at most 100 characters."),

  state: z
    .string()
    .trim()
    .min(1, "Please enter your state or province.")
    .max(100, "State must be at most 100 characters."),

  postalCode: z
    .string()
    .trim()
    .min(1, "Please enter your postal code.")
    .max(20, "Postal code must be at most 20 characters."),

  country: z
    .string()
    .trim()
    .min(1, "Please select your country.")
    .max(100, "Country must be at most 100 characters."),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
