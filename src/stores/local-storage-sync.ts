"use client";

import { useEffect, useState } from "react";
import { useTasksStore } from "./tasks-store";
import { useHabitsStore } from "./habits-store";
import { useDeveloperStore } from "./developer-store";
import { useFinanceStore } from "./finance-store";
import { useKnowledgeStore } from "./knowledge-store";
import { useStudyStore } from "./study-store";
import { useGoalsStore } from "./goals-store";
import { useCalendarStore } from "./calendar-store";
import { useDashboardStore } from "./dashboard-store";
import { TaskStatus, Priority, ProjectStatus, TransactionType, DashboardMetrics } from "@/types";

/**
 * Universal hook to verify whether client hydration is complete.
 * Avoids SSR/CSR DOM mismatch when rendering localStorage-backed state.
 */
export function useHydration() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}

/**
 * Wipe all data across all local storage keys and reset stores to empty.
 * Deletes keys immediately from browser localStorage.
 */
export function clearAllLocalData() {
  if (typeof window !== "undefined") {
    const keys = [
      "xasan_tasks_storage",
      "xasan_habits_storage",
      "xasan_developer_storage",
      "xasan_finance_storage",
      "xasan_knowledge_storage",
      "xasan_study_storage",
      "xasan_goals_storage",
      "xasan_calendar_storage",
      "xasan-dashboard-settings",
      "xasan_offline_pending_queue",
      "xasan_offline_last_sync",
    ];

    keys.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`Error removing ${key} from localStorage:`, e);
      }
    });
  }

  useTasksStore.getState().clearAllTasks();
  useHabitsStore.getState().clearAllHabits();
  useDeveloperStore.getState().clearAllDeveloper();
  useFinanceStore.getState().clearAllFinance();
  useKnowledgeStore.getState().clearAllKnowledge();
  useStudyStore.getState().clearAllStudy();
  useGoalsStore.getState().clearAllGoals();
  useCalendarStore.getState().clearAllCalendar();
}

/**
 * Reset all stores to factory default seed data (PRD foundation).
 * Immediately persists to browser localStorage.
 */
export function resetAllLocalData() {
  useTasksStore.getState().resetTasksToDefault();
  useHabitsStore.getState().resetHabitsToDefault();
  useDeveloperStore.getState().resetDeveloperToDefault();
  useFinanceStore.getState().resetFinanceToDefault();
  useKnowledgeStore.getState().resetKnowledgeToDefault();
  useStudyStore.getState().resetStudyToDefault();
  useGoalsStore.getState().resetGoalsToDefault();
  useCalendarStore.getState().resetCalendarToDefault();
  useDashboardStore.getState().resetLayout();
}

/**
 * Export full state from all stores as a portable JSON snapshot string.
 */
export function exportLocalBackup(): string {
  const backup = {
    version: "2.0.0-client-local",
    timestamp: new Date().toISOString(),
    tasks: useTasksStore.getState().tasks,
    habits: useHabitsStore.getState().habits,
    wellnessLogs: useHabitsStore.getState().wellnessLogs,
    journalEntries: useHabitsStore.getState().journalEntries,
    projects: useDeveloperStore.getState().projects,
    bugs: useDeveloperStore.getState().bugs,
    features: useDeveloperStore.getState().features,
    docs: useDeveloperStore.getState().docs,
    deployments: useDeveloperStore.getState().deployments,
    releases: useDeveloperStore.getState().releases,
    integration: useDeveloperStore.getState().integration,
    transactions: useFinanceStore.getState().transactions,
    budgets: useFinanceStore.getState().budgets,
    savingsGoals: useFinanceStore.getState().savingsGoals,
    folders: useKnowledgeStore.getState().folders,
    notes: useKnowledgeStore.getState().notes,
    ieltsRecords: useStudyStore.getState().ieltsRecords,
    examResults: useStudyStore.getState().examResults,
    arabicLogs: useStudyStore.getState().arabicLogs,
    vocabCards: useStudyStore.getState().vocabCards,
    studySessions: useStudyStore.getState().studySessions,
    goals: useGoalsStore.getState().goals,
    visionItems: useGoalsStore.getState().visionItems,
    events: useCalendarStore.getState().events,
    reminders: useCalendarStore.getState().reminders,
    focusSessions: useCalendarStore.getState().focusSessions,
    widgets: useDashboardStore.getState().widgets,
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Import a full backup JSON snapshot, repopulating all stores and localStorage.
 */
export function importLocalBackup(jsonStr: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(jsonStr);

    if (Array.isArray(data.tasks)) useTasksStore.getState().setTasks(data.tasks);
    if (Array.isArray(data.habits)) useHabitsStore.setState({ habits: data.habits });
    if (Array.isArray(data.wellnessLogs)) useHabitsStore.setState({ wellnessLogs: data.wellnessLogs });
    if (Array.isArray(data.journalEntries)) useHabitsStore.setState({ journalEntries: data.journalEntries });
    if (Array.isArray(data.projects)) useDeveloperStore.setState({ projects: data.projects });
    if (Array.isArray(data.bugs)) useDeveloperStore.setState({ bugs: data.bugs });
    if (Array.isArray(data.features)) useDeveloperStore.setState({ features: data.features });
    if (Array.isArray(data.docs)) useDeveloperStore.setState({ docs: data.docs });
    if (Array.isArray(data.deployments)) useDeveloperStore.setState({ deployments: data.deployments });
    if (Array.isArray(data.releases)) useDeveloperStore.setState({ releases: data.releases });
    if (Array.isArray(data.transactions)) useFinanceStore.setState({ transactions: data.transactions });
    if (Array.isArray(data.budgets)) useFinanceStore.setState({ budgets: data.budgets });
    if (Array.isArray(data.savingsGoals)) useFinanceStore.setState({ savingsGoals: data.savingsGoals });
    if (Array.isArray(data.folders)) useKnowledgeStore.setState({ folders: data.folders });
    if (Array.isArray(data.notes)) useKnowledgeStore.setState({ notes: data.notes });
    if (Array.isArray(data.ieltsRecords)) useStudyStore.setState({ ieltsRecords: data.ieltsRecords });
    if (Array.isArray(data.examResults)) useStudyStore.setState({ examResults: data.examResults });
    if (Array.isArray(data.arabicLogs)) useStudyStore.setState({ arabicLogs: data.arabicLogs });
    if (Array.isArray(data.vocabCards)) useStudyStore.setState({ vocabCards: data.vocabCards });
    if (Array.isArray(data.studySessions)) useStudyStore.setState({ studySessions: data.studySessions });
    if (Array.isArray(data.goals)) useGoalsStore.setState({ goals: data.goals });
    if (Array.isArray(data.visionItems)) useGoalsStore.setState({ visionItems: data.visionItems });
    if (Array.isArray(data.events)) useCalendarStore.setState({ events: data.events });
    if (Array.isArray(data.reminders)) useCalendarStore.setState({ reminders: data.reminders });
    if (Array.isArray(data.focusSessions)) useCalendarStore.setState({ focusSessions: data.focusSessions });

    return { success: true };
  } catch (err: any) {
    console.error("Failed to parse backup JSON:", err);
    return { success: false, error: err.message || "Invalid JSON backup file format." };
  }
}

/**
 * Reactive computed dashboard metrics directly derived from client stores.
 */
export function useComputedDashboardMetrics(): DashboardMetrics {
  const tasks = useTasksStore((s) => s.tasks);
  const habits = useHabitsStore((s) => s.habits);
  const projects = useDeveloperStore((s) => s.projects);
  const transactions = useFinanceStore((s) => s.transactions);

  const pending = tasks.filter((t) => t.status !== TaskStatus.COMPLETED).length;
  const completed = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
  const urgent = tasks.filter(
    (t) => t.priority === Priority.URGENT && t.status !== TaskStatus.COMPLETED
  ).length;

  const activeHabits = habits.filter((h) => !h.archived);
  const completedTodayHabits = activeHabits.filter((h) => h.isCompletedToday).length;
  const habitCompletionRate =
    activeHabits.length > 0
      ? Math.round((completedTodayHabits / activeHabits.length) * 100)
      : 0;

  const activeProjects = projects.filter((p) => p.status === ProjectStatus.ACTIVE).length;
  const completedProjects = projects.filter((p) => p.status === ProjectStatus.COMPLETED).length;

  const income = transactions
    .filter((tx) => tx.type === TransactionType.INCOME)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const expenses = transactions
    .filter((tx) => tx.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  return {
    tasks: { pending, completed, urgent },
    habits: {
      active: activeHabits.length,
      completedToday: completedTodayHabits,
      completionRate: habitCompletionRate,
    },
    projects: { active: activeProjects, completed: completedProjects },
    finance: {
      balance: income - expenses,
      incomeThisMonth: income,
      expensesThisMonth: expenses,
    },
  };
}

export {
  useTasksStore,
  useHabitsStore,
  useDeveloperStore,
  useFinanceStore,
  useKnowledgeStore,
  useStudyStore,
  useGoalsStore,
  useCalendarStore,
  useDashboardStore,
};
