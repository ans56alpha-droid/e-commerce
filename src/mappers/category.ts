import type { Types } from "mongoose";
import { CategoryType } from "@/models/Category";
import type { Category, CategoryOption } from "@/types/category";

type CategoryWithCount = CategoryType & {
    _id: Types.ObjectId;
    productCount: number;
}

export function toCategoryCard(
    category: CategoryWithCount
): Category {

    return {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        image: category.image,
        description: category.description || undefined,
        productCount: category.productCount,
    };
}

export function toCategoryOption(
    category: CategoryType & { _id: Types.ObjectId }
): CategoryOption {
    return {
        id: category._id.toString(),
        name: category.name,
    };
}

