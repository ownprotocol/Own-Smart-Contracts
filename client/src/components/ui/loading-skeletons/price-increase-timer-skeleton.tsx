function PriceIncreaseTimerSkeleton() {
  return (
    <div className="relative mt-4 flex min-h-[100px] justify-center">
      <div className="flex flex-col gap-4">
        {/* Title skeleton */}
        <div className="mx-auto h-[14px] w-[150px] animate-pulse rounded bg-gray-100/50 px-4 py-2 md:h-[16px] lg:h-[18px]" />

        {/* Timer boxes skeleton */}
        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <div className="flex gap-4">
            {/* Days and Hours boxes */}
            <div className="flex h-[60px] w-1/2 flex-col items-center rounded-md bg-gray-100/50 px-6 py-2 md:h-[120px] md:w-[120px]"></div>
            <div className="flex h-[60px] w-1/2 flex-col items-center rounded-md bg-gray-100/50 px-6 py-2 md:h-[120px] md:w-[120px]"></div>
          </div>
          <div className="flex gap-4">
            {/* Minutes and Seconds boxes */}
            <div className="flex h-[60px] w-1/2 flex-col items-center rounded-md bg-gray-100/50 px-6 py-2 md:h-[120px] md:w-[120px]"></div>
            <div className="flex h-[60px] w-1/2 flex-col items-center rounded-md bg-gray-100/50 px-6 py-2 md:h-[120px] md:w-[120px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PriceIncreaseTimerSkeleton;
