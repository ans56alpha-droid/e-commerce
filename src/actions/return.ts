"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  createReturnRequest as createReturnRequestService,
} from "@/services/return";
import { returnRequestSchema } from "@/lib/validations/return";

import type { ActionResult } from "@/types/action";

export async function createReturnRequestAction(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const raw = {
    orderId: formData.get("orderId") as string,
    reason: formData.get("reason") as string,
  };

  const parsed = returnRequestSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Invalid return request",
    };
  }

  try {
    await createReturnRequestService({
      ...parsed.data,
      userId: session.user.id,
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${parsed.data.orderId}`);

    return {
      success: true,
      message: "Return request submitted",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to submit return request",
    };
  }
}
