"use client";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
  type ObjectTarget,
  type Easing,
} from "framer-motion";
import { useEffect } from "react";

interface ProgressBarProps {
  sales: number;
  allocation: number;
  className?: string;
  duration?: number;
  delay?: number;
  easing?: string;
}

function ProgressBar({
  sales,
  allocation,
  className,
  duration = 3,
  delay = 0.5,
  easing = "easeInOut",
}: ProgressBarProps) {
  const progress = (sales / allocation) * 100;
  console.log(progress);

  // Create motion values for animating the numbers
  const soldCount = useMotionValue(0);
  const capCount = useMotionValue(0);

  // Transform the motion values to formatted strings
  const displaySold = useTransform(soldCount, (value: number) =>
    value.toFixed(2).toLocaleString(),
  );
  const displayCap = useTransform(capCount, (value: number) =>
    Math.round(value).toLocaleString(),
  );

  // Animate the counters when component mounts
  useEffect(() => {
    const soldAnimation = animate(
      soldCount,
      sales as ObjectTarget<MotionValue<number>>,
      {
        duration,
        delay,
        ease: easing as Easing,
      },
    );

    const capAnimation = animate(
      capCount,
      allocation as ObjectTarget<MotionValue<number>>,
      {
        duration,
        delay,
        ease: easing as Easing,
      },
    );

    return () => {
      soldAnimation.stop();
      capAnimation.stop();
    };
  }, [sales, allocation, duration, delay, easing, soldCount, capCount]);

  const variants = {
    initial: {
      x: "-100%",
    },
    animate: {
      x: "0%",
      transition: {
        duration,
        delay,
        ease: easing,
      },
    },
  };

  return (
    <div
      className={cn(
        "relative h-[75px] w-full overflow-hidden rounded-lg bg-purple-950 pt-4 md:h-[105px]",
        className,
      )}
    >
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-amber-400"
        style={{
          width: `${progress}%`,
          clipPath: `polygon(0 0, ${progress === 100 ? 100 : 80}% 0, calc(${progress === 100 ? 100 : 80}% + 20px) 50%, ${progress === 100 ? 100 : 80}% 100%, 0 100%)`,
        }}
      />

      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        className="absolute inset-y-0 left-0"
        style={{ width: `${progress}%` }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r"
          style={{
            background:
              "linear-gradient(to right, rgba(245, 158, 11, 0.4), rgba(245, 158, 11, 0.4) 60%, rgba(251, 146, 60, 0.2) 80%, rgba(251, 146, 60, 0) 100%)",
            filter: "blur(16px) brightness(1.2)",
          }}
        />
        {(progress < 95 && progress > 0) && <ProgressDots />}
      </motion.div>

      <div className="relative flex h-full items-center justify-between px-4 font-medium text-white">
        <div>
          <span className="font-dm_mono text-[10px] font-normal leading-[10px] tracking-[0.08em] opacity-80 md:text-[14px] md:leading-[14px]">
            SOLD
          </span>
          <motion.p className="font-dm_sans text-base font-medium leading-[40px] tracking-[-0.06em] md:text-[40px]">
            {displaySold}
          </motion.p>
        </div>
        <div className="text-right">
          <span className="font-dm_mono text-[10px] font-normal leading-[10px] tracking-[0.08em] opacity-80 md:text-[14px] md:leading-[14px]">
            PRESALE CAP
          </span>
          <motion.p className="font-dm_sans text-base font-medium leading-[40px] tracking-[-0.06em] md:text-[40px]">
            {displayCap}
          </motion.p>
        </div>
      </div>
    </div>
  );
}

function ProgressDots() {
  return (
    <>
      <div className="absolute left-[90%] top-[15%] flex -translate-y-1/2 gap-1 md:left-[85%]">
        <div className="h-2 w-2 animate-pulse rounded-full bg-orange-300">1</div>
      </div>
      <div className="absolute left-[95%] top-[38%] flex -translate-y-1/2 gap-1 md:left-[85%]">
        <div className="h-1 w-1 animate-pulse rounded-full bg-orange-300 delay-75">2</div>
      </div>
      <div className="absolute left-[98%] top-[52%] flex -translate-y-1/2 gap-1 md:left-[88%]">
        <div className="h-3 w-3 animate-pulse rounded-full bg-orange-300 delay-150">3</div>
      </div>
      <div className="absolute left-[94%] top-[72%] flex -translate-y-1/2 gap-1 md:left-[84%]">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-300 delay-300">4</div>
      </div>
      <div className="absolute left-[90%] top-[85%] flex -translate-y-1/2 gap-1 md:left-[86%]">
        <div className="h-2 w-2 animate-pulse rounded-full bg-orange-300 delay-500">5</div>
      </div>
    </>
  );
}

export default ProgressBar;
