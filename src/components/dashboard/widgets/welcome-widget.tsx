"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Clock,
  Calendar as CalendarIcon,
  Play,
  Sliders,
  Plus,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useTranslation } from "@/stores/language-store";

interface WelcomeWidgetProps {
  completedTasksCount: number;
  totalTasksCount: number;
  completedHabitsCount: number;
  totalHabitsCount: number;
  onOpenQuickCreate: () => void;
  onOpenCustomizer: () => void;
}

export function WelcomeWidget({
  completedTasksCount,
  totalTasksCount,
  completedHabitsCount,
  totalHabitsCount,
  onOpenQuickCreate,
  onOpenCustomizer,
}: WelcomeWidgetProps) {
  const { dict, isUz } = useTranslation();
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");
  const { focusSessionActive, startFocusSession, stopFocusSession } = useDashboardStore();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setDateStr(
        now.toLocaleDateString(isUz ? "uz-UZ" : "en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [isUz]);

  // Compute daily execution progress
  const totalItems = totalTasksCount + totalHabitsCount;
  const completedItems = completedTasksCount + completedHabitsCount;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 75;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#25352C] relative overflow-hidden emerald-glow-sm">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#10B981]/10 to-transparent blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Greeting & System Telemetry */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              {isUz ? "TIZIM OPTIMAL" : "SYSTEM OPTIMAL"}
            </span>
            <span className="text-xs text-[#98A69D] flex items-center gap-1 font-mono">
              <CalendarIcon className="w-3.5 h-3.5 text-[#10B981]" />
              {dateStr || (isUz ? "Seshanba, 10-noyabr, 2026" : "Tuesday, Nov 10, 2026")}
            </span>
            <span className="text-xs text-[#98A69D] flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#10B981]" />
              {time || "22:12"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F3F7F4]">
            {isUz ? "Xush kelibsiz, " : "Welcome Back, "}<span className="text-[#10B981]">{isUz ? "Arxitektor Xasan" : "Architect Xasan"}</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#98A69D] max-w-xl leading-relaxed">
            {isUz ? (
              <>
                Barcha tizimlar sinxronlangan. Siz bugungi <span className="text-[#F3F7F4] font-semibold">{totalItems}</span> ta maqsaddan <span className="text-[#F3F7F4] font-semibold">{completedItems}</span> tasini bajardingiz. Chuqur diqqat bloklari tayyor.
              </>
            ) : (
              <>
                All pipelines synchronized. You have completed{" "}
                <span className="text-[#F3F7F4] font-semibold">{completedItems}</span> of{" "}
                <span className="text-[#F3F7F4] font-semibold">{totalItems}</span> daily targets. Deep work blocks are prepared.
              </>
            )}
          </p>
        </div>

        {/* Right: Progress Indicator & Action Hub */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shrink-0">
          {/* Progress Circular/Bar Stat */}
          <div className="p-3.5 rounded-2xl bg-[#101915] border border-[#25352C] flex items-center gap-4 min-w-[200px]">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-[#25352C]"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#10B981] transition-all duration-700 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[11px] font-mono font-bold text-[#F3F7F4]">
                {progressPercent}%
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-[#F3F7F4]">
                {isUz ? "Kunlik Rivojlanish" : "Daily Progress"}
              </div>
              <div className="text-[10px] text-[#98A69D]">
                {isUz
                  ? `${completedTasksCount} ta vazifa • ${completedHabitsCount} ta odat`
                  : `${completedTasksCount} tasks • ${completedHabitsCount} habits`}
              </div>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-2">
            {focusSessionActive ? (
              <button
                onClick={stopFocusSession}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] hover:bg-[#EF4444] hover:text-[#080D0B] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{isUz ? "Sessiyani yakunlash" : "End Focus Session"}</span>
              </button>
            ) : (
              <button
                onClick={() => startFocusSession(50)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#10B981]/25 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isUz ? "Diqqat (50 daq)" : "Focus (50m)"}</span>
              </button>
            )}

            <button
              onClick={onOpenCustomizer}
              title={isUz ? "Ko‘rinishni sozlash" : "Customize Layout"}
              className="p-2.5 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/50 text-[#98A69D] hover:text-[#F3F7F4] transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
