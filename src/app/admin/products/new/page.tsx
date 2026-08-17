"use client";

import { useEffect, useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createProductAction } from "@/actions/admin/products";
import { getAdminCategoriesAction } from "@/actions/admin/categories";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";

interface Category {
  _id: { toString(): string };
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createProductAction, {
    success: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    getAdminCategoriesAction().then((cats) => {
      setCategories(cats as Category[]);
      setLoadingCategories(false);
    });
  }, []);

  useEffect(() => {
    if (state.success) {
      router.push("/admin/products");
    }
  }, [state.success, router]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New Product</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new product to your catalog.
        </p>
      </div>

      <Card>
        <form action={formAction} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Name *
            </label>
            <Input name="name" required placeholder="Product name" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                SKU *
              </label>
              <Input
                name="sku"
                required
                placeholder="e.g. PROD-001"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Brand
              </label>
              <Input name="brand" placeholder="Brand name" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Price *
              </label>
              <Input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Stock *
              </label>
              <Input
                name="stock"
                type="number"
                min="0"
                required
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Category *
            </label>
            {loadingCategories ? (
              <Spinner />
            ) : (
              <select
                name="category"
                required
                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id.toString()} value={cat._id.toString()}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Short Description
            </label>
            <Input
              name="shortDescription"
              placeholder="Brief product description"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Detailed product description"
              className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Status
            </label>
            <select
              name="status"
              defaultValue="draft"
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Featured
            </label>
            <select
              name="isFeatured"
              defaultValue="false"
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {state.message && (
            <p
              className={`text-sm ${
                state.success ? "text-green-600" : "text-destructive"
              }`}
            >
              {state.message}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner /> Creating...
                </>
              ) : (
                "Create Product"
              )}
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
