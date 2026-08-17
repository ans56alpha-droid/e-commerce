import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/button";
import {
  ORDER_STATUS_STYLES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_STYLES,
} from "@/constants/order";

interface OrderCardProps {
  order: {
    _id: { toString(): string };
    orderNumber: string;
    createdAt: Date | string;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod?: string;
    total: number;
    items: {
      name: string;
      image?: string;
      quantity: number;
    }[];
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  const orderStatus =
    ORDER_STATUS_STYLES[order.orderStatus] ?? {
      label: order.orderStatus,
      className: "bg-muted text-muted-foreground",
    };

  const paymentStatus =
    PAYMENT_STATUS_STYLES[order.paymentStatus] ?? {
      label: order.paymentStatus,
      className: "bg-muted text-muted-foreground",
    };

  const paymentMethod =
    PAYMENT_METHOD_LABELS[order.paymentMethod ?? ""] ??
    order.paymentMethod ??
    "—";

  const placedAt = new Date(
    order.createdAt
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const previewItems = order.items.slice(0, 3);

  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <article className="rounded-lg border bg-background">
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold">{order.orderNumber}</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Placed on {placedAt}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${orderStatus.className}`}
          >
            {orderStatus.label}
          </span>

          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${paymentStatus.className}`}
          >
            {paymentStatus.label}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {previewItems.map((item, index) => (
            <div
              key={index}
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
          ))}

          <div>
            <p className="text-sm font-medium">
              {totalQuantity}{" "}
              {totalQuantity === 1 ? "item" : "items"}
            </p>

            <p className="text-sm text-muted-foreground">
              {paymentMethod}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Total
            </p>

            <p className="font-semibold">
              ${order.total.toFixed(2)}
            </p>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link href={`/orders/${order._id.toString()}`}>
              View Order
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
