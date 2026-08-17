"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/services/admin/auth";
import { updateOrderStatus } from "@/services/order/mutations";
import { getAllOrders, getOrderById } from "@/services/order/queries";

import type { ActionResult } from "@/types/action";

export async function getAdminOrdersAction(
  page = 1,
  filters: { status?: string; paymentStatus?: string; search?: string } = {}
) {
  await requireAdmin();

  return getAllOrders(page, filters);
}

export async function getAdminOrderDetailAction(orderId: string) {
  await requireAdmin();

  return getOrderById(orderId);
}

export async function updateOrderStatusAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();

    const orderId = formData.get("orderId") as string;
    const newStatus = formData.get("newStatus") as string;
    const note = (formData.get("note") as string) || "";

    if (!orderId || !newStatus) {
      return { success: false, message: "Missing required fields" };
    }

    await updateOrderStatus(orderId, newStatus, session.user.id, note);

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true, message: "Order status updated" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update",
    };
  }
}
