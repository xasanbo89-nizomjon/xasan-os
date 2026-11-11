"use server";

import {
  TransactionSummary,
  BudgetSummary,
  SavingsGoalSummary,
  FinanceMetrics,
  FinancialReportSummary,
  TransactionType,
} from "@/types";
import {
  FALLBACK_TRANSACTIONS,
  FALLBACK_BUDGETS,
  FALLBACK_SAVINGS_GOALS,
  FALLBACK_FINANCE_METRICS,
  FALLBACK_FINANCIAL_REPORTS,
} from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getFinanceMetricsAction(): Promise<FinanceMetrics> {
  return FALLBACK_FINANCE_METRICS;
}

export async function getTransactionsAction(filters?: {
  type?: TransactionType;
  category?: string;
  startDate?: string;
  endDate?: string;
}): Promise<TransactionSummary[]> {
  let list = [...FALLBACK_TRANSACTIONS];
  if (filters?.type) {
    list = list.filter((t) => t.type === filters.type);
  }
  if (filters?.category && filters.category !== "ALL") {
    list = list.filter((t) => t.category.toLowerCase() === filters.category?.toLowerCase());
  }
  return list;
}

export async function createTransactionAction(data: {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  account?: string;
  currency?: string;
  paymentMethod?: string;
  date?: string;
  notes?: string;
  tags?: string[];
}) {
  const newTx: TransactionSummary = {
    id: `tx-local-${Date.now()}`,
    userId: "local-user",
    title: data.title,
    amount: Number(data.amount),
    type: data.type,
    category: data.category,
    account: data.account || "Default Account",
    currency: data.currency || "USD",
    paymentMethod: data.paymentMethod || "Visa / Mastercard",
    date: data.date || new Date().toISOString(),
    notes: data.notes || null,
    tags: data.tags || [],
    createdAt: new Date().toISOString(),
  };

  revalidatePath("/finance");
  revalidatePath("/");
  return { success: true, transaction: newTx };
}

export async function updateTransactionAction(
  id: string,
  updates: Partial<TransactionSummary>
) {
  revalidatePath("/finance");
  revalidatePath("/");
  return { success: true, id, updates };
}

export async function deleteTransactionAction(id: string) {
  revalidatePath("/finance");
  revalidatePath("/");
  return { success: true, id };
}

export async function getBudgetsAction(period?: string): Promise<BudgetSummary[]> {
  return FALLBACK_BUDGETS;
}

export async function createBudgetAction(data: {
  category: string;
  monthlyLimit: number;
  period?: string;
  month?: string;
  alertThreshold?: number;
}) {
  const newBudget: BudgetSummary = {
    id: `bdg-local-${Date.now()}`,
    userId: "local-user",
    category: data.category,
    month: data.month || data.period || "2026-11",
    monthlyLimit: Number(data.monthlyLimit),
    spentAmount: 0,
    percentageUsed: 0,
    currency: "USD",
    createdAt: new Date().toISOString(),
  };

  revalidatePath("/finance");
  return { success: true, budget: newBudget };
}

export async function setBudgetLimitAction(category: string, monthlyLimit: number, month: string = "2026-11") {
  revalidatePath("/finance");
  return { success: true, category, monthlyLimit, month };
}

export async function updateBudgetAction(id: string, updates: Partial<BudgetSummary>) {
  revalidatePath("/finance");
  return { success: true, id, updates };
}

export async function deleteBudgetAction(id: string) {
  revalidatePath("/finance");
  return { success: true, id };
}

export async function getSavingsGoalsAction(): Promise<SavingsGoalSummary[]> {
  return FALLBACK_SAVINGS_GOALS;
}

export async function createSavingsGoalAction(data: {
  name: string;
  targetAmount: number;
  currentAmount?: number;
  targetDate?: string;
  color?: string;
  icon?: string;
  category?: string;
}) {
  const targetAmount = Number(data.targetAmount);
  const currentAmount = Number(data.currentAmount || 0);
  const newGoal: SavingsGoalSummary = {
    id: `goal-local-${Date.now()}`,
    userId: "local-user",
    name: data.name,
    targetAmount,
    currentAmount,
    currency: "USD",
    category: data.category || "Hardware",
    isCompleted: currentAmount >= targetAmount,
    progressPercentage: targetAmount > 0 ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0,
    targetDate: data.targetDate || null,
    color: data.color || "#10B981",
    icon: data.icon || "Target",
    contributions: [],
    createdAt: new Date().toISOString(),
  };

  revalidatePath("/finance");
  return { success: true, goal: newGoal };
}

export async function contributeToSavingsGoalAction(id: string, amount: number) {
  revalidatePath("/finance");
  return { success: true, id, amount };
}

export async function deleteSavingsGoalAction(id: string) {
  revalidatePath("/finance");
  return { success: true, id };
}

export async function getFinancialReportAction(period: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"): Promise<FinancialReportSummary> {
  return FALLBACK_FINANCIAL_REPORTS[period] || FALLBACK_FINANCIAL_REPORTS["MONTHLY"];
}
