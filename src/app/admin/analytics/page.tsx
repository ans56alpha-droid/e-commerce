import type { Metadata } from "next";

import { getDashboardStats, getAdminOrderStats, getTopProducts, getCategoryStats } from "@/services/admin";
import { formatCurrency } from "@/lib/format-currency";
import Card from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Analytics",
  description: "View store analytics and reports.",
};

export default async function AdminAnalyticsPage() {
  const [stats, orderStats, topProducts, categoryStats] = await Promise.all([
    getDashboardStats(),
    getAdminOrderStats(),
    getTopProducts(10),
    getCategoryStats(),
  ]);

  const totalReturned = orderStats.statusCounts["returned"] ?? 0;
  const averageOrderValue =
    stats.totalOrders > 0 ? stats.revenue / stats.totalOrders : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Insights and reports for your store.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {formatCurrency(stats.revenue)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="mt-2 text-2xl font-bold">{stats.totalOrders}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Avg Order Value</p>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(averageOrderValue)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="mt-2 text-2xl font-bold">{stats.totalCustomers}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Orders by Status</h2>
          <div className="space-y-3">
            {[
              { label: "Pending", value: orderStats.statusCounts["pending"] ?? 0, color: "bg-amber-500" },
              { label: "Processing", value: orderStats.statusCounts["processing"] ?? 0, color: "bg-blue-500" },
              { label: "Shipped", value: orderStats.statusCounts["shipped"] ?? 0, color: "bg-blue-400" },
              { label: "Delivered", value: orderStats.statusCounts["delivered"] ?? 0, color: "bg-green-500" },
              { label: "Cancelled", value: orderStats.statusCounts["cancelled"] ?? 0, color: "bg-red-500" },
              { label: "Returned", value: totalReturned, color: "bg-orange-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                <span className="flex-1 text-sm">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Payment Status</h2>
          <div className="space-y-3">
            {[
              { label: "Pending", value: orderStats.paymentCounts["pending"] ?? 0 },
              { label: "Paid", value: orderStats.paymentCounts["paid"] ?? 0 },
              { label: "Failed", value: orderStats.paymentCounts["failed"] ?? 0 },
              { label: "Refunded", value: orderStats.paymentCounts["refunded"] ?? 0 },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map(
                (product: Record<string, unknown>) => {
                  const p = product as {
                    _id: { toString(): string };
                    name: string;
                    price: number;
                    salesCount: number;
                    stock: number;
                  };
                  return (
                    <div key={p._id.toString()} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(p.price)} · Stock: {p.stock}
                        </p>
                      </div>
                      <span className="text-sm font-medium">{p.salesCount} sales</span>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Categories</h2>
          {categoryStats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="space-y-3">
              {categoryStats.map(
                (cat: Record<string, unknown>) => {
                  const c = cat as {
                    _id: { toString(): string };
                    name: string;
                    isActive: boolean;
                    productCount: number;
                  };
                  return (
                    <div key={c._id.toString()} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.isActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <span className="text-sm font-medium">{c.productCount} products</span>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </Card>
      </div>

      {orderStats.monthlyRevenue.length > 0 && (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Monthly Revenue</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 font-medium">Month</th>
                  <th className="pb-2 font-medium">Orders</th>
                  <th className="pb-2 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {orderStats.monthlyRevenue.map(
                  (item: Record<string, unknown>) => {
                    const m = item as {
                      _id: { year: number; month: number };
                      revenue: number;
                      count: number;
                    };
                    return (
                      <tr key={`${m._id.year}-${m._id.month}`} className="border-b last:border-0">
                        <td className="py-2.5">
                          {new Date(m._id.year, m._id.month - 1).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                          })}
                        </td>
                        <td className="py-2.5">{m.count}</td>
                        <td className="py-2.5 text-right font-medium">
                          {formatCurrency(m.revenue)}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
