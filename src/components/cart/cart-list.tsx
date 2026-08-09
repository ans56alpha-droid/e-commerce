import CartItem from "./cart-item";

import type { Cart } from "@/mappers/cart";

interface CartListProps {
  cart: Cart;
}

export default function CartList({ cart }: CartListProps) {
  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {cart.items.map((item) => (
        <CartItem key={item.productId} item={item} />
      ))}
    </div>
  );
}
