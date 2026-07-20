import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

import Container from "@/components/ui/container";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $100",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% protected checkout",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
  },
];

export default function Features() {
  return (
    <section className="py-16">
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="rounded-xl border p-6 text-center">
                <Icon className="mx-auto mb-4 h-8 w-8 text-primary" />

                <h3 className="font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
