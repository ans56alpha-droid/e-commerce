import Container from "@/components/ui/container";
import EmptyState from "@/components/shared/empty-state";

export default function CategoryNotFound() {
  return (
    <Container className="py-20">
      <EmptyState
        title="Category Not Found"
        description="The category you are looking for does not exist or has been removed."
        action={{ label: "Browse Categories", href: "/categories" }}
      />
    </Container>
  );
}
