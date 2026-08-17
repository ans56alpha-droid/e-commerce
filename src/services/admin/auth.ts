import { auth } from "@/auth";
import { USER_ROLE } from "@/constants/user";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== USER_ROLE.ADMIN) {
    throw new Error("Forbidden");
  }

  return session;
}
