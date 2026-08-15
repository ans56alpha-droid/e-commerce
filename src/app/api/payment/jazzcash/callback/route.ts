import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/db";
import Order from "@/models/Order";
import { verifyJazzCashSecureHash } from "@/lib/jazzcash/hash";
import { completeJazzCashPayment } from "@/services/payment/complete-payment";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const payload: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        payload[key] = value;
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.debug("JazzCash callback:", {
        pp_TxnRefNo: payload.pp_TxnRefNo,
        pp_ResponseCode: payload.pp_ResponseCode,
      });
    }

    // 1. Verify the cryptographic signature
    if (!verifyJazzCashSecureHash(payload)) {
      console.error(
        "JazzCash callback rejected: invalid secure hash"
      );

      return new NextResponse(
        "Invalid secure hash",
        {
          status: 400,
        }
      );
    }

    const txnRefNo = payload.pp_TxnRefNo;
    const responseCode = payload.pp_ResponseCode;
    const responseMessage =
      payload.pp_ResponseMessage ?? "";

    if (!txnRefNo) {
      return new NextResponse(
        "Transaction reference is missing",
        {
          status: 400,
        }
      );
    }

    await connectDB();

    // 2. Find the order using our stored transaction reference
    const order = await Order.findOne({
      "jazzCash.txnRefNo": txnRefNo,
    });

    if (!order) {
      console.error(
        "JazzCash callback: order not found",
        txnRefNo
      );

      return new NextResponse(
        "Order not found",
        {
          status: 404,
        }
      );
    }

    // Reject terminal states. We never re-process paid/refunded/cancelled orders.
    if (order.paymentStatus === "refunded") {
      return new NextResponse(
        "Refunded order cannot be processed",
        {
          status: 400,
        }
      );
    }

    if (order.orderStatus === "cancelled") {
      return new NextResponse(
        "Cancelled order cannot be processed",
        {
          status: 400,
        }
      );
    }

    const orderId = order._id.toString();

    // 3. Persist the gateway response fields for audit.
    order.jazzCash = {
      ...(order.jazzCash ?? {}),
      txnRefNo,

      responseCode,

      responseMessage,

      retrievalReferenceNo:
        payload.pp_RetrievalReferenceNo ?? "",

      authCode:
        payload.pp_AuthCode ?? "",
    };

    await order.save();

    // 4. Gateway reported a failure.
    if (responseCode !== "000") {
      if (order.paymentStatus === "paid") {
        // Never downgrade an already-confirmed payment.
        return NextResponse.redirect(
          new URL(
            `/orders/${orderId}?payment=success`,
            request.url
          )
        );
      }

      order.paymentStatus = "failed";

      await order.save();

      return NextResponse.redirect(
        new URL(
          `/orders/${orderId}?payment=failed`,
          request.url
        )
      );
    }

    // 5. Verify the amount.
    const returnedAmount = Number(
      payload.pp_Amount
    );

    const expectedAmount = Math.round(
      order.total * 100
    );

    if (
      !Number.isFinite(returnedAmount) ||
      returnedAmount !== expectedAmount
    ) {
      console.error(
        "JazzCash callback: amount mismatch",
        {
          returnedAmount,
          expectedAmount,
          orderId,
        }
      );

      if (order.paymentStatus !== "paid") {
        order.paymentStatus = "failed";

        order.jazzCash.responseMessage =
          "Payment amount mismatch";

        await order.save();

        return new NextResponse(
          "Payment amount mismatch",
          {
            status: 400,
          }
        );
      }

      // Already paid: keep the confirmed state.
      return NextResponse.redirect(
        new URL(
          `/orders/${orderId}?payment=success`,
          request.url
        )
      );
    }

    // 6. Fast path: already confirmed and fulfilled.
    if (order.paymentStatus === "paid" && order.stockDeducted) {
      return NextResponse.redirect(
        new URL(
          `/orders/${orderId}?payment=success`,
          request.url
        )
      );
    }

    // 7. Confirm payment and fulfill (all-or-nothing stock deduction).
    const result = await completeJazzCashPayment(
      orderId,
      txnRefNo
    );

    if (!result.fulfillmentOk) {
      // Payment is already preserved as "paid" in the database. Return a
      // retryable status so JazzCash notifies again and fulfillment can be
      // retried once stock is available.
      console.error(
        "JazzCash payment confirmed; fulfillment pending:",
        {
          orderId,
          message: result.fulfillmentError,
        }
      );

      return new NextResponse(
        "Payment confirmed; fulfillment pending",
        {
          status: 500,
        }
      );
    }

    return NextResponse.redirect(
      new URL(
        `/orders/${orderId}?payment=success`,
        request.url
      )
    );
  } catch (error) {
    console.error(
      "JazzCash callback error:",
      error
    );

    return new NextResponse(
      "Payment processing failed",
      {
        status: 500,
      }
    );
  }
}

/**
 * Browser return: JazzCash redirects the customer to pp_ReturnURL with the
 * gateway response as query parameters. Payment state is always re-verified
 * server-side; the success/failure page state is driven by the persisted
 * Order, never by unverified query params alone.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const payload: Record<string, string> = {};

    for (const [key, value] of searchParams.entries()) {
      payload[key] = value;
    }

    const txnRefNo = payload.pp_TxnRefNo;

    if (!txnRefNo || !verifyJazzCashSecureHash(payload)) {
      return NextResponse.redirect(
        new URL("/orders", request.url)
      );
    }

    await connectDB();

    const order = await Order.findOne({
      "jazzCash.txnRefNo": txnRefNo,
    });

    if (!order) {
      return NextResponse.redirect(
        new URL("/orders", request.url)
      );
    }

    const orderId = order._id.toString();
    const responseCode = payload.pp_ResponseCode;

    if (responseCode === "000" || order.paymentStatus === "paid") {
      return NextResponse.redirect(
        new URL(
          `/orders/${orderId}?payment=success`,
          request.url
        )
      );
    }

    return NextResponse.redirect(
      new URL(
        `/orders/${orderId}?payment=failed`,
        request.url
      )
    );
  } catch (error) {
    console.error(
      "JazzCash return error:",
      error
    );

    return NextResponse.redirect(
      new URL("/orders", request.url)
    );
  }
}
