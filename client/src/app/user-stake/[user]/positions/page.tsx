import { MainNavigation, StakingRewards, StakePositionsTable } from "@/components";

function UserStakePage() {
  return (
    <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
      <div className="relative flex flex-col">
          <h1 className="font-funnel flex py-8 text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:py-4 md:text-[72px] md:leading-[72px]">
            Your Staking
          </h1>
          <StakingRewards />
          <StakePositionsTable />
        </div>
      <MainNavigation isLoading={false} />
    </main>
  );
}

export default UserStakePage;
