import { PRODUCT_STATUS } from "@/constants/product";
import { CategoryMap } from "./types";

export function createWomen(categories: CategoryMap) {
  return [
    {
      name: "Floral Print Midi Dress",

      shortDescription:
        "An elegant floral midi dress for any occasion.",

      description:
        "This floral print midi dress features a flattering A-line silhouette with a flowing hemline. Crafted from lightweight fabric, it's perfect for daytime outings and special occasions.",

      brand: "Zara",

      category: categories.women,

      price: 89,

      compareAtPrice: 119,

      costPrice: 45,

      sku: "ZAR-FMD-001",

      stock: 50,

      images: [
        {
          url: "/products/women/floral-midi-dress.jpeg",
          alt: "Floral Print Midi Dress",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Material",
          value: "Viscose",
        },
        {
          key: "Fit",
          value: "A-Line",
        },
      ],

      tags: ["women", "dress", "floral"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "High-Waist Skinny Jeans",

      shortDescription:
        "Flattering high-waist jeans with stretch comfort.",

      description:
        "These high-waist skinny jeans hug your curves with a premium stretch denim that holds its shape all day. A must-have wardrobe essential.",

      brand: "Zara",

      category: categories.women,

      price: 49,

      compareAtPrice: 69,

      costPrice: 22,

      sku: "ZAR-HWSJ-001",

      stock: 100,

      images: [
        {
          url: "/products/women/high-waist-skinny-jeans.jpeg",
          alt: "High-Waist Skinny Jeans",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Material",
          value: "Cotton/Elastane",
        },
        {
          key: "Fit",
          value: "Skinny",
        },
      ],

      tags: ["women", "jeans", "skinny"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Cashmere Blend Cardigan",

      shortDescription:
        "A luxurious cashmere blend cardigan for layering.",

      description:
        "This cashmere blend cardigan offers an ultra-soft feel with a relaxed fit. Features front pockets and a button closure, perfect for cozy layering.",

      brand: "H&M",

      category: categories.women,

      price: 79,

      compareAtPrice: 99,

      costPrice: 40,

      sku: "HM-CBC-001",

      stock: 45,

      images: [
        {
          url: "/products/women/cashmere-cardigan.jpeg",
          alt: "Cashmere Blend Cardigan",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Material",
          value: "Cashmere/Wool",
        },
        {
          key: "Fit",
          value: "Relaxed",
        },
      ],

      tags: ["women", "cardigan", "knitwear"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Silk Wrap Blouse",

      shortDescription:
        "An elegant silk blouse with a flattering wrap design.",

      description:
        "This silk wrap blouse drapes beautifully with a V-neckline and adjustable waist tie. A polished piece that transitions from office to evening.",

      brand: "Reiss",

      category: categories.women,

      price: 125,

      compareAtPrice: 155,

      costPrice: 65,

      sku: "REI-SWB-001",

      stock: 30,

      images: [
        {
          url: "/products/women/silk-wrap-blouse.jpeg",
          alt: "Silk Wrap Blouse",
          isPrimary: true,
        },
      ],

      specifications: [
        {
          key: "Material",
          value: "Silk",
        },
        {
          key: "Fit",
          value: "Wrap",
        },
      ],

      tags: ["women", "blouse", "silk"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
    {
      name: "Pleated Tennis Skirt",

      shortDescription:
        "A sporty pleated skirt for casual and active wear.",

      description:
        "This pleated tennis skirt features a built-in short liner and a flattering high-waist design. Made from lightweight, breathable fabric.",

      brand: "Nike",

      category: categories.women,

      price: 45,

      compareAtPrice: 60,

      costPrice: 20,

      sku: "NK-PTS-001",

      stock: 75,

      images: [
        {
          url: "/products/women/pleated-tennis-skirt.jpeg",
          alt: "Pleated Tennis Skirt",
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
          value: "High-Waist",
        },
      ],

      tags: ["women", "skirt", "sporty"],

      status: PRODUCT_STATUS.PUBLISHED,

      isFeatured: true,
    },
  ];
}