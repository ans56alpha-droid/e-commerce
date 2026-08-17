"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { cancelOrder as cancelOrderService } from "@/services/order";

import type { ActionResult } from "@/types/action";

export async function cancelOrderAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const orderId = formData.get("orderId");

  if (typeof orderId !== "string") {
    return {
      success: false,
      message: "Invalid request.",
    };
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in.",
      };
    }

    await cancelOrderService(session.user.id, orderId);

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    return {
      success: true,
      message: "Order cancelled.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to cancel order.",
    };
  }
}
