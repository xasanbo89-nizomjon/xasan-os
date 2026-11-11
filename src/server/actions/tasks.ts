"use server";

import { Priority, TaskStatus, TaskSummary, SubtaskSummary } from "@/types";
import { FALLBACK_TASKS, DEFAULT_USER_EMAIL, DEFAULT_USER_NAME } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getTasksAction(filters?: {
  category?: string;
  priority?: Priority;
  status?: TaskStatus;
  search?: string;
}): Promise<TaskSummary[]> {
  let filtered = [...FALLBACK_TASKS];
  if (filters?.category && filters.category !== "ALL") {
    filtered = filtered.filter((t: TaskSummary) => t.category?.toLowerCase() === filters.category?.toLowerCase());
  }
  if (filters?.priority) {
    filtered = filtered.filter((t: TaskSummary) => t.priority === filters.priority);
  }
  if (filters?.status) {
    filtered = filtered.filter((t: TaskSummary) => t.status === filters.status);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((t: TaskSummary) => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
  }
  return filtered;
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
  const id = `task-local-${Date.now()}`;
  const subtasks: SubtaskSummary[] = (data.subtasks || []).map((title, i) => ({
    id: `st-local-${Date.now()}-${i}`,
    taskId: id,
    title,
    completed: false,
    order: i,
    createdAt: new Date().toISOString(),
  }));

  const newTask: TaskSummary = {
    id,
    userId: "local-user",
    projectId: data.projectId || null,
    title: data.title,
    description: data.description || null,
    category: data.category || "General",
    priority: data.priority || Priority.NORMAL,
    status: TaskStatus.PENDING,
    startDate: data.startDate || null,
    dueDate: data.dueDate || null,
    estimatedMinutes: data.estimatedMinutes || 30,
    actualMinutes: 0,
    recurrence: data.recurrence || "NONE",
    subtasks,
    tags: data.tags || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  revalidatePath("/tasks");
  revalidatePath("/");
  return { success: true, task: newTask };
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
  revalidatePath("/tasks");
  revalidatePath("/");
  return { success: true, taskId, updates };
}

export async function toggleTaskStatusAction(taskId: string, currentStatus: TaskStatus) {
  const newStatus =
    currentStatus === TaskStatus.COMPLETED
      ? TaskStatus.PENDING
      : currentStatus === TaskStatus.PENDING
      ? TaskStatus.IN_PROGRESS
      : TaskStatus.COMPLETED;

  revalidatePath("/tasks");
  revalidatePath("/");
  return { success: true, taskId, newStatus };
}

export async function deleteTaskAction(taskId: string) {
  revalidatePath("/tasks");
  revalidatePath("/");
  return { success: true, taskId };
}

export async function bulkUpdateTasksStatusAction(taskIds: string[], status: TaskStatus) {
  revalidatePath("/tasks");
  revalidatePath("/");
  return { success: true, updatedCount: taskIds.length, status };
}

export async function bulkDeleteTasksAction(taskIds: string[]) {
  revalidatePath("/tasks");
  revalidatePath("/");
  return { success: true, deletedCount: taskIds.length };
}

export async function createSubtaskAction(taskId: string, title: string) {
  const newSub: SubtaskSummary = {
    id: `st-local-${Date.now()}`,
    taskId,
    title,
    completed: false,
    order: 99,
    createdAt: new Date().toISOString(),
  };

  revalidatePath("/tasks");
  return { success: true, subtask: newSub };
}

export async function toggleSubtaskAction(subtaskId: string, currentCompleted: boolean) {
  revalidatePath("/tasks");
  return { success: true, subtaskId, completed: !currentCompleted };
}

export async function deleteSubtaskAction(subtaskId: string) {
  revalidatePath("/tasks");
  return { success: true, subtaskId };
}
