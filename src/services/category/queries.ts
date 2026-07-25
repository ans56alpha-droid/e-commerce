import { connectDB } from "@/db";
import Category from "@/models/Category";
import { PRODUCT_STATUS } from "@/constants/product";
import { toCategoryCard, toCategoryOption } from "@/mappers/category";
import type { CategoryOption } from "@/types/category";


export async function getFeaturedCategories() {
    await connectDB();

    const categories = await Category.aggregate([
        {
            $match: {
                isFeatured: true,
                isActive: true
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "category",
                as: "products"
            }
        },
        {
            $addFields: {
                productCount: {
                    $size: {
                        $filter: {
                            input: "$products",
                            as: "product",
                            cond: {
                                $and: [
                                    {$eq: ["$$product.isDeleted", false]},
                                    {$eq: ["$$product.status", PRODUCT_STATUS.PUBLISHED]}
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                products: 0,
            }
        }
    ]);

    return categories.map(toCategoryCard);

}

export async function getActiveCategories(): Promise<CategoryOption[]> {
    await connectDB();

    const categories = await Category.find({ isActive: true })
        .sort({ sortOrder: 1, name: 1 })
        .select("name")
        .lean();

    return categories.map(toCategoryOption);
}
