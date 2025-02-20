import RaiseStats from "@/components/raise-stats";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-[10%] mt-[10%]">
      <div className="flex flex-col">
        <h1 className="text-[72px] font-normal leading-[72px]">
          Buy $Own Token in Presale Now
        </h1>

        <RaiseStats />
      </div>
    </main>
  );
}
