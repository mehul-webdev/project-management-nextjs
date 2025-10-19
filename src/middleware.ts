// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/settings/:path*",
    "/login",
    "/register",
    "/update-profile/:path*",
    "/update-profile",
  ],
  runtime: "nodejs",
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  let pathname = request.nextUrl.pathname;

  // Normalize pathname
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  const protectedRoutes = ["/dashboard", "/projects", "/tasks", "/settings"];
  let isAuthenticated = false;
  let role = "";

  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error(
      JSON.stringify({ level: "error", message: "JWT_SECRET not defined!" })
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log(
    JSON.stringify({
      level: "info",
      message: "Middleware hit",
      pathname,
      token,
    })
  );

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        role?: string;
      };

      if (!decoded.id || decoded.role === undefined || decoded.role === null) {
        console.warn(
          JSON.stringify({ level: "warn", message: "Token missing id or role" })
        );
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("token");
        return res;
      }

      isAuthenticated = true;
      role = decoded.role || "";

      console.log(
        JSON.stringify({
          level: "info",
          message: "Authenticated user",
          userId: decoded.id,
          role,
        })
      );
    } catch (err) {
      console.warn(
        JSON.stringify({ level: "warn", message: "Invalid token", error: err })
      );
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }
  }

  // Authenticated but no role → redirect to update-profile
  if (isAuthenticated && role === "" && pathname !== "/update-profile") {
    return NextResponse.redirect(new URL("/update-profile", request.url));
  }

  // Authenticated with role → prevent login/register
  if (
    isAuthenticated &&
    role !== "" &&
    ["/login", "/register"].includes(pathname)
  ) {
    console.log(
      JSON.stringify({
        level: "info",
        message: "Middleware Authenticated",
        token,
        pathname,
      })
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Unauthenticated trying protected route → redirect to login
  if (!isAuthenticated && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
