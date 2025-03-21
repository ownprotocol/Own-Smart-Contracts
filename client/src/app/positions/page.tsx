import { MainNavigation } from "@/components";
import { StakePageContent } from "@/components/user-stake/stake-page-content";

function UserStakingPositionsPage() {
  return (
    <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
      <div className="relative flex flex-col">
        <h1 className="font-funnel flex py-8 text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:py-4 md:text-[72px] md:leading-[72px]">
          Your Staking
        </h1>
        <StakePageContent />
      </div>
      <MainNavigation />
    </main>
  );
}

export default UserStakingPositionsPage;
