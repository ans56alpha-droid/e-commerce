import { connectDB } from "@/db";

import Product from "@/models/Product";
import { PRODUCT_STATUS } from "@/constants/product";

import "@/models/Category"
import { toProductCard, toProductDetails } from "@/mappers/product";
import { ProductFilters } from "./types";

export async function getFeaturedProducts(limit = 8) {
  return getProducts({ featured: true, limit, sortBy: "newest" });
}

export async function getNewArrivals(limit = 8) {
  return getProducts({ limit, sortBy: "newest" });
}

export async function getProductsByCategory(categoryId: string) {
  return getProducts({ category: categoryId, sortBy: "newest" });
}

export async function getProducts({
  search,
  category,
  brand,
  minPrice,
  maxPrice,
  featured,
  limit = 8,
  page = 1,
  sortBy = "newest",
  status,
}: ProductFilters = {}) {
  await connectDB();

  const query: Record<string, unknown> = {
    status: status ?? PRODUCT_STATUS.PUBLISHED,
    isDeleted: false,
  }

  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        shortDescription: {
          $regex: search,
          $options: "i",
        }
      },
      {
        description: {
          $regex: search,
          $options: "i",
        }
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        }
      }
    ]
  }

  if (category) {
    query.category = category;
  }

  if (brand) {
    query.brand = {
      $regex: brand,
      $options: "i",
    };
  }

  if ( minPrice !== undefined || maxPrice !== undefined) {
    const price: Record<string, number> = {};

    if(minPrice !== undefined) {
      price.$gte = minPrice;
    }

    if(maxPrice !== undefined) {
      price.$lte = maxPrice;
    }

    query.price = price;
  }

  if (featured !== undefined) {
    query.isFeatured = featured;
  }

  // sorting

  let sort: Record<string, 1 | -1> 

  switch (sortBy) {
    case "oldest":
      sort = { createdAt : 1};
      break;

    case "price-asc":
      sort = { price : 1 };
      break;

    case "price-desc":
      sort = { price : -1 };
      break;

    case "rating":
      sort = { averageRating : -1 };
      break;
    
    default:
      sort = { createdAt : -1 };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit),
    Product.countDocuments(query)
  ]);

  return {
    products: products.map(toProductCard),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getProductBySlug(slug: string) {
  await connectDB();

  const product = await Product.findOne({
     slug,
     isDeleted: false,
     status: PRODUCT_STATUS.PUBLISHED,
    }).populate("category");

  return product ? toProductDetails(product) : null;
}