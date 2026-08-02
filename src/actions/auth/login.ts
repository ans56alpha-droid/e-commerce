"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/lib/validations/auth";
import type { AuthActionState } from "@/types/auth";
import { AuthError } from "next-auth";

export async function login(
  values: unknown
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Login successful.",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    throw error;
  }
}