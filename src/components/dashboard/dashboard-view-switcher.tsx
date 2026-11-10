"use client";

import React from "react";
import {
  LayoutDashboard,
  Activity,
  CalendarRange,
  CalendarDays,
  Sliders,
} from "lucide-react";
import { DashboardViewType, useDashboardStore } from "@/stores/dashboard-store";

export function DashboardViewSwitcher() {
  const { currentView, setView } = useDashboardStore();

  const views: { id: DashboardViewType; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "activity", label: "My Activity", icon: Activity },
    { id: "weekly", label: "Weekly View", icon: CalendarRange },
    { id: "monthly", label: "Monthly View", icon: CalendarDays },
    { id: "custom", label: "Custom Layout", icon: Sliders },
  ];

  return (
    <div className="flex p-1 bg-[#101915] rounded-xl border border-[#25352C] overflow-x-auto select-none max-w-full">
      {views.map((v) => {
        const Icon = v.icon;
        const isActive = currentView === v.id;
        return (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isActive
                ? "bg-[#142019] text-[#10B981] border border-[#25352C] shadow-sm emerald-glow-sm"
                : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019]/40"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}
