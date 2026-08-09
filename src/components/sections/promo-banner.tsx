import Image from "next/image";
import Link from "next/link";

import Container from "@/components/ui/container";
import Button from "@/components/ui/button";

import { promoBanner } from "@/data/banner";

export default function PromoBanner() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid overflow-hidden rounded-3xl bg-muted lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-6 p-10">
            <h2 className="text-4xl font-bold">{promoBanner.title}</h2>

            <p className="text-muted-foreground">{promoBanner.description}</p>

            <Button asChild className="w-fit">
              <Link href={promoBanner.button.href}>{promoBanner.button.label}</Link>
            </Button>
          </div>

          <div className="relative min-h-[320px]">
            <Image
              src={promoBanner.image}
              alt={promoBanner.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
