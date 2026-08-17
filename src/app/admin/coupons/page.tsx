"use client";

import { useEffect, useState, useActionState } from "react";

import {
  getAdminCouponsAction,
  createCouponAction,
  updateCouponAction,
  deleteCouponAction,
} from "@/actions/admin/coupons";
import { formatCurrency } from "@/lib/format-currency";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import ConfirmAction from "@/components/ui/confirm-action";
import type { ActionResult } from "@/types/action";

interface Coupon {
  _id: { toString(): string };
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [data, setData] = useState<{
    coupons: Coupon[];
    page: number;
    totalPages: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    let cancelled = false;
    setLoading(true);

    getAdminCouponsAction(page, search || undefined).then((res) => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage discount coupons.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCoupon(null);
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancel" : "Add Coupon"}
        </Button>
      </div>

      {showForm && (
        <CouponForm
          editingCoupon={editingCoupon}
          onDone={() => {
            setShowForm(false);
            setEditingCoupon(null);
            load();
          }}
        />
      )}

      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Search
            </label>
            <Input
              placeholder="Coupon code..."
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
      ) : !data || data.coupons.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No coupons found.
        </p>
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Code</th>
                  <th className="pb-3 font-medium">Discount</th>
                  <th className="pb-3 font-medium">Min Order</th>
                  <th className="pb-3 font-medium">Usage</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Expires</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.coupons.map((coupon) => (
                  <tr
                    key={coupon._id.toString()}
                    className="border-b last:border-0"
                  >
                    <td className="py-3 pr-4 font-mono font-medium">
                      {coupon.code}
                    </td>
                    <td className="py-3 pr-4">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : formatCurrency(coupon.discountValue)}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {coupon.minOrderAmount > 0
                        ? formatCurrency(coupon.minOrderAmount)
                        : "—"}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {coupon.usedCount}
                      {coupon.usageLimit > 0 ? ` / ${coupon.usageLimit}` : ""}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          coupon.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {new Date(coupon.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCoupon(coupon);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </Button>
                        <ConfirmAction
                          action={async (
                            _prev: ActionResult,
                            _fd: FormData,
                          ) => deleteCouponAction(coupon._id.toString())}
                          confirmLabel="Delete"
                          confirmMessage="Delete this coupon?"
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

function CouponForm({
  editingCoupon,
  onDone,
}: {
  editingCoupon: Coupon | null;
  onDone: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    async (
      _prev: ActionResult,
      fd: FormData,
    ): Promise<ActionResult> => {
      if (editingCoupon) {
        fd.set("couponId", editingCoupon._id.toString());
        return updateCouponAction(_prev, fd);
      }
      return createCouponAction(_prev, fd);
    },
    { success: false },
  );

  useEffect(() => {
    if (state.success) {
      onDone();
    }
  }, [state.success, onDone]);

  const inputStyles =
    "flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary";

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold">
        {editingCoupon ? "Edit Coupon" : "New Coupon"}
      </h3>
      <form action={formAction} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Code *</label>
            <Input name="code" required defaultValue={editingCoupon?.code ?? ""} placeholder="e.g. SAVE20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <Input name="description" defaultValue={editingCoupon?.description ?? ""} placeholder="Optional description" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Discount Type *</label>
            <select
              name="discountType"
              defaultValue={editingCoupon?.discountType ?? "percentage"}
              className={inputStyles}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Discount Value *</label>
            <Input name="discountValue" type="number" min="0" step="0.01" required defaultValue={editingCoupon?.discountValue ?? ""} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Max Discount</label>
            <Input name="maxDiscount" type="number" min="0" step="0.01" defaultValue={editingCoupon?.maxDiscount ?? "0"} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Min Order Amount</label>
            <Input name="minOrderAmount" type="number" min="0" step="0.01" defaultValue={editingCoupon?.minOrderAmount ?? "0"} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Usage Limit (0 = unlimited)</label>
            <Input name="usageLimit" type="number" min="0" defaultValue={editingCoupon?.usageLimit ?? "0"} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Per User Limit</label>
            <Input name="perUserLimit" type="number" min="0" defaultValue={editingCoupon?.perUserLimit ?? "1"} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Start Date *</label>
            <Input name="startDate" type="date" required defaultValue={editingCoupon?.startDate ? new Date(editingCoupon.startDate).toISOString().split("T")[0] : ""} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">End Date *</label>
            <Input name="endDate" type="date" required defaultValue={editingCoupon?.endDate ? new Date(editingCoupon.endDate).toISOString().split("T")[0] : ""} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Active</label>
            <select
              name="isActive"
              defaultValue={editingCoupon ? String(editingCoupon.isActive) : "true"}
              className={inputStyles}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        {state.message && (
          <p className={`text-sm ${state.success ? "text-green-600" : "text-destructive"}`}>
            {state.message}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Saving...
              </>
            ) : editingCoupon ? (
              "Update Coupon"
            ) : (
              "Create Coupon"
            )}
          </Button>
          <Button type="button" variant="outline" onClick={onDone}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
