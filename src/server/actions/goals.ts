"use server";

import prisma from "@/lib/prisma";
import { GoalSummary, VisionItemSummary } from "@/types";
import { FALLBACK_GOALS, FALLBACK_VISION_ITEMS, DEFAULT_USER_EMAIL, DEFAULT_USER_NAME } from "@/lib/constants";
import { Priority } from "@prisma/client";
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

export async function getGoalsAction(filters?: {
  timeframe?: string;
  category?: string;
}): Promise<GoalSummary[]> {
  if (!isDatabaseConfigured()) {
    let goals = [...FALLBACK_GOALS];
    if (filters?.timeframe && filters.timeframe !== "ALL") {
      goals = goals.filter((g) => g.timeframe === filters.timeframe);
    }
    if (filters?.category && filters.category !== "ALL") {
      goals = goals.filter((g) => g.category.toLowerCase() === filters.category?.toLowerCase());
    }
    return goals;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };

    if (filters?.timeframe && filters.timeframe !== "ALL") {
      whereClause.timeframe = filters.timeframe;
    }
    if (filters?.category && filters.category !== "ALL") {
      whereClause.category = filters.category;
    }

    const goals = await prisma.goal.findMany({
      where: whereClause,
      include: {
        milestones: { orderBy: { order: "asc" } },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    if (goals.length === 0 && !filters?.category) {
      return FALLBACK_GOALS;
    }

    return goals.map((g) => ({
      id: g.id,
      userId: g.userId,
      title: g.title,
      description: g.description,
      category: g.category,
      timeframe: g.timeframe,
      priority: g.priority,
      progress: g.progress,
      targetDate: g.targetDate ? g.targetDate.toISOString() : null,
      completedAt: g.completedAt ? g.completedAt.toISOString() : null,
      isAchieved: g.isAchieved,
      milestones: g.milestones.map((m) => ({
        id: m.id,
        goalId: m.goalId,
        title: m.title,
        isCompleted: m.isCompleted,
        targetDate: m.targetDate ? m.targetDate.toISOString() : null,
        order: m.order,
        completedAt: m.completedAt ? m.completedAt.toISOString() : null,
        createdAt: m.createdAt.toISOString(),
      })),
      createdAt: g.createdAt.toISOString(),
      updatedAt: g.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB goals query fallback:", error);
    return FALLBACK_GOALS;
  }
}

export async function createGoalAction(data: {
  title: string;
  description?: string;
  category?: string;
  timeframe?: string;
  priority?: Priority;
  targetDate?: string;
  milestones?: string[];
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const category = data.category || "Career";
    const timeframe = data.timeframe || "ANNUAL";
    const priority = data.priority || Priority.NORMAL;

    if (!isDatabaseConfigured()) {
      const newGoal: GoalSummary = {
        id: `goal-sim-${Date.now()}`,
        userId: user.id,
        title: data.title,
        description: data.description,
        category,
        timeframe,
        priority,
        progress: 0,
        targetDate: data.targetDate || null,
        isAchieved: false,
        milestones: (data.milestones || []).map((mTitle, i) => ({
          id: `ms-sim-${Date.now()}-${i}`,
          goalId: `goal-sim-${Date.now()}`,
          title: mTitle,
          isCompleted: false,
          order: i,
          createdAt: new Date().toISOString(),
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, goal: newGoal };
    }

    const goal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: data.title,
        description: data.description || null,
        category,
        timeframe,
        priority,
        progress: 0,
        targetDate: data.targetDate ? new Date(data.targetDate) : null,
        milestones: data.milestones && data.milestones.length > 0 ? {
          create: data.milestones.map((mTitle, i) => ({
            title: mTitle,
            isCompleted: false,
            order: i,
          })),
        } : undefined,
      },
      include: {
        milestones: true,
      },
    });

    revalidatePath("/goals");
    return { success: true, goal };
  } catch (error) {
    console.error("Failed to create goal:", error);
    return { success: false, error: "Could not create goal." };
  }
}

export async function toggleMilestoneAction(milestoneId: string, currentCompleted: boolean) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true, isCompleted: !currentCompleted };
    }

    const updated = await prisma.goalMilestone.update({
      where: { id: milestoneId },
      data: {
        isCompleted: !currentCompleted,
        completedAt: !currentCompleted ? new Date() : null,
      },
    });

    // Recompute goal progress
    const allMilestones = await prisma.goalMilestone.findMany({
      where: { goalId: updated.goalId },
    });

    const completedCount = allMilestones.filter((m) => m.isCompleted).length;
    const progress = Math.round((completedCount / allMilestones.length) * 100);
    const isAchieved = progress === 100;

    await prisma.goal.update({
      where: { id: updated.goalId },
      data: {
        progress,
        isAchieved,
        completedAt: isAchieved ? new Date() : null,
      },
    });

    revalidatePath("/goals");
    return { success: true, milestone: updated, progress, isAchieved };
  } catch (error) {
    console.error("Failed to toggle milestone:", error);
    return { success: false, error: "Could not toggle milestone." };
  }
}

export async function updateGoalAction(
  goalId: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    timeframe?: string;
    priority?: Priority;
    progress?: number;
    targetDate?: string | null;
    isAchieved?: boolean;
  }
) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    const updateData: any = { ...data };
    if (data.targetDate !== undefined) {
      updateData.targetDate = data.targetDate ? new Date(data.targetDate) : null;
    }

    const goal = await prisma.goal.update({
      where: { id: goalId },
      data: updateData,
      include: { milestones: true },
    });

    revalidatePath("/goals");
    return { success: true, goal };
  } catch (error) {
    console.error("Failed to update goal:", error);
    return { success: false, error: "Could not update goal." };
  }
}

export async function deleteGoalAction(goalId: string) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    await prisma.goal.delete({
      where: { id: goalId },
    });

    revalidatePath("/goals");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete goal:", error);
    return { success: false, error: "Could not delete goal." };
  }
}

// Vision Board Actions
export async function getVisionItemsAction(): Promise<VisionItemSummary[]> {
  if (!isDatabaseConfigured()) {
    return FALLBACK_VISION_ITEMS;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const items = await prisma.visionItem.findMany({
      where: { userId: user.id },
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    });

    if (items.length === 0) {
      return FALLBACK_VISION_ITEMS;
    }

    return items.map((item) => ({
      id: item.id,
      userId: item.userId,
      title: item.title,
      statement: item.statement,
      category: item.category,
      imageUrl: item.imageUrl,
      targetYear: item.targetYear,
      isPinned: item.isPinned,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB vision items fallback:", error);
    return FALLBACK_VISION_ITEMS;
  }
}

export async function createVisionItemAction(data: {
  title: string;
  statement: string;
  category?: string;
  imageUrl?: string;
  targetYear?: number;
  isPinned?: boolean;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const category = data.category || "CAREER";

    if (!isDatabaseConfigured()) {
      const newItem: VisionItemSummary = {
        id: `vis-sim-${Date.now()}`,
        userId: user.id,
        title: data.title,
        statement: data.statement,
        category,
        imageUrl: data.imageUrl,
        targetYear: data.targetYear || 2027,
        isPinned: data.isPinned || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, item: newItem };
    }

    const item = await prisma.visionItem.create({
      data: {
        userId: user.id,
        title: data.title,
        statement: data.statement,
        category,
        imageUrl: data.imageUrl || null,
        targetYear: data.targetYear || 2027,
        isPinned: data.isPinned || false,
      },
    });

    revalidatePath("/goals");
    return { success: true, item };
  } catch (error) {
    console.error("Failed to create vision item:", error);
    return { success: false, error: "Could not create vision card." };
  }
}

export async function deleteVisionItemAction(id: string) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    await prisma.visionItem.delete({
      where: { id },
    });

    revalidatePath("/goals");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete vision item:", error);
    return { success: false, error: "Could not delete vision card." };
  }
}
