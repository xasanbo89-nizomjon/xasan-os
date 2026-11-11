"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  TransactionSummary,
  BudgetSummary,
  SavingsGoalSummary,
  TransactionType,
} from "@/types";
import {
  FALLBACK_TRANSACTIONS,
  FALLBACK_BUDGETS,
  FALLBACK_SAVINGS_GOALS,
} from "@/lib/constants";

interface FinanceState {
  transactions: TransactionSummary[];
  budgets: BudgetSummary[];
  savingsGoals: SavingsGoalSummary[];
  isHydrated: boolean;

  // Transaction Actions
  addTransaction: (data: {
    title: string;
    amount: number;
    type: TransactionType;
    category: string;
    account?: string;
    notes?: string;
    tags?: string[];
    date?: string;
  }) => TransactionSummary;

  updateTransaction: (id: string, updates: Partial<TransactionSummary>) => void;
  deleteTransaction: (id: string) => void;

  // Budget Actions
  addBudget: (data: {
    category: string;
    monthlyLimit: number;
    month?: string;
    spentAmount?: number;
    currency?: string;
  }) => BudgetSummary;

  setBudgetLimit: (category: string, monthlyLimit: number, month?: string) => void;
  updateBudget: (id: string, updates: Partial<BudgetSummary>) => void;
  deleteBudget: (id: string) => void;

  // Savings Goal Actions
  addSavingsGoal: (data: {
    name: string;
    targetAmount: number;
    currentAmount?: number;
    category?: string;
    targetDate?: string;
    color?: string;
    icon?: string;
  }) => SavingsGoalSummary;

  contributeToGoal: (id: string, amount: number) => void;
  deleteSavingsGoal: (id: string) => void;

  // Reset & Purge
  resetFinanceToDefault: () => void;
  clearAllFinance: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: FALLBACK_TRANSACTIONS,
      budgets: FALLBACK_BUDGETS,
      savingsGoals: FALLBACK_SAVINGS_GOALS,
      isHydrated: false,

      addTransaction: (data) => {
        const id = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newTx: TransactionSummary = {
          id,
          userId: "local-user",
          title: data.title,
          amount: Number(data.amount),
          type: data.type,
          category: data.category,
          account: data.account || "Default Account",
          date: data.date || new Date().toISOString(),
          notes: data.notes || null,
          tags: data.tags || [],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          transactions: [newTx, ...state.transactions],
        }));

        return newTx;
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        }));
      },

      addBudget: (data) => {
        const id = `bdg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const monthlyLimit = Number(data.monthlyLimit);
        const spentAmount = Number(data.spentAmount || 0);
        const percentageUsed =
          monthlyLimit > 0
            ? parseFloat(((spentAmount / monthlyLimit) * 100).toFixed(1))
            : 0;

        const newBudget: BudgetSummary = {
          id,
          userId: "local-user",
          category: data.category,
          month: data.month || "2026-11",
          monthlyLimit,
          spentAmount,
          percentageUsed,
          currency: data.currency || "USD",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          budgets: [newBudget, ...state.budgets],
        }));

        return newBudget;
      },

      setBudgetLimit: (category, monthlyLimit, month = "2026-11") => {
        set((state) => {
          const existing = state.budgets.find(
            (b) => b.category === category && b.month === month
          );
          if (existing) {
            const spent = existing.spentAmount || 0;
            const pct =
              monthlyLimit > 0
                ? parseFloat(((spent / monthlyLimit) * 100).toFixed(1))
                : 0;
            return {
              budgets: state.budgets.map((b) =>
                b.id === existing.id
                  ? { ...b, monthlyLimit, percentageUsed: pct }
                  : b
              ),
            };
          } else {
            const newBud: BudgetSummary = {
              id: `bud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              userId: "local-user",
              category,
              month,
              monthlyLimit,
              spentAmount: 0,
              percentageUsed: 0,
              currency: "USD",
              createdAt: new Date().toISOString(),
            };
            return {
              budgets: [...state.budgets, newBud],
            };
          }
        });
      },

      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        }));
      },

      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        }));
      },

      addSavingsGoal: (data) => {
        const id = `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const targetAmount = Number(data.targetAmount);
        const currentAmount = Number(data.currentAmount || 0);
        const progressPercentage =
          targetAmount > 0
            ? Math.min(100, Math.round((currentAmount / targetAmount) * 100))
            : 0;

        const newGoal: SavingsGoalSummary = {
          id,
          userId: "local-user",
          name: data.name,
          targetAmount,
          currentAmount,
          currency: "USD",
          category: data.category || "Hardware",
          isCompleted: currentAmount >= targetAmount,
          progressPercentage,
          targetDate: data.targetDate || null,
          color: data.color || "#10B981",
          icon: data.icon || "Target",
          contributions: [],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          savingsGoals: [newGoal, ...state.savingsGoals],
        }));

        return newGoal;
      },

      contributeToGoal: (id, amount) => {
        set((state) => ({
          savingsGoals: state.savingsGoals.map((g) => {
            if (g.id !== id) return g;
            const newAmount = g.currentAmount + Number(amount);
            const progress = Math.min(
              100,
              Math.round((newAmount / g.targetAmount) * 100)
            );
            return {
              ...g,
              currentAmount: newAmount,
              isCompleted: newAmount >= g.targetAmount,
              progressPercentage: progress,
              contributions: [
                ...(g.contributions || []),
                {
                  id: `contrib-${Date.now()}`,
                  goalId: id,
                  userId: "local-user",
                  amount: Number(amount),
                  date: new Date().toISOString(),
                  note: "Manual contribution",
                },
              ],
            };
          }),
        }));
      },

      deleteSavingsGoal: (id) => {
        set((state) => ({
          savingsGoals: state.savingsGoals.filter((g) => g.id !== id),
        }));
      },

      resetFinanceToDefault: () =>
        set({
          transactions: FALLBACK_TRANSACTIONS,
          budgets: FALLBACK_BUDGETS,
          savingsGoals: FALLBACK_SAVINGS_GOALS,
        }),

      clearAllFinance: () =>
        set({
          transactions: [],
          budgets: [],
          savingsGoals: [],
        }),

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: "xasan_finance_storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
