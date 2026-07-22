import { connectDB } from "@/db";
import Category from "@/models/Category";
import { PRODUCT_STATUS } from "@/constants/product";
import { toCategoryCard } from "@/mappers/category";


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