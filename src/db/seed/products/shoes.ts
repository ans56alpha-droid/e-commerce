import { PRODUCT_STATUS } from "@/constants/product";
import { CategoryMap } from "./types";

export function createShoes(categories: CategoryMap) {
  // console.log("=== NEW SHOES FILE LOADED ===");
  return [
    {
      name: "Nike Air Max 270",

      shortDescription:
        "Comfortable everyday running shoes.",

      description:
        "Nike Air Max 270 with breathable mesh and responsive Air cushioning for all-day comfort.",

      brand: "Nike",

      category: categories.shoes,

      price: 120,

      compareAtPrice: 150,

      costPrice: 80,

      sku: "NK-AM270-001",

      stock: 50,

      images: [
        {
          url: "/products/shoes/nike-air-max-270.jpeg",
          alt: "Nike Air Max 270",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Material",
          value: "Mesh",
        },
        {
          key: "Color",
          value: "White",
        },
      ],

      tags: ["nike", "running"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Adidas Ultraboost Light",
    
      shortDescription:
        "Responsive running shoes with lightweight cushioning.",
    
      description:
        "The Adidas Ultraboost Light features Light BOOST foam for superior comfort and energy return during everyday wear and long-distance runs.",
    
      category: categories.shoes,
    
      brand: "Adidas",
    
      price: 180,
    
      compareAtPrice: 220,
    
      costPrice: 120,
    
      sku: "ADI-UBL-001",
    
      stock: 35,
    
      images: [
        {
          url: "/products/shoes/adidas-ultraboost-light.jpg",
          alt: "Adidas Ultraboost Light",
          isPrimary: true,
        },
      ],
    
      specifications: [
        {
          key: "Material",
          value: "Primeknit",
        },
        {
          key: "Color",
          value: "Red",
        },
      ],
    
      tags: [
        "running",
        "sports",
        "adidas",
      ],
    
      status: PRODUCT_STATUS.PUBLISHED,
    
      isFeatured: true,
    },
    {
      name: "Puma RS-X",
    
      shortDescription:
        "Responsive running shoes with lightweight cushioning.",
    
      description:
        "The Puma RS-X features Light BOOST foam for superior comfort and energy return during everyday wear and long-distance runs.",
    
      category: categories.shoes,
    
      brand: "Puma",
    
      price: 180,
    
      compareAtPrice: 220,
    
      costPrice: 120,
    
      sku: "PUMA-RSX-001",
    
      stock: 35,
    
      images: [
        {
          url: "/products/shoes/puma-rsx.jpeg",
          alt: "Adidas Ultraboost Light",
          isPrimary: true,
        },
      ],
    
      specifications: [
        {
          key: "Material",
          value: "Primeknit",
        },
        {
          key: "Color",
          value: "White",
        },
      ],
    
      tags: [
        "running",
        "sports",
        "adidas",
      ],
    
      status: PRODUCT_STATUS.PUBLISHED,
    
      isFeatured: true,
    },
    {
      name: "New Balance 574",
    
      shortDescription:
        "Responsive running shoes with lightweight cushioning.",
    
      description:
        "The New Balance 574 features Light BOOST foam for superior comfort and energy return during everyday wear and long-distance runs.",
    
      category: categories.shoes,
    
      brand: "Adidas",
    
      price: 180,
    
      compareAtPrice: 220,
    
      costPrice: 120,
    
      sku: "NB-574-001",
    
      stock: 35,
    
      images: [
        {
          url: "/products/shoes/new-balance-574.jpeg",
          alt: "Adidas Ultraboost Light",
          isPrimary: true,
        },
      ],
    
      specifications: [
        {
          key: "Material",
          value: "Primeknit",
        },
        {
          key: "Color",
          value: "White",
        },
      ],
    
      tags: [
        "running",
        "sports",
        "adidas",
      ],
    
      status: PRODUCT_STATUS.PUBLISHED,
    
      isFeatured: true,
    }
  ];
}