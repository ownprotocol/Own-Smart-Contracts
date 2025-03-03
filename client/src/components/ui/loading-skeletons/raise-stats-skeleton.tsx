function RaiseStatsSkeleton() {
  return (
    <div className="relative flex md:min-h-[200px] flex-col gap-4 md:mt-1">
      <div className="flex w-full flex-row">
        <div className="flex w-1/2 flex-col">
          <div className="mb-2 h-[14px] w-[100px] animate-pulse rounded bg-gray-100/50" />
          <div className="h-[22px] w-[120px] animate-pulse rounded bg-gray-100/50" />
        </div>
        <div className="flex w-1/2 flex-col">
          <div className="mb-2 h-[14px] w-[100px] animate-pulse rounded bg-gray-100/50" />
          <div className="h-[22px] w-[120px] animate-pulse rounded bg-gray-100/50" />
        </div>
      </div>
      <div className="pt-4">
        <div className="h-[75px] w-full animate-pulse rounded-lg bg-gray-100/50 pt-4 md:h-[105px]" />
      </div>
      <div className="absolute left-[-15%] top-[-15%] -z-10 hidden md:block"></div>
      <div className="absolute left-0 top-0 h-[580px] w-[200px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />
    </div>
  );
}

export default RaiseStatsSkeleton;
