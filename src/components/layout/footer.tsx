import Container from "../ui/container";

export default function Footer() {
  return (
    <footer className="py-8 border-t border-border">
      <Container className="py-8">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} AlphaShop. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
