import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserOrders } from "@/services/order";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>

        <p className="mt-2 text-muted-foreground">View your order history and order details.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <h2 className="text-xl font-semibold">No orders yet</h2>

          <p className="mt-2 text-muted-foreground">You haven&apos;t placed any orders yet.</p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id.toString()}
              href={`/orders/${order._id.toString()}`}
              className="block rounded-lg border p-5 transition hover:bg-muted/50"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>

                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>

                    <p className="font-medium capitalize">{order.orderStatus}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
