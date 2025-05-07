function HasPresaleConcludedSkeleton() {
  return (
    <div className="relative h-screen w-full">
      <div className="container mx-auto max-w-[1000px]">
        {/* Title skeleton */}
        <div className="mt-[10%] flex min-h-[200px] max-w-[750px] animate-pulse flex-col gap-4 px-8 md:px-0">
          <div className="h-[52px] w-full rounded bg-gray-100/50 md:h-[72px]" />
          <div className="h-[52px] w-1/2 rounded bg-gray-100/50 md:h-[72px]" />
        </div>

        {/* Description skeleton */}
        <div className="mt-4 px-8 md:px-0 min-h-[100px]">
          <div className="h-[32px] w-full rounded bg-gray-100/50 md:h-[42px]" />
          <div className="mt-2 h-[32px] w-3/4 rounded bg-gray-100/50 md:h-[42px]" />
        </div>

        <div className="px-8 mt-8 md:px-0">
          <div className="flex flex-col gap-4 md:flex-row md:gap-12">
            {/* Your $OWN section skeleton */}
            <div>
              <div className="h-[12px] w-[200px] rounded bg-gray-100/50 md:h-[14px]" />
              <div className="mt-2 h-[24px] w-[250px] rounded bg-gray-100/50 md:h-[32px]" />
            </div>

            {/* Contract address section skeleton */}
            <div>
              <div className="h-[12px] w-[200px] rounded bg-gray-100/50 md:h-[14px]" />
              <div className="mt-2 h-[24px] w-[250px] rounded bg-gray-100/50 md:h-[32px]" />
            </div>
          </div>

          {/* Buttons skeleton */}
          <div className="mt-4 flex flex-col gap-3 py-4 sm:flex-row md:justify-start md:gap-4">
            <div className="h-[46px] w-full rounded bg-gray-100/50" />
            <div className="h-[46px] w-full rounded bg-gray-100/50" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HasPresaleConcludedSkeleton;
