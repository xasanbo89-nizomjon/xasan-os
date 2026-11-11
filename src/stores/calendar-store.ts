"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CalendarEventSummary,
  ReminderSummary,
  FocusSessionSummary,
  Priority,
} from "@/types";
import {
  FALLBACK_EVENTS,
  FALLBACK_REMINDERS,
  FALLBACK_FOCUS_SESSIONS,
} from "@/lib/constants";

interface CalendarState {
  events: CalendarEventSummary[];
  reminders: ReminderSummary[];
  focusSessions: FocusSessionSummary[];
  isHydrated: boolean;

  // Calendar Event Actions
  addEvent: (data: {
    title: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    startDate?: string;
    endDate?: string;
    allDay?: boolean;
    category?: string;
    color?: string;
  }) => CalendarEventSummary;

  deleteEvent: (id: string) => void;

  // Reminder Actions
  addReminder: (data: {
    title: string;
    dueDateTime?: string;
    dueDate?: string;
    category?: string;
    priority?: Priority;
  }) => ReminderSummary;

  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;

  // Focus Sessions
  addFocusSession: (data: {
    durationMinutes: number;
    taskId?: string;
    notes?: string;
    subject?: string;
    mode?: string;
  }) => FocusSessionSummary;

  // Reset & Purge
  resetCalendarToDefault: () => void;
  clearAllCalendar: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: FALLBACK_EVENTS,
      reminders: FALLBACK_REMINDERS,
      focusSessions: FALLBACK_FOCUS_SESSIONS,
      isHydrated: false,

      addEvent: (data) => {
        const id = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newEvent: CalendarEventSummary = {
          id,
          userId: "local-user",
          title: data.title,
          description: data.description || null,
          startDate: data.startDate || data.startTime || new Date().toISOString(),
          endDate: data.endDate || data.endTime || new Date().toISOString(),
          allDay: data.allDay || false,
          category: data.category || "General",
          isRecurring: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          events: [...state.events, newEvent],
        }));

        return newEvent;
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },

      addReminder: (data) => {
        const id = `rem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newReminder: ReminderSummary = {
          id,
          userId: "local-user",
          title: data.title,
          dueDateTime: data.dueDateTime || data.dueDate || new Date().toISOString(),
          isCompleted: false,
          category: data.category || "General",
          isRecurring: false,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          reminders: [newReminder, ...state.reminders],
        }));

        return newReminder;
      },

      toggleReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
          ),
        }));
      },

      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },

      addFocusSession: (data) => {
        const id = `fcs-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newSession: FocusSessionSummary = {
          id,
          userId: "local-user",
          subject: data.subject || "Focus Block",
          durationMinutes: data.durationMinutes,
          taskId: data.taskId || null,
          notes: data.notes || null,
          mode: data.mode || "POMODORO",
          completedAt: new Date().toISOString(),
        };

        set((state) => ({
          focusSessions: [newSession, ...state.focusSessions],
        }));

        return newSession;
      },

      resetCalendarToDefault: () =>
        set({
          events: FALLBACK_EVENTS,
          reminders: FALLBACK_REMINDERS,
          focusSessions: FALLBACK_FOCUS_SESSIONS,
        }),

      clearAllCalendar: () =>
        set({
          events: [],
          reminders: [],
          focusSessions: [],
        }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "xasan_calendar_storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
