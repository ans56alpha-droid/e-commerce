import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Sony WH-1000XM5",
    slug: "sony-wh1000xm5",
    description: "Premium wireless headphones.",

    price: 349,

    compareAtPrice: 399,

    image: "/products/headphones.jpg",

    rating: 4.8,

    reviewCount: 520,

    category: "electronics",

    featured: true,

    isNew: true,

    inStock: true,
  },

  {
    id: "2",
    name: "Apple Watch Ultra",
    slug: "apple-watch-ultra",
    description: "Smart watch.",

    price: 799,

    image: "/products/watch.jpg",

    rating: 4.9,

    reviewCount: 312,

    category: "electronics",

    featured: true,

    isNew: false,

    inStock: true,
  },
];