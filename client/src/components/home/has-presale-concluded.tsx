import { PillarBackgrounds, SquareDots } from "@/components";

function HasPresaleConcluded() {
  return (
    <div className="relative h-screen w-full">
      <PillarBackgrounds />
      <SquareDots />
      <div className="container relative z-10 mx-auto px-4">
        <div className="relative z-10 px-4">HasPresaleConcluded</div>
      </div>
    </div>
  );
}

export default HasPresaleConcluded;
