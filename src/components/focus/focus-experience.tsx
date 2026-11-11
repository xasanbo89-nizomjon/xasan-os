"use client";

import React, { useState } from "react";
import { TaskSummary, FocusSessionSummary } from "@/types";
import { PomodoroTimer } from "./pomodoro-timer";
import { FocusHistory } from "./focus-history";
import { Clock, History, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/stores/language-store";

interface FocusExperienceProps {
  tasks: TaskSummary[];
  initialSessions: FocusSessionSummary[];
  stats: {
    totalMinutesToday: number;
    sessionsCompletedToday: number;
    totalFocusHoursAllTime: number;
  };
}

export function FocusExperience({
  tasks,
  initialSessions,
  stats,
}: FocusExperienceProps) {
  const { isUz } = useTranslation();
  const [activeTab, setActiveTab] = useState<"timer" | "history">("timer");
  const [sessions, setSessions] = useState<FocusSessionSummary[]>(initialSessions);
  const router = useRouter();

  const handleSessionLogged = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Navigation Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center bg-[#101915] p-1.5 rounded-2xl border border-[#25352C]">
          <button
            type="button"
            onClick={() => setActiveTab("timer")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "timer"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "text-[#98A69D] hover:text-[#F3F7F4]"
            }`}
          >
            <Clock className="w-4 h-4" />
            {isUz ? "Pomodoro va Diqqat Taymeri" : "Pomodoro & Focus Timer"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === "history"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "text-[#98A69D] hover:text-[#F3F7F4]"
            }`}
          >
            <History className="w-4 h-4" />
            {isUz
              ? `Diqqat Telemetriyasi va Jurnal (${sessions.length})`
              : `Focus Telemetry & Log (${sessions.length})`}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#98A69D] bg-[#101915] px-3.5 py-2 rounded-xl border border-[#25352C]">
          <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
          <span>
            {isUz ? (
              <>Bugun: <strong className="text-[#F3F7F4]">{stats.totalMinutesToday} daqiqa</strong> chuqur ishlash</>
            ) : (
              <>Today: <strong className="text-[#F3F7F4]">{stats.totalMinutesToday}m</strong> deep work</>
            )}
          </span>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === "timer" ? (
        <PomodoroTimer
          tasks={tasks}
          onSessionLogged={handleSessionLogged}
        />
      ) : (
        <FocusHistory
          sessions={sessions}
          stats={stats}
        />
      )}
    </div>
  );
}
