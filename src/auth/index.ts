import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authenticateUser } from "@/services/auth";
import { authConfig } from "./config";

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        return authenticateUser(
          String(credentials.email),
          String(credentials.password)
        );
      },
    }),
  ],
});
