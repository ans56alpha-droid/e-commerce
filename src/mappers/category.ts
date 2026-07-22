import type { Types } from "mongoose";
import { CategoryType } from "@/models/Category";
import type { Category } from "@/types/category";

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
        productCount: category.productCount,
    };
}










// export interface Category {
//     id: string;
//     name: string;
//     slug: string;
//     image: string;
//     productCount: number;
// }

