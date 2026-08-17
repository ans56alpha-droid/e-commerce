"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { UserModel } from "@/models/User";
import { connectDB } from "@/db";
import { updateUserPassword } from "@/services/user/mutations";

import type { ActionResult } from "@/types/action";

export async function updateProfileAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || name.length < 2 || name.length > 100) {
    return {
      success: false,
      message: "Name must be 2-100 characters",
    };
  }

  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "Valid email is required",
    };
  }

  await connectDB();

  try {
    const existing = await UserModel.findOne({
      email: email.toLowerCase(),
      _id: { $ne: session.user.id },
    });

    if (existing) {
      return {
        success: false,
        message: "Email is already in use",
      };
    }

    await UserModel.findByIdAndUpdate(session.user.id, {
      $set: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
      },
    });

    revalidatePath("/account/profile");

    return { success: true, message: "Profile updated" };
  } catch {
    return {
      success: false,
      message: "Failed to update profile",
    };
  }
}

export async function changePasswordAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "All password fields are required" };
  }

  if (newPassword.length < 8) {
    return { success: false, message: "New password must be at least 8 characters" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "New passwords do not match" };
  }

  if (currentPassword === newPassword) {
    return { success: false, message: "New password must be different from current password" };
  }

  try {
    await updateUserPassword(session.user.id, currentPassword, newPassword);

    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to change password",
    };
  }
}
