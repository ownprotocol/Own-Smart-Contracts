import { type NextRequest, NextResponse } from "next/server";

interface UserAuthResponse {
  isValid: boolean;
  accessToken: string;
  address: string;
}

const protectedRoute = ["/user-stake/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedRoute = protectedRoute.some((route) => {
    return pathname.startsWith(route);
  });

  if (isProtectedRoute) {
    // Get the JWT from cookies
    const jwt = request.cookies.get("jwt");
    console.log("jwt", jwt);
    if (!jwt?.value) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }

    // Verify the JWT
    try {
      const result = await fetch(
        `${request.nextUrl.origin}/api/users/auth/get-user`,
        {
          method: "GET",
          headers: {
            Cookie: `jwt=${jwt.value}`,
          },
        },
      );
      const response = (await result.json()) as UserAuthResponse;
      if (!response.isValid) {
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
