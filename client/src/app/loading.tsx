import HashLoader from "react-spinners/HashLoader";

function Loading() {
  return (
    <main className="px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
      <div className="flex h-[500px] w-full items-center justify-center">
        <HashLoader
          color={"#FFA500"}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </main>
  );
}

export default Loading;
