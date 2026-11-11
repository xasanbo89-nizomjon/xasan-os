"use server";

import {
  Priority,
  TaskStatus,
  ProjectStatus,
  TransactionType,
  DashboardMetrics,
  TaskSummary,
  HabitSummary,
  ProjectSummary,
  TransactionSummary,
  KnowledgeNoteSummary,
} from "@/types";
import {
  FALLBACK_PROJECTS,
  FALLBACK_TASKS,
  FALLBACK_HABITS,
  FALLBACK_TRANSACTIONS,
  FALLBACK_NOTES,
} from "@/lib/constants";

export async function getDashboardData(): Promise<{
  metrics: DashboardMetrics;
  recentTasks: TaskSummary[];
  activeHabits: HabitSummary[];
  projects: ProjectSummary[];
  recentTransactions: TransactionSummary[];
  pinnedNotes: KnowledgeNoteSummary[];
}> {
  return {
    metrics: {
      tasks: { pending: 3, completed: 1, urgent: 1 },
      habits: { active: 3, completedToday: 2, completionRate: 67 },
      projects: { active: 3, completed: 0 },
      finance: { balance: 4390, incomeThisMonth: 4850, expensesThisMonth: 460 },
    },
    recentTasks: FALLBACK_TASKS,
    activeHabits: FALLBACK_HABITS,
    projects: FALLBACK_PROJECTS,
    recentTransactions: FALLBACK_TRANSACTIONS,
    pinnedNotes: FALLBACK_NOTES,
  };
}

export async function getGlobalSearchDataAction(): Promise<{
  tasks: TaskSummary[];
  projects: ProjectSummary[];
  notes: KnowledgeNoteSummary[];
  transactions: TransactionSummary[];
}> {
  return {
    tasks: FALLBACK_TASKS,
    projects: FALLBACK_PROJECTS,
    notes: FALLBACK_NOTES,
    transactions: FALLBACK_TRANSACTIONS,
  };
}

export async function createTaskAction(formData: {
  title: string;
  description?: string;
  priority: Priority;
  projectId?: string;
  dueDate?: string;
}) {
  return {
    success: true,
    task: {
      id: `task-local-${Date.now()}`,
      userId: "local-user",
      title: formData.title,
      description: formData.description || null,
      priority: formData.priority,
      status: TaskStatus.PENDING,
      tags: [],
      createdAt: new Date().toISOString(),
    },
  };
}

export async function createHabitAction(formData: {
  name: string;
  description?: string;
  frequency?: string;
  category?: string;
  color?: string;
}) {
  return {
    success: true,
    habit: {
      id: `habit-local-${Date.now()}`,
      userId: "local-user",
      name: formData.name,
      category: formData.category || "DISCIPLINE",
      streak: 1,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function createProjectAction(formData: {
  name: string;
  slug: string;
  description?: string;
  techStack?: string[];
  priority?: Priority;
}) {
  return {
    success: true,
    project: {
      id: `proj-local-${Date.now()}`,
      userId: "local-user",
      name: formData.name,
      slug: formData.slug,
      progress: 10,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function createTransactionAction(formData: {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  account?: string;
  notes?: string;
}) {
  return {
    success: true,
    transaction: {
      id: `tx-local-${Date.now()}`,
      userId: "local-user",
      title: formData.title,
      amount: formData.amount,
      type: formData.type,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function createKnowledgeNoteAction(formData: {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
}) {
  return {
    success: true,
    note: {
      id: `note-local-${Date.now()}`,
      userId: "local-user",
      title: formData.title,
      content: formData.content,
      createdAt: new Date().toISOString(),
    },
  };
}
