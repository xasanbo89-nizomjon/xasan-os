import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Clock } from "lucide-react";
import { getTasksAction } from "@/server/actions/tasks";
import { getFocusSessionsAction, getFocusStatsAction } from "@/server/actions/focus";
import { FocusExperience } from "@/components/focus/focus-experience";

export const metadata = {
  title: "Focus & Pomodoro Lab | XASAN OS",
  description: "Distraction-free focus sessions, Pomodoro intervals, and deep work telemetry.",
};

export default async function FocusPage() {
  const [tasks, sessions, stats] = await Promise.all([
    getTasksAction(),
    getFocusSessionsAction(),
    getFocusStatsAction(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Clock}
          badge="COGNITIVE FLOW"
          title="Focus & Pomodoro Lab"
          description="Distraction-free execution blocks, single-task immersion, ambient noise protocols, and session telemetry."
        />

        <FocusExperience
          tasks={tasks}
          initialSessions={sessions}
          stats={stats}
        />
      </div>
    </AppShell>
  );
}
