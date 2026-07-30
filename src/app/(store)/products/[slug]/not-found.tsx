import Container from "@/components/ui/container";
import EmptyState from "@/components/shared/empty-state";

export default function ProductNotFound() {
  return (
    <Container className="py-20">
      <EmptyState
        title="Product Not Found"
        description="The product you are looking for does not exist or has been removed."
        action={{ label: "Browse Products", href: "/products" }}
      />
    </Container>
  );
}
