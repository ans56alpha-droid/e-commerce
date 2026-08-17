import { Types } from "mongoose";

import { connectDB } from "@/db";
import Notification from "@/models/Notification";

const NOTIFICATIONS_PER_PAGE = 20;

export async function getUserNotifications(
  userId: string,
  page = 1
) {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const safePage =
    Number.isInteger(page) && page > 0 ? page : 1;

  const filter = {
    user: new Types.ObjectId(userId),
  };

  const total = await Notification.countDocuments(filter);
  const totalPages = Math.max(
    1,
    Math.ceil(total / NOTIFICATIONS_PER_PAGE)
  );
  const resolvedPage = Math.min(safePage, totalPages);

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .skip((resolvedPage - 1) * NOTIFICATIONS_PER_PAGE)
    .limit(NOTIFICATIONS_PER_PAGE)
    .lean();

  return {
    notifications,
    page: resolvedPage,
    limit: NOTIFICATIONS_PER_PAGE,
    totalPages,
    total,
  };
}

export async function getUnreadCount(
  userId: string
): Promise<number> {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  return Notification.countDocuments({
    user: new Types.ObjectId(userId),
    isRead: false,
  });
}
