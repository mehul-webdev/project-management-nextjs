// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get("auth")?.value === "true";
  const { pathname } = request.nextUrl;

  // Protect everything inside (protected)
  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!isAuthenticated && pathname.startsWith("/projects")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!isAuthenticated && pathname.startsWith("/tasks")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (!isAuthenticated && pathname.startsWith("/settings")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in users away from /login or /register
  if (
    isAuthenticated &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
