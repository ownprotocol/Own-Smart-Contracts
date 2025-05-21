import { StakingPageContent } from "@/components/staking/staking-page-content";

function StakingPageClient() {
  return (
    <main className="flex flex-col gap-4">
      <div className="mx-auto flex w-full flex-col items-center justify-center">
        <h1 className="header">Stake $Own Token</h1>
      </div>
      <StakingPageContent />
    </main>
  );
}

export default StakingPageClient;
