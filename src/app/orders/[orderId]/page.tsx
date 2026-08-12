import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserOrder } from "@/services/order";
import Link from "next/link";

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { orderId } = await params;

  const order = await getUserOrder(session.user.id, orderId);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-400 text-2xl">
            ✓
          </div>

          <h1 className="mt-5 text-3xl font-bold">Order Confirmed</h1>

          <p className="mt-2 text-muted-foreground">Thank you for your purchase!</p>

          <div className="mt-6 rounded-md bg-muted p-4">
            <p className="text-sm text-muted-foreground">Order ID</p>

            <p className="mt-1 break-all font-medium">{order._id.toString()}</p>
          </div>

          <div className="mt-8 space-y-4 text-left">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>

              <span>${order.subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>

              <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between border-t pt-4 text-lg font-semibold">
              <span>Total</span>

              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/orders" className="rounded-md border px-5 py-3 text-sm font-medium">
              View Orders
            </Link>

            <Link
              href="/products"
              className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
