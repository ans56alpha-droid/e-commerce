import mongoose, { Types } from "mongoose";

import { connectDB } from "@/db";

import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";

import type { ShippingAddressType } from "@/models/Order";

import { ALLOWED_STATUS_TRANSITIONS } from "@/constants/order";
import { createNotification } from "@/services/notification/mutations";

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 10;

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);

  return `ORD-${timestamp}-${random}`;
}

export async function createOrder(
  userId: string,
  shippingAddress: ShippingAddressType
) {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!shippingAddress) {
    throw new Error("Shipping address is required");
  }

  const cart = await Cart.findOne({
    user: userId,
  }).lean();

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty");
  }

  const productIds = cart.items.map((item) => item.product);

  const products = await Product.find({
    _id: { $in: productIds },
    isDeleted: false,
  }).lean();

  const productMap = new Map(
    products.map((product) => [product._id.toString(), product])
  );

  const orderItems = [];

  let subtotal = 0;

  for (const cartItem of cart.items) {
    const productId = cartItem.product.toString();

    const product = productMap.get(productId);

    if (!product) {
      throw new Error(
        `Product ${productId} is no longer available`
      );
    }

    if (product.stock < cartItem.quantity) {
      throw new Error(
        `${product.name} does not have enough stock`
      );
    }

    if (cartItem.quantity < 1) {
      throw new Error(
        `Invalid quantity for ${product.name}`
      );
    }

    const itemTotal = product.price * cartItem.quantity;

    subtotal += itemTotal;

    const primaryImage =
      product.images.find((image) => image.isPrimary)?.url ||
      product.images[0]?.url ||
      "";

    orderItems.push({
      product: product._id,
      name: product.name,
      slug: product.slug,
      image: primaryImage,
      sku: product.sku,
      price: product.price,
      quantity: cartItem.quantity,
    });
  }

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_FEE;

  const total = subtotal + shipping;

  const orderNumber = generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    user: new Types.ObjectId(userId),
    items: orderItems,
    shippingAddress,
    subtotal,
    shipping,
    total,
    orderStatus: "pending",
    paymentStatus: "pending",
  });

  await Cart.findOneAndUpdate(
    { user: userId },
    { $set: { items: [] } }
  );

  return order;
}

/**
 * Cancels a pending order. Stock is only restored if it was previously
 * deducted (paid order where fulfillment completed). The operation runs
 * inside a MongoDB transaction: validate → restore stock → mark cancelled.
 */
export async function cancelOrder(
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

  const session = await mongoose.startSession();

  try {
    let cancelled = false;

    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: new Types.ObjectId(orderId),
        user: new Types.ObjectId(userId),
      }).session(session);

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.orderStatus === "cancelled") {
        throw new Error(
          "This order has already been cancelled"
        );
      }

      if (order.orderStatus !== "pending") {
        throw new Error(
          "This order cannot be cancelled"
        );
      }

      // Restore stock only if it was previously deducted.
      if (order.stockDeducted) {
        for (const item of order.items) {
          await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
            { session }
          );
        }
      }

      order.orderStatus = "cancelled";
      order.cancelledAt = new Date();

      await order.save({ session });

      cancelled = true;
    });

    if (!cancelled) {
      throw new Error("Failed to cancel order");
    }

    const orderForNotification = await Order.findById(
      new Types.ObjectId(orderId)
    ).select("orderNumber user");

    if (orderForNotification) {
      await createNotification({
        userId: orderForNotification.user.toString(),
        type: "order_cancelled",
        title: "Order Cancelled",
        message: `Your order #${orderForNotification.orderNumber} has been cancelled.`,
        orderId,
      });
    }
  } finally {
    await session.endSession();
  }
}

/**
 * Admin-only: updates order status with transition validation.
 * Validates the transition is allowed, appends status history entry.
 * When cancelling, restores stock if it was previously deducted.
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
  adminId: string,
  note = ""
) {
  await connectDB();

  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  if (!Types.ObjectId.isValid(adminId)) {
    throw new Error("Invalid admin ID");
  }

  const allowed = ALLOWED_STATUS_TRANSITIONS[newStatus];
  if (allowed === undefined) {
    throw new Error("Invalid order status");
  }

  const session = await mongoose.startSession();

  try {
    let updated = false;

    await session.withTransaction(async () => {
      const order = await Order.findById(
        new Types.ObjectId(orderId)
      ).session(session);

      if (!order) {
        throw new Error("Order not found");
      }

      const currentStatus = order.orderStatus;

      if (currentStatus === newStatus) {
        throw new Error(
          `Order is already ${newStatus}`
        );
      }

      const permitted = ALLOWED_STATUS_TRANSITIONS[currentStatus];
      if (!permitted || !permitted.includes(newStatus)) {
        throw new Error(
          `Cannot transition from "${currentStatus}" to "${newStatus}"`
        );
      }

      order.orderStatus = newStatus as typeof order.orderStatus;

      if (newStatus === "cancelled") {
        order.cancelledAt = new Date();

        if (order.stockDeducted) {
          for (const item of order.items) {
            await Product.updateOne(
              { _id: item.product },
              { $inc: { stock: item.quantity } },
              { session }
            );
          }
        }
      }

      order.statusHistory.push({
        status: newStatus,
        note,
        changedBy: new Types.ObjectId(adminId),
        createdAt: new Date(),
      });

      await order.save({ session });

      updated = true;
    });

    if (!updated) {
      throw new Error("Failed to update order status");
    }

    const orderForNotification = await Order.findById(
      new Types.ObjectId(orderId)
    ).select("orderNumber user");

    if (orderForNotification) {
      const notificationMap: Record<string, { type: "order_processing" | "order_shipped" | "order_delivered" | "order_cancelled"; title: string; message: string }> = {
        processing: {
          type: "order_processing",
          title: "Order Processing",
          message: `Your order #${orderForNotification.orderNumber} is now being processed.`,
        },
        shipped: {
          type: "order_shipped",
          title: "Order Shipped",
          message: `Your order #${orderForNotification.orderNumber} has been shipped.`,
        },
        delivered: {
          type: "order_delivered",
          title: "Order Delivered",
          message: `Your order #${orderForNotification.orderNumber} has been delivered.`,
        },
        cancelled: {
          type: "order_cancelled",
          title: "Order Cancelled",
          message: `Your order #${orderForNotification.orderNumber} has been cancelled.`,
        },
      };

      const notificationData = notificationMap[newStatus];

      if (notificationData) {
        await createNotification({
          userId: orderForNotification.user.toString(),
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          orderId,
        });
      }
    }
  } finally {
    await session.endSession();
  }
}