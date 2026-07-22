import { Types } from "mongoose";
import { PRODUCT_STATUS } from "@/constants/product";
// import { slugify } from "@/utils/slugify";

type CategoryMap = {
  men: Types.ObjectId;
  women: Types.ObjectId;
  electronics: Types.ObjectId;
  shoes: Types.ObjectId;
};

export function createProductSeed(categories: CategoryMap) {
  return [
    {
      name: "Nike Air Max 270",

    //   slug: slugify("Nike Air Max 270"),

      shortDescription: "Comfortable running shoes.",

      description:
        "Nike Air Max 270 with breathable mesh and Air cushioning.",

      category: categories.shoes,

      brand: "Nike",

      price: 120,

      compareAtPrice: 150,

      costPrice: 80,

      sku: "NK-AM270-001",

      stock: 50,

      images: [
        {
          url: "/products/nike-air-max-270.jpeg",
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
  ];
}