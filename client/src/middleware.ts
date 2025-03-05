import { type NextRequest, NextResponse } from "next/server";

import { isLoggedIn } from "@/actions/login";

const protectedRoute = ["/user-stake/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoute.some((route) => {
    return pathname.startsWith(route);
  });
  // Get the JWT from cookies

  if (isProtectedRoute) {
    // Get the JWT from cookies
    const jwt = request.cookies.get("jwt");

    // If no JWT or invalid JWT, redirect to home
    if (!jwt?.value) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }

    // Verify the JWT
    try {
      const { isValid } = await isLoggedIn();
      if (!isValid) {
        return NextResponse.redirect(new URL(`/`, request.url));
      }
    } catch (error) {
      console.error("JWT verification error:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // For authenticated users, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
