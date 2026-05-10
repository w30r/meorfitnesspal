import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  // Check for both possible cookie names
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const isAuthenticated = !!sessionToken?.value;

  const isAuthRoute =
    request.nextUrl.pathname === "/signin" ||
    request.nextUrl.pathname === "/signup";
  const isAuthApi = request.nextUrl.pathname.startsWith("/api/auth");

  // 1. If not logged in and trying to access protected route
  if (!isAuthenticated && !isAuthRoute && !isAuthApi) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 2. If logged in and trying to access Signin/Signup
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
