"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TaskSummary, SubtaskSummary, TaskStatus, Priority } from "@/types";
import { FALLBACK_TASKS } from "@/lib/constants";

interface TasksState {
  tasks: TaskSummary[];
  isHydrated: boolean;

  // CRUD Actions
  addTask: (data: {
    title: string;
    description?: string;
    category?: string;
    priority?: Priority;
    projectId?: string | null;
    startDate?: string | null;
    dueDate?: string | null;
    estimatedMinutes?: number;
    recurrence?: string;
    tags?: string[];
    subtasks?: string[];
  }) => TaskSummary;

  updateTask: (id: string, updates: Partial<TaskSummary>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => TaskStatus;
  bulkUpdateStatus: (ids: string[], status: TaskStatus) => void;
  bulkDeleteTasks: (ids: string[]) => void;

  // Subtasks
  addSubtask: (taskId: string, title: string) => SubtaskSummary;
  toggleSubtask: (subtaskId: string) => void;
  deleteSubtask: (subtaskId: string) => void;

  // Reset & Purge
  setTasks: (tasks: TaskSummary[]) => void;
  resetTasksToDefault: () => void;
  clearAllTasks: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: FALLBACK_TASKS,
      isHydrated: false,

      addTask: (data) => {
        const id = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const subtasks: SubtaskSummary[] = (data.subtasks || []).map((title, i) => ({
          id: `st-${Date.now()}-${i}`,
          taskId: id,
          title,
          completed: false,
          order: i,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
          completedAt: null,
          estimatedMinutes: data.estimatedMinutes || 30,
          actualMinutes: 0,
          recurrence: data.recurrence || "NONE",
          subtasks,
          tags: data.tags || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));

        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const updated = { ...t, ...updates, updatedAt: new Date().toISOString() };
            if (updates.status === TaskStatus.COMPLETED && t.status !== TaskStatus.COMPLETED) {
              updated.completedAt = new Date().toISOString();
            } else if (updates.status && updates.status !== TaskStatus.COMPLETED) {
              updated.completedAt = null;
            }
            return updated;
          }),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      toggleTaskStatus: (id) => {
        let finalStatus: TaskStatus = TaskStatus.PENDING;
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== id) return t;
            const nextStatus =
              t.status === TaskStatus.COMPLETED
                ? TaskStatus.PENDING
                : TaskStatus.COMPLETED;
            finalStatus = nextStatus;
            return {
              ...t,
              status: nextStatus,
              completedAt: nextStatus === TaskStatus.COMPLETED ? new Date().toISOString() : null,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
        return finalStatus;
      },

      bulkUpdateStatus: (ids, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            ids.includes(t.id)
              ? {
                  ...t,
                  status,
                  completedAt: status === TaskStatus.COMPLETED ? new Date().toISOString() : null,
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));
      },

      bulkDeleteTasks: (ids) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => !ids.includes(t.id)),
        }));
      },

      addSubtask: (taskId, title) => {
        const subtaskId = `st-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newSub: SubtaskSummary = {
          id: subtaskId,
          taskId,
          title,
          completed: false,
          order: 99,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: [...(t.subtasks || []), newSub], updatedAt: new Date().toISOString() }
              : t
          ),
        }));

        return newSub;
      },

      toggleSubtask: (subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => ({
            ...t,
            subtasks: (t.subtasks || []).map((st) =>
              st.id === subtaskId
                ? { ...st, completed: !st.completed, updatedAt: new Date().toISOString() }
                : st
            ),
          })),
        }));
      },

      deleteSubtask: (subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) => ({
            ...t,
            subtasks: (t.subtasks || []).filter((st) => st.id !== subtaskId),
          })),
        }));
      },

      setTasks: (tasks) => set({ tasks }),
      resetTasksToDefault: () => set({ tasks: FALLBACK_TASKS }),
      clearAllTasks: () => set({ tasks: [] }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "xasan_tasks_storage",
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState || !Array.isArray(persistedState.tasks) || version < 2) {
          return {
            ...persistedState,
            tasks: FALLBACK_TASKS,
          };
        }
        return persistedState;
      },
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
