import { Types } from "mongoose";

import { connectDB } from "@/db";
import Order from "@/models/Order";
import ReturnRequest from "@/models/ReturnRequest";

import { createNotification } from "@/services/notification/mutations";

type CreateReturnInput = {
  orderId: string;
  userId: string;
  reason: string;
};

export async function createReturnRequest(
  data: CreateReturnInput
) {
  await connectDB();

  if (!Types.ObjectId.isValid(data.orderId)) {
    throw new Error("Invalid order ID");
  }

  if (!Types.ObjectId.isValid(data.userId)) {
    throw new Error("Invalid user ID");
  }

  const order = await Order.findOne({
    _id: new Types.ObjectId(data.orderId),
    user: new Types.ObjectId(data.userId),
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.orderStatus !== "delivered") {
    throw new Error(
      "Return requests can only be made for delivered orders"
    );
  }

  const existing = await ReturnRequest.findOne({
    order: new Types.ObjectId(data.orderId),
    user: new Types.ObjectId(data.userId),
    status: {
      $in: [
        "requested",
        "approved",
        "returned",
        "refund_pending",
      ],
    },
  });

  if (existing) {
    throw new Error(
      "A return request already exists for this order"
    );
  }

  const request = await ReturnRequest.create({
    order: new Types.ObjectId(data.orderId),
    user: new Types.ObjectId(data.userId),
    reason: data.reason,
  });

  await createNotification({
    userId: data.userId,
    type: "return_requested",
    title: "Return Requested",
    message: `Your return request for order #${order.orderNumber} has been submitted.`,
    orderId: data.orderId,
  });

  return request;
}

export async function updateReturnStatus(
  requestId: string,
  status: string,
  adminNote = ""
) {
  await connectDB();

  if (!Types.ObjectId.isValid(requestId)) {
    throw new Error("Invalid request ID");
  }

  const allowed = [
    "approved",
    "rejected",
    "returned",
    "refund_pending",
    "refunded",
  ];

  if (!allowed.includes(status)) {
    throw new Error("Invalid return status");
  }

  const request = await ReturnRequest.findById(
    new Types.ObjectId(requestId)
  );

  if (!request) {
    throw new Error("Return request not found");
  }

  const currentStatus = request.status;

  const transitions: Record<string, string[]> = {
    requested: ["approved", "rejected"],
    approved: ["returned"],
    returned: ["refund_pending"],
    refund_pending: ["refunded"],
    rejected: [],
    refunded: [],
  };

  const permitted = transitions[currentStatus];
  if (!permitted || !permitted.includes(status)) {
    throw new Error(
      `Cannot transition from "${currentStatus}" to "${status}"`
    );
  }

  request.status =
    status as typeof request.status;
  request.adminNote = adminNote;

  await request.save();

  return request;
}
