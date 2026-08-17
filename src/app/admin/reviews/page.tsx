"use client";

import { useEffect, useState } from "react";

import { getAdminReviewsAction, deleteReviewAction } from "@/actions/admin/reviews";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import ConfirmAction from "@/components/ui/confirm-action";
import type { ActionResult } from "@/types/action";

interface Review {
  _id: { toString(): string };
  rating: number;
  title: string;
  comment: string;
  user?: { name?: string; email?: string };
  product?: { name?: string; slug?: string };
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<{
    reviews: Review[];
    page: number;
    totalPages: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    let cancelled = false;
    setLoading(true);

    getAdminReviewsAction(page, search || undefined).then((res) => {
      if (!cancelled) {
        setData(JSON.parse(JSON.stringify(res)));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [page, search]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Moderate customer reviews.
        </p>
      </div>

      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Search by product name
            </label>
            <Input
              placeholder="Product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit" variant="outline" size="sm">
            Search
          </Button>
        </form>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : !data || data.reviews.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No reviews found.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {data.reviews.map((review) => (
              <Card key={review._id.toString()} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={i < review.rating ? "text-yellow-500" : "text-gray-300"}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        by {review.user?.name ?? "Unknown"}
                      </span>
                    </div>

                    {review.title && (
                      <h3 className="font-semibold">{review.title}</h3>
                    )}

                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Product: {review.product?.name ?? "—"}</span>
                      <span>•</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <ConfirmAction
                      action={async (
                        _prev: ActionResult,
                        _fd: FormData,
                      ) => deleteReviewAction(review._id.toString())}
                      confirmLabel="Delete"
                      confirmMessage="Are you sure you want to delete this review?"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="px-3 text-sm text-muted-foreground">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
