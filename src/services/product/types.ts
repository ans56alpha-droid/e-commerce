import { Types } from "mongoose";
import { ProductImage, ProductSpecification, ProductDimension, ProductSeo } from "@/models/Product";
import { PRODUCT_STATUS } from "@/constants/product";

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