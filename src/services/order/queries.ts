import { Types } from "mongoose";

import { connectDB } from "@/db";
import Order, { type OrderType } from "@/models/Order";
import { ORDERS_PER_PAGE } from "@/constants/order";
import { escapeRegex } from "@/lib/escape-regex";

type LeanOrder = OrderType & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export interface PaginatedOrders {
  orders: LeanOrder[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export async function getUserOrders(
  userId: string,
  page = 1
): Promise<PaginatedOrders> {
  await connectDB();

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const safePage =
    Number.isInteger(page) && page > 0 ? page : 1;

  const filter = {
    user: new Types.ObjectId(userId),
  };

  const total = await Order.countDocuments(filter);

  const totalPages = Math.max(
    1,
    Math.ceil(total / ORDERS_PER_PAGE)
  );

  const resolvedPage = Math.min(safePage, totalPages);

  const orders = await Order.find(filter)
    .select(
      "orderNumber orderStatus paymentStatus paymentMethod total createdAt items.name items.image items.quantity items.sku"
    )
    .sort({ createdAt: -1 })
    .skip((resolvedPage - 1) * ORDERS_PER_PAGE)
    .limit(ORDERS_PER_PAGE)
    .lean();

  return {
    orders,
    page: resolvedPage,
    limit: ORDERS_PER_PAGE,
    totalPages,
    total,
  };
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
  })
    .select(
      "orderNumber orderStatus paymentStatus paymentMethod subtotal shipping total createdAt shippingAddress cancelledAt statusHistory items.name items.image items.slug items.sku items.price items.quantity"
    )
    .lean();

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}

const ADMIN_ORDERS_PER_PAGE = 20;

export interface AdminPaginatedOrders {
  orders: LeanOrder[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export async function getAllOrders(
  page = 1,
  filters: {
    status?: string;
    paymentStatus?: string;
    search?: string;
  } = {}
): Promise<AdminPaginatedOrders> {
  await connectDB();

  const safePage =
    Number.isInteger(page) && page > 0 ? page : 1;

  const query: Record<string, unknown> = {};

  if (filters.status) {
    query.orderStatus = filters.status;
  }

  if (filters.paymentStatus) {
    query.paymentStatus = filters.paymentStatus;
  }

  if (filters.search) {
    const safe = escapeRegex(filters.search);
    query.$or = [
      { orderNumber: { $regex: safe, $options: "i" } },
      { "shippingAddress.name": { $regex: safe, $options: "i" } },
    ];
  }

  const total = await Order.countDocuments(query);

  const totalPages = Math.max(
    1,
    Math.ceil(total / ADMIN_ORDERS_PER_PAGE)
  );

  const resolvedPage = Math.min(safePage, totalPages);

  const orders = await Order.find(query)
    .select(
      "orderNumber orderStatus paymentStatus paymentMethod total user shippingAddress.name shippingAddress.phone createdAt"
    )
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip((resolvedPage - 1) * ADMIN_ORDERS_PER_PAGE)
    .limit(ADMIN_ORDERS_PER_PAGE)
    .lean();

  return {
    orders,
    page: resolvedPage,
    limit: ADMIN_ORDERS_PER_PAGE,
    totalPages,
    total,
  };
}

export async function getOrderById(orderId: string) {
  await connectDB();

  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID");
  }

  const order = await Order.findById(
    new Types.ObjectId(orderId)
  )
    .populate("user", "name email")
    .lean();

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}
