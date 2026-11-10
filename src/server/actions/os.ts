"use server";

import prisma from "@/lib/prisma";
import { Priority, TaskStatus, ProjectStatus, TransactionType } from "@prisma/client";
import { DashboardMetrics, TaskSummary, HabitSummary, ProjectSummary, TransactionSummary, KnowledgeNoteSummary } from "@/types";
import {
  DEFAULT_USER_EMAIL,
  DEFAULT_USER_NAME,
  FALLBACK_PROJECTS,
  FALLBACK_TASKS,
  FALLBACK_HABITS,
  FALLBACK_TRANSACTIONS,
  FALLBACK_NOTES,
} from "@/lib/constants";

function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  if (url.includes("johndoe:randompassword")) return false;
  return true;
}

export async function getOrCreateCurrentUser() {
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
    console.error("Database connection note: Fallback user profile in effect.", error);
    return {
      id: "demo-user-uuid-1",
      email: DEFAULT_USER_EMAIL,
      displayName: DEFAULT_USER_NAME,
      role: "OWNER",
    };
  }
}

export async function getDashboardData(): Promise<{
  metrics: DashboardMetrics;
  recentTasks: TaskSummary[];
  activeHabits: HabitSummary[];
  projects: ProjectSummary[];
  recentTransactions: TransactionSummary[];
  pinnedNotes: KnowledgeNoteSummary[];
}> {
  if (!isDatabaseConfigured()) {
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

  try {
    const user = await getOrCreateCurrentUser();

    const [tasks, habits, projects, transactions, notes] = await Promise.all([
      prisma.task.findMany({
        where: { userId: user.id },
        include: {
          project: { select: { id: true, name: true, color: true } },
          subtasks: { orderBy: { order: "asc" } },
        },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: 10,
      }),
      prisma.habit.findMany({
        where: { userId: user.id, archived: false },
        orderBy: { streak: "desc" },
        take: 6,
      }),
      prisma.project.findMany({
        where: { userId: user.id },
        include: { tasks: { select: { id: true, status: true } } },
        orderBy: { progress: "asc" },
        take: 6,
      }),
      prisma.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
        take: 6,
      }),
      prisma.knowledgeNote.findMany({
        where: { userId: user.id, isPinned: true },
        orderBy: { updatedAt: "desc" },
        take: 4,
      }),
    ]);

    if (projects.length === 0 && tasks.length === 0) {
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

    const pendingTasks = tasks.filter((t) => t.status !== TaskStatus.COMPLETED).length;
    const completedTasks = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const urgentTasks = tasks.filter((t) => t.priority === Priority.URGENT && t.status !== TaskStatus.COMPLETED).length;

    const habitActiveCount = habits.length;
    const habitCompletedCount = habits.filter((h) => h.streak > 0).length;

    const income = transactions
      .filter((tx) => tx.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
    const expenses = transactions
      .filter((tx) => tx.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      metrics: {
        tasks: {
          pending: pendingTasks,
          completed: completedTasks,
          urgent: urgentTasks,
        },
        habits: {
          active: habitActiveCount,
          completedToday: habitCompletedCount,
          completionRate: habitActiveCount > 0 ? Math.round((habitCompletedCount / habitActiveCount) * 100) : 0,
        },
        projects: {
          active: projects.filter((p) => p.status === ProjectStatus.ACTIVE).length,
          completed: projects.filter((p) => p.status === ProjectStatus.COMPLETED).length,
        },
        finance: {
          balance: income - expenses,
          incomeThisMonth: income,
          expensesThisMonth: expenses,
        },
      },
      recentTasks: tasks.map((t) => ({
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
      })),
      activeHabits: habits.map((h) => ({
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
        createdAt: h.createdAt.toISOString(),
      })),
      projects: projects.map((p) => ({
        id: p.id,
        userId: p.userId,
        name: p.name,
        slug: p.slug,
        description: p.description,
        status: p.status,
        priority: p.priority,
        techStack: p.techStack,
        repositoryUrl: p.repositoryUrl,
        liveUrl: p.liveUrl,
        progress: p.progress,
        color: p.color,
        icon: p.icon,
        taskCount: p.tasks.length,
        completedTaskCount: p.tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      recentTransactions: transactions.map((tx) => ({
        id: tx.id,
        userId: tx.userId,
        title: tx.title,
        amount: Number(tx.amount),
        type: tx.type,
        category: tx.category,
        account: tx.account,
        date: tx.date.toISOString(),
        notes: tx.notes,
        tags: tx.tags,
        createdAt: tx.createdAt.toISOString(),
      })),
      pinnedNotes: notes.map((n) => ({
        id: n.id,
        userId: n.userId,
        title: n.title,
        content: n.content,
        summary: n.summary,
        category: n.category,
        tags: n.tags,
        isPinned: n.isPinned,
        isFavorite: n.isFavorite,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.warn("Serving architect foundation preview.", error);
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
}

export async function getGlobalSearchDataAction(): Promise<{
  tasks: TaskSummary[];
  projects: ProjectSummary[];
  notes: KnowledgeNoteSummary[];
  transactions: TransactionSummary[];
}> {
  if (!isDatabaseConfigured()) {
    return {
      tasks: FALLBACK_TASKS,
      projects: FALLBACK_PROJECTS,
      notes: FALLBACK_NOTES,
      transactions: FALLBACK_TRANSACTIONS,
    };
  }

  try {
    const user = await getOrCreateCurrentUser();
    const [tasks, projects, notes, transactions] = await Promise.all([
      prisma.task.findMany({
        where: { userId: user.id },
        include: { project: { select: { id: true, name: true, color: true } } },
        take: 30,
      }),
      prisma.project.findMany({
        where: { userId: user.id },
        take: 20,
      }),
      prisma.knowledgeNote.findMany({
        where: { userId: user.id },
        take: 20,
      }),
      prisma.transaction.findMany({
        where: { userId: user.id },
        take: 20,
      }),
    ]);

    return {
      tasks: tasks.map((t) => ({
        id: t.id,
        userId: t.userId,
        projectId: t.projectId,
        project: t.project,
        title: t.title,
        description: t.description,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate ? t.dueDate.toISOString() : null,
        tags: t.tags,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
      projects: projects.map((p) => ({
        id: p.id,
        userId: p.userId,
        name: p.name,
        slug: p.slug,
        description: p.description,
        status: p.status,
        priority: p.priority,
        techStack: p.techStack,
        repositoryUrl: p.repositoryUrl,
        liveUrl: p.liveUrl,
        progress: p.progress,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      notes: notes.map((n) => ({
        id: n.id,
        userId: n.userId,
        title: n.title,
        content: n.content,
        summary: n.summary,
        category: n.category,
        tags: n.tags,
        isPinned: n.isPinned,
        isFavorite: n.isFavorite,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
      transactions: transactions.map((tx) => ({
        id: tx.id,
        userId: tx.userId,
        title: tx.title,
        amount: Number(tx.amount),
        type: tx.type,
        category: tx.category,
        account: tx.account,
        date: tx.date.toISOString(),
        tags: tx.tags,
        createdAt: tx.createdAt.toISOString(),
      })),
    };
  } catch (err) {
    console.warn("Using fallback search dataset:", err);
    return {
      tasks: FALLBACK_TASKS,
      projects: FALLBACK_PROJECTS,
      notes: FALLBACK_NOTES,
      transactions: FALLBACK_TRANSACTIONS,
    };
  }
}

// Server action to create a new task
export async function createTaskAction(formData: {
  title: string;
  description?: string;
  priority: Priority;
  projectId?: string;
  dueDate?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    if (!isDatabaseConfigured()) {
      return {
        success: true,
        task: {
          id: `task-sim-${Date.now()}`,
          userId: user.id,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: TaskStatus.PENDING,
          tags: [],
          createdAt: new Date(),
        },
      };
    }
    const task = await prisma.task.create({
      data: {
        userId: user.id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority || Priority.NORMAL,
        projectId: formData.projectId || null,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        status: TaskStatus.PENDING,
      },
    });
    return { success: true, task };
  } catch (error) {
    console.error("Failed to create task in DB:", error);
    return { success: false, error: "Could not create task. Ensure database is running." };
  }
}

// Server action to create a new habit
export async function createHabitAction(formData: {
  name: string;
  description?: string;
  frequency?: string;
  category?: string;
  color?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    if (!isDatabaseConfigured()) {
      return {
        success: true,
        habit: {
          id: `habit-sim-${Date.now()}`,
          userId: user.id,
          name: formData.name,
          category: formData.category || "DISCIPLINE",
          streak: 1,
          createdAt: new Date(),
        },
      };
    }
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: formData.name,
        description: formData.description,
        frequency: formData.frequency || "DAILY",
        category: formData.category || "DISCIPLINE",
        color: formData.color || "#10B981",
      },
    });
    return { success: true, habit };
  } catch (error) {
    console.error("Failed to create habit in DB:", error);
    return { success: false, error: "Could not create habit." };
  }
}

// Server action to create a project
export async function createProjectAction(formData: {
  name: string;
  slug: string;
  description?: string;
  techStack?: string[];
  priority?: Priority;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    if (!isDatabaseConfigured()) {
      return {
        success: true,
        project: {
          id: `proj-sim-${Date.now()}`,
          userId: user.id,
          name: formData.name,
          slug: formData.slug,
          progress: 10,
          createdAt: new Date(),
        },
      };
    }
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: formData.description,
        techStack: formData.techStack || [],
        priority: formData.priority || Priority.NORMAL,
        status: ProjectStatus.ACTIVE,
      },
    });
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project in DB:", error);
    return { success: false, error: "Could not create project." };
  }
}

// Server action to create a transaction
export async function createTransactionAction(formData: {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  account?: string;
  notes?: string;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    if (!isDatabaseConfigured()) {
      return {
        success: true,
        transaction: {
          id: `tx-sim-${Date.now()}`,
          userId: user.id,
          title: formData.title,
          amount: formData.amount,
          type: formData.type,
          createdAt: new Date(),
        },
      };
    }
    const tx = await prisma.transaction.create({
      data: {
        userId: user.id,
        title: formData.title,
        amount: formData.amount,
        type: formData.type,
        category: formData.category,
        account: formData.account || "Default Account",
        notes: formData.notes,
      },
    });
    return { success: true, transaction: tx };
  } catch (error) {
    console.error("Failed to create transaction in DB:", error);
    return { success: false, error: "Could not create transaction." };
  }
}

// Server action to create a knowledge note
export async function createKnowledgeNoteAction(formData: {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
}) {
  try {
    const user = await getOrCreateCurrentUser();
    if (!isDatabaseConfigured()) {
      return {
        success: true,
        note: {
          id: `note-sim-${Date.now()}`,
          userId: user.id,
          title: formData.title,
          content: formData.content,
          createdAt: new Date(),
        },
      };
    }
    const note = await prisma.knowledgeNote.create({
      data: {
        userId: user.id,
        title: formData.title,
        content: formData.content,
        category: formData.category || "General",
        tags: formData.tags || [],
        isPinned: formData.isPinned || false,
      },
    });
    return { success: true, note };
  } catch (error) {
    console.error("Failed to create knowledge note in DB:", error);
    return { success: false, error: "Could not create knowledge note." };
  }
}
