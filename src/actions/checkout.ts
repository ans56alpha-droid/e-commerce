"use server";

import { auth } from "@/auth";
import { createOrder } from "@/services/order";
import type { ShippingAddressType } from "@/models/Order";

export type CheckoutActionState = {
  success: boolean;
  message: string;
  orderId?: string;
};

export async function checkoutAction(
  shippingAddress: ShippingAddressType
): Promise<CheckoutActionState> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to place an order.",
      };
    }

    if (!shippingAddress) {
      return {
        success: false,
        message: "Shipping address is required.",
      };
    }

    const order = await createOrder(
      session.user.id,
      shippingAddress
    );

    return {
      success: true,
      message: "Order created successfully.",
      orderId: order._id.toString(),
    };
  } catch (error) {
    console.error("Checkout error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong while placing your order.",
    };
  }
}