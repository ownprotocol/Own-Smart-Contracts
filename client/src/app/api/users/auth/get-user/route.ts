import { isLoggedIn } from "@/actions/login";

export async function GET() {
  try {
    const userAuthState = await isLoggedIn();

    return new Response(
      JSON.stringify({
        address: userAuthState?.address ?? null,
        accessToken: userAuthState?.accessToken ?? null,
        isValid: !!userAuthState?.isValid,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error fetching user auth state:", error);
    return new Response(
      JSON.stringify({
        address: null,
        accessToken: null,
        isValid: false,
        error: "Failed to fetch authentication state",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
