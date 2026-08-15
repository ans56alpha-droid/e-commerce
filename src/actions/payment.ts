"use server";

import { auth } from "@/auth";
import { initiateJazzCashPayment } from "@/services/payment/jazzcash";

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

  try {
    const payment = await initiateJazzCashPayment(
      session.user.id,
      orderId
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