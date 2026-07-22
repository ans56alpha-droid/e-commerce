import { connectDB } from "@/db";

import Category from "@/models/Category";
import Product from "@/models/Product";

import { categorySeed } from "./categories";
import { createProductSeed } from "./products";

async function seed() {
  await connectDB();

  console.log("Connected.");

  // Delete old data
  await Product.deleteMany({});
  await Category.deleteMany({});

  console.log("Old data removed.");

  // Insert categories
  const insertedCategories = await Category.insertMany(categorySeed);

  console.log("Categories inserted.");

  // Create category lookup
  const categoryMap = {
    men: insertedCategories.find((c) => c.slug === "men")!._id,

    women: insertedCategories.find((c) => c.slug === "women")!._id,

    electronics: insertedCategories.find(
      (c) => c.slug === "electronics"
    )!._id,

    shoes: insertedCategories.find((c) => c.slug === "shoes")!._id,
  };

//   console.log("categoryMap", categoryMap);

  // Generate products
  const products = createProductSeed(categoryMap);

  // Insert products
  await Product.insertMany(products);

  console.log("Products inserted.");

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});