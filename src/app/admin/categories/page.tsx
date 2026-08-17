"use client";

import { useEffect, useState, useActionState } from "react";

import {
  getAdminCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/admin/categories";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import ConfirmAction from "@/components/ui/confirm-action";
import type { ActionResult } from "@/types/action";

interface Category {
  _id: { toString(): string };
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadCategories() {
    setLoading(true);
    const cats = await getAdminCategoriesAction();
    setCategories(cats as Category[]);
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage product categories.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancel" : "Add Category"}
        </Button>
      </div>

      {showForm && (
        <CategoryForm
          editingId={editingId}
          categories={categories}
          onDone={() => {
            setShowForm(false);
            setEditingId(null);
            loadCategories();
          }}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : categories.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No categories found.
        </p>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Slug</th>
                <th className="pb-3 font-medium">Active</th>
                <th className="pb-3 font-medium">Featured</th>
                <th className="pb-3 font-medium">Sort</th>
                <th className="pb-3 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat._id.toString()}
                  className="border-b last:border-0"
                >
                  <td className="py-3 pr-4 font-medium">
                    {cat.name}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">
                    {cat.slug}
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        cat.isActive
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {cat.isActive ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        cat.isFeatured
                          ? "bg-blue-50 text-blue-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {cat.isFeatured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {cat.sortOrder}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingId(cat._id.toString());
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <ConfirmAction
                        action={async (
                          _prev: ActionResult,
                          _fd: FormData,
                        ) =>
                          deleteCategoryAction(cat._id.toString())}
                        confirmLabel="Delete"
                        confirmMessage="Delete this category? Products using it will be unaffected."
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function CategoryForm({
  editingId,
  categories,
  onDone,
}: {
  editingId: string | null;
  categories: Category[];
  onDone: () => void;
}) {
  const existing = editingId
    ? categories.find((c) => c._id.toString() === editingId)
    : null;

  const [state, formAction, isPending] = useActionState(
    async (
      _prev: ActionResult,
      fd: FormData,
    ): Promise<ActionResult> => {
      if (editingId) {
        fd.set("categoryId", editingId);
        return updateCategoryAction(_prev, fd);
      }
      return createCategoryAction(_prev, fd);
    },
    { success: false },
  );

  useEffect(() => {
    if (state.success) {
      onDone();
    }
  }, [state.success, onDone]);

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold">
        {existing ? "Edit Category" : "New Category"}
      </h3>
      <form action={formAction} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Name *
          </label>
          <Input
            name="name"
            required
            defaultValue={existing?.name ?? ""}
            placeholder="Category name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            defaultValue={existing?.description ?? ""}
            placeholder="Category description"
            className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Image URL
          </label>
          <Input
            name="image"
            defaultValue={existing?.image ?? ""}
            placeholder="https://..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Active
            </label>
            <select
              name="isActive"
              defaultValue={
                existing ? String(existing.isActive) : "true"
              }
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Featured
            </label>
            <select
              name="isFeatured"
              defaultValue={
                existing ? String(existing.isFeatured) : "false"
              }
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

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Saving...
              </>
            ) : existing ? (
              "Update Category"
            ) : (
              "Create Category"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onDone}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
