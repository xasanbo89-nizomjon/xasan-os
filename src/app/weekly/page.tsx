import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { CalendarRange } from "lucide-react";
import { getDashboardData } from "@/server/actions/os";
import { WeeklyOverviewView } from "@/components/dashboard/views/weekly-overview-view";
import Link from "next/link";

export default async function WeeklyPage() {
  const data = await getDashboardData();
  const { recentTasks, activeHabits } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={CalendarRange}
          badge="SPRINT VELOCITY"
          title="Weekly Overview"
          description="7-day deep work velocity curves, sprint burndown telemetry, and weekly habit consistency matrix."
        >
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-xs font-semibold text-[#10B981]"
          >
            ← Return to Overview
          </Link>
        </ModuleHeader>

        <WeeklyOverviewView habits={activeHabits} tasks={recentTasks} />
      </div>
    </AppShell>
  );
}
