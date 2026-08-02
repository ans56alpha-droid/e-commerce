import { NextResponse } from "next/server";
import NextAuth from "next-auth";

import { authConfig } from "@/auth/config";
import {
  ADMIN_ROUTES,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
} from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  console.log("req.nextUrl +++++++", req.nextUrl)       // console

  const session = req.auth;
  console.log("req auth  +++++++", req.auth)               // console  req
  console.log("session +++++++", session)               // console  req

  const isLoggedIn = !!session;

  const isPublicRoute =
    PUBLIC_ROUTES.some(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`)
    );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }

    return NextResponse.next();
  }

  const isProtected =
    PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  const isAdmin =
    ADMIN_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

  if (isAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    if (session.user.role !== USER_ROLE.ADMIN) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};