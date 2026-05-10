import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  let sessionCookie = request.cookies.get("better-auth.session_token");
  if (!!sessionCookie?.value) {
    sessionCookie = request.cookies.get("__Secure-better-auth.session_token");
  }
  const isAuthenticated = !!sessionCookie?.value;
  const isAuthRoute =
    request.nextUrl.pathname === "/signin" ||
    request.nextUrl.pathname === "/signup";
  const isAuthApi = request.nextUrl.pathname.startsWith("/api/auth");

  if (!isAuthenticated && !isAuthRoute && !isAuthApi) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

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
