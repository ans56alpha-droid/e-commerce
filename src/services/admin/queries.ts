import { connectDB } from "@/db";
import Order from "@/models/Order";
import { UserModel } from "@/models/User";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function getDashboardStats() {
  await connectDB();

  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: "pending" }),
    Order.countDocuments({ orderStatus: "processing" }),
    Order.countDocuments({ orderStatus: "shipped" }),
    Order.countDocuments({ orderStatus: "delivered" }),
    Order.countDocuments({ orderStatus: "cancelled" }),
    UserModel.countDocuments({ role: "CUSTOMER" }),
    Product.countDocuments({ isDeleted: false }),
    Product.countDocuments({
      isDeleted: false,
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    }),
    Order.find()
      .select(
        "orderNumber total orderStatus paymentStatus createdAt"
      )
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const revenueResult = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);

  const revenue = revenueResult[0]?.total ?? 0;

  return {
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalCustomers,
    totalProducts,
    lowStockProducts,
    revenue,
    recentOrders,
  };
}

export async function getAdminOrderStats() {
  await connectDB();

  const statusCounts = await Order.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  const paymentCounts = await Order.aggregate([
    {
      $group: {
        _id: "$paymentStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  const monthlyRevenue = await Order.aggregate([
    { $match: { paymentStatus: "paid" } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        revenue: { $sum: "$total" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 12 },
  ]);

  return {
    statusCounts: statusCounts.reduce(
      (acc, item) => ({ ...acc, [item._id]: item.count }),
      {} as Record<string, number>
    ),
    paymentCounts: paymentCounts.reduce(
      (acc, item) => ({ ...acc, [item._id]: item.count }),
      {} as Record<string, number>
    ),
    monthlyRevenue,
  };
}

export async function getTopProducts(limit = 10) {
  await connectDB();

  return Product.find({ isDeleted: false })
    .select("name slug price salesCount stock images")
    .sort({ salesCount: -1 })
    .limit(limit)
    .lean();
}

export async function getCategoryStats() {
  await connectDB();

  return Category.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        pipeline: [
          { $match: { isDeleted: false } },
          { $count: "count" },
        ],
        as: "products",
      },
    },
    {
      $project: {
        name: 1,
        slug: 1,
        isActive: 1,
        productCount: {
          $ifNull: [
            { $arrayElemAt: ["$products.count", 0] },
            0,
          ],
        },
      },
    },
    { $sort: { productCount: -1 } },
  ]);
}
