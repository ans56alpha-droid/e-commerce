import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getCart } from "@/services/cart";

import CheckoutForm from "@/components/checkout/checkout-form";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/checkout");
  }

  const cart = await getCart(session.user.id);

  if (!cart || cart.items.length === 0) {
    redirect("/cart");
  }

  const subtotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shipping = subtotal >= 100 ? 0 : 10;

  const total = subtotal + shipping;

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <p className="mt-2 text-muted-foreground">Complete your information to place your order.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <section>
          <CheckoutForm />
        </section>

        <aside className="h-fit rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="mt-6 space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex justify-between gap-4">
                <div>
                  <p className="font-medium">{item.name}</p>

                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>

                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 border-t pt-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>

              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>

              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between border-t pt-3 text-lg font-semibold">
              <span>Total</span>

              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
