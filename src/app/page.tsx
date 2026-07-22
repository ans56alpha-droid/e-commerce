import FeaturedCategories from "@/components/sections/featured-categories";
import FeaturedProducts from "@/components/sections/featured-products";
import Features from "@/components/sections/features";
import Hero from "@/components/sections/hero";
import NewArrivals from "@/components/sections/new-arrivals";
import Newsletter from "@/components/sections/newsletter";
import PromoBanner from "@/components/sections/promo-banner";
import { getFeaturedProducts, getNewArrivals } from "@/services/product";
import { getFeaturedCategories } from "@/services/category";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();
  const newArrivalProducts = await getNewArrivals();

  const categories = await getFeaturedCategories();

  return (
    <>
      <Hero />
      <FeaturedCategories categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <PromoBanner />
      <NewArrivals products={newArrivalProducts} />
      <Features />
      <Newsletter />
    </>
  );
}
