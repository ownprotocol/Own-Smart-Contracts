import { StakeOwnTokenBanner } from "@/components";

function StakingPage() {
  return (
    <main className="mx-[10%] mt-[10%] min-h-screen md:mt-[3%]">
      <div className="relative flex flex-col">
        <StakeOwnTokenBanner />
      </div>
    </main>
  );
}

export default StakingPage;
