import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE_NAME,
  PIN_ENABLED_COOKIE,
  PIN_UNLOCKED_COOKIE,
} from "./lib/auth/constants";

// Public routes that never require authentication
const PUBLIC_PATHS = ["/login", "/signup", "/api/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets, next internal files, and favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api/public") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isLockScreen = pathname === "/lock";

  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isPinEnabled = request.cookies.get(PIN_ENABLED_COOKIE)?.value === "true";
  const isPinUnlocked = request.cookies.get(PIN_UNLOCKED_COOKIE)?.value === "true";

  const isAuthenticated = Boolean(sessionToken);

  // 1. Unauthenticated users trying to access protected routes -> redirect to /login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    if (pathname !== "/") {
      loginUrl.searchParams.set("returnUrl", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user visiting /login or /signup -> redirect to home
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Authenticated user with PIN enabled but locked -> redirect to /lock
  if (isAuthenticated && isPinEnabled && !isPinUnlocked && !isLockScreen) {
    const lockUrl = new URL("/lock", request.url);
    if (pathname !== "/") {
      lockUrl.searchParams.set("returnUrl", pathname);
    }
    return NextResponse.redirect(lockUrl);
  }

  // 4. Authenticated user already unlocked visiting /lock -> redirect to home
  if (isAuthenticated && (!isPinEnabled || isPinUnlocked) && isLockScreen) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
