import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserOrders } from "@/services/order";

import Container from "@/components/ui/container";
import EmptyState from "@/components/shared/empty-state";
import ProductPagination from "@/components/shop/product-pagination";
import OrderCard from "@/components/orders/order-card";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history and order details.",
};

interface OrdersPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function OrdersPage({
  searchParams,
}: OrdersPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const { page: pageParam } = await searchParams;

  const requestedPage = pageParam ? Number(pageParam) : 1;

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const {
    orders,
    page: currentPage,
    totalPages,
  } = await getUserOrders(session.user.id, page);

  return (
    <main className="py-10">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>

          <p className="mt-2 text-muted-foreground">
            View your order history and order details.
          </p>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Start shopping to place your first order."
            action={{
              label: "Continue Shopping",
              href: "/products",
            }}
          />
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => (
                <OrderCard
                  key={order._id.toString()}
                  order={order}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <ProductPagination
                page={currentPage}
                totalPages={totalPages}
              />
            )}
          </>
        )}
      </Container>
    </main>
  );
}
