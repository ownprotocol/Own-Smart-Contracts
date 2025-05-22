"use client";

import { useActiveAccount } from "thirdweb/react";

import { StakePageContent } from "@/components/user-stake/stake-page-content";
import { useStakingPositionsPage } from "@/hooks/use-staking-positions-page";
import Loading from "../loading";
import { useRouter } from "next/navigation";

function UserStakingPositionsPage() {
  const activeAccount = useActiveAccount();
  const queryHook = useStakingPositionsPage();
  const router = useRouter();

  if (!activeAccount) {
    router.push("/");

    return <Loading />;
  }

  return (
    <div className="relative flex flex-col">
      <h1 className="header">Your Staking</h1>
      <StakePageContent queryHook={queryHook} />
    </div>
  );
}

export default UserStakingPositionsPage;
