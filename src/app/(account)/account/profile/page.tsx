import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and manage your account profile.",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/profile");
  }

  const user = session.user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="mt-2 text-muted-foreground">
          View your account details and information.
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Name
              </p>
              <p className="mt-1 text-lg">{user.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Email
              </p>
              <p className="mt-1 text-lg">{user.email}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Role
              </p>
              <p className="mt-1 text-lg capitalize">{user.role}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Member Since
              </p>
              <p className="mt-1 text-lg">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Link href="/account/settings">
        <Button variant="outline">Edit Profile</Button>
      </Link>
    </div>
  );
}
