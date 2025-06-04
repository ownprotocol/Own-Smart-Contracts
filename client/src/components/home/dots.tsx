import Image from "next/image";

export const Dots = () => (
  <div className="absolute -z-10 h-screen w-full">
    <div className="absolute right-0 top-96 -z-10 hidden md:block lg:-right-40">
      <div className="relative">
        <Image
          src="/home-page/hero/designed-dots.png"
          alt="Decorative dots"
          width={75}
          height={75}
          priority
        />
        <div className="absolute left-[27%] top-[13%] h-[6px] w-[6px] animate-dot-pulse rounded-full bg-[#ff844f] [animation-delay:0ms]" />
        <div className="absolute left-[67%] top-[27%] h-[6px] w-[6px] animate-dot-pulse rounded-full bg-[#ff844f] [animation-delay:500ms]" />
        <div className="absolute left-[40%] top-[53%] h-[6px] w-[6px] animate-dot-pulse rounded-full bg-[#ff844f] [animation-delay:1000ms]" />
      </div>
    </div>
    <div className="absolute top-40 -z-10 hidden md:block lg:-left-40">
      <div className="relative">
        <Image
          src="/home-page/hero/designed-dots.png"
          alt="Decorative dots"
          width={75}
          height={75}
          priority
        />
        <div className="absolute left-[27%] top-[13%] h-[6px] w-[6px] animate-dot-pulse rounded-full bg-[#ff844f] [animation-delay:0ms]" />
        <div className="absolute left-[67%] top-[27%] h-[6px] w-[6px] animate-dot-pulse rounded-full bg-[#ff844f] [animation-delay:500ms]" />
        <div className="absolute left-[40%] top-[53%] h-[6px] w-[6px] animate-dot-pulse rounded-full bg-[#ff844f] [animation-delay:1000ms]" />
      </div>
    </div>
    <div className="absolute left-0 top-0 h-[580px] w-[200px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />
  </div>
);
