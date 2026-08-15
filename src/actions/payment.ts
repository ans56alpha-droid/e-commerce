"use server";

import { auth } from "@/auth";
import { initiateJazzCashPayment } from "@/services/payment/jazzcash";
import { initiatePaymentSchema } from "@/lib/validations/payment";

export async function initiateJazzCashPaymentAction(
  orderId: string
) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "You must be logged in.",
    };
  }

  const parsed = initiatePaymentSchema.safeParse({ orderId });

  if (!parsed.success) {
    return {
      success: false,
      message: "Invalid order ID.",
    };
  }

  try {
    const payment = await initiateJazzCashPayment(
      session.user.id,
      parsed.data.orderId
    );

    return {
      success: true,
      payment,
    };
  } catch (error) {
    console.error(
      "JazzCash payment initiation failed:",
      error
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to initiate payment.",
    };
  }
}