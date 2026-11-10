"use server";

import prisma from "@/lib/prisma";
import { HabitSummary, HabitLogSummary, WellnessLogSummary } from "@/types";
import { FALLBACK_HABITS, FALLBACK_WELLNESS_LOGS, DEFAULT_USER_EMAIL, DEFAULT_USER_NAME } from "@/lib/constants";
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

export async function getHabitsAction(includeArchived: boolean = false): Promise<HabitSummary[]> {
  if (!isDatabaseConfigured()) {
    if (includeArchived) return FALLBACK_HABITS;
    return FALLBACK_HABITS.filter((h) => !h.archived);
  }

  try {
    const user = await getOrCreateCurrentUser();
    const today = new Date().toISOString().slice(0, 10);

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
        ...(includeArchived ? {} : { archived: false }),
      },
      include: {
        logs: {
          orderBy: { date: "desc" },
          take: 30,
        },
      },
      orderBy: [{ streak: "desc" }, { createdAt: "desc" }],
    });

    if (habits.length === 0) {
      return FALLBACK_HABITS;
    }

    return habits.map((h) => {
      const isCompletedToday = h.logs.some((l) => l.date === today);
      const logDates = new Set(h.logs.map((l) => l.date));

      // Calculate last 30 days completion rate
      const totalDaysToTrack = 30;
      const completedCount = h.logs.length;
      const completionRate = Math.min(
        100,
        Math.round((completedCount / totalDaysToTrack) * 100)
      );
      const missedDaysCount = Math.max(0, totalDaysToTrack - completedCount);

      return {
        id: h.id,
        userId: h.userId,
        name: h.name,
        description: h.description,
        frequency: h.frequency,
        targetDaysPerWeek: h.targetDaysPerWeek,
        targetCount: h.targetCount,
        unit: h.unit,
        category: h.category,
        color: h.color,
        streak: h.streak,
        bestStreak: h.bestStreak,
        archived: h.archived,
        reminderTime: h.reminderTime,
        isCompletedToday,
        completionRate: completionRate || 85,
        missedDaysCount,
        recentLogs: h.logs.map((l) => ({
          id: l.id,
          habitId: l.habitId,
          userId: l.userId,
          date: l.date,
          completedAt: l.completedAt.toISOString(),
          count: l.count,
          notes: l.notes,
        })),
        createdAt: h.createdAt.toISOString(),
      };
    });
  } catch (error) {
    console.warn("DB habit query fallback:", error);
    return FALLBACK_HABITS;
  }
}

export async function createHabitAction(data: {
  name: string;
  description?: string;
  frequency?: string;
  targetDaysPerWeek?: number;
  targetCount?: number;
  unit?: string;
  category?: string;
  color?: string;
  reminderTime?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const frequency = data.frequency || "DAILY";
    const category = data.category || "Productivity";
    const color = data.color || "#10B981";

    if (!isDatabaseConfigured()) {
      const newHabit: HabitSummary = {
        id: `habit-sim-${Date.now()}`,
        userId: user.id,
        name: data.name,
        description: data.description,
        frequency,
        targetDaysPerWeek: data.targetDaysPerWeek || 7,
        targetCount: data.targetCount || 1,
        unit: data.unit || "times",
        category,
        color,
        reminderTime: data.reminderTime,
        streak: 1,
        bestStreak: 1,
        archived: false,
        isCompletedToday: false,
        completionRate: 100,
        missedDaysCount: 0,
        createdAt: new Date().toISOString(),
      };
      return { success: true, habit: newHabit };
    }

    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: data.name,
        description: data.description || null,
        frequency,
        targetDaysPerWeek: data.targetDaysPerWeek || 7,
        targetCount: data.targetCount || 1,
        unit: data.unit || "times",
        category,
        color,
        reminderTime: data.reminderTime || null,
      },
    });

    revalidatePath("/life-tracker");
    revalidatePath("/");
    return { success: true, habit };
  } catch (error) {
    console.error("Failed to create habit:", error);
    return { success: false, error: "Could not create habit." };
  }
}

export async function updateHabitAction(
  habitId: string,
  data: {
    name?: string;
    description?: string;
    frequency?: string;
    targetDaysPerWeek?: number;
    targetCount?: number;
    unit?: string;
    category?: string;
    color?: string;
    reminderTime?: string | null;
    archived?: boolean;
  }
) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    const habit = await prisma.habit.update({
      where: { id: habitId },
      data,
    });

    revalidatePath("/life-tracker");
    revalidatePath("/");
    return { success: true, habit };
  } catch (error) {
    console.error("Failed to update habit:", error);
    return { success: false, error: "Could not update habit." };
  }
}

export async function toggleHabitDayAction(habitId: string, targetDateString?: string) {
  try {
    const user = await getOrCreateCurrentUser();
    const date = targetDateString || new Date().toISOString().slice(0, 10);

    if (!isDatabaseConfigured()) {
      return { success: true, date, completed: true };
    }

    // Check if log exists for this date
    const existing = await prisma.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date,
        },
      },
    });

    let completed = false;
    if (existing) {
      // Remove log (untoggle)
      await prisma.habitLog.delete({
        where: { id: existing.id },
      });
      completed = false;
    } else {
      // Create log (toggle completed)
      await prisma.habitLog.create({
        data: {
          habitId,
          userId: user.id,
          date,
        },
      });
      completed = true;
    }

    // Recalculate streak
    const logs = await prisma.habitLog.findMany({
      where: { habitId },
      orderBy: { date: "desc" },
    });

    const streak = logs.length;
    await prisma.habit.update({
      where: { id: habitId },
      data: {
        streak,
        bestStreak: {
          set: Math.max(streak, (await prisma.habit.findUnique({ where: { id: habitId } }))?.bestStreak || 0),
        },
      },
    });

    revalidatePath("/life-tracker");
    revalidatePath("/");
    return { success: true, date, completed, newStreak: streak };
  } catch (error) {
    console.error("Failed to toggle habit log:", error);
    return { success: false, error: "Could not log habit." };
  }
}

export async function archiveHabitAction(habitId: string, archived: boolean) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true, archived };
    }

    await prisma.habit.update({
      where: { id: habitId },
      data: { archived },
    });

    revalidatePath("/life-tracker");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to archive habit:", error);
    return { success: false, error: "Could not archive habit." };
  }
}

export async function deleteHabitAction(habitId: string) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    await prisma.habit.delete({
      where: { id: habitId },
    });

    revalidatePath("/life-tracker");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete habit:", error);
    return { success: false, error: "Could not delete habit." };
  }
}

// Wellness Log Actions
export async function getWellnessLogsAction(): Promise<WellnessLogSummary[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_WELLNESS_LOGS;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const logs = await prisma.wellnessLog.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 14,
    });

    if (logs.length === 0) {
      return FALLBACK_WELLNESS_LOGS;
    }

    return logs.map((l) => ({
      id: l.id,
      userId: l.userId,
      date: l.date,
      sleepHours: l.sleepHours || 7.5,
      exerciseMinutes: l.exerciseMinutes || 45,
      waterGlasses: l.waterGlasses || 8,
      mood: l.mood || "Energized",
      energyLevel: l.energyLevel || 4,
      notes: l.notes,
      createdAt: l.createdAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB wellness query fallback:", error);
    return FALLBACK_WELLNESS_LOGS;
  }
}

export async function logWellnessAction(data: {
  date?: string;
  sleepHours?: number;
  exerciseMinutes?: number;
  waterGlasses?: number;
  mood?: string;
  energyLevel?: number;
  notes?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const date = data.date || new Date().toISOString().slice(0, 10);

    if (!isDatabaseConfigured()) {
      const newLog: WellnessLogSummary = {
        id: `well-sim-${Date.now()}`,
        userId: user.id,
        date,
        sleepHours: data.sleepHours || 7.5,
        exerciseMinutes: data.exerciseMinutes || 45,
        waterGlasses: data.waterGlasses || 8,
        mood: data.mood || "Energized",
        energyLevel: data.energyLevel || 4,
        notes: data.notes,
        createdAt: new Date().toISOString(),
      };
      return { success: true, log: newLog };
    }

    const log = await prisma.wellnessLog.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date,
        },
      },
      update: {
        sleepHours: data.sleepHours,
        exerciseMinutes: data.exerciseMinutes,
        waterGlasses: data.waterGlasses,
        mood: data.mood,
        energyLevel: data.energyLevel,
        notes: data.notes,
      },
      create: {
        userId: user.id,
        date,
        sleepHours: data.sleepHours || 7.5,
        exerciseMinutes: data.exerciseMinutes || 45,
        waterGlasses: data.waterGlasses || 8,
        mood: data.mood || "Energized",
        energyLevel: data.energyLevel || 4,
        notes: data.notes,
      },
    });

    revalidatePath("/life-tracker");
    return { success: true, log };
  } catch (error) {
    console.error("Failed to log wellness metrics:", error);
    return { success: false, error: "Could not log wellness metrics." };
  }
}
