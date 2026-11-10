"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WidgetId =
  | "tasks"
  | "deadlines"
  | "habits"
  | "study"
  | "projects"
  | "finance"
  | "ai";

export interface WidgetConfig {
  id: WidgetId;
  label: string;
  description: string;
  enabled: boolean;
  order: number;
  colSpan?: 1 | 2 | 3;
}

export type DashboardViewType =
  | "overview"
  | "activity"
  | "weekly"
  | "monthly"
  | "custom";

export type DashboardDensity = "compact" | "standard" | "expanded";

interface DashboardState {
  currentView: DashboardViewType;
  density: DashboardDensity;
  widgets: WidgetConfig[];
  focusSessionActive: boolean;
  focusMinutesRemaining: number;
  searchQuery: string;

  // Actions
  setView: (view: DashboardViewType) => void;
  setDensity: (density: DashboardDensity) => void;
  toggleWidget: (id: WidgetId) => void;
  moveWidget: (id: WidgetId, direction: "up" | "down") => void;
  resetLayout: () => void;
  startFocusSession: (minutes?: number) => void;
  stopFocusSession: () => void;
  setSearchQuery: (query: string) => void;
}

export const DEFAULT_WIDGETS: WidgetConfig[] = [
  {
    id: "ai",
    label: "XASAN AI Sovereign Recommendations",
    description: "Autonomous cognitive nudges, study advice & architecture recommendations",
    enabled: true,
    order: 0,
    colSpan: 3,
  },
  {
    id: "tasks",
    label: "Today's Execution Tasks",
    description: "High-priority queue with instant checkoff and tag filters",
    enabled: true,
    order: 1,
    colSpan: 2,
  },
  {
    id: "habits",
    label: "Discipline & Habit Matrix",
    description: "Daily rituals, streaks & weekly consistency tracker",
    enabled: true,
    order: 2,
    colSpan: 1,
  },
  {
    id: "projects",
    label: "Active Developer Hub Projects",
    description: "Aurelius IELTS, LinguaHub, Ravon Avto platform velocity",
    enabled: true,
    order: 3,
    colSpan: 2,
  },
  {
    id: "deadlines",
    label: "Upcoming Milestone Deadlines",
    description: "Chronological countdown to project delivery benchmarks",
    enabled: true,
    order: 4,
    colSpan: 1,
  },
  {
    id: "study",
    label: "Study Center & IELTS Band 8.5 Lab",
    description: "Daily prep hours, vocabulary review counts & mock score trends",
    enabled: true,
    order: 5,
    colSpan: 2,
  },
  {
    id: "finance",
    label: "Treasury & Cashflow Telemetry",
    description: "Monthly revenue vs cloud infrastructure burn breakdown",
    enabled: true,
    order: 6,
    colSpan: 1,
  },
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      currentView: "overview",
      density: "standard",
      widgets: DEFAULT_WIDGETS,
      focusSessionActive: false,
      focusMinutesRemaining: 50,
      searchQuery: "",

      setView: (view) => set({ currentView: view }),
      setDensity: (density) => set({ density }),

      toggleWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, enabled: !w.enabled } : w
          ),
        })),

      moveWidget: (id, direction) =>
        set((state) => {
          const sorted = [...state.widgets].sort((a, b) => a.order - b.order);
          const index = sorted.findIndex((w) => w.id === id);
          if (index === -1) return state;

          const targetIndex = direction === "up" ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= sorted.length) return state;

          // Swap orders
          const tempOrder = sorted[index].order;
          sorted[index].order = sorted[targetIndex].order;
          sorted[targetIndex].order = tempOrder;

          return { widgets: [...sorted] };
        }),

      resetLayout: () =>
        set({
          widgets: DEFAULT_WIDGETS,
          density: "standard",
        }),

      startFocusSession: (minutes = 50) =>
        set({
          focusSessionActive: true,
          focusMinutesRemaining: minutes,
        }),

      stopFocusSession: () =>
        set({
          focusSessionActive: false,
          focusMinutesRemaining: 0,
        }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),
    }),
    {
      name: "xasan-os-dashboard-layout",
    }
  )
);
