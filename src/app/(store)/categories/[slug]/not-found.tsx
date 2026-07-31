import Container from "@/components/ui/container";
import NotFoundState from "@/components/shared/not-found-state";

export default function CategoryNotFound() {
  return (
    <Container className="py-20">
      <NotFoundState
        title="Category Not Found"
        description="The category you are looking for does not exist or has been removed."
        actionHref="/categories"
        actionLabel="Browse Categories"
      />
    </Container>
  );
}
