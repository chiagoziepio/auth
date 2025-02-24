import NextAuth from "next-auth";
import authConfig from "../auth.config";
import { NextResponse } from "next/server";
import {
  authRoutes,
  apiAuthRoutePrefix,
  DEFAULT_REDIRECT_ROUTE,
  publicRoutes,
} from "../routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedin = !!req.auth;
  console.log(isLoggedin);

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthRoutePrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    console.log("isApiAuthRoute");
    return NextResponse.next();
  }
  if (isAuthRoute) {
    console.log("isAuthRoute");

    if (isLoggedin) {
      console.log("isLoggedin");

      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_ROUTE, nextUrl));
    }
    return NextResponse.next();
  }
  if (!isPublicRoute && !isLoggedin) {
    console.log("!isPublicRoute && !isLoggedin");
    return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Exclude static files and Next.js internals
    "/", // Include the root path
    "/(api|trpc)(.*)", // Include API and tRPC routes
  ],
};
