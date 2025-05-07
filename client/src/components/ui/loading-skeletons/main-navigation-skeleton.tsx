function MainNavigationSkeleton() {
  return (
    <div className="mb-[10%] mt-[30%] flex min-h-[100px] w-full justify-between md:mt-[10%]">
      <div className="w-1/3 md:w-1/2">
        <div className="h-[100px] w-[100px] animate-pulse rounded bg-gray-100/50" />
      </div>
      <div className="flex w-full gap-16 pl-12 md:w-1/2 md:gap-28">
        <div className="flex flex-col gap-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="h-[10px] w-[40px] lg:w-[80px] animate-pulse rounded bg-gray-100/50 md:h-3"
            />
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="h-[10px] w-[40px] lg:w-[80px] animate-pulse rounded bg-gray-100/50 md:h-3"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainNavigationSkeleton;
