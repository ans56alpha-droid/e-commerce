"use client";

import { useEffect, useState, useActionState } from "react";
import { MapPin, Plus, Star } from "lucide-react";

import {
  getAddressesAction,
  createAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/actions/address";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import ConfirmAction from "@/components/ui/confirm-action";
import EmptyState from "@/components/shared/empty-state";
import ErrorState from "@/components/shared/error-state";

interface Address {
  _id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [createState, createFormAction, createPending] = useActionState(
    createAddressAction,
    { success: false }
  );

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    if (createState.success) {
      setShowForm(false);
      loadAddresses();
    }
  }, [createState.success]);

  async function loadAddresses() {
    setLoading(true);
    setError(null);
    try {
      const result = await getAddressesAction();
      if (result.success) {
        setAddresses(result.addresses as unknown as Address[]);
      } else {
        setError(result.message ?? "Failed to load addresses");
      }
    } catch {
      setError("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <ErrorState description={error} onRetry={loadAddresses} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Addresses</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your shipping addresses.
          </p>
        </div>

        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
          {showForm ? "Cancel" : "Add Address"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <h2 className="mb-4 text-lg font-semibold">New Address</h2>

          <form action={createFormAction} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium"
                >
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Phone number"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="address"
                className="text-sm font-medium"
              >
                Address
              </label>
              <Input
                id="address"
                name="address"
                placeholder="Street address"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="city"
                  className="text-sm font-medium"
                >
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="state"
                  className="text-sm font-medium"
                >
                  State
                </label>
                <Input
                  id="state"
                  name="state"
                  placeholder="State"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="postalCode"
                  className="text-sm font-medium"
                >
                  Postal Code
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="Postal code"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="country"
                className="text-sm font-medium"
              >
                Country
              </label>
              <Input
                id="country"
                name="country"
                placeholder="Country"
                required
              />
            </div>

            <input type="hidden" name="isDefault" value="false" />

            {createState.message && !createState.success && (
              <p className="text-sm text-destructive">
                {createState.message}
              </p>
            )}

            {createState.success && (
              <p className="text-sm text-green-600">
                {createState.message}
              </p>
            )}

            <Button type="submit" disabled={createPending}>
              {createPending && <Spinner />}
              {createPending ? "Adding..." : "Add Address"}
            </Button>
          </form>
        </Card>
      )}

      {addresses.length === 0 && !showForm ? (
        <EmptyState
          title="No addresses saved"
          description="Add a shipping address for faster checkout."
        />
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr._id}
              address={addr}
              onAction={loadAddresses}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AddressCard({
  address,
  onAction,
}: {
  address: Address;
  onAction: () => void;
}) {
  const [deleteState, _deleteFormAction, _deletePending] = useActionState(
    deleteAddressAction,
    { success: false }
  );

  const [setDefaultState, setDefaultFormAction, setDefaultPending] =
    useActionState(setDefaultAddressAction, { success: false });

  useEffect(() => {
    if (deleteState.success || setDefaultState.success) {
      onAction();
    }
  }, [deleteState.success, setDefaultState.success, onAction]);

  return (
    <Card className="relative">
      {address.isDefault && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
          Default
        </span>
      )}

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <p className="font-semibold">{address.name}</p>
        </div>

        <p className="text-sm text-muted-foreground">{address.phone}</p>
        <p className="text-sm">{address.address}</p>
        <p className="text-sm">
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p className="text-sm">{address.country}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!address.isDefault && (
          <form action={setDefaultFormAction}>
            <input type="hidden" name="addressId" value={address._id} />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              disabled={setDefaultPending}
            >
              Set as Default
            </Button>
          </form>
        )}

        <ConfirmAction
          action={deleteAddressAction}
          fields={[{ name: "addressId", value: address._id }]}
          confirmMessage="Are you sure you want to delete this address?"
          confirmLabel="Delete"
          variant="destructive"
        />
      </div>
    </Card>
  );
}
