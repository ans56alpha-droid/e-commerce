import { Types } from "mongoose";
import { ProductImage, ProductSpecification, ProductDimension, ProductSeo } from "@/models/Product";
import { PRODUCT_STATUS } from "@/constants/product";
import { Product } from "@/types/product";

export interface CreateProductInput {
  name: string;

  shortDescription: string;

  description?: string;

  category: Types.ObjectId;

  brand?: string;

  price: number;

  compareAtPrice?: number;

  costPrice?: number;

  sku: string;

  stock: number;

  lowStockThreshold?: number;

  images?: ProductImage[];

  specifications?: ProductSpecification[];

  dimensions?: ProductDimension;

  seo?: ProductSeo;

  tags?: string[];

  status?: (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

  isFeatured?: boolean;
}

export interface ProductFilters {
  search?: string;

  category?: string;

  brand?: string;

  minPrice?: number;

  maxPrice?: number;

  featured?: boolean;

  status?: (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

  sortBy?:
    | "newest"
    | "oldest"
    | "price-asc"
    | "price-desc"
    | "rating";

  page?: number;

  limit?: number;
}

export interface PaginatedProducts {
  products:  Product[];

  total: number;

  page: number;

  totalPages: number;

  limit: number;
}