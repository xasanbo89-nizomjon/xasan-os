"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { HabitSummary, WellnessLogSummary, JournalEntrySummary } from "@/types";
import {
  FALLBACK_HABITS,
  FALLBACK_WELLNESS_LOGS,
  FALLBACK_JOURNAL_ENTRIES,
} from "@/lib/constants";

interface HabitsState {
  habits: HabitSummary[];
  wellnessLogs: WellnessLogSummary[];
  journalEntries: JournalEntrySummary[];
  isHydrated: boolean;

  // Habit Actions
  addHabit: (data: {
    name: string;
    description?: string;
    frequency?: string;
    targetDaysPerWeek?: number;
    targetCount?: number;
    unit?: string;
    category?: string;
    color?: string;
  }) => HabitSummary;

  updateHabit: (id: string, updates: Partial<HabitSummary>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDay: (id: string, dateStr?: string) => void;
  archiveHabit: (id: string) => void;

  // Wellness & Journal Actions
  logWellness: (data: {
    sleepHours?: number;
    waterGlasses?: number;
    exerciseMinutes?: number;
    workoutMinutes?: number;
    energyLevel?: number;
    mood?: string;
    notes?: string;
    date?: string;
  }) => WellnessLogSummary;

  addJournalEntry: (data: {
    content: string;
    title?: string;
    mood?: string;
    tags?: string[];
    date?: string;
    isPrivate?: boolean;
    isArchived?: boolean;
  }) => JournalEntrySummary;

  deleteJournalEntry: (id: string) => void;

  // Reset & Purge
  resetHabitsToDefault: () => void;
  clearAllHabits: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: FALLBACK_HABITS,
      wellnessLogs: FALLBACK_WELLNESS_LOGS,
      journalEntries: FALLBACK_JOURNAL_ENTRIES,
      isHydrated: false,

      addHabit: (data) => {
        const id = `habit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newHabit: HabitSummary = {
          id,
          userId: "local-user",
          name: data.name,
          description: data.description || null,
          frequency: data.frequency || "DAILY",
          targetDaysPerWeek: data.targetDaysPerWeek || 7,
          targetCount: data.targetCount || 1,
          unit: data.unit || "times",
          category: data.category || "DISCIPLINE",
          color: data.color || "#10B981",
          streak: 0,
          bestStreak: 0,
          archived: false,
          isCompletedToday: false,
          recentLogs: [],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          habits: [newHabit, ...state.habits],
        }));

        return newHabit;
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        }));
      },

      toggleHabitDay: (id, dateStr) => {
        const targetDate = dateStr || new Date().toISOString().slice(0, 10);
        const todayStr = new Date().toISOString().slice(0, 10);
        const isToday = targetDate === todayStr;

        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h;
            const existingLogs = h.recentLogs || [];
            const hasLog = existingLogs.some((l) => l.date === targetDate);

            let updatedLogs;
            if (hasLog) {
              updatedLogs = existingLogs.filter((l) => l.date !== targetDate);
            } else {
              updatedLogs = [
                ...existingLogs,
                {
                  id: `log-${Date.now()}`,
                  habitId: id,
                  userId: h.userId,
                  date: targetDate,
                  completed: true,
                  count: 1,
                  completedAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                },
              ];
            }

            const isCompletedToday = isToday ? !hasLog : h.isCompletedToday;
            const streakChange = !hasLog ? 1 : -1;
            const newStreak = Math.max(0, h.streak + streakChange);
            const bestStreak = Math.max(h.bestStreak, newStreak);

            return {
              ...h,
              recentLogs: updatedLogs,
              isCompletedToday,
              streak: newStreak,
              bestStreak,
            };
          }),
        }));
      },

      archiveHabit: (id) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, archived: !h.archived } : h
          ),
        }));
      },

      logWellness: (data) => {
        const newLog: WellnessLogSummary = {
          id: `well-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: "local-user",
          date: data.date || new Date().toISOString().slice(0, 10),
          sleepHours: data.sleepHours || 8,
          waterGlasses: data.waterGlasses || 8,
          exerciseMinutes: data.exerciseMinutes || data.workoutMinutes || 30,
          energyLevel: data.energyLevel || 4,
          mood: data.mood || "Focused",
          notes: data.notes || null,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          wellnessLogs: [newLog, ...state.wellnessLogs],
        }));

        return newLog;
      },

      addJournalEntry: (data) => {
        const newEntry: JournalEntrySummary = {
          id: `jrnl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          userId: "local-user",
          title: data.title || "Daily Reflection",
          content: data.content,
          date: data.date || new Date().toISOString().slice(0, 10),
          mood: data.mood || "Focused",
          tags: data.tags || ["Reflection"],
          isPrivate: data.isPrivate || false,
          isArchived: data.isArchived || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          journalEntries: [newEntry, ...state.journalEntries],
        }));

        return newEntry;
      },

      deleteJournalEntry: (id) => {
        set((state) => ({
          journalEntries: state.journalEntries.filter((j) => j.id !== id),
        }));
      },

      resetHabitsToDefault: () =>
        set({
          habits: FALLBACK_HABITS,
          wellnessLogs: FALLBACK_WELLNESS_LOGS,
          journalEntries: FALLBACK_JOURNAL_ENTRIES,
        }),

      clearAllHabits: () =>
        set({
          habits: [],
          wellnessLogs: [],
          journalEntries: [],
        }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "xasan_habits_storage",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState || !Array.isArray(persistedState.habits) || version < 2) {
          return {
            ...persistedState,
            habits: FALLBACK_HABITS,
          };
        }
        return persistedState;
      },
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
