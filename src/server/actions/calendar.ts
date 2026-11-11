"use server";

import { CalendarEventSummary, ReminderSummary, Priority } from "@/types";
import { FALLBACK_EVENTS, FALLBACK_REMINDERS } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getCalendarEventsAction(filters?: {
  category?: string;
  startDate?: string;
  endDate?: string;
}): Promise<CalendarEventSummary[]> {
  let events = [...FALLBACK_EVENTS];
  if (filters?.category && filters.category !== "ALL") {
    events = events.filter((e) => e.category.toLowerCase() === filters.category?.toLowerCase());
  }
  return events;
}

export async function createCalendarEventAction(data: {
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  startDate?: string;
  endDate?: string;
  allDay?: boolean;
  category?: string;
  color?: string;
}) {
  const newEvent: CalendarEventSummary = {
    id: `evt-local-${Date.now()}`,
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

  revalidatePath("/calendar");
  return { success: true, event: newEvent };
}

export async function updateCalendarEventAction(id: string, updates: Partial<CalendarEventSummary>) {
  revalidatePath("/calendar");
  return { success: true, id, updates };
}

export async function deleteCalendarEventAction(id: string) {
  revalidatePath("/calendar");
  return { success: true, id };
}

export async function getRemindersAction(): Promise<ReminderSummary[]> {
  return FALLBACK_REMINDERS;
}

export async function createReminderAction(data: {
  title: string;
  dueDateTime?: string;
  dueDate?: string;
  category?: string;
  priority?: Priority;
}) {
  const newReminder: ReminderSummary = {
    id: `rem-local-${Date.now()}`,
    userId: "local-user",
    title: data.title,
    dueDateTime: data.dueDateTime || data.dueDate || new Date().toISOString(),
    isCompleted: false,
    category: data.category || "General",
    isRecurring: false,
    createdAt: new Date().toISOString(),
  };

  revalidatePath("/calendar");
  return { success: true, reminder: newReminder };
}

export async function toggleReminderAction(id: string, currentCompleted: boolean) {
  revalidatePath("/calendar");
  return { success: true, id, completed: !currentCompleted };
}

export async function deleteReminderAction(id: string) {
  revalidatePath("/calendar");
  return { success: true, id };
}
