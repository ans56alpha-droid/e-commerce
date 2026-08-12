import { Types } from "mongoose";

import { connectDB } from "@/db";

import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";

import type { ShippingAddressType } from "@/models/Order";

const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 10;

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

  const order = await Order.create({
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