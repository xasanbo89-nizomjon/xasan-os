"use server";

import prisma from "@/lib/prisma";
import { CalendarEventSummary, ReminderSummary } from "@/types";
import { FALLBACK_EVENTS, FALLBACK_REMINDERS, DEFAULT_USER_EMAIL, DEFAULT_USER_NAME } from "@/lib/constants";
import { revalidatePath } from "next/cache";

function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("johndoe:randompassword")) return false;
  return true;
}

async function getOrCreateCurrentUser() {
  if (!isDatabaseConfigured()) {
    return {
      id: "demo-user-uuid-1",
      email: DEFAULT_USER_EMAIL,
      displayName: DEFAULT_USER_NAME,
      role: "OWNER",
    };
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email: DEFAULT_USER_EMAIL },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: DEFAULT_USER_EMAIL,
          displayName: DEFAULT_USER_NAME,
          role: "OWNER",
        },
      });
    }

    return user;
  } catch (error) {
    console.warn("DB user retrieval error, fallback:", error);
    return {
      id: "demo-user-uuid-1",
      email: DEFAULT_USER_EMAIL,
      displayName: DEFAULT_USER_NAME,
      role: "OWNER",
    };
  }
}

export async function getCalendarEventsAction(filters?: {
  category?: string;
  startDate?: string;
  endDate?: string;
}): Promise<CalendarEventSummary[]> {
  if (!isDatabaseConfigured()) {
    let events = [...FALLBACK_EVENTS];
    if (filters?.category && filters.category !== "ALL") {
      events = events.filter((e) => e.category.toLowerCase() === filters.category?.toLowerCase());
    }
    return events;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };

    if (filters?.category && filters.category !== "ALL") {
      whereClause.category = filters.category;
    }
    if (filters?.startDate && filters?.endDate) {
      whereClause.startDate = {
        gte: new Date(filters.startDate),
        lte: new Date(filters.endDate),
      };
    }

    const events = await prisma.calendarEvent.findMany({
      where: whereClause,
      orderBy: { startDate: "asc" },
    });

    if (events.length === 0 && !filters?.category) {
      return FALLBACK_EVENTS;
    }

    return events.map((e) => ({
      id: e.id,
      userId: e.userId,
      title: e.title,
      description: e.description,
      category: e.category,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate.toISOString(),
      allDay: e.allDay,
      location: e.location,
      projectId: e.projectId,
      isRecurring: e.isRecurring,
      recurrence: e.recurrence,
      reminderMin: e.reminderMin,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB calendar events fallback:", error);
    return FALLBACK_EVENTS;
  }
}

export async function createCalendarEventAction(data: {
  title: string;
  description?: string;
  category?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
  location?: string;
  projectId?: string;
  isRecurring?: boolean;
  recurrence?: string;
  reminderMin?: number;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const category = data.category || "WORK";

    if (!isDatabaseConfigured()) {
      const newEvent: CalendarEventSummary = {
        id: `evt-sim-${Date.now()}`,
        userId: user.id,
        title: data.title,
        description: data.description,
        category,
        startDate: data.startDate,
        endDate: data.endDate,
        allDay: data.allDay || false,
        location: data.location,
        projectId: data.projectId,
        isRecurring: data.isRecurring || false,
        recurrence: data.recurrence,
        reminderMin: data.reminderMin || 15,
        createdAt: new Date().toISOString(),
      };
      return { success: true, event: newEvent };
    }

    const event = await prisma.calendarEvent.create({
      data: {
        userId: user.id,
        title: data.title,
        description: data.description || null,
        category,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        allDay: data.allDay || false,
        location: data.location || null,
        projectId: data.projectId || null,
        isRecurring: data.isRecurring || false,
        recurrence: data.recurrence || null,
        reminderMin: data.reminderMin || 15,
      },
    });

    revalidatePath("/calendar");
    return { success: true, event };
  } catch (error) {
    console.error("Failed to create calendar event:", error);
    return { success: false, error: "Could not create event." };
  }
}

export async function updateCalendarEventAction(
  eventId: string,
  updates: {
    title?: string;
    description?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    allDay?: boolean;
    location?: string;
    projectId?: string;
    isRecurring?: boolean;
    recurrence?: string;
    reminderMin?: number;
  }
) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    const dataToUpdate: any = { ...updates };
    if (updates.startDate) dataToUpdate.startDate = new Date(updates.startDate);
    if (updates.endDate) dataToUpdate.endDate = new Date(updates.endDate);

    const event = await prisma.calendarEvent.update({
      where: { id: eventId },
      data: dataToUpdate,
    });

    revalidatePath("/calendar");
    return { success: true, event };
  } catch (error) {
    console.error("Failed to update event:", error);
    return { success: false, error: "Could not update event." };
  }
}

export async function deleteCalendarEventAction(eventId: string) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    await prisma.calendarEvent.delete({
      where: { id: eventId },
    });

    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return { success: false, error: "Could not delete event." };
  }
}

// Reminders
export async function getRemindersAction(): Promise<ReminderSummary[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_REMINDERS;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const reminders = await prisma.reminder.findMany({
      where: { userId: user.id },
      orderBy: { dueDateTime: "asc" },
    });

    if (reminders.length === 0) {
      return FALLBACK_REMINDERS;
    }

    return reminders.map((r) => ({
      id: r.id,
      userId: r.userId,
      title: r.title,
      dueDateTime: r.dueDateTime.toISOString(),
      isCompleted: r.isCompleted,
      category: r.category,
      isRecurring: r.isRecurring,
      recurrence: r.recurrence,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB reminders fallback:", error);
    return FALLBACK_REMINDERS;
  }
}

export async function createReminderAction(data: {
  title: string;
  dueDateTime: string;
  category?: string;
  isRecurring?: boolean;
  recurrence?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const category = data.category || "General";

    if (!isDatabaseConfigured()) {
      const newReminder: ReminderSummary = {
        id: `rem-sim-${Date.now()}`,
        userId: user.id,
        title: data.title,
        dueDateTime: data.dueDateTime,
        isCompleted: false,
        category,
        isRecurring: data.isRecurring || false,
        recurrence: data.recurrence || null,
        createdAt: new Date().toISOString(),
      };
      return { success: true, reminder: newReminder };
    }

    const reminder = await prisma.reminder.create({
      data: {
        userId: user.id,
        title: data.title,
        dueDateTime: new Date(data.dueDateTime),
        isCompleted: false,
        category,
        isRecurring: data.isRecurring || false,
        recurrence: data.recurrence || null,
      },
    });

    revalidatePath("/calendar");
    return { success: true, reminder };
  } catch (error) {
    console.error("Failed to create reminder:", error);
    return { success: false, error: "Could not create reminder." };
  }
}

export async function toggleReminderAction(reminderId: string, currentCompleted: boolean) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true, isCompleted: !currentCompleted };
    }

    const reminder = await prisma.reminder.update({
      where: { id: reminderId },
      data: { isCompleted: !currentCompleted },
    });

    revalidatePath("/calendar");
    return { success: true, reminder };
  } catch (error) {
    console.error("Failed to toggle reminder:", error);
    return { success: false, error: "Could not toggle reminder." };
  }
}

export async function deleteReminderAction(reminderId: string) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    await prisma.reminder.delete({
      where: { id: reminderId },
    });

    revalidatePath("/calendar");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete reminder:", error);
    return { success: false, error: "Could not delete reminder." };
  }
}
