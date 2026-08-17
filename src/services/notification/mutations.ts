import { Types } from "mongoose";

import { connectDB } from "@/db";
import Notification from "@/models/Notification";

import type { NotificationType } from "@/models/Notification";

type NotificationInput = {
  userId: string;
  type: NotificationType["type"];
  title: string;
  message: string;
  orderId?: string;
};

export async function createNotification(
  data: NotificationInput
) {
  await connectDB();

  if (!Types.ObjectId.isValid(data.userId)) {
    throw new Error("Invalid user ID");
  }

  const createData: Record<string, unknown> = {
    user: new Types.ObjectId(data.userId),
    type: data.type,
    title: data.title,
    message: data.message,
  };

  if (data.orderId && Types.ObjectId.isValid(data.orderId)) {
    createData.orderId = new Types.ObjectId(data.orderId);
  }

  return Notification.create(createData);
}

export async function markAsRead(
  userId: string,
  notificationId: string
) {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!Types.ObjectId.isValid(notificationId)) {
    throw new Error("Invalid notification ID");
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: new Types.ObjectId(notificationId),
      user: new Types.ObjectId(userId),
    },
    { $set: { isRead: true } },
    { new: true }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
}

export async function markAllAsRead(userId: string) {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  await Notification.updateMany(
    {
      user: new Types.ObjectId(userId),
      isRead: false,
    },
    { $set: { isRead: true } }
  );
}

export async function deleteNotification(
  userId: string,
  notificationId: string
) {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!Types.ObjectId.isValid(notificationId)) {
    throw new Error("Invalid notification ID");
  }

  const notification =
    await Notification.findOneAndDelete({
      _id: new Types.ObjectId(notificationId),
      user: new Types.ObjectId(userId),
    });

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
}
