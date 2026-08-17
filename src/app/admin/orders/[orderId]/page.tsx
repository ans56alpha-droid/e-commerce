"use client";

import { useEffect, useState, useActionState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { getAdminOrderDetailAction, updateOrderStatusAction } from "@/actions/admin/orders";
import { formatCurrency } from "@/lib/format-currency";
import {
  ORDER_STATUS_STYLES,
  PAYMENT_STATUS_STYLES,
  PAYMENT_METHOD_LABELS,
  ALLOWED_STATUS_TRANSITIONS,
} from "@/constants/order";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";

interface OrderData {
  _id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  shipping: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  user?: { name?: string; email?: string } | null;
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    slug: string;
    image: string;
    sku: string;
    price: number;
    quantity: number;
  }>;
  statusHistory: Array<{
    status: string;
    note: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");

  const [state, formAction, isPending] = useActionState(
    updateOrderStatusAction,
    { success: false },
  );

  useEffect(() => {
    getAdminOrderDetailAction(orderId).then((data) => {
      setOrder(data as unknown as OrderData);
      setLoading(false);
    });
  }, [orderId, state.success]);

  useEffect(() => {
    if (state.success) {
      setNote("");
    }
  }, [state.success]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <p className="py-20 text-center text-muted-foreground">
        Order not found.
      </p>
    );
  }

  const oStyle =
    ORDER_STATUS_STYLES[order.orderStatus] ?? {
      label: order.orderStatus,
      className: "bg-muted text-muted-foreground",
    };

  const pStyle =
    PAYMENT_STATUS_STYLES[order.paymentStatus] ?? {
      label: order.paymentStatus,
      className: "bg-muted text-muted-foreground",
    };

  const paymentMethod =
    PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod;

  const allowedTransitions =
    ALLOWED_STATUS_TRANSITIONS[order.orderStatus] ?? [];

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Order {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {date}
          </p>
        </div>
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            Back to Orders
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Order Status
              </p>
              <span
                className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${oStyle.className}`}
              >
                {oStyle.label}
              </span>
            </div>

            <div className="rounded-md bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Payment Status
              </p>
              <span
                className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${pStyle.className}`}
              >
                {pStyle.label}
              </span>
            </div>

            <div className="rounded-md bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Payment Method
              </p>
              <p className="mt-1 font-medium">{paymentMethod}</p>
            </div>

            <div className="rounded-md bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="mt-1 font-medium">
                {formatCurrency(order.total)}
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-semibold">Items</h2>
            <ul className="divide-y rounded-md border">
              {order.items.map((item, i) => (
                <li
                  key={`${item.sku}-${i}`}
                  className="flex items-center gap-4 p-4"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center text-[10px] text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      SKU: {item.sku}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)} &times;{" "}
                      {item.quantity}
                    </p>
                    <p className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shipping === 0
                    ? "Free"
                    : formatCurrency(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-3 font-semibold">Customer</h3>
            <div className="space-y-1 text-sm">
              <p>{order.user?.name ?? "—"}</p>
              <p className="text-muted-foreground">
                {order.user?.email ?? "—"}
              </p>
            </div>
          </Card>

          {order.shippingAddress && (
            <Card>
              <h3 className="mb-3 font-semibold">Shipping Address</h3>
              <div className="space-y-1 text-sm">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.address}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.country}
                </p>
              </div>
            </Card>
          )}

          {allowedTransitions.length > 0 && (
            <Card>
              <h3 className="mb-3 font-semibold">
                Update Status
              </h3>

              <form action={formAction} className="space-y-3">
                <input
                  type="hidden"
                  name="orderId"
                  value={orderId}
                />

                <div className="space-y-2">
                  {allowedTransitions.map((s) => {
                    const style =
                      ORDER_STATUS_STYLES[s] ?? {
                        label: s,
                        className: "",
                      };
                    return (
                      <label
                        key={s}
                        className="flex cursor-pointer items-center gap-2 rounded-md border p-2 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <input
                          type="radio"
                          name="newStatus"
                          value={s}
                          className="accent-primary"
                        />
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${style.className}`}
                        >
                          {style.label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div>
                  <Input
                    name="note"
                    placeholder="Note (optional)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                {state.message && (
                  <p
                    className={`text-sm ${
                      state.success
                        ? "text-green-600"
                        : "text-destructive"
                    }`}
                  >
                    {state.message}
                  </p>
                )}

                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                >
                  {isPending ? "Updating..." : "Update Status"}
                </Button>
              </form>
            </Card>
          )}

          {order.statusHistory && order.statusHistory.length > 0 && (
            <Card>
              <h3 className="mb-3 font-semibold">
                Status History
              </h3>
              <ol className="space-y-3 border-l-2 border-border pl-4">
                {order.statusHistory
                  .slice()
                  .reverse()
                  .map((entry, i) => (
                    <li key={i} className="relative text-sm">
                      <div className="absolute -left-[1.35rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-border bg-background" />
                      <p className="font-medium capitalize">
                        {entry.status}
                      </p>
                      {entry.note && (
                        <p className="text-muted-foreground">
                          {entry.note}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          entry.createdAt,
                        ).toLocaleString()}
                      </p>
                    </li>
                  ))}
              </ol>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
