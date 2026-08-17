"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getAdminCustomersAction } from "@/actions/admin/customers";
import { getAdminOrdersAction } from "@/actions/admin/orders";
import { formatCurrency } from "@/lib/format-currency";
import {
  ORDER_STATUS_STYLES,
  PAYMENT_STATUS_STYLES,
} from "@/constants/order";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";

interface CustomerData {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Order {
  _id: { toString(): string };
  orderNumber: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminCustomerDetailPage() {
  const params = useParams();
  const customerId = params.customerId as string;

  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const customerResult = await getAdminCustomersAction(1, undefined);
      const found = customerResult.customers.find(
        (c: { _id: { toString(): string } }) => c._id.toString() === customerId
      );
      setCustomer(found ? { ...found, _id: customerId } as CustomerData : null);

      const orderResult = await getAdminOrdersAction(1, {
        search: customerId,
      });
      setOrders(orderResult.orders as unknown as Order[]);

      setLoading(false);
    }

    load();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!customer) {
    return (
      <p className="py-20 text-center text-muted-foreground">
        Customer not found.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customer.email}
          </p>
        </div>
        <Link href="/admin/customers">
          <Button variant="outline" size="sm">
            Back to Customers
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="space-y-4">
          <h3 className="font-semibold">Account Details</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Name: </span>
              {customer.name}
            </div>
            <div>
              <span className="text-muted-foreground">Email: </span>
              {customer.email}
            </div>
            <div>
              <span className="text-muted-foreground">Role: </span>
              <span className="capitalize">{customer.role}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Status: </span>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  customer.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {customer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Joined: </span>
              {new Date(customer.createdAt).toLocaleDateString()}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-semibold">Order History</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 font-medium">Order #</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Payment</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const oStyle =
                      ORDER_STATUS_STYLES[order.orderStatus] ?? {
                        label: order.orderStatus,
                        className: "bg-muted text-muted-foreground",
                      };
                    const pStyle =
                      PAYMENT_STATUS_STYLES[order.paymentStatus] ?? {
                        label: order.paymentStatus,
                        className: "bg-muted text-muted-foreground",
                      };
                    return (
                      <tr key={order._id.toString()} className="border-b last:border-0">
                        <td className="py-2.5 pr-4 font-medium">
                          <Link
                            href={`/admin/orders/${order._id.toString()}`}
                            className="hover:text-primary"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="py-2.5 pr-4">{formatCurrency(order.total)}</td>
                        <td className="py-2.5 pr-4">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${oStyle.className}`}>
                            {oStyle.label}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize ${pStyle.className}`}>
                            {pStyle.label}
                          </span>
                        </td>
                        <td className="py-2.5 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
