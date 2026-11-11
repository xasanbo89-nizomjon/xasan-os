"use server";

import { GoalSummary, VisionItemSummary, Priority, GoalMilestoneSummary } from "@/types";
import { FALLBACK_GOALS, FALLBACK_VISION_ITEMS } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getGoalsAction(filters?: {
  timeframe?: string;
  category?: string;
}): Promise<GoalSummary[]> {
  let goals = [...FALLBACK_GOALS];
  if (filters?.timeframe && filters.timeframe !== "ALL") {
    goals = goals.filter((g) => g.timeframe === filters.timeframe);
  }
  if (filters?.category && filters.category !== "ALL") {
    goals = goals.filter((g) => g.category.toLowerCase() === filters.category?.toLowerCase());
  }
  return goals;
}

export async function createGoalAction(data: {
  title: string;
  description?: string;
  category?: string;
  timeframe?: string;
  targetDate?: string;
  priority?: Priority;
  color?: string;
  icon?: string;
  milestones?: string[];
}) {
  const id = `goal-local-${Date.now()}`;
  const milestones: GoalMilestoneSummary[] = (data.milestones || []).map((title, i) => ({
    id: `ms-local-${Date.now()}-${i}`,
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

  revalidatePath("/goals");
  revalidatePath("/");
  return { success: true, goal: newGoal };
}

export async function updateGoalAction(id: string, updates: Partial<GoalSummary>) {
  revalidatePath("/goals");
  revalidatePath("/");
  return { success: true, id, updates };
}

export async function deleteGoalAction(id: string) {
  revalidatePath("/goals");
  revalidatePath("/");
  return { success: true, id };
}

export async function toggleMilestoneAction(milestoneId: string, completed: boolean) {
  revalidatePath("/goals");
  return { success: true, milestoneId, completed };
}

export async function createMilestoneAction(data: {
  goalId: string;
  title: string;
  dueDate?: string;
  targetDate?: string;
}) {
  const newMs: GoalMilestoneSummary = {
    id: `ms-local-${Date.now()}`,
    goalId: data.goalId,
    title: data.title,
    isCompleted: false,
    targetDate: data.targetDate || data.dueDate || null,
    order: 99,
    createdAt: new Date().toISOString(),
  };

  revalidatePath("/goals");
  return { success: true, milestone: newMs };
}

export async function deleteMilestoneAction(milestoneId: string) {
  revalidatePath("/goals");
  return { success: true, milestoneId };
}

export async function getVisionItemsAction(): Promise<VisionItemSummary[]> {
  return FALLBACK_VISION_ITEMS;
}

export async function createVisionItemAction(data: {
  title: string;
  statement?: string;
  description?: string;
  category: string;
  timeHorizon?: string;
  targetYear?: number;
  imageUrl?: string;
  isPinned?: boolean;
  color?: string;
}) {
  const newItem: VisionItemSummary = {
    id: `vis-local-${Date.now()}`,
    userId: "local-user",
    title: data.title,
    statement: data.statement || data.description || data.title,
    category: data.category,
    imageUrl: data.imageUrl || null,
    targetYear: data.targetYear || new Date().getFullYear() + 5,
    isPinned: data.isPinned || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  revalidatePath("/goals");
  return { success: true, item: newItem };
}

export async function deleteVisionItemAction(id: string) {
  revalidatePath("/goals");
  return { success: true, id };
}
