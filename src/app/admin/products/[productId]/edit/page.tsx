"use client";

import { useEffect, useState, useActionState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

import { updateProductAction } from "@/actions/admin/products";
import { getAdminCategoriesAction } from "@/actions/admin/categories";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";

interface Category {
  _id: { toString(): string };
  name: string;
}

interface ProductData {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: { _id: string; name: string } | string;
  brand: string;
  description: string;
  shortDescription: string;
  status: string;
  isFeatured: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [state, formAction, isPending] = useActionState(updateProductAction, {
    success: false,
  });

  const [product, setProduct] = useState<ProductData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [cats, productsRes] = await Promise.all([
        getAdminCategoriesAction(),
        import("@/actions/admin/products").then((m) =>
          m.getAdminProductsAction(1, {}),
        ),
      ]);

      setCategories(cats as Category[]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const found = (productsRes.products as any[]).find(
        (p) => String(p._id) === productId,
      );

      if (!found) {
        setLoading(false);
        return;
      }

      setProduct({
        _id: String(found._id),
        name: found.name,
        sku: found.sku,
        price: found.price,
        stock: found.stock,
        category: typeof found.category === "object"
          ? { _id: String(found.category._id), name: found.category.name }
          : String(found.category),
        brand: found.brand ?? "",
        description: found.description ?? "",
        shortDescription: found.shortDescription ?? "",
        status: found.status,
        isFeatured: found.isFeatured ?? false,
      });
      setLoading(false);
    }

    load();
  }, [productId]);

  useEffect(() => {
    if (state.success) {
      router.push("/admin/products");
    }
  }, [state.success, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <p className="py-20 text-center text-muted-foreground">
        Product not found.
      </p>
    );
  }

  const categoryId =
    typeof product.category === "object"
      ? product.category._id
      : product.category;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update product information.
        </p>
      </div>

      <Card>
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="productId" value={productId} />

          <div>
            <label className="mb-1 block text-sm font-medium">
              Name *
            </label>
            <Input
              name="name"
              required
              defaultValue={product.name}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                SKU *
              </label>
              <Input
                name="sku"
                required
                defaultValue={product.sku}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Brand
              </label>
              <Input
                name="brand"
                defaultValue={product.brand}
              />
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
                defaultValue={product.price}
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
                defaultValue={product.stock}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Category *
            </label>
            <select
              name="category"
              required
              defaultValue={categoryId}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option
                  key={cat._id.toString()}
                  value={cat._id.toString()}
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Short Description
            </label>
            <Input
              name="shortDescription"
              defaultValue={product.shortDescription}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product.description}
              className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Status
              </label>
              <select
                name="status"
                defaultValue={product.status}
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
                defaultValue={product.isFeatured ? "true" : "false"}
                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
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
                  <Spinner /> Saving...
                </>
              ) : (
                "Save Changes"
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
