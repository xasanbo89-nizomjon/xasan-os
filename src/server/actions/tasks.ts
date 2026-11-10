"use server";

import prisma from "@/lib/prisma";
import { Priority, TaskStatus } from "@prisma/client";
import { TaskSummary, SubtaskSummary } from "@/types";
import { FALLBACK_TASKS, DEFAULT_USER_EMAIL, DEFAULT_USER_NAME } from "@/lib/constants";
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

export async function getTasksAction(filters?: {
  category?: string;
  priority?: Priority;
  status?: TaskStatus;
  search?: string;
}): Promise<TaskSummary[]> {
  if (!isDatabaseConfigured()) {
    let filtered = [...FALLBACK_TASKS];
    if (filters?.category && filters.category !== "ALL") {
      filtered = filtered.filter((t) => t.category?.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters?.priority) {
      filtered = filtered.filter((t) => t.priority === filters.priority);
    }
    if (filters?.status) {
      filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter((t) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    return filtered;
  }

  try {
    const user = await getOrCreateCurrentUser();
    const whereClause: any = { userId: user.id };

    if (filters?.category && filters.category !== "ALL") {
      whereClause.category = filters.category;
    }
    if (filters?.priority) {
      whereClause.priority = filters.priority;
    }
    if (filters?.status) {
      whereClause.status = filters.status;
    }
    if (filters?.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: { select: { id: true, name: true, color: true } },
        subtasks: { orderBy: { order: "asc" } },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    if (tasks.length === 0 && !filters?.category && !filters?.search) {
      return FALLBACK_TASKS;
    }

    return tasks.map((t) => ({
      id: t.id,
      userId: t.userId,
      projectId: t.projectId,
      project: t.project,
      title: t.title,
      description: t.description,
      category: t.category,
      priority: t.priority,
      status: t.status,
      startDate: t.startDate ? t.startDate.toISOString() : null,
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      completedAt: t.completedAt ? t.completedAt.toISOString() : null,
      estimatedMinutes: t.estimatedMinutes,
      actualMinutes: t.actualMinutes,
      recurrence: t.recurrence,
      subtasks: t.subtasks.map((st) => ({
        id: st.id,
        taskId: st.taskId,
        title: st.title,
        completed: st.completed,
        order: st.order,
        createdAt: st.createdAt.toISOString(),
        updatedAt: st.updatedAt.toISOString(),
      })),
      tags: t.tags,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.warn("DB task query fallback:", error);
    return FALLBACK_TASKS;
  }
}

export async function createTaskAction(data: {
  title: string;
  description?: string;
  category?: string;
  priority?: Priority;
  projectId?: string;
  startDate?: string;
  dueDate?: string;
  estimatedMinutes?: number;
  recurrence?: string;
  tags?: string[];
  subtasks?: string[];
}) {
  try {
    const user = await getOrCreateCurrentUser();
    const priority = data.priority || Priority.NORMAL;
    const category = data.category || "General";
    const recurrence = data.recurrence || "NONE";
    const estimatedMinutes = data.estimatedMinutes || 30;
    const tags = data.tags || [];

    if (!isDatabaseConfigured()) {
      const newSimTask: TaskSummary = {
        id: `task-sim-${Date.now()}`,
        userId: user.id,
        projectId: data.projectId || null,
        title: data.title,
        description: data.description || null,
        category,
        priority,
        status: TaskStatus.PENDING,
        startDate: data.startDate || null,
        dueDate: data.dueDate || null,
        estimatedMinutes,
        actualMinutes: 0,
        recurrence,
        subtasks: (data.subtasks || []).map((title, i) => ({
          id: `st-sim-${Date.now()}-${i}`,
          taskId: `task-sim-${Date.now()}`,
          title,
          completed: false,
          order: i,
          createdAt: new Date().toISOString(),
        })),
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, task: newSimTask };
    }

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        projectId: data.projectId || null,
        title: data.title,
        description: data.description || null,
        category,
        priority,
        status: TaskStatus.PENDING,
        startDate: data.startDate ? new Date(data.startDate) : null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        estimatedMinutes,
        recurrence,
        tags,
        subtasks: data.subtasks && data.subtasks.length > 0 ? {
          create: data.subtasks.map((stTitle, i) => ({
            title: stTitle,
            completed: false,
            order: i,
          })),
        } : undefined,
      },
      include: {
        project: { select: { id: true, name: true, color: true } },
        subtasks: true,
      },
    });

    revalidatePath("/tasks");
    revalidatePath("/");
    return { success: true, task };
  } catch (error) {
    console.error("Failed to create task:", error);
    return { success: false, error: "Could not create task. Check database connection." };
  }
}

export async function updateTaskAction(
  taskId: string,
  updates: {
    title?: string;
    description?: string;
    category?: string;
    priority?: Priority;
    status?: TaskStatus;
    projectId?: string | null;
    startDate?: string | null;
    dueDate?: string | null;
    estimatedMinutes?: number;
    actualMinutes?: number;
    recurrence?: string;
    tags?: string[];
  }
) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true, message: "Task updated (simulated)" };
    }

    const dataToUpdate: any = { ...updates };
    if (updates.startDate !== undefined) {
      dataToUpdate.startDate = updates.startDate ? new Date(updates.startDate) : null;
    }
    if (updates.dueDate !== undefined) {
      dataToUpdate.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
    }
    if (updates.status === TaskStatus.COMPLETED) {
      dataToUpdate.completedAt = new Date();
    } else if (updates.status) {
      dataToUpdate.completedAt = null;
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: dataToUpdate,
      include: {
        project: { select: { id: true, name: true, color: true } },
        subtasks: true,
      },
    });

    revalidatePath("/tasks");
    revalidatePath("/");
    return { success: true, task };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { success: false, error: "Failed to update task." };
  }
}

export async function toggleTaskStatusAction(taskId: string, currentStatus: TaskStatus) {
  try {
    const newStatus =
      currentStatus === TaskStatus.COMPLETED
        ? TaskStatus.PENDING
        : currentStatus === TaskStatus.PENDING
        ? TaskStatus.IN_PROGRESS
        : TaskStatus.COMPLETED;

    if (!isDatabaseConfigured()) {
      return { success: true, newStatus };
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        completedAt: newStatus === TaskStatus.COMPLETED ? new Date() : null,
      },
    });

    revalidatePath("/tasks");
    revalidatePath("/");
    return { success: true, task, newStatus };
  } catch (error) {
    console.error("Failed to toggle task status:", error);
    return { success: false, error: "Could not toggle task status." };
  }
}

export async function deleteTaskAction(taskId: string) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    revalidatePath("/tasks");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete task:", error);
    return { success: false, error: "Could not delete task." };
  }
}

export async function bulkUpdateTasksStatusAction(taskIds: string[], status: TaskStatus) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true, updatedCount: taskIds.length };
    }

    const result = await prisma.task.updateMany({
      where: { id: { in: taskIds } },
      data: {
        status,
        completedAt: status === TaskStatus.COMPLETED ? new Date() : null,
      },
    });

    revalidatePath("/tasks");
    revalidatePath("/");
    return { success: true, updatedCount: result.count };
  } catch (error) {
    console.error("Failed to bulk update tasks:", error);
    return { success: false, error: "Could not bulk update tasks." };
  }
}

export async function bulkDeleteTasksAction(taskIds: string[]) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true, deletedCount: taskIds.length };
    }

    const result = await prisma.task.deleteMany({
      where: { id: { in: taskIds } },
    });

    revalidatePath("/tasks");
    revalidatePath("/");
    return { success: true, deletedCount: result.count };
  } catch (error) {
    console.error("Failed to bulk delete tasks:", error);
    return { success: false, error: "Could not bulk delete tasks." };
  }
}

export async function createSubtaskAction(taskId: string, title: string) {
  try {
    if (!isDatabaseConfigured()) {
      const newSub: SubtaskSummary = {
        id: `st-sim-${Date.now()}`,
        taskId,
        title,
        completed: false,
        order: 99,
        createdAt: new Date().toISOString(),
      };
      return { success: true, subtask: newSub };
    }

    const subtask = await prisma.subtask.create({
      data: {
        taskId,
        title,
        completed: false,
      },
    });

    revalidatePath("/tasks");
    return { success: true, subtask };
  } catch (error) {
    console.error("Failed to create subtask:", error);
    return { success: false, error: "Could not create subtask." };
  }
}

export async function toggleSubtaskAction(subtaskId: string, currentCompleted: boolean) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true, completed: !currentCompleted };
    }

    const subtask = await prisma.subtask.update({
      where: { id: subtaskId },
      data: { completed: !currentCompleted },
    });

    revalidatePath("/tasks");
    return { success: true, subtask };
  } catch (error) {
    console.error("Failed to toggle subtask:", error);
    return { success: false, error: "Could not toggle subtask." };
  }
}

export async function deleteSubtaskAction(subtaskId: string) {
  try {
    if (!isDatabaseConfigured()) {
      return { success: true };
    }

    await prisma.subtask.delete({
      where: { id: subtaskId },
    });

    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete subtask:", error);
    return { success: false, error: "Could not delete subtask." };
  }
}
