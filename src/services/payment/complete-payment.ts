import mongoose, { Types } from "mongoose";

import { connectDB } from "@/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function completeJazzCashPayment(
  orderId: string,
  txnRefNo: string
) {
  await connectDB();

  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  const session = await mongoose.startSession();

  try {
    let completedOrder;

    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: orderId,
        "jazzCash.txnRefNo": txnRefNo,
      }).session(session);

      if (!order) {
        throw new Error("Order not found");
      }

      // Idempotency
      if (order.paymentStatus === "paid") {
        completedOrder = order;
        return;
      }

      if (order.paymentStatus === "refunded") {
        throw new Error(
          "Refunded order cannot be completed"
        );
      }

      // Deduct stock atomically for every item.
      for (const item of order.items) {
        const result = await Product.updateOne(
          {
            _id: item.product,
            stock: {
              $gte: item.quantity,
            },
          },
          {
            $inc: {
              stock: -item.quantity,
              salesCount: item.quantity,
            },
          },
          {
            session,
          }
        );

        if (result.modifiedCount !== 1) {
          throw new Error(
            `Insufficient stock for product ${item.product}`
          );
        }
      }

      order.paymentStatus = "paid";
      order.orderStatus = "processing";

    order.jazzCash = {
        responseCode: order.jazzCash?.responseCode ?? "",
        responseMessage: order.jazzCash?.responseMessage ?? "",
        retrievalReferenceNo: order.jazzCash?.retrievalReferenceNo ?? "",
        authCode: order.jazzCash?.authCode ?? "",
        txnRefNo: order.jazzCash?.txnRefNo,
        paidAt: new Date(),
    };

      await order.save({ session });

      completedOrder = order;
    });

    return completedOrder;
  } finally {
    await session.endSession();
  }
}