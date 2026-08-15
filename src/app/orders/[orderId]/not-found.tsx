import NotFoundState from "@/components/shared/not-found-state";

export default function OrderNotFound() {
  return (
    <NotFoundState
      title="Order not found"
      description="We couldn't find an order matching that ID. It may have been removed, or you may not have access to it."
      actionHref="/orders"
      actionLabel="Back to Orders"
    />
  );
}
