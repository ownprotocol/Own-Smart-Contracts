function ActionButtonsSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-3 p-4 sm:flex-row md:justify-center md:gap-4">
      <div className="h-[52px] w-full animate-pulse rounded bg-gray-100/50 sm:w-[200px] md:h-[56px]" />
      <div className="h-[52px] w-full animate-pulse rounded bg-gray-100/50 sm:w-[200px] md:h-[56px]" />
    </div>
  );
}

export default ActionButtonsSkeleton;
