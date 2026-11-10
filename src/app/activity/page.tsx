import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Activity } from "lucide-react";
import { getDashboardData } from "@/server/actions/os";
import { ActivityView } from "@/components/dashboard/views/activity-view";
import Link from "next/link";

export default async function ActivityPage() {
  const data = await getDashboardData();
  const { recentTasks, activeHabits, recentTransactions, pinnedNotes } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Activity}
          badge="AUDIT LOG"
          title="My Activity Feed"
          description="Chronological telemetry of executed tasks, logged discipline habits, venture code pushes & financial transactions."
        >
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-xs font-semibold text-[#10B981]"
          >
            ← Return to Overview
          </Link>
        </ModuleHeader>

        <ActivityView
          tasks={recentTasks}
          habits={activeHabits}
          transactions={recentTransactions}
          notes={pinnedNotes}
        />
      </div>
    </AppShell>
  );
}
