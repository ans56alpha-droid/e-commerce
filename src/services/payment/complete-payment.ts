import mongoose, { Types } from "mongoose";

import { connectDB } from "@/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

class FulfillmentError extends Error {}

type OrderDoc = Awaited<ReturnType<typeof Order.findOne>>;

/**
 * Confirms a verified JazzCash payment and fulfils the order.
 *
 * Phase 1 (payment confirmation) and Phase 2 (stock deduction) are separate
 * transactions. A successful gateway payment is ALWAYS preserved, even if
 * fulfillment hits a stock problem. If fulfillment cannot complete, the order
 * is left paid with `stockDeducted: false` so a later retry (duplicate
 * callback) can finish fulfilment without double-deducting stock.
 */
export async function completeJazzCashPayment(
  orderId: string,
  txnRefNo: string
) {
  await connectDB();

  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  let order: OrderDoc | undefined;

  // Phase 1: confirm the payment. Never rolls back due to stock problems.
  const confirmSession = await mongoose.startSession();

  try {
    await confirmSession.withTransaction(async () => {
      order = await Order.findOne({
        _id: orderId,
        "jazzCash.txnRefNo": txnRefNo,
      }).session(confirmSession);

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.paymentStatus === "refunded") {
        throw new Error("Refunded order cannot be completed");
      }

      if (order.orderStatus === "cancelled") {
        throw new Error("Cancelled order cannot be completed");
      }

      if (order.paymentStatus !== "paid") {
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

        await order.save({ session: confirmSession });
      }
    });
  } finally {
    await confirmSession.endSession();
  }

  if (order?.stockDeducted) {
    return {
      order,
      fulfillmentOk: true,
      fulfillmentError: undefined,
    };
  }

  // Phase 2: deduct stock for every item atomically. Failure must never undo
  // the confirmed payment (Phase 1).
  const fulfillSession = await mongoose.startSession();

  try {
    await fulfillSession.withTransaction(async () => {
      const latest = await Order.findOne({
        _id: orderId,
        "jazzCash.txnRefNo": txnRefNo,
      }).session(fulfillSession);

      if (!latest) {
        throw new Error("Order not found");
      }

      if (latest.stockDeducted) {
        order = latest;
        return;
      }

      for (const item of latest.items) {
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
            session: fulfillSession,
          }
        );

        if (result.modifiedCount !== 1) {
          throw new FulfillmentError(
            `Insufficient stock for product ${item.product}`
          );
        }
      }

      latest.stockDeducted = true;
      latest.fulfillmentError = "";

      await latest.save({ session: fulfillSession });

      order = latest;
    });

    return {
      order,
      fulfillmentOk: true,
      fulfillmentError: undefined,
    };
  } catch (error) {
    if (error instanceof FulfillmentError) {
      await Order.updateOne(
        { _id: orderId },
        { $set: { fulfillmentError: error.message } }
      );

      console.error(
        "JazzCash payment confirmed; fulfillment pending:",
        {
          orderId,
          message: error.message,
        }
      );

      return {
        order,
        fulfillmentOk: false,
        fulfillmentError: error.message,
      };
    }

    throw error;
  } finally {
    await fulfillSession.endSession();
  }
}
