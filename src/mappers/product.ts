import type { HydratedDocument } from "mongoose";
import { ProductType } from "@/models/Product";
import type { Product } from "@/types/product";

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