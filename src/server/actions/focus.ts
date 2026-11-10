"use server";

import prisma from "@/lib/prisma";
import { FocusSessionSummary } from "@/types";
import { FALLBACK_FOCUS_SESSIONS, DEFAULT_USER_EMAIL, DEFAULT_USER_NAME } from "@/lib/constants";
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

export async function getFocusSessionsAction(): Promise<FocusSessionSummary[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_FOCUS_SESSIONS;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const sessions = await prisma.focusSession.findMany({
      where: { userId: user.id },
      orderBy: { completedAt: "desc" },
      take: 20,
    });

    if (sessions.length === 0) {
      return FALLBACK_FOCUS_SESSIONS;
    }

    return sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      taskId: s.taskId,
      subject: s.subject,
      durationMinutes: s.durationMinutes,
      completedAt: s.completedAt.toISOString(),
      notes: s.notes,
      mode: s.mode,
    }));
  } catch (error) {
    console.warn("DB focus sessions fallback:", error);
    return FALLBACK_FOCUS_SESSIONS;
  }
}

export async function logFocusSessionAction(data: {
  taskId?: string;
  subject: string;
  durationMinutes: number;
  notes?: string;
  mode?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const mode = data.mode || "POMODORO";

    if (!isDatabaseConfigured()) {
      const newSession: FocusSessionSummary = {
        id: `foc-sim-${Date.now()}`,
        userId: user.id,
        taskId: data.taskId,
        subject: data.subject,
        durationMinutes: data.durationMinutes,
        completedAt: new Date().toISOString(),
        notes: data.notes,
        mode,
      };
      return { success: true, session: newSession };
    }

    const session = await prisma.focusSession.create({
      data: {
        userId: user.id,
        taskId: data.taskId || null,
        subject: data.subject,
        durationMinutes: data.durationMinutes,
        notes: data.notes || null,
        mode,
      },
    });

    // If taskId is provided, increment task actualMinutes
    if (data.taskId) {
      await prisma.task.update({
        where: { id: data.taskId },
        data: {
          actualMinutes: { increment: data.durationMinutes },
        },
      }).catch((e) => console.warn("Failed to update task actualMinutes", e));
    }

    revalidatePath("/focus");
    revalidatePath("/tasks");
    revalidatePath("/");
    return { success: true, session };
  } catch (error) {
    console.error("Failed to log focus session:", error);
    return { success: false, error: "Could not log focus session." };
  }
}

export async function getFocusStatsAction(): Promise<{
  totalMinutesToday: number;
  sessionsCompletedToday: number;
  totalFocusHoursAllTime: number;
}> {
  if (!isDatabaseConfigured()) {
    return {
      totalMinutesToday: 75,
      sessionsCompletedToday: 2,
      totalFocusHoursAllTime: 42.5,
    };
  }

  try {
    const user = await getOrCreateCurrentUser();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todaySessions, allSessions] = await Promise.all([
      prisma.focusSession.findMany({
        where: {
          userId: user.id,
          completedAt: { gte: today },
        },
      }),
      prisma.focusSession.findMany({
        where: { userId: user.id },
        select: { durationMinutes: true },
      }),
    ]);

    const totalMinutesToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const totalMinutesAllTime = allSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

    return {
      totalMinutesToday,
      sessionsCompletedToday: todaySessions.length,
      totalFocusHoursAllTime: parseFloat((totalMinutesAllTime / 60).toFixed(1)),
    };
  } catch (error) {
    console.warn("DB focus stats fallback:", error);
    return {
      totalMinutesToday: 75,
      sessionsCompletedToday: 2,
      totalFocusHoursAllTime: 42.5,
    };
  }
}
