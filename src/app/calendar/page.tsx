import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus } from "lucide-react";

export default function CalendarPage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={CalendarIcon}
          badge="TIME ARCHITECTURE"
          title="Calendar & Milestones"
          description="Chronological schedule, project milestone deadlines, and deep-work calendar blocks."
        />

        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-[#F3F7F4]">November 2026</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-mono">
                Current Sprint
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4]">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-lg bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-[#98A69D] pb-3 border-b border-[#25352C]">
            {days.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-7 gap-2 pt-3">
            {dates.map((date) => {
              const isToday = date === 10;
              const hasEvent = date === 10 || date === 14 || date === 21;
              return (
                <div
                  key={date}
                  className={`min-h-[90px] p-2.5 rounded-xl border transition-colors flex flex-col justify-between ${
                    isToday
                      ? "bg-[#142019] border-[#10B981] emerald-glow-sm"
                      : "bg-[#101915]/50 border-[#25352C]/60 hover:border-[#25352C]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isToday ? "text-[#10B981]" : "text-[#F3F7F4]"
                      }`}
                    >
                      {date}
                    </span>
                    {isToday && (
                      <span className="text-[9px] px-1 bg-[#10B981] text-[#080D0B] rounded font-bold">
                        TODAY
                      </span>
                    )}
                  </div>

                  {hasEvent && (
                    <div className="space-y-1 mt-1">
                      {date === 10 && (
                        <div className="p-1 rounded bg-[#10B981]/20 border border-[#10B981]/30 text-[10px] text-[#10B981] truncate font-medium">
                          Whisper Model Pipeline
                        </div>
                      )}
                      {date === 14 && (
                        <div className="p-1 rounded bg-[#3B82F6]/20 border border-[#3B82F6]/30 text-[10px] text-[#3B82F6] truncate font-medium">
                          IELTS Mock Test #4
                        </div>
                      )}
                      {date === 21 && (
                        <div className="p-1 rounded bg-[#F59E0B]/20 border border-[#F59E0B]/30 text-[10px] text-[#F59E0B] truncate font-medium">
                          Ravon Avto Dealer Beta
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
