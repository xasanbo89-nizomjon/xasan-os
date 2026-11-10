"use client";

import React, { useState } from "react";
import { HabitSummary, WellnessLogSummary, JournalEntrySummary } from "@/types";
import {
  Flame,
  Activity,
  BookOpen,
  Plus,
  Calendar,
  Award,
  Sparkles,
  Archive,
} from "lucide-react";
import { HabitCard } from "./habit-card";
import { HabitCalendar } from "./habit-calendar";
import { DisciplineReport } from "./discipline-report";
import { CreateHabitModal } from "./create-habit-modal";
import { WellnessTracker } from "./wellness-tracker";
import { JournalView } from "@/components/journal/journal-view";
import {
  createHabitAction,
  toggleHabitDayAction,
  archiveHabitAction,
  deleteHabitAction,
} from "@/server/actions/habits";

interface LifeTrackerExperienceProps {
  initialHabits: HabitSummary[];
  initialWellnessLogs: WellnessLogSummary[];
  initialJournalEntries: JournalEntrySummary[];
}

export function LifeTrackerExperience({
  initialHabits,
  initialWellnessLogs,
  initialJournalEntries,
}: LifeTrackerExperienceProps) {
  const [activeTab, setActiveTab] = useState<"habits" | "heatmap" | "report" | "wellness" | "journal">("habits");
  const [habits, setHabits] = useState<HabitSummary[]>(initialHabits);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const activeHabits = habits.filter((h) => !h.archived);
  const archivedHabits = habits.filter((h) => h.archived);
  const displayedHabits = showArchived ? archivedHabits : activeHabits;

  // Handlers
  const handleToggleToday = async (habitId: string) => {
    const today = new Date().toISOString().slice(0, 10);
    // Optimistic update
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const newStatus = !h.isCompletedToday;
        const newStreak = newStatus ? h.streak + 1 : Math.max(0, h.streak - 1);
        return {
          ...h,
          isCompletedToday: newStatus,
          streak: newStreak,
          bestStreak: Math.max(h.bestStreak, newStreak),
        };
      })
    );
    await toggleHabitDayAction(habitId, today);
  };

  const handleToggleDate = async (habitId: string, date: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const hasLog = h.recentLogs?.some((l) => l.date === date);
        const updatedLogs = hasLog
          ? h.recentLogs?.filter((l) => l.date !== date)
          : [
              ...(h.recentLogs || []),
              {
                id: `log-sim-${Date.now()}`,
                habitId,
                userId: h.userId,
                date,
                completedAt: new Date().toISOString(),
                count: 1,
              },
            ];
        return {
          ...h,
          recentLogs: updatedLogs,
        };
      })
    );
    await toggleHabitDayAction(habitId, date);
  };

  const handleArchive = async (habitId: string, archived: boolean) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, archived } : h))
    );
    await archiveHabitAction(habitId, archived);
  };

  const handleDelete = async (habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    await deleteHabitAction(habitId);
  };

  const handleCreateHabit = async (data: any) => {
    const res = await createHabitAction(data);
    if (res.success && res.habit) {
      setHabits((prev) => [res.habit as HabitSummary, ...prev]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Navigation Tabs */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-[#25352C] bg-[#101915] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("habits")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "habits"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Flame className="w-4 h-4" />
            Habit Protocols ({activeHabits.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("heatmap")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "heatmap"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Habit Calendar Heatmap
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("report")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "report"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Award className="w-4 h-4 text-[#F59E0B]" />
            Discipline Report
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wellness")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "wellness"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Activity className="w-4 h-4 text-[#3B82F6]" />
            Wellness Protocol
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("journal")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "journal"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
            Digital Journal ({initialJournalEntries.length})
          </button>
        </div>

        {/* Right Action */}
        {activeTab === "habits" && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowArchived(!showArchived)}
              className={`p-2 rounded-xl border text-xs font-mono transition-colors ${
                showArchived
                  ? "bg-[#142019] text-[#F59E0B] border-[#F59E0B]/40"
                  : "bg-[#142019] text-[#98A69D] border-[#25352C] hover:text-[#F3F7F4]"
              }`}
              title={showArchived ? "View Active" : "View Archived Habits"}
            >
              <Archive className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Protocol
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div>
        {activeTab === "habits" && (
          <div className="space-y-4">
            {displayedHabits.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center border border-[#25352C] bg-[#101915]/50 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[#F3F7F4]">
                  {showArchived ? "No Archived Habits" : "No Active Habits"}
                </h3>
                <p className="text-xs text-[#98A69D] max-w-sm">
                  Build atomic discipline with daily and weekly execution rituals.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Create First Protocol
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggleToday={handleToggleToday}
                    onToggleDate={handleToggleDate}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "heatmap" && <HabitCalendar habits={habits} />}

        {activeTab === "report" && <DisciplineReport habits={habits} />}

        {activeTab === "wellness" && (
          <WellnessTracker initialLogs={initialWellnessLogs} />
        )}

        {activeTab === "journal" && (
          <JournalView initialEntries={initialJournalEntries} />
        )}
      </div>

      {/* Create Habit Modal */}
      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateHabit={handleCreateHabit}
      />
    </div>
  );
}
