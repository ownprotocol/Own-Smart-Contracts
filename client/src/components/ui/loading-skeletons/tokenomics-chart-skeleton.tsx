function TokenomicsChartSkeleton() {
  return (
    <div className="z-20 mt-[10%] hidden w-full rounded-lg lg:flex min-h-[500px]">
      <div className="relative flex-1">
        <div className="mb-8 h-[72px] w-[400px] animate-pulse rounded bg-gray-100/50" />
        <div className="relative h-[500px] w-[500px]">
          <div className="absolute -left-[20px] top-[40px] h-[440px] w-[440px] animate-pulse rounded-full border-[40px] border-gray-100/50" />
        </div>
      </div>
      <div className="flex w-full flex-1 items-center">
        <div className="flex w-full flex-col pl-12">
          <div className="grid grid-cols-2 gap-x-16 gap-y-2">
            <div className="min-w-[200px] space-y-3">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-6 w-1.5 animate-pulse bg-gray-100/50" />
                  <div className="h-[24px] w-[150px] animate-pulse rounded bg-gray-100/50" />
                </div>
              ))}
            </div>
            <div className="min-w-[200px] space-y-3">
              {[6, 7, 8, 9, 10].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="h-6 w-1.5 animate-pulse bg-gray-100/50" />
                  <div className="h-[24px] w-[150px] animate-pulse rounded bg-gray-100/50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenomicsChartSkeleton;
