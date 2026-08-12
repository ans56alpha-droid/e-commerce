import { Types } from "mongoose";

import { connectDB } from "@/db";
import Order from "@/models/Order";

export async function getUserOrders(userId: string) {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  return Order.find({
    user: new Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getUserOrder(
  userId: string,
  orderId: string
) {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  const order = await Order.findOne({
    _id: new Types.ObjectId(orderId),
    user: new Types.ObjectId(userId),
  }).lean();

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}