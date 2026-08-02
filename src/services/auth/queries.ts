import bcrypt from "bcrypt";

import { findUserByEmail } from "@/services/user";

export async function authenticateUser(
  email: string,
  password: string
) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatches) {
    return null;
  }

  return {
    id: user.id.toString(),
    name: user.name,
    email: user.email,
    role: user.role.toString(),
    image: user.image,
  };
}