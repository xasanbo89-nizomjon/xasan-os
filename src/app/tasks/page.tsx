import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { CheckSquare } from "lucide-react";
import { getTasksAction } from "@/server/actions/tasks";
import { getDashboardData } from "@/server/actions/os";
import { TaskManagerView } from "@/components/tasks/task-manager-view";

export const metadata = {
  title: "Tasks & Pipelines | XASAN OS",
  description: "Advanced Task Manager with Kanban, Calendar, and Subtask telemetry.",
};

export default async function TasksPage() {
  const [tasks, dashboardData] = await Promise.all([
    getTasksAction(),
    getDashboardData(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={CheckSquare}
          badge="EXECUTION ENGINE"
          title="Tasks & Pipelines"
          description="Granular work items, prioritization matrices, drag-and-drop Kanban, and engineering execution tracking."
        />

        <TaskManagerView
          initialTasks={tasks}
          projects={dashboardData.projects}
        />
      </div>
    </AppShell>
  );
}
