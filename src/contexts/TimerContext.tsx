import { createContext, useState, useRef, MutableRefObject } from "react";

interface ITimerContext {
  time: number;
  mode: number;
  wasRunning: boolean;
  task?: number;
  pomos:number
}

export const TimerContext = createContext<MutableRefObject<ITimerContext>>({
  current: { time: 0, mode: 0, wasRunning: false,pomos:0 },
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const timer = useRef<ITimerContext>({ time: 0, mode: 0, wasRunning: false,pomos:0 });

  return (
    <TimerContext.Provider value={timer}>{children}</TimerContext.Provider>
  );
}
