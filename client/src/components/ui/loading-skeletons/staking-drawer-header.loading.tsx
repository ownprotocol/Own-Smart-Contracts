import { DrawerHeader, DrawerTitle } from "../drawer";

function StakingDrawerHeaderLoading() {
  return (
    <DrawerHeader className="relative">
      <DrawerTitle className="text-black">
        <div className="flex w-full flex-col justify-center gap-1 md:flex-row md:gap-4">
          {/* Skeleton for "Stake tokens" text */}
          <div className="h-[28px] w-full animate-pulse rounded bg-gray-100/50 lg:h-[38px] xl:h-[48px]" />
        </div>
      </DrawerTitle>
    </DrawerHeader>
  );
}

export default StakingDrawerHeaderLoading;