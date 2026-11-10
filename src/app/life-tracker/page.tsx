import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Flame } from "lucide-react";
import { getHabitsAction, getWellnessLogsAction } from "@/server/actions/habits";
import { getJournalEntriesAction } from "@/server/actions/journal";
import { LifeTrackerExperience } from "@/components/habits/life-tracker-experience";

export const metadata = {
  title: "Life Tracker & Discipline | XASAN OS",
  description: "Habit protocols, streak visualizers, wellness tracking, and daily digital reflections.",
};

export default async function LifeTrackerPage() {
  const [habits, wellnessLogs, journalEntries] = await Promise.all([
    getHabitsAction(true),
    getWellnessLogsAction(),
    getJournalEntriesAction(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Flame}
          badge="DISCIPLINE OS"
          title="Life Tracker & Discipline"
          description="Consistent routines, streak telemetry, non-medical wellness protocols, and confidential daily reflections."
        />

        <LifeTrackerExperience
          initialHabits={habits}
          initialWellnessLogs={wellnessLogs}
          initialJournalEntries={journalEntries}
        />
      </div>
    </AppShell>
  );
}
