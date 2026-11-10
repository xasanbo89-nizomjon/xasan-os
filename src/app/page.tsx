import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getDashboardData } from "@/server/actions/os";
import { DashboardExperience } from "@/components/dashboard/dashboard-experience";

export default async function OverviewPage() {
  const data = await getDashboardData();
  const {
    metrics,
    recentTasks,
    activeHabits,
    projects,
    recentTransactions,
    pinnedNotes,
  } = data;

  return (
    <AppShell>
      <DashboardExperience
        metrics={metrics}
        tasks={recentTasks}
        habits={activeHabits}
        projects={projects}
        transactions={recentTransactions}
        notes={pinnedNotes}
      />
    </AppShell>
  );
}
