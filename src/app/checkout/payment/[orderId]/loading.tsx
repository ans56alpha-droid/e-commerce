import Skeleton from "@/components/ui/skeleton";

export default function PaymentLoading() {
  return (
    <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-lg border p-8 text-center">
        <Skeleton className="mx-auto h-8 w-64" />

        <Skeleton className="mx-auto mt-3 h-4 w-72" />

        <Skeleton className="mx-auto mt-6 h-11 w-full rounded-md" />
      </div>
    </main>
  );
}
