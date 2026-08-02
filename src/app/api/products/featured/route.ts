import { NextResponse } from "next/server"; 
import { getFeaturedProducts } from "@/services/product";

export async function GET() {
  try {
    const products = await getFeaturedProducts();

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch featured products.",
      },
      {
        status: 500,
      }
    );
  }
}