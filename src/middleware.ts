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

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = req.nextUrl.pathname.startsWith(apiAuthRoutePrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  const theme = req.cookies.get("theme")?.value || "system";

  const response = NextResponse.next();

  if (!req.cookies.has("theme")) {
    response.cookies.set("theme", theme);
  }

  if (isApiAuthRoute) {
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
  const requestHeaders = new Headers(req.headers);

  if (req.auth?.user?.id) {
    requestHeaders.set("x-user-id", req.auth.user.id);
  }

  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Exclude static files and Next.js internals
    "/", // Include the root path
    "/(api|trpc)(.*)", // Include API and tRPC routes
  ],
};
