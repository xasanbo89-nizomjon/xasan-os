import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { CalendarDays } from "lucide-react";
import { getDashboardData } from "@/server/actions/os";
import { MonthlyOverviewView } from "@/components/dashboard/views/monthly-overview-view";
import Link from "next/link";

export default async function MonthlyPage() {
  const data = await getDashboardData();
  const { metrics } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={CalendarDays}
          badge="MONTHLY TELEMETRY"
          title="Monthly Overview"
          description="High-level monthly OKRs, trailing 28-day habit heatmap, cumulative IELTS study hours, and monthly cashflow."
        >
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-xs font-semibold text-[#10B981]"
          >
            ← Return to Overview
          </Link>
        </ModuleHeader>

        <MonthlyOverviewView
          balance={metrics.finance.balance}
          income={metrics.finance.incomeThisMonth}
          expenses={metrics.finance.expensesThisMonth}
        />
      </div>
    </AppShell>
  );
}
