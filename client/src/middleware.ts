import { type NextRequest, NextResponse } from "next/server";

interface UserAuthResponse {
  isValid: boolean;
  accessToken: string;
  address: string;
}

const protectedRoute = ["/user-stake/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const contractAddressMatch =
    /\/user-stake\/([^\/]+)\/(rewards|positions)/.exec(pathname);
  const contractAddress = contractAddressMatch ? contractAddressMatch[1] : null;

  // if (contractAddress) {
  //   const requestHeaders = new Headers(request.headers);
  //   requestHeaders.set("x-contract-address", contractAddress);
  // }

  const isProtectedRoute = protectedRoute.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    const jwt = request.cookies.get("jwt");
    if (!jwt?.value) {
      return NextResponse.redirect(new URL(`/`, request.url));
    }
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
      if (response.address !== contractAddress) {
        return NextResponse.redirect(new URL("/not-found", request.url));
      }
      if (!response.isValid) {
        return NextResponse.redirect(new URL(`/`, request.url));
      }
    } catch (error) {
      console.error("JWT verification error:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
