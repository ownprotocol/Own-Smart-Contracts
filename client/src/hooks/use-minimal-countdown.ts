"use client";

import { type Duration, intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

interface TimerState {
  offset: number;
  duration: Duration;
}

export const useMinimalCountdown = (timerDurationSeconds: number) => {
  const [timerState, setTimerState] = useState<TimerState>({
    offset: 0,
    duration: intervalToDuration({
      start: 0,
      end: timerDurationSeconds * 1000,
    }),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerState((prevState) => {
        const offset = prevState?.offset ? prevState.offset + 1 : 1;
        return {
          offset,
          duration: intervalToDuration({
            start: offset * 1000,
            end: timerDurationSeconds * 1000,
          }),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timerState.duration;
};
