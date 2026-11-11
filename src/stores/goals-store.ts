"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  GoalSummary,
  VisionItemSummary,
  GoalMilestoneSummary,
  Priority,
} from "@/types";
import { FALLBACK_GOALS, FALLBACK_VISION_ITEMS } from "@/lib/constants";

interface GoalsState {
  goals: GoalSummary[];
  visionItems: VisionItemSummary[];
  isHydrated: boolean;

  // Goal Actions
  addGoal: (data: {
    title: string;
    description?: string;
    category?: string;
    timeframe?: string;
    targetDate?: string;
    priority?: Priority;
    color?: string;
    icon?: string;
    milestones?: string[];
  }) => GoalSummary;

  updateGoal: (id: string, updates: Partial<GoalSummary>) => void;
  deleteGoal: (id: string) => void;

  // Milestone Actions
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addMilestone: (goalId: string, title: string, dueDate?: string) => void;
  deleteMilestone: (goalId: string, milestoneId: string) => void;

  // Vision Item Actions
  addVisionItem: (data: {
    title: string;
    statement?: string;
    description?: string;
    category: string;
    timeHorizon?: string;
    targetYear?: number;
    color?: string;
  }) => VisionItemSummary;

  deleteVisionItem: (id: string) => void;

  // Reset & Purge
  resetGoalsToDefault: () => void;
  clearAllGoals: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: FALLBACK_GOALS,
      visionItems: FALLBACK_VISION_ITEMS,
      isHydrated: false,

      addGoal: (data) => {
        const id = `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const milestones: GoalMilestoneSummary[] = (data.milestones || []).map((title, i) => ({
          id: `ms-${Date.now()}-${i}`,
          goalId: id,
          title,
          isCompleted: false,
          targetDate: null,
          order: i,
          createdAt: new Date().toISOString(),
        }));

        const newGoal: GoalSummary = {
          id,
          userId: "local-user",
          title: data.title,
          description: data.description || null,
          category: data.category || "Career",
          timeframe: data.timeframe || "SHORT_TERM",
          targetDate: data.targetDate || null,
          progress: 0,
          isAchieved: false,
          priority: data.priority || Priority.HIGH,
          milestones,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          goals: [newGoal, ...state.goals],
        }));

        return newGoal;
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        }));
      },

      toggleMilestone: (goalId, milestoneId) => {
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const updatedMilestones = (g.milestones || []).map((m) =>
              m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted, completedAt: !m.isCompleted ? new Date().toISOString() : null } : m
            );
            const completedCount = updatedMilestones.filter((m) => m.isCompleted).length;
            const progress =
              updatedMilestones.length > 0
                ? Math.round((completedCount / updatedMilestones.length) * 100)
                : 0;

            return {
              ...g,
              milestones: updatedMilestones,
              progress,
              isAchieved: progress === 100,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      addMilestone: (goalId, title, dueDate) => {
        const newMs: GoalMilestoneSummary = {
          id: `ms-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          goalId,
          title,
          isCompleted: false,
          targetDate: dueDate || null,
          order: 99,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const updatedMilestones = [...(g.milestones || []), newMs];
            const completedCount = updatedMilestones.filter((m) => m.isCompleted).length;
            const progress = Math.round((completedCount / updatedMilestones.length) * 100);
            return {
              ...g,
              milestones: updatedMilestones,
              progress,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      deleteMilestone: (goalId, milestoneId) => {
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.id !== goalId) return g;
            const updatedMilestones = (g.milestones || []).filter((m) => m.id !== milestoneId);
            const completedCount = updatedMilestones.filter((m) => m.isCompleted).length;
            const progress =
              updatedMilestones.length > 0
                ? Math.round((completedCount / updatedMilestones.length) * 100)
                : 0;
            return {
              ...g,
              milestones: updatedMilestones,
              progress,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      addVisionItem: (data) => {
        const id = `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newItem: VisionItemSummary = {
          id,
          userId: "local-user",
          title: data.title,
          statement: data.statement || data.description || data.title,
          category: data.category,
          targetYear: data.targetYear || new Date().getFullYear() + 5,
          isPinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          visionItems: [newItem, ...state.visionItems],
        }));

        return newItem;
      },

      deleteVisionItem: (id) => {
        set((state) => ({
          visionItems: state.visionItems.filter((v) => v.id !== id),
        }));
      },

      resetGoalsToDefault: () =>
        set({
          goals: FALLBACK_GOALS,
          visionItems: FALLBACK_VISION_ITEMS,
        }),

      clearAllGoals: () =>
        set({
          goals: [],
          visionItems: [],
        }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "xasan_goals_storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
