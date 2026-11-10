import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Sliders } from "lucide-react";
import { CustomDashboardView } from "@/components/dashboard/views/custom-dashboard-view";
import Link from "next/link";

export default function CustomDashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Sliders}
          badge="LAYOUT CONTROLLER"
          title="Custom Dashboard Architecture"
          description="Personalize widget positioning, show/hide cards, and adjust layout density with persistent local state."
        >
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-xs font-semibold text-[#10B981]"
          >
            ← Return to Overview
          </Link>
        </ModuleHeader>

        <CustomDashboardView />
      </div>
    </AppShell>
  );
}
