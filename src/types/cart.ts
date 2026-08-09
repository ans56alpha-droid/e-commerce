import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  user: string;
  items: CartItem[];
}