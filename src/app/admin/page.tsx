import type { Metadata } from "next";
import Link from "next/link";

import { getDashboardStats, getTopProducts } from "@/services/admin";
import { formatCurrency } from "@/lib/format-currency";
import Card from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin dashboard overview.",
};

export default async function AdminDashboardPage() {
  const [stats, topProducts] = await Promise.all([
    getDashboardStats(),
    getTopProducts(5),
  ]);

  const metricCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      href: "/admin/orders",
    },
    {
      label: "Revenue",
      value: formatCurrency(stats.revenue),
      href: "/admin/orders",
    },
    {
      label: "Total Products",
      value: stats.totalProducts,
      href: "/admin/products",
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      href: "/admin/customers",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      href: "/admin/orders?status=pending",
      accent: "text-amber-600",
    },
    {
      label: "Processing",
      value: stats.processingOrders,
      href: "/admin/orders?status=processing",
      accent: "text-blue-600",
    },
    {
      label: "Shipped",
      value: stats.shippedOrders,
      href: "/admin/orders?status=shipped",
      accent: "text-blue-600",
    },
    {
      label: "Delivered",
      value: stats.deliveredOrders,
      href: "/admin/orders?status=delivered",
      accent: "text-green-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelledOrders,
      href: "/admin/orders?status=cancelled",
      accent: "text-red-600",
    },
    {
      label: "Low Stock Alerts",
      value: stats.lowStockProducts,
      href: "/admin/products",
      accent: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your store performance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metricCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-colors hover:border-primary/30">
              <p className="text-sm text-muted-foreground">
                {card.label}
              </p>
              <p
                className={`mt-2 text-2xl font-bold ${card.accent ?? ""}`}
              >
                {card.value}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No orders yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Order</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(
                    (order: Record<string, unknown>) => {
                      const o = order as {
                        _id: { toString(): string };
                        orderNumber: string;
                        total: number;
                        orderStatus: string;
                        user?: { name?: string; email?: string };
                        createdAt: string;
                      };
                      return (
                        <tr
                          key={o._id.toString()}
                          className="border-b last:border-0"
                        >
                          <td className="py-2.5">
                            <Link
                              href={`/admin/orders/${o._id.toString()}`}
                              className="font-medium hover:text-primary"
                            >
                              {o.orderNumber}
                            </Link>
                          </td>
                          <td className="py-2.5 text-muted-foreground">
                            {o.user?.name ?? "—"}
                          </td>
                          <td className="py-2.5 font-medium">
                            {formatCurrency(o.total)}
                          </td>
                          <td className="py-2.5">
                            <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Products</h2>
            <Link
              href="/admin/products"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Product</th>
                    <th className="pb-2 font-medium">Price</th>
                    <th className="pb-2 font-medium">Sales</th>
                    <th className="pb-2 font-medium">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map(
                    (product: Record<string, unknown>) => {
                      const p = product as {
                        _id: { toString(): string };
                        name: string;
                        slug: string;
                        price: number;
                        salesCount: number;
                        stock: number;
                      };
                      return (
                        <tr
                          key={p._id.toString()}
                          className="border-b last:border-0"
                        >
                          <td className="py-2.5">
                            <Link
                              href={`/admin/products/${p._id.toString()}/edit`}
                              className="font-medium hover:text-primary"
                            >
                              {p.name}
                            </Link>
                          </td>
                          <td className="py-2.5">
                            {formatCurrency(p.price)}
                          </td>
                          <td className="py-2.5 text-muted-foreground">
                            {p.salesCount}
                          </td>
                          <td className="py-2.5 text-muted-foreground">
                            {p.stock}
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
