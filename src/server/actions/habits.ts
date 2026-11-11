"use server";

import { HabitSummary, HabitLogSummary, WellnessLogSummary } from "@/types";
import { FALLBACK_HABITS, FALLBACK_WELLNESS_LOGS, DEFAULT_USER_EMAIL, DEFAULT_USER_NAME } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getHabitsAction(includeArchived: boolean = false): Promise<HabitSummary[]> {
  if (includeArchived) return FALLBACK_HABITS;
  return FALLBACK_HABITS.filter((h) => !h.archived);
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
}) {
  const newHabit: HabitSummary = {
    id: `habit-local-${Date.now()}`,
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

  revalidatePath("/life-tracker");
  revalidatePath("/");
  return { success: true, habit: newHabit };
}

export async function toggleHabitDayAction(habitId: string, date: string) {
  revalidatePath("/life-tracker");
  revalidatePath("/");
  return { success: true, habitId, date, completed: true };
}

export async function archiveHabitAction(habitId: string, archived: boolean) {
  revalidatePath("/life-tracker");
  revalidatePath("/");
  return { success: true, habitId, archived };
}

export async function deleteHabitAction(habitId: string) {
  revalidatePath("/life-tracker");
  revalidatePath("/");
  return { success: true, habitId };
}

export async function getWellnessLogsAction(): Promise<WellnessLogSummary[]> {
  return FALLBACK_WELLNESS_LOGS;
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
  const date = data.date || new Date().toISOString().slice(0, 10);
  const newLog: WellnessLogSummary = {
    id: `well-local-${Date.now()}`,
    userId: "local-user",
    date,
    sleepHours: data.sleepHours || 7.5,
    exerciseMinutes: data.exerciseMinutes || 45,
    waterGlasses: data.waterGlasses || 8,
    mood: data.mood || "Energized",
    energyLevel: data.energyLevel || 4,
    notes: data.notes || null,
    createdAt: new Date().toISOString(),
  };

  revalidatePath("/life-tracker");
  return { success: true, log: newLog };
}
