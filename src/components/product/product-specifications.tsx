import type { ProductDetails } from "@/types/product";
import Card from "@/components/ui/card";

interface ProductSpecificationsProps {
  specifications: ProductDetails["specifications"];
}

export default function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  if (!specifications || specifications.length === 0) {
    return (
      <Card className="m-2">
        <h2 className="mb-4 text-lg font-semibold">Specifications</h2>
        <p className="text-muted-foreground">No specifications available for this product.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold">Specifications</h2>
      <table className="w-full text-sm">
        <tbody>
          {specifications.map((spec) => (
            <tr key={spec.key} className="border-b border-border last:border-0">
              <td className="py-2 pr-4 font-medium text-muted-foreground">{spec.key}</td>
              <td className="py-2">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
