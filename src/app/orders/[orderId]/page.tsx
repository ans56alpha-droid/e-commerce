import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { auth } from "@/auth";
import { getUserOrder } from "@/services/order";

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams: Promise<{
    payment?: "success" | "failed";
  }>;
};

const paymentStatusStyles: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Payment Pending",
    className: "bg-amber-50 text-amber-700",
  },
  paid: {
    label: "Paid",
    className: "bg-green-50 text-green-700",
  },
  failed: {
    label: "Payment Failed",
    className: "bg-red-50 text-red-700",
  },
  refunded: {
    label: "Refunded",
    className: "bg-slate-100 text-slate-600",
  },
};

const orderStatusStyles: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-50 text-blue-700",
  },
  shipped: {
    label: "Shipped",
    className: "bg-blue-50 text-blue-700",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-50 text-green-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700",
  },
};

const paymentMethodLabels: Record<string, string> = {
  jazzcash: "JazzCash",
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

  let order;

  try {
    order = await getUserOrder(session.user.id, orderId);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Order not found" ||
        error.message === "Invalid order ID")
    ) {
      notFound();
    }

    throw error;
  }

  const isPaymentSuccess = payment === "success";
  const isPaymentFailed = payment === "failed";

  const canPay =
    (order.paymentStatus === "pending" ||
      order.paymentStatus === "failed") &&
    order.orderStatus !== "cancelled";

  const paymentStatus =
    paymentStatusStyles[order.paymentStatus] ??
    paymentStatusStyles.pending;

  const orderStatus =
    orderStatusStyles[order.orderStatus] ?? {
      label: order.orderStatus,
      className: "bg-muted text-muted-foreground",
    };

  const paymentMethod =
    paymentMethodLabels[order.paymentMethod] ?? order.paymentMethod;

  const placedAt = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {isPaymentSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-md border border-green-200 bg-green-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
              ✓
            </div>

            <div>
              <p className="font-semibold text-green-800">
                Payment Successful
              </p>

              <p className="text-sm text-green-700">
                Your payment has been processed successfully.
              </p>
            </div>
          </div>
        )}

        {isPaymentFailed && (
          <div className="mb-6 flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
              ✕
            </div>

            <div>
              <p className="font-semibold text-red-800">
                Payment Failed
              </p>

              <p className="text-sm text-red-700">
                Your payment was not completed. You can try again below.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-lg border">
          <div className="border-b p-6">
            <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {placedAt}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Payment Method
                </p>

                <p className="mt-1 font-medium">{paymentMethod}</p>
              </div>

              <div className="rounded-md bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Payment Status
                </p>

                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${paymentStatus.className}`}
                >
                  {paymentStatus.label}
                </span>
              </div>

              <div className="rounded-md bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Order Status
                </p>

                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${orderStatus.className}`}
                >
                  {orderStatus.label}
                </span>
              </div>

              <div className="rounded-md bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Order Number
                </p>

                <p className="mt-1 break-all font-medium">
                  {order.orderNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="border-b p-6">
            <h2 className="mb-4 font-semibold">Items</h2>

            <ul className="divide-y">
              {order.items.map((item) => (
                <li
                  key={item.sku}
                  className="flex items-center gap-4 py-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="line-clamp-2 font-medium hover:text-primary"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-1 text-sm text-muted-foreground">
                      SKU: {item.sku}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>

                    <p className="mt-1 font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6">
            <div className="space-y-3">
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

              <div className="flex justify-between border-t pt-3 text-lg font-semibold">
                <span>Total</span>

                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>

            {canPay && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href={`/checkout/payment/${order._id.toString()}`}
                  className="rounded-md bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground"
                >
                  {order.paymentStatus === "failed"
                    ? "Retry Payment"
                    : "Pay Now"}
                </Link>

                <Link
                  href="/orders"
                  className="rounded-md border px-5 py-3 text-center text-sm font-medium"
                >
                  Back to Orders
                </Link>

                <Link
                  href="/products"
                  className="rounded-md border px-5 py-3 text-center text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            )}

            {!canPay && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/orders"
                  className="rounded-md border px-5 py-3 text-center text-sm font-medium"
                >
                  View All Orders
                </Link>

                <Link
                  href="/products"
                  className="rounded-md bg-primary px-5 py-3 text-center text-sm font-medium text-primary-foreground"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
