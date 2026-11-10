"use client";

import React from "react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { TodayTasksWidget } from "../widgets/today-tasks-widget";
import { UpcomingDeadlinesWidget } from "../widgets/upcoming-deadlines-widget";
import { HabitCompletionWidget } from "../widgets/habit-completion-widget";
import { StudyTimeStatisticsWidget } from "../widgets/study-time-widget";
import { ActiveProjectsWidget } from "../widgets/active-projects-widget";
import { FinancialSummaryWidget } from "../widgets/financial-summary-widget";
import { AiRecommendationsWidget } from "../widgets/ai-recommendations-widget";
import { TaskSummary, HabitSummary, ProjectSummary, TransactionSummary } from "@/types";

interface OverviewWidgetGridProps {
  tasks: TaskSummary[];
  habits: HabitSummary[];
  projects: ProjectSummary[];
  transactions: TransactionSummary[];
  financeMetrics: {
    balance: number;
    income: number;
    expenses: number;
  };
  onOpenQuickCreate: () => void;
  onStartFocus: () => void;
}

export function OverviewWidgetGrid({
  tasks,
  habits,
  projects,
  transactions,
  financeMetrics,
  onOpenQuickCreate,
  onStartFocus,
}: OverviewWidgetGridProps) {
  const { widgets, density } = useDashboardStore();

  const enabledWidgets = [...widgets]
    .filter((w) => w.enabled)
    .sort((a, b) => a.order - b.order);

  const gapClass =
    density === "compact" ? "gap-3.5" : density === "expanded" ? "gap-7" : "gap-5";

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${gapClass}`}>
      {enabledWidgets.map((widget) => {
        switch (widget.id) {
          case "ai":
            return (
              <div key={widget.id} className="col-span-1 md:col-span-2 lg:col-span-3">
                <AiRecommendationsWidget onStartFocus={onStartFocus} />
              </div>
            );
          case "tasks":
            return (
              <div key={widget.id} className="col-span-1 md:col-span-2">
                <TodayTasksWidget
                  initialTasks={tasks}
                  onOpenQuickCreate={onOpenQuickCreate}
                />
              </div>
            );
          case "habits":
            return (
              <div key={widget.id} className="col-span-1">
                <HabitCompletionWidget initialHabits={habits} />
              </div>
            );
          case "projects":
            return (
              <div key={widget.id} className="col-span-1 md:col-span-2">
                <ActiveProjectsWidget projects={projects} />
              </div>
            );
          case "deadlines":
            return (
              <div key={widget.id} className="col-span-1">
                <UpcomingDeadlinesWidget />
              </div>
            );
          case "study":
            return (
              <div key={widget.id} className="col-span-1 md:col-span-2">
                <StudyTimeStatisticsWidget />
              </div>
            );
          case "finance":
            return (
              <div key={widget.id} className="col-span-1">
                <FinancialSummaryWidget
                  balance={financeMetrics.balance}
                  income={financeMetrics.income}
                  expenses={financeMetrics.expenses}
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
