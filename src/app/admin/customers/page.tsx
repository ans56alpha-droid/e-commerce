"use client";

import { useEffect, useState, useActionState } from "react";
import Link from "next/link";

import {
  getAdminCustomersAction,
  toggleCustomerStatusAction,
} from "@/actions/admin/customers";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import type { ActionResult } from "@/types/action";

interface Customer {
  _id: { toString(): string };
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<{
    customers: Customer[];
    page: number;
    totalPages: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  function load() {
    let cancelled = false;
    setLoading(true);

    getAdminCustomersAction(page, search || undefined).then((res) => {
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
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage customer accounts.
        </p>
      </div>

      <Card className="p-4">
        <form onSubmit={handleSearch} className="flex items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Search
            </label>
            <Input
              placeholder="Name or email..."
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
      ) : !data || data.customers.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No customers found.
        </p>
      ) : (
        <>
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.customers.map((customer) => (
                  <tr
                    key={customer._id.toString()}
                    className="border-b last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium">
                      <Link
                        href={`/admin/customers/${customer._id.toString()}`}
                        className="hover:text-primary"
                      >
                        {customer.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {customer.email}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium capitalize">
                        {customer.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          customer.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {customer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/customers/${customer._id.toString()}`}
                        >
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                        {customer.role !== "ADMIN" && (
                          <ToggleStatusButton customer={customer} onDone={load} />
                        )}
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

function ToggleStatusButton({
  customer,
  onDone,
}: {
  customer: Customer;
  onDone: () => void;
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: ActionResult, _fd: FormData) => {
      return toggleCustomerStatusAction(customer._id.toString());
    },
    { success: false }
  );

  useEffect(() => {
    if (state.success) {
      onDone();
    }
  }, [state.success, onDone]);

  return (
    <form action={formAction}>
      <Button type="submit" variant="ghost" size="sm" disabled={isPending}>
        {customer.isActive ? "Deactivate" : "Activate"}
      </Button>
    </form>
  );
}
