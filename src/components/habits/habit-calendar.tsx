"use client";

import React, { useState } from "react";
import { HabitSummary } from "@/types";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Flame, Sparkles } from "lucide-react";

interface HabitCalendarProps {
  habits: HabitSummary[];
}

export function HabitCalendar({ habits }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Nov 2026
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Collect all log dates across active habits
  const activeHabitsCount = habits.filter((h) => !h.archived).length || 1;

  // Build a map of date string to number of completed habits
  const dateCompletionMap = new Map<string, number>();
  habits.forEach((h) => {
    h.recentLogs?.forEach((l) => {
      dateCompletionMap.set(l.date, (dateCompletionMap.get(l.date) || 0) + 1);
    });
    // Include today if marked completed today
    if (h.isCompletedToday) {
      const today = new Date().toISOString().slice(0, 10);
      dateCompletionMap.set(today, (dateCompletionMap.get(today) || 0) + 1);
    }
  });

  const getHeatmapColor = (completedCount: number) => {
    if (completedCount === 0) return "bg-[#101915] border-[#25352C]/60 text-[#98A69D]";
    const ratio = completedCount / activeHabitsCount;
    if (ratio >= 0.75) return "bg-[#10B981] border-[#10B981] text-[#080D0B] font-bold shadow-sm shadow-[#10B981]/20";
    if (ratio >= 0.5) return "bg-[#10B981]/60 border-[#10B981]/70 text-[#F3F7F4] font-semibold";
    return "bg-[#10B981]/25 border-[#10B981]/40 text-[#10B981]";
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] bg-[#101915] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#F3F7F4]">
              Discipline Heatmap & Habit Matrix
            </h3>
            <p className="text-xs text-[#98A69D]">
              Visual day-by-day ritual consistency and streak execution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
            className="p-1.5 rounded-lg bg-[#142019] border border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold text-[#F3F7F4] px-2">
            {monthName} {year}
          </span>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
            className="p-1.5 rounded-lg bg-[#142019] border border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-[#98A69D] pb-2 border-b border-[#25352C]">
        {daysOfWeek.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="h-12 sm:h-14 rounded-xl bg-[#080D0B]/30 border border-transparent opacity-30"
          />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayDate = new Date(year, month, dayNum);
          const dateStr = dayDate.toISOString().slice(0, 10);
          const completedCount = dateCompletionMap.get(dateStr) || 0;
          const isToday =
            dayNum === 10 && month === 10 && year === 2026;

          return (
            <div
              key={dayNum}
              className={`h-12 sm:h-14 p-1.5 rounded-xl border flex flex-col justify-between transition-transform hover:scale-[1.03] ${getHeatmapColor(
                completedCount
              )} ${isToday ? "ring-2 ring-[#10B981] emerald-glow-sm" : ""}`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span>{dayNum}</span>
                {isToday && (
                  <span className="text-[8px] px-1 rounded bg-[#080D0B] text-[#10B981] font-bold">
                    NOW
                  </span>
                )}
              </div>

              {completedCount > 0 && (
                <div className="text-[9px] font-mono text-right">
                  {completedCount}/{activeHabitsCount}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-2 border-t border-[#25352C] text-[11px] font-mono text-[#98A69D]">
        <span>Less Consistent</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-[#101915] border border-[#25352C]" />
          <div className="w-3.5 h-3.5 rounded bg-[#10B981]/25 border border-[#10B981]/40" />
          <div className="w-3.5 h-3.5 rounded bg-[#10B981]/60 border border-[#10B981]/70" />
          <div className="w-3.5 h-3.5 rounded bg-[#10B981]" />
        </div>
        <span>100% Ritual Execution</span>
      </div>
    </div>
  );
}
