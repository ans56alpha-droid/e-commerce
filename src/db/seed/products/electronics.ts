import { PRODUCT_STATUS } from "@/constants/product";
import { CategoryMap } from "./types";

export function createElectronics(categories: CategoryMap) {
  return [
    {
      name: "Sony WH-1000XM5",

      shortDescription:
        "Premium noise-cancelling wireless headphones.",

      description:
        "The Sony WH-1000XM5 industry-leading noise cancellation with Auto NC Optimizer, crystal clear hands-free calling, and exceptional sound quality.",

      brand: "Sony",

      category: categories.electronics,

      price: 348,

      compareAtPrice: 399,

      costPrice: 250,

      sku: "SONY-WH1000XM5-001",

      stock: 40,

      images: [
        {
          url: "/products/electronics/sony-wh-1000xm5.jpeg",
          alt: "Sony WH-1000XM5",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Type",
          value: "Over-Ear",
        },
        {
          key: "Battery Life",
          value: "30 hours",
        },
      ],

      tags: ["sony", "headphones", "noise-cancelling"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Apple AirPods Pro 2",

      shortDescription:
        "Active noise-cancelling true wireless earbuds.",

      description:
        "Apple AirPods Pro 2 with adaptive transparency, personalized spatial audio, and up to 2x more noise cancellation than the previous generation.",

      brand: "Apple",

      category: categories.electronics,

      price: 249,

      compareAtPrice: 279,

      costPrice: 170,

      sku: "APPL-APP2-001",

      stock: 60,

      images: [
        {
          url: "/products/electronics/apple-airpods-pro-2.jpeg",
          alt: "Apple AirPods Pro 2",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Type",
          value: "In-Ear",
        },
        {
          key: "Battery Life",
          value: "6 hours",
        },
      ],

      tags: ["apple", "earbuds", "wireless"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Samsung Galaxy S24 Ultra",

      shortDescription:
        "Flagship smartphone with AI-powered features.",

      description:
        "Samsung Galaxy S24 Ultra with titanium frame, 200MP camera, built-in S Pen, and Galaxy AI for intelligent productivity and creativity.",

      brand: "Samsung",

      category: categories.electronics,

      price: 1299,

      compareAtPrice: 1419,

      costPrice: 900,

      sku: "SAM-S24U-001",

      stock: 25,

      images: [
        {
          url: "/products/electronics/samsung-galaxy-s24-ultra.jpeg",
          alt: "Samsung Galaxy S24 Ultra",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Display",
          value: "6.8 inch Dynamic AMOLED 2X",
        },
        {
          key: "Storage",
          value: "256GB",
        },
      ],

      tags: ["samsung", "smartphone", "flagship"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Apple MacBook Air M3",

      shortDescription:
        "Thin and light laptop with M3 chip performance.",

      description:
        "Apple MacBook Air with M3 chip delivers blazing-fast performance in an ultraportable design with up to 18 hours of battery life and a stunning Liquid Retina display.",

      brand: "Apple",

      category: categories.electronics,

      price: 1099,

      compareAtPrice: 1199,

      costPrice: 780,

      sku: "APPL-MBA-M3-001",

      stock: 20,

      images: [
        {
          url: "/products/electronics/apple-macbook-air-m3.jpeg",
          alt: "Apple MacBook Air M3",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Chip",
          value: "Apple M3",
        },
        {
          key: "RAM",
          value: "8GB",
        },
      ],

      tags: ["apple", "laptop", "macbook"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Sony PlayStation 5",

      shortDescription:
        "Next-gen gaming console with 4K gaming.",

      description:
        "Sony PlayStation 5 with ultra-high speed SSD, ray tracing, 3D audio, and DualSense wireless controller for immersive gaming.",

      brand: "Sony",

      category: categories.electronics,

      price: 499,

      compareAtPrice: 549,

      costPrice: 380,

      sku: "SONY-PS5-001",

      stock: 15,

      images: [
        {
          url: "/products/electronics/sony-playstation-5.jpeg",
          alt: "Sony PlayStation 5",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Storage",
          value: "825GB SSD",
        },
        {
          key: "Resolution",
          value: "4K",
        },
      ],

      tags: ["sony", "gaming", "console"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
  ];
}