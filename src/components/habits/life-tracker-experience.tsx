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
import { useHabitsStore } from "@/stores/habits-store";
import { useTranslation } from "@/stores/language-store";

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
  const { dict, isUz } = useTranslation();
  const [activeTab, setActiveTab] = useState<"habits" | "heatmap" | "report" | "wellness" | "journal">("habits");
  const storeHabits = useHabitsStore((s) => s.habits);
  const storeWellness = useHabitsStore((s) => s.wellnessLogs);
  const storeJournal = useHabitsStore((s) => s.journalEntries);
  const addHabit = useHabitsStore((s) => s.addHabit);
  const deleteHabit = useHabitsStore((s) => s.deleteHabit);
  const toggleHabitDay = useHabitsStore((s) => s.toggleHabitDay);
  const archiveHabit = useHabitsStore((s) => s.archiveHabit);
  const isHydrated = useHabitsStore((s) => s.isHydrated);

  const habits = isHydrated ? storeHabits : initialHabits;
  const wellnessLogs = isHydrated ? storeWellness : initialWellnessLogs;
  const journalEntries = isHydrated ? storeJournal : initialJournalEntries;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const activeHabits = habits.filter((h) => !h.archived);
  const archivedHabits = habits.filter((h) => h.archived);
  const displayedHabits = showArchived ? archivedHabits : activeHabits;

  // Handlers
  const handleToggleToday = (habitId: string) => {
    toggleHabitDay(habitId);
  };

  const handleToggleDate = (habitId: string, date: string) => {
    toggleHabitDay(habitId, date);
  };

  const handleArchive = (habitId: string, _archived: boolean) => {
    archiveHabit(habitId);
  };

  const handleDelete = (habitId: string) => {
    deleteHabit(habitId);
  };

  const handleCreateHabit = async (data: any) => {
    addHabit(data);
    setIsCreateModalOpen(false);
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
            {dict.habits?.tabs?.habits || (isUz ? "Odatlar bayonnomasi" : "Habit Protocols")} ({activeHabits.length})
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
            {isUz ? "Davomiylik xaritasi (Heatmap)" : "Habit Calendar Heatmap"}
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
            {isUz ? "Intizom hisoboti" : "Discipline Report"}
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
            {dict.habits?.tabs?.wellness || (isUz ? "Salomatlik va Uyqu" : "Wellness Protocol")}
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
            {dict.habits?.tabs?.journal || (isUz ? "Shaxsiy kundalik" : "Digital Journal")} ({initialJournalEntries.length})
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
              title={showArchived ? (isUz ? "Faol odatlarni ko‘rish" : "View Active") : (isUz ? "Arxivlangan odatlar" : "View Archived Habits")}
            >
              <Archive className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {dict.habits?.create_habit || (isUz ? "Yangi odat" : "New Protocol")}
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
                  {showArchived
                    ? (isUz ? "Arxivlangan odatlar mavjud emas" : "No Archived Habits")
                    : (isUz ? "Faol odatlar mavjud emas" : "No Active Habits")}
                </h3>
                <p className="text-xs text-[#98A69D] max-w-sm">
                  {isUz
                    ? "Kunlik va haftalik odatlar orqali intizomni shakllantiring."
                    : "Build atomic discipline with daily and weekly execution rituals."}
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  {dict.habits?.create_habit || (isUz ? "Birinchi odatni yaratish" : "Create First Protocol")}
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
          <WellnessTracker initialLogs={wellnessLogs} />
        )}

        {activeTab === "journal" && (
          <JournalView initialEntries={journalEntries} />
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