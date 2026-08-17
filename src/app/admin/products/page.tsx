"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  getAdminProductsAction,
  deleteProductAction,
} from "@/actions/admin/products";
import { formatCurrency } from "@/lib/format-currency";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import ConfirmAction from "@/components/ui/confirm-action";
import type { ActionResult } from "@/types/action";

interface Product {
  _id: string | { toString(): string };
  name: string;
  slug?: string | null;
  sku: string;
  price: number;
  stock: number;
  status: string;
  isFeatured: boolean;
  category?: { name: string };
  brand?: string;
}

const STATUS_OPTIONS = ["", "draft", "published", "archived"];

export default function AdminProductsPage() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [data, setData] = useState<{
    products: Product[];
    page: number;
    totalPages: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getAdminProductsAction(page, {
      search: search || undefined,
      status: status || undefined,
    }).then((res) => {
      if (!cancelled) {
        setData(JSON.parse(JSON.stringify(res)));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [page, search, status]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your product catalog.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <Card className="p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-end gap-3"
        >
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Search
            </label>
            <Input
              placeholder="Name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-40">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s || "All"}
                </option>
              ))}
            </select>
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
      ) : !data || data.products.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No products found.
        </p>
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">SKU</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product) => (
                  <tr
                    key={product._id.toString()}
                    className="border-b last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium">
                      <Link
                        href={`/admin/products/${product._id.toString()}/edit`}
                        className="hover:text-primary"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                      {product.sku}
                    </td>
                    <td className="py-3 pr-4">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          product.stock <= 5
                            ? "font-medium text-red-600"
                            : ""
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {product.category?.name ?? "—"}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product._id.toString()}/edit`}
                        >
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <ConfirmAction
                          action={async (
                            _prev: ActionResult,
                            _fd: FormData,
                          ) => deleteProductAction(product._id.toString())}
                          confirmLabel="Delete"
                          confirmMessage="Are you sure you want to delete this product?"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

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
