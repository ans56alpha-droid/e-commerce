"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { connectDB } from "@/db";
import { registerSchema } from "@/lib/validations/auth";
import { AuthActionState } from "@/types/auth";
import { createUser, findUserByEmail } from "@/services/user";

export async function register(values: unknown): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await connectDB();

    const existingUser = await findUserByEmail(parsed.data.email)

    if (existingUser) {
      return {
        success: false,
        errors: {
          email: ["An account with this email already exists."],
        },
      };
    }

    const user = await createUser(parsed.data);
    console.log("user", user);

    await autoLogin(parsed.data.email, parsed.data.password);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

async function autoLogin(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    // Registration already succeeded; a failed session is non-fatal.
    if (error instanceof AuthError) {
      return;
    }

    throw error;
  }
}
