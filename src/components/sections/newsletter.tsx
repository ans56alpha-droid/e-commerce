import Container from "@/components/ui/container";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="text-4xl font-bold">Subscribe to Our Newsletter</h2>

          <p className="mx-auto mt-4 max-w-xl">
            Get exclusive offers, new arrivals, and product updates.
          </p>

          <form className="mx-auto mt-8 flex max-w-lg flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-background text-foreground"
            />

            <Button type="submit" variant="secondary">
              Subscribe
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
