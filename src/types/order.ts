import type {
    OrderItemType,
    ShippingAddressType,
  } from "@/models/Order";
  
  export type CheckoutItemInput = {
    product: string;
    quantity: number;
  };
  
  export type CheckoutInput = {
    items: CheckoutItemInput[];
    shippingAddress: ShippingAddressType;
  };
  
  export type OrderItem = OrderItemType;
  
  export type ShippingAddress = ShippingAddressType;