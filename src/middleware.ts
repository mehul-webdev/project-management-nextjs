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
  runtime: "nodejs", // important: allows process.env access
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
    console.error("[Middleware] JWT_SECRET not defined!");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("the token is", token);

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        role?: string;
      };

      // Check id and role exist
      if (!decoded.id || decoded.role === undefined || decoded.role === null) {
        console.log("[Middleware] Token missing id or role, clearing cookie");
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("token");
        return res;
      }

      isAuthenticated = true;
      role = decoded.role || "";
      console.log(
        "[Middleware] Authenticated user:",
        decoded.id,
        "Role:",
        role
      );
    } catch (err) {
      console.log("[Middleware] Invalid token:", err);
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("token");
      return res;
    }
  }

  // 1️⃣ Authenticated but no role → update-profile
  if (isAuthenticated && role === "" && pathname !== "/update-profile") {
    return NextResponse.redirect(new URL("/update-profile", request.url));
  }

  // 2️⃣ Authenticated with role → prevent login/register
  if (
    isAuthenticated &&
    role !== "" &&
    (pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3️⃣ Unauthenticated trying protected route → login
  if (!isAuthenticated && protectedRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 4️⃣ Everything else → allow
  return NextResponse.next();
}
