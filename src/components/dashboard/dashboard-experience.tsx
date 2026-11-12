"use client";

import React, { useState } from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import {
  useTasksStore,
  useHabitsStore,
  useDeveloperStore,
  useFinanceStore,
  useKnowledgeStore,
  useComputedDashboardMetrics,
  useHydration,
} from "@/stores/local-storage-sync";
import { WelcomeWidget } from "./widgets/welcome-widget";
import { DashboardViewSwitcher } from "./dashboard-view-switcher";
import { OverviewReplica } from "./overview-replica";
import { OverviewWidgetGrid } from "./views/overview-widget-grid";
import { ActivityView } from "./views/activity-view";
import { WeeklyOverviewView } from "./views/weekly-overview-view";
import { MonthlyOverviewView } from "./views/monthly-overview-view";
import { CustomDashboardView } from "./views/custom-dashboard-view";
import { LayoutCustomizerDialog } from "./layout-customizer-dialog";
import { QuickCreateDialog } from "../layout/quick-create-dialog";
import { useTranslation } from "@/stores/language-store";
import {
  TaskSummary,
  HabitSummary,
  ProjectSummary,
  TransactionSummary,
  KnowledgeNoteSummary,
  DashboardMetrics,
} from "@/types";

interface DashboardExperienceProps {
  metrics: DashboardMetrics;
  tasks: TaskSummary[];
  habits: HabitSummary[];
  projects: ProjectSummary[];
  transactions: TransactionSummary[];
  notes: KnowledgeNoteSummary[];
}

export function DashboardExperience({
  metrics: initialMetrics,
  tasks: initialTasks,
  habits: initialHabits,
  projects: initialProjects,
  transactions: initialTransactions,
  notes: initialNotes,
}: DashboardExperienceProps) {
  const isHydrated = useHydration();
  const computedMetrics = useComputedDashboardMetrics();
  const storeTasks = useTasksStore((s) => s.tasks);
  const storeHabits = useHabitsStore((s) => s.habits);
  const storeProjects = useDeveloperStore((s) => s.projects);
  const storeTransactions = useFinanceStore((s) => s.transactions);
  const storeNotes = useKnowledgeStore((s) => s.notes);

  const metrics = isHydrated ? computedMetrics : initialMetrics;
  const tasks = isHydrated ? storeTasks : initialTasks;
  const habits = isHydrated ? storeHabits : initialHabits;
  const projects = isHydrated ? storeProjects : initialProjects;
  const transactions = isHydrated ? storeTransactions : initialTransactions;
  const notes = isHydrated ? storeNotes : initialNotes;
  const { currentView, startFocusSession } = useDashboardStore();
  const { dict, isUz } = useTranslation();
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateType, setQuickCreateType] = useState<string>("task");

  const handleOpenQuickCreate = (type: string = "task") => {
    setQuickCreateType(type);
    setQuickCreateOpen(true);
  };

  return (
    <div className="space-y-6">
      {currentView === "overview" ? (
        <OverviewReplica
          onOpenQuickCreate={handleOpenQuickCreate}
          onStartFocus={() => startFocusSession(50)}
        />
      ) : (
        <>
          {/* Welcome Section & Daily Progress */}
          <WelcomeWidget
            completedTasksCount={metrics.tasks.completed}
            totalTasksCount={metrics.tasks.pending + metrics.tasks.completed}
            completedHabitsCount={metrics.habits.completedToday}
            totalHabitsCount={metrics.habits.active}
            onOpenQuickCreate={() => handleOpenQuickCreate("task")}
            onOpenCustomizer={() => setCustomizerOpen(true)}
          />

          {/* Dashboard View Switcher */}
          <div className="flex items-center justify-between gap-4 flex-wrap pb-1">
            <DashboardViewSwitcher />
            <span className="text-xs font-mono text-[#98A69D] hidden sm:inline">
              {isUz ? "Ko‘rinish rejimi: " : "View Mode: "}<span className="text-[#10B981] font-bold uppercase">{currentView}</span>
            </span>
          </div>

          {currentView === "activity" && (
            <ActivityView
              tasks={tasks}
              habits={habits}
              transactions={transactions}
              notes={notes}
            />
          )}

          {currentView === "weekly" && (
            <WeeklyOverviewView habits={habits} tasks={tasks} />
          )}

          {currentView === "monthly" && (
            <MonthlyOverviewView
              balance={metrics.finance.balance}
              income={metrics.finance.incomeThisMonth}
              expenses={metrics.finance.expensesThisMonth}
            />
          )}

          {currentView === "custom" && <CustomDashboardView />}
        </>
      )}

      {/* Layout Customizer Dialog */}
      <LayoutCustomizerDialog
        open={customizerOpen}
        onOpenChange={setCustomizerOpen}
      />

      {/* Quick Create Dialog for Dashboard Widgets */}
      <QuickCreateDialog
        open={quickCreateOpen}
        onOpenChange={setQuickCreateOpen}
        initialType={quickCreateType}
      />
    </div>
  );
}
