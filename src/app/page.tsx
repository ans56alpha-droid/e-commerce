import FeaturedCategories from "@/components/sections/featured-categories";
import FeaturedProducts from "@/components/sections/featured-products";
import Hero from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
    </>
  );
}
