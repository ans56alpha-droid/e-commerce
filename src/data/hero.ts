import type { HeroData } from "@/types/hero";

export const heroData: HeroData = {
  title: "Discover Premium Products for Everyday Life",

  description:
    "Shop the latest electronics, fashion, and accessories with fast delivery and secure checkout.",

  primaryButton: {
    label: "Shop Now",
    href: "/shop",
  },

  secondaryButton: {
    label: "Browse Categories",
    href: "/categories",
  },

  image: "/hero/image-1.jpg",

  imageAlt: "Featured products",
};