import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserOrder } from "@/services/order";
import Link from "next/link";

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<{
    payment?: "success" | "failed";
  }>;
};

export default async function OrderPage({
  params,
  searchParams,
}: OrderPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { orderId } = await params;
  const { payment } = await searchParams;

  const order = await getUserOrder(session.user.id, orderId);

  const isPaymentSuccess = payment === "success";
  const isPaymentFailed = payment === "failed";
  const isPaid = order.paymentStatus === "paid";
  const canRetryPayment =
    (order.paymentStatus === "pending" || order.paymentStatus === "failed") &&
    order.orderStatus !== "cancelled";

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {isPaymentSuccess && (
          <div className="rounded-lg border p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-400 text-2xl">
              ✓
            </div>

            <h1 className="mt-5 text-3xl font-bold">Payment Successful</h1>

            <p className="mt-2 text-muted-foreground">
              Your payment has been processed successfully.
            </p>

            <div className="mt-6 rounded-md bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order Number</p>

              <p className="mt-1 break-all font-medium">{order.orderNumber}</p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-green-50 p-4 text-left">
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <p className="mt-1 font-medium text-green-700 capitalize">
                  {order.paymentStatus}
                </p>
              </div>
              <div className="rounded-md bg-blue-50 p-4 text-left">
                <p className="text-sm text-muted-foreground">Order Status</p>
                <p className="mt-1 font-medium text-blue-700 capitalize">
                  {order.orderStatus}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-left border-t pt-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shipping === 0
                    ? "Free"
                    : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/orders"
                className="rounded-md border px-5 py-3 text-sm font-medium"
              >
                View All Orders
              </Link>

              <Link
                href="/products"
                className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {isPaymentFailed && (
          <div className="rounded-lg border p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-400 text-2xl">
              ✕
            </div>

            <h1 className="mt-5 text-3xl font-bold">Payment Failed</h1>

            <p className="mt-2 text-muted-foreground">
              We were unable to process your payment.
            </p>

            <div className="mt-6 rounded-md bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order Number</p>

              <p className="mt-1 break-all font-medium">{order.orderNumber}</p>
            </div>

            <div className="mt-4 rounded-md bg-red-50 p-4 text-left">
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <p className="mt-1 font-medium text-red-700 capitalize">
                {order.paymentStatus}
              </p>
              <p className="mt-2 text-sm text-red-600">
                Your payment was not completed. The order is still pending
                payment.
              </p>
            </div>

            <div className="mt-4 rounded-md bg-blue-50 p-4 text-left">
              <p className="text-sm text-muted-foreground">Order Status</p>
              <p className="mt-1 font-medium text-blue-700 capitalize">
                {order.orderStatus}
              </p>
            </div>

            <div className="mt-8 space-y-4 text-left border-t pt-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shipping === 0
                    ? "Free"
                    : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() =>
                  window.location.href = `/checkout/payment/${order._id.toString()}`
                }
                className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
              >
                Retry Payment
              </button>

              <Link
                href="/orders"
                className="rounded-md border px-5 py-3 text-sm font-medium"
              >
                Back to Orders
              </Link>

              <Link
                href="/products"
                className="rounded-md border px-5 py-3 text-sm font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {!isPaymentSuccess && !isPaymentFailed && (
          <div className="rounded-lg border p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-400 text-2xl">
              ℹ
            </div>

            <h1 className="mt-5 text-3xl font-bold">Order Details</h1>

            <p className="mt-2 text-muted-foreground">
              {isPaid
                ? "Your order has been paid and is being processed."
                : "Your order is pending payment."}
            </p>

            <div className="mt-6 rounded-md bg-muted p-4">
              <p className="text-sm text-muted-foreground">Order Number</p>

              <p className="mt-1 break-all font-medium">{order.orderNumber}</p>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md p-4 text-left">
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <p className="mt-1 font-medium capitalize">
                  {order.paymentStatus}
                </p>
              </div>
              <div className="rounded-md p-4 text-left">
                <p className="text-sm text-muted-foreground">Order Status</p>
                <p className="mt-1 font-medium capitalize">
                  {order.orderStatus}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 text-left border-t pt-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shipping === 0
                    ? "Free"
                    : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-semibold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            {canRetryPayment && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() =>
                    (window.location.href = `/checkout/payment/${order._id.toString()}`)
                  }
                  className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
                >
                  Retry Payment
                </button>
                <Link
                  href="/orders"
                  className="rounded-md border px-5 py-3 text-sm font-medium"
                >
                  Back to Orders
                </Link>
                <Link
                  href="/products"
                  className="rounded-md border px-5 py-3 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            )}

            {isPaid && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/orders"
                  className="rounded-md border px-5 py-3 text-sm font-medium"
                >
                  View All Orders
                </Link>

                <Link
                  href="/products"
                  className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}