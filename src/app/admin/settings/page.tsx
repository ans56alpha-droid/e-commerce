import type { Metadata } from "next";

import Card from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Settings",
  description: "Store configuration and settings.",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Store configuration and operational settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Store Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Store Name</span>
              <span className="font-medium">alphaShop</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Currency</span>
              <span className="font-medium">USD</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Free Shipping Threshold</span>
              <span className="font-medium">$100.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping Fee</span>
              <span className="font-medium">$10.00</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Payment</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Payment Gateway</span>
              <span className="font-medium">JazzCash</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-block rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                Configured
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment</span>
              <span className="font-medium">Sandbox</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Order Settings</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Order Status Transitions</span>
              <span className="font-medium">Enforced</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Stock Deduction</span>
              <span className="font-medium">On Payment Confirmation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cancellation</span>
              <span className="font-medium">Pending orders only</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Inventory</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Low Stock Threshold</span>
              <span className="font-medium">5 units (default)</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Stock Validation</span>
              <span className="font-medium">Server-side enforced</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Soft Delete</span>
              <span className="font-medium">Products preserved for order history</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Authentication</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Provider</span>
              <span className="font-medium">Auth.js (Credentials)</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Session Strategy</span>
              <span className="font-medium">JWT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Password Hashing</span>
              <span className="font-medium">bcrypt (12 rounds)</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold">Security</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Admin Route Protection</span>
              <span className="font-medium">Middleware + Server-side</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Input Validation</span>
              <span className="font-medium">Zod schemas</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">ObjectId Validation</span>
              <span className="font-medium">All mutations</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Security</span>
              <span className="font-medium">HMAC-SHA256 SecureHash</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
