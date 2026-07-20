import FeaturedCategories from "@/components/sections/featured-categories";
import FeaturedProducts from "@/components/sections/featured-products";
import Features from "@/components/sections/features";
import Hero from "@/components/sections/hero";
import NewArrivals from "@/components/sections/new-arrivals";
import Newsletter from "@/components/sections/newsletter";
import PromoBanner from "@/components/sections/promo-banner";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromoBanner />
      <NewArrivals />
      <Features />
      <Newsletter />
    </>
  );
}
