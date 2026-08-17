"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { getAdminOrdersAction } from "@/actions/admin/orders";
import { formatCurrency } from "@/lib/format-currency";
import {
  ORDER_STATUS_STYLES,
  PAYMENT_STATUS_STYLES,
} from "@/constants/order";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";

interface Order {
  _id: { toString(): string };
  orderNumber: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  user?: { name?: string; email?: string } | null;
  shippingAddress?: { name?: string };
  createdAt: string;
}

const ORDER_FILTERS = [
  "",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const PAYMENT_FILTERS = ["", "pending", "paid", "failed", "refunded"];

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [paymentStatus, setPaymentStatus] = useState(
    searchParams.get("paymentStatus") ?? "",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [data, setData] = useState<{
    orders: Order[];
    page: number;
    totalPages: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getAdminOrdersAction(page, {
      search: search || undefined,
      status: status || undefined,
      paymentStatus: paymentStatus || undefined,
    }).then((res) => {
      if (!cancelled) {
        setData(JSON.parse(JSON.stringify(res)));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [page, search, status, paymentStatus]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage customer orders.
        </p>
      </div>

      <Card className="p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-end gap-3"
        >
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Search
            </label>
            <Input
              placeholder="Order # or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-36">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Order Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {ORDER_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s || "All"}
                </option>
              ))}
            </select>
          </div>

          <div className="w-36">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Payment
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {PAYMENT_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s || "All"}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </form>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : !data || data.orders.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No orders found.
        </p>
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Order #</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.orders.map((order) => {
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

                  const date = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : "—";

                  const customerName =
                    order.user?.name ??
                    order.shippingAddress?.name ??
                    "—";

                  return (
                    <tr
                      key={order._id.toString()}
                      className="border-b last:border-0"
                    >
                      <td className="py-3 pr-4 font-medium">
                        <Link
                          href={`/admin/orders/${order._id.toString()}`}
                          className="hover:text-primary"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {customerName}
                      </td>
                      <td className="py-3 pr-4 font-medium">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${oStyle.className}`}
                        >
                          {oStyle.label}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${pStyle.className}`}
                        >
                          {pStyle.label}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {date}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/orders/${order._id.toString()}`}
                        >
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="px-3 text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
