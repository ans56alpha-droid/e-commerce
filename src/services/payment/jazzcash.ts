import { Types } from "mongoose";

import { connectDB } from "@/db";
import Order from "@/models/Order";

import { createJazzCashPayment } from "@/lib/jazzcash/payment";

export async function initiateJazzCashPayment(
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
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "paid") {
    throw new Error("Order has already been paid");
  }

  if (order.paymentStatus === "refunded") {
    throw new Error("Refunded orders cannot be paid");
  }

  if (order.orderStatus === "cancelled") {
    throw new Error("Cancelled orders cannot be paid");
  }

  if (order.jazzCash?.txnRefNo) {
    return {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      paymentUrl: undefined,
      payload: undefined,
      txnRefNo: order.jazzCash.txnRefNo,
    };
  }

  const payment = createJazzCashPayment({
    amount: order.total,
    orderNumber: order.orderNumber,
  });

  order.paymentMethod = "jazzcash";

  order.jazzCash = {
    responseCode: order.jazzCash?.responseCode ?? "",
    responseMessage: order.jazzCash?.responseMessage ?? "",
    retrievalReferenceNo: order.jazzCash?.retrievalReferenceNo ?? "",
    authCode: order.jazzCash?.authCode ?? "",
    txnRefNo: payment.txnRefNo,
  };

  await order.save();

  return {
    orderId: order._id.toString(),
    orderNumber: order.orderNumber,
    paymentUrl: payment.paymentUrl,
    payload: payment.payload,
    txnRefNo: payment.txnRefNo,
  };
}