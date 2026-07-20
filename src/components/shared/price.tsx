interface PriceProps {
  price: number;
  compareAtPrice?: number;
}

export default function Price({ price, compareAtPrice }: PriceProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold">${price}</span>

      {compareAtPrice && (
        <span className="text-sm text-muted-foreground line-through">${compareAtPrice}</span>
      )}
    </div>
  );
}
