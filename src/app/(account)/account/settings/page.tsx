"use client";

import { useActionState } from "react";

import { updateProfileAction, changePasswordAction } from "@/actions/account";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";

export default function SettingsPage() {
  const [profileState, profileFormAction, profilePending] = useActionState(
    updateProfileAction,
    { success: false }
  );

  const [passwordState, passwordFormAction, passwordPending] = useActionState(
    changePasswordAction,
    { success: false }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Update your account information and preferences.
        </p>
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Edit Profile</h2>

        <form action={profileFormAction} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              required
              disabled={profilePending}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={profilePending}
            />
          </div>

          {profileState.message && (
            <p
              className={`text-sm ${
                profileState.success ? "text-green-600" : "text-destructive"
              }`}
            >
              {profileState.message}
            </p>
          )}

          <Button type="submit" disabled={profilePending}>
            {profilePending && <Spinner />}
            {profilePending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Change Password</h2>

        <form action={passwordFormAction} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Enter current password"
              required
              disabled={passwordPending}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter new password (min 8 characters)"
              required
              minLength={8}
              disabled={passwordPending}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              required
              minLength={8}
              disabled={passwordPending}
            />
          </div>

          {passwordState.message && (
            <p
              className={`text-sm ${
                passwordState.success ? "text-green-600" : "text-destructive"
              }`}
            >
              {passwordState.message}
            </p>
          )}

          <Button type="submit" disabled={passwordPending}>
            {passwordPending && <Spinner />}
            {passwordPending ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
