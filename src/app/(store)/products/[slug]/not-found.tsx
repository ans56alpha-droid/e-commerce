import Container from "@/components/ui/container";
import NotFoundState from "@/components/shared/not-found-state";

export default function ProductNotFound() {
  return (
    <Container className="py-20">
      <NotFoundState
        title="Product Not Found"
        description="The product you are looking for does not exist or has been removed."
        actionHref="/products"
        actionLabel="Browse Products"
      />
    </Container>
  );
}
