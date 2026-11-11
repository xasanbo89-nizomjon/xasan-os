"use server";

import { FocusSessionSummary } from "@/types";
import { FALLBACK_FOCUS_SESSIONS } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getFocusSessionsAction(): Promise<FocusSessionSummary[]> {
  return FALLBACK_FOCUS_SESSIONS;
}

export async function getFocusStatsAction() {
  return {
    totalMinutesToday: 125,
    sessionsCompletedToday: 5,
    totalFocusHoursAllTime: 84.5,
    todayMinutes: 125,
    weekMinutes: 680,
    completedSessions: 8,
    streakDays: 5,
  };
}

export async function logFocusSessionAction(data: {
  durationMinutes: number;
  taskId?: string;
  notes?: string;
  subject?: string;
  mode?: string;
}) {
  const newSession: FocusSessionSummary = {
    id: `fcs-local-${Date.now()}`,
    userId: "local-user",
    subject: data.subject || "Deep Work Session",
    durationMinutes: data.durationMinutes,
    taskId: data.taskId || null,
    notes: data.notes || null,
    mode: data.mode || "POMODORO",
    completedAt: new Date().toISOString(),
  };

  revalidatePath("/focus");
  return { success: true, session: newSession };
}
