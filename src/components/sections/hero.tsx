import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/button";
import Container from "@/components/ui/container";
import { heroData } from "@/data/hero";

export default function Hero() {
  return (
    <section className="group relative overflow-hidden py-16 lg:py-24">
      <Image
        src={heroData.image}
        alt={heroData.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />

      <div className="absolute inset-0 bg-black/40" />

      <Container className="relative z-10">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl font-bold text-white lg:text-6xl">{heroData.title}</h1>

          <p className="text-lg text-gray-200">{heroData.description}</p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild className="hover:scale-105 transition-transform duration-300">
              <Link href={heroData.primaryButton.href}>{heroData.primaryButton.label}</Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href={heroData.secondaryButton.href}>{heroData.secondaryButton.label}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
