"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-[5%] md:px-[10%]">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold text-[#9333EA] md:text-6xl">404</h1>
        <h2 className="text-2xl font-medium text-white md:text-3xl">
          Page Not Found
        </h2>
        <p className="mx-auto max-w-md text-gray-400">
          The page you are looking for is not available. It might have been
          moved or doesn&apos;t exist.
        </p>
        <Button
          className="bg-[#9333EA] px-8 py-6 text-lg text-white hover:bg-[#7E22CE]"
          onClick={() => router.push("/")}
        >
          Return Home
        </Button>
      </div>
    </main>
  );
}
