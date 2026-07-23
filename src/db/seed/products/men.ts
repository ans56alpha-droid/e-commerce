import { PRODUCT_STATUS } from "@/constants/product";
import { CategoryMap } from "./types";

export function createMen(categories: CategoryMap) {
  return [
    {
      name: "Classic Oxford Button-Down Shirt",

      shortDescription:
        "A timeless button-down shirt for everyday wear.",

      description:
        "This classic Oxford shirt is crafted from premium cotton for a soft, breathable feel. Features a tailored fit with a button-down collar, perfect for both casual and semi-formal occasions.",

      brand: "Calvin Klein",

      category: categories.men,

      price: 59,

      compareAtPrice: 79,

      costPrice: 30,

      sku: "CK-OXF-001",

      stock: 80,

      images: [
        {
          url: "/products/men/classic-oxford-shirt.jpeg",
          alt: "Classic Oxford Button-Down Shirt",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Material",
          value: "100% Cotton",
        },
        {
          key: "Fit",
          value: "Tailored",
        },
      ],

      tags: ["men", "shirt", "casual"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Slim Fit Stretch Chinos",

      shortDescription:
        "Comfortable slim-fit chinos with stretch fabric.",

      description:
        "These slim-fit chinos are made with a cotton-stretch blend for all-day comfort and mobility. A versatile wardrobe staple available in multiple colors.",

      brand: "Levi's",

      category: categories.men,

      price: 69,

      compareAtPrice: 89,

      costPrice: 35,

      sku: "LEVI-CHI-001",

      stock: 70,

      images: [
        {
          url: "/products/men/slim-fit-chinos.jpeg",
          alt: "Slim Fit Stretch Chinos",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Material",
          value: "Cotton/Spandex",
        },
        {
          key: "Fit",
          value: "Slim",
        },
      ],

      tags: ["men", "pants", "chinos"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Lightweight Bomber Jacket",

      shortDescription:
        "A stylish bomber jacket for layering.",

      description:
        "This lightweight bomber jacket features a smooth polyester shell with ribbed cuffs and hem. Perfect for transitional weather and effortless street style.",

      brand: "Hugo Boss",

      category: categories.men,

      price: 149,

      compareAtPrice: 195,

      costPrice: 85,

      sku: "HB-BMB-001",

      stock: 40,

      images: [
        {
          url: "/products/men/bomber-jacket.jpeg",
          alt: "Lightweight Bomber Jacket",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Material",
          value: "Polyester",
        },
        {
          key: "Fit",
          value: "Regular",
        },
      ],

      tags: ["men", "jacket", "outerwear"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "V-Neck Merino Wool Sweater",

      shortDescription:
        "A soft merino wool sweater for layering.",

      description:
        "Crafted from 100% merino wool, this V-neck sweater provides lightweight warmth with a refined look. Ideal for layering over a shirt or under a blazer.",

      brand: "Ralph Lauren",

      category: categories.men,

      price: 98,

      compareAtPrice: 125,

      costPrice: 55,

      sku: "RL-VNS-001",

      stock: 55,

      images: [
        {
          url: "/products/men/merino-wool-sweater.jpeg",
          alt: "V-Neck Merino Wool Sweater",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Material",
          value: "Merino Wool",
        },
        {
          key: "Fit",
          value: "Regular",
        },
      ],

      tags: ["men", "sweater", "knitwear"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Relaxed Fit Denim Jeans",

      shortDescription:
        "Classic relaxed-fit jeans with durable denim.",

      description:
        "These relaxed-fit jeans are made from heavyweight denim that softens with every wash. A comfortable straight-leg cut with a classic five-pocket design.",

      brand: "Levi's",

      category: categories.men,

      price: 79,

      compareAtPrice: 98,

      costPrice: 40,

      sku: "LEVI-RELJ-001",

      stock: 90,

      images: [
        {
          url: "/products/men/relaxed-denim-jeans.jpeg",
          alt: "Relaxed Fit Denim Jeans",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Material",
          value: "Denim",
        },
        {
          key: "Fit",
          value: "Relaxed",
        },
      ],

      tags: ["men", "jeans", "denim"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
  ];
}