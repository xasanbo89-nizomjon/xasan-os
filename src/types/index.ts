import { Priority, TaskStatus, ProjectStatus, TransactionType } from "@prisma/client";

export type { Priority, TaskStatus, ProjectStatus, TransactionType };

export interface NavItem {
  id: string;
  name: string;
  href: string;
  iconName: string;
  badge?: string | number;
  badgeVariant?: "default" | "emerald" | "urgent";
  category: "Core" | "Growth" | "Intelligence" | "System";
  shortcut?: string;
}

export interface UserSummary {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  role: string;
}

export interface TaskSummary {
  id: string;
  userId: string;
  projectId?: string | null;
  project?: {
    id: string;
    name: string;
    color?: string | null;
  } | null;
  title: string;
  description?: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate?: Date | string | null;
  completedAt?: Date | string | null;
  tags: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface HabitSummary {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  frequency: string;
  targetDaysPerWeek: number;
  targetCount: number;
  unit: string;
  category: string;
  color: string;
  streak: number;
  bestStreak: number;
  archived: boolean;
  isCompletedToday?: boolean;
  createdAt: Date | string;
}

export interface ProjectSummary {
  id: string;
  userId: string;
  name: string;
  slug: string;
  description?: string | null;
  status: ProjectStatus;
  priority: Priority;
  techStack: string[];
  repositoryUrl?: string | null;
  liveUrl?: string | null;
  progress: number;
  color?: string | null;
  icon?: string | null;
  taskCount?: number;
  completedTaskCount?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TransactionSummary {
  id: string;
  userId: string;
  title: string;
  amount: number | string;
  type: TransactionType;
  category: string;
  account: string;
  date: Date | string;
  notes?: string | null;
  tags: string[];
  createdAt: Date | string;
}

export interface KnowledgeNoteSummary {
  id: string;
  userId: string;
  title: string;
  content: string;
  summary?: string | null;
  category: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface DashboardMetrics {
  tasks: {
    pending: number;
    completed: number;
    urgent: number;
  };
  habits: {
    active: number;
    completedToday: number;
    completionRate: number;
  };
  projects: {
    active: number;
    completed: number;
  };
  finance: {
    balance: number;
    incomeThisMonth: number;
    expensesThisMonth: number;
  };
}
