import type { HydratedDocument } from "mongoose";
import { ProductType } from "@/models/Product";
import { CategoryType } from "@/models/Category";

import type { Product, ProductDetails } from "@/types/product";
import type { Populated } from "@/types/mongoose";

export function toProductCard(
    product: HydratedDocument<ProductType>
): Product {

    return {
        id: product._id.toString(),

        name: product.name,

        slug: product.slug ?? "",

        description: product.description,

        image:
            product.images.find(i => i.isPrimary)?.url ??
            product.images[0]?.url ??
            "",

        price: product.price,

        compareAtPrice: product.compareAtPrice ?? undefined,

        rating: product.averageRating,

        reviewCount: product.reviewCount,

        category: product.category.toString(),

        featured: product.isFeatured,

        isNew: false,

        inStock: product.stock > 0,
    };
}

export function toProductDetails(
    product: HydratedDocument<ProductType>
): ProductDetails {

    // const category = product.category as unknown as CategoryType & { _id: { toString(): string } };
    const category = product.category as unknown as Populated<CategoryType>;

    return {
        id: product._id.toString(),

        name: product.name,

        slug: product.slug ?? "",

        shortDescription: product.shortDescription,

        description: product.description,

        price: product.price,

        compareAtPrice: product.compareAtPrice ?? undefined,

        brand: product.brand ?? undefined,

        stock: product.stock,

        images: product.images.map(image => ({
            url: image.url,
            alt: image.alt,
            isPrimary: image.isPrimary,
        })),

        specifications: product.specifications.map(spec => ({
            key: spec.key,
            value: spec.value,
        })),

        category: {
            id: category._id.toString(),

            name: category.name,

            slug: category.slug,
        },

        tags: product.tags,

        rating: product.averageRating,

        reviewCount: product.reviewCount,
    };
}