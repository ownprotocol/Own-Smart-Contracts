const TokenomicsChartMobileSkeleton = () => {
  return (
    <div className="mt-12 flex w-full flex-col items-center rounded-lg md:hidden">
      <div className="h-[40px] w-[200px] animate-pulse rounded bg-gray-100/50" />
      {/* Title skeleton */}
      <div className="relative mt-8">
        {/* Chart circle skeleton */}
        <div className="h-[300px] w-[300px] animate-pulse rounded-full border-[30px] border-gray-100/50" />
      </div>
      {/* Legend skeleton */}
      <div className="mt-8 flex w-full flex-col items-center px-4">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="h-6 w-1.5 animate-pulse bg-gray-100/50" />
              <div className="h-[20px] w-[100px] animate-pulse rounded bg-gray-100/50" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenomicsChartMobileSkeleton;
