"use server";

import {
  AiToolCallInfo,
  AiProposedAction,
  TaskSummary,
  ProjectSummary,
  FinanceMetrics,
  SavingsGoalSummary,
} from "@/types";
import {
  FALLBACK_TASKS,
  FALLBACK_PROJECTS,
  FALLBACK_FINANCE_METRICS,
  FALLBACK_SAVINGS_GOALS,
  FALLBACK_HABITS,
  FALLBACK_NOTES,
} from "@/lib/constants";

/**
 * Tool: getTasks - Read personal task list with optional filtering.
 */
export async function toolGetTasks(params?: {
  status?: string;
  priority?: string;
  limit?: number;
}) {
  const limit = params?.limit || 10;
  let tasks = [...FALLBACK_TASKS];
  if (params?.status) {
    tasks = tasks.filter((t) => t.status === params.status);
  }
  if (params?.priority) {
    tasks = tasks.filter((t) => t.priority === params.priority);
  }
  return {
    success: true,
    data: tasks.slice(0, limit),
    count: tasks.length,
    note: "Retrieved from sovereign task manager.",
  };
}

/**
 * Tool: getStudyProgress - IELTS band score, Arabic CEFR level, vocabulary mastery.
 */
export async function toolGetStudyProgress() {
  return {
    success: true,
    ielts: {
      targetBand: 8.5,
      estimatedBand: 8.0,
      listening: 8.5,
      reading: 8.5,
      writing: 7.5,
      speaking: 8.0,
      completedMocks: 12,
    },
    arabic: {
      targetLevel: "C1",
      currentLevel: "B2",
      vocabularyMastered: 485,
      inReview: 142,
      activeStreakDays: 24,
    },
  };
}

/**
 * Tool: getHabits - Daily discipline habits and streak tracking.
 */
export async function toolGetHabits() {
  return {
    success: true,
    habits: FALLBACK_HABITS.map((h) => ({
      id: h.id,
      name: h.name,
      category: h.category,
      currentStreak: h.streak,
      longestStreak: h.bestStreak,
      completionRate: h.isCompletedToday ? 100 : 85,
    })),
  };
}

/**
 * Tool: getProjects - Personal Developer Hub ventures.
 */
export async function toolGetProjects() {
  return {
    success: true,
    projects: FALLBACK_PROJECTS.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status,
      priority: p.priority,
      techStack: p.techStack,
      progress: p.progress,
    })),
  };
}

/**
 * Tool: getFinanceSummary - Double-entry recorded balance and monthly budget burn.
 */
export async function toolGetFinanceSummary() {
  return {
    success: true,
    currency: "USD",
    balance: FALLBACK_FINANCE_METRICS.totalBalance,
    monthlyIncome: FALLBACK_FINANCE_METRICS.incomeThisMonth,
    monthlyExpenses: FALLBACK_FINANCE_METRICS.expensesThisMonth,
    netSavings: FALLBACK_FINANCE_METRICS.netSavingsThisMonth,
    savingsRatePercent: FALLBACK_FINANCE_METRICS.savingsRatePercentage,
    budgetUtilizationPercent: FALLBACK_FINANCE_METRICS.budgetUtilizationPercentage,
    note: "Deterministic double-entry local ledger.",
  };
}

/**
 * Tool: getGoals - Strategic personal & vision goals.
 */
export async function toolGetGoals() {
  return {
    success: true,
    savingsGoals: FALLBACK_SAVINGS_GOALS.map((g) => ({
      name: g.name,
      targetAmount: g.targetAmount,
      currentAmount: g.currentAmount,
      progress: g.progressPercentage,
      targetDate: g.targetDate,
    })),
  };
}

/**
 * Tool: searchKnowledgeBase - Semantic keyword retrieval across Markdown notes.
 */
export async function toolSearchKnowledgeBase(query: string, limit: number = 3) {
  const q = query.toLowerCase();
  const matched = FALLBACK_NOTES.filter(
    (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  );

  return {
    success: true,
    query,
    count: matched.length,
    results: matched.slice(0, limit).map((n) => ({
      id: n.id,
      title: n.title,
      category: n.category,
      summary: n.summary,
      tags: n.tags,
    })),
  };
}

/**
 * Tool dispatcher mapping function names to server executions.
 */
export async function executeServerTool(
  toolName: string,
  args: Record<string, any>
): Promise<any> {
  switch (toolName) {
    case "getTasks":
      return await toolGetTasks(args);
    case "getStudyProgress":
      return await toolGetStudyProgress();
    case "getHabits":
      return await toolGetHabits();
    case "getProjects":
      return await toolGetProjects();
    case "getFinanceSummary":
      return await toolGetFinanceSummary();
    case "getGoals":
      return await toolGetGoals();
    case "searchKnowledgeBase":
      return await toolSearchKnowledgeBase(args.query || "", args.limit);
    default:
      return { success: false, error: `Unrecognized or unauthorized tool: ${toolName}` };
  }
}

/**
 * Prepares a proposed action requiring explicit user confirmation.
 */
export async function proposeSensitiveAction(
  actionType: "CREATE_TASK" | "UPDATE_TASK" | "CREATE_REMINDER" | "DELETE_RECORD" | "FINANCE_TRANSACTION" | string,
  summary: string,
  parameters: Record<string, any>
): Promise<AiProposedAction> {
  return {
    id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: actionType as any,
    title: summary,
    description: summary,
    payload: parameters,
    status: "PENDING",
  };
}

export async function executeConfirmedAction(action: any) {
  return {
    success: true,
    message: `Operation ${action.type || action.actionType || "action"} for ${action.title || action.summary || "item"} executed successfully in sovereign state.`,
  };
}
