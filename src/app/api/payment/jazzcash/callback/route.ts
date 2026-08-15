import { NextResponse } from "next/server";
import { connectDB } from "@/db";
import Order from "@/models/Order";
import { verifyJazzCashSecureHash } from "@/lib/jazzcash/hash";
import { completeJazzCashPayment } from "@/services/payment/complete-payment";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const payload: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        payload[key] = value;
      }
    }

    console.log("JazzCash callback:", payload);

    // 1. Verify the cryptographic signature
    const isValidHash =
      verifyJazzCashSecureHash(payload);

    if (!isValidHash) {
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

    // 3. Prevent duplicate processing
    if (order.paymentStatus === "paid") {
      return NextResponse.redirect(
        new URL(
          `/orders/${order._id}`,
          request.url
        )
      );
    }

    // 4. Store gateway response
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

    // 5. Verify successful JazzCash response
    if (responseCode !== "000") {
      order.paymentStatus = "failed";

      await order.save();

      return NextResponse.redirect(
        new URL(
          `/orders/${order._id}?payment=failed`,
          request.url
        )
      );
    }

    // 6. Verify the amount
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
          orderId: order._id.toString(),
        }
      );

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

    // 7. Payment is verified
    await completeJazzCashPayment(
        order._id.toString(),
        txnRefNo
      );

    return NextResponse.redirect(
      new URL(
        `/orders/${order._id}?payment=success`,
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