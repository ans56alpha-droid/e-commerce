import { connectDB } from "@/db";

import Category from "@/models/Category";
import Product from "@/models/Product";

import { categorySeed } from "./categories"; 
import { createProductSeed } from "./products";

import { createProduct } from "@/services/product";

async function seed() {
  try {
    await connectDB();

    console.log("Connected to database.");

    // Clear collections
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log("Old data removed.");

    // Insert categories
    const insertedCategories = await Category.insertMany(categorySeed);

    console.log(insertedCategories.length)
    console.log("Categories", insertedCategories.map((c) => c.name));

    console.log("Categories inserted.");

    // Build category lookup
    const categoryMap = {
      men: insertedCategories.find(
        (category) => category.slug === "men"
      )!._id,

      women: insertedCategories.find(
        (category) => category.slug === "women"
      )!._id,

      electronics: insertedCategories.find(
        (category) => category.slug === "electronics"
      )!._id,

      shoes: insertedCategories.find(
        (category) => category.slug === "shoes"
      )!._id,
    };

    // Generate products
    const products = createProductSeed(categoryMap);

    // console.log("Products", products);

    // Save products (runs middleware)
    for (const productData of products) {
       await createProduct(productData);
    }

    console.log("Products inserted.");

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

seed();