"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  getUserNotifications as getUserNotificationsService,
  getUnreadCount as getUnreadCountService,
  markAsRead as markAsReadService,
  markAllAsRead as markAllAsReadService,
  deleteNotification as deleteNotificationService,
} from "@/services/notification";

import type { ActionResult } from "@/types/action";

export async function getNotificationsAction(page = 1) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false as const,
      message: "Unauthorized",
      notifications: [],
      total: 0,
      totalPages: 0,
      unreadCount: 0,
    };
  }

  try {
    const [result, unreadCount] = await Promise.all([
      getUserNotificationsService(session.user.id, page),
      getUnreadCountService(session.user.id),
    ]);

    return {
      success: true as const,
      ...result,
      unreadCount,
    };
  } catch {
    return {
      success: false as const,
      message: "Failed to load notifications",
      notifications: [],
      total: 0,
      totalPages: 0,
      unreadCount: 0,
    };
  }
}

export async function markNotificationReadAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const notificationId = formData.get(
    "notificationId"
  ) as string;

  if (!notificationId) {
    return {
      success: false,
      message: "Notification ID required",
    };
  }

  try {
    await markAsReadService(
      session.user.id,
      notificationId
    );

    revalidatePath("/account/notifications");

    return { success: true };
  } catch {
    return {
      success: false,
      message: "Failed to mark notification",
    };
  }
}

export async function markAllNotificationsReadAction(): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await markAllAsReadService(session.user.id);

    revalidatePath("/account/notifications");

    return { success: true };
  } catch {
    return {
      success: false,
      message: "Failed to mark notifications",
    };
  }
}

export async function deleteNotificationAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const notificationId = formData.get(
    "notificationId"
  ) as string;

  if (!notificationId) {
    return {
      success: false,
      message: "Notification ID required",
    };
  }

  try {
    await deleteNotificationService(
      session.user.id,
      notificationId
    );

    revalidatePath("/account/notifications");

    return { success: true };
  } catch {
    return {
      success: false,
      message: "Failed to delete notification",
    };
  }
}
