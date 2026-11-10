"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, X, Clock, Sparkles } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";

export function FocusSessionModal() {
  const { focusSessionActive, focusMinutesRemaining, stopFocusSession } =
    useDashboardStore();
  const [secondsLeft, setSecondsLeft] = useState(focusMinutesRemaining * 60);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setSecondsLeft(focusMinutesRemaining * 60);
  }, [focusMinutesRemaining]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (focusSessionActive && !isPaused && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            stopFocusSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [focusSessionActive, isPaused, secondsLeft, stopFocusSession]);

  if (!focusSessionActive) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div className="fixed bottom-20 left-6 z-40 animate-in slide-in-from-bottom-5 duration-200 select-none">
      <div className="glass-card rounded-2xl p-4 border border-[#10B981]/40 shadow-2xl bg-[#101915]/95 flex items-center gap-4 emerald-glow">
        <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[#10B981] animate-pulse">
          <Clock className="w-5 h-5" />
        </div>

        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#10B981] flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
            DEEP WORK BLOCK
          </div>
          <div className="text-xl font-bold font-mono text-[#F3F7F4] tracking-widest">
            {timeFormatted}
          </div>
        </div>

        <div className="flex items-center gap-1 border-l border-[#25352C] pl-3 ml-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-lg bg-[#142019] text-[#F3F7F4] hover:text-[#10B981] border border-[#25352C] transition-colors cursor-pointer"
          >
            {isPaused ? (
              <Play className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Pause className="w-3.5 h-3.5 fill-current" />
            )}
          </button>
          <button
            onClick={stopFocusSession}
            className="p-2 rounded-lg bg-[#142019] text-[#98A69D] hover:text-[#EF4444] border border-[#25352C] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
