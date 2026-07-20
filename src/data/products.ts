import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Product 1",
    slug: "product-1",
    price: 9.99,
    image: "/images/product-1.jpg",
    category: "Electronics",
    featured: true,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Product 2",
    slug: "product-2",
    price: 19.99,
    image: "/images/product-2.jpg",
    category: "Electronics",
    featured: false,
    rating: 4,
  },
  {
    id: "3",
    name: "Product 3",
    slug: "product-3",
    price: 24.99,
    image: "/images/product-3.jpg",
    category: "Electronics",
    featured: false,
    rating: 3.5,
  },
  {
    id: "4",
    name: "Product 4",
    slug: "product-4",
    price: 34.99,
    image: "/images/product-4.jpg",
    category: "Electronics",
    featured: false,
    rating: 4.5,
  },
  {
    id: "5",
    name: "Product 5",
    slug: "product-5",
    price: 39.99,
    image: "/images/product-5.jpg",
    category: "Electronics",
    featured: false,
    rating: 4.5,
  }
]