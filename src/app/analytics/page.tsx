import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { BarChart3, TrendingUp, Activity, Clock, Zap } from "lucide-react";

export default function AnalyticsPage() {
  const weeklyVelocity = [
    { day: "Mon", hours: 6.5 },
    { day: "Tue", hours: 8.2 },
    { day: "Wed", hours: 7.0 },
    { day: "Thu", hours: 9.1 },
    { day: "Fri", hours: 8.0 },
    { day: "Sat", hours: 5.5 },
    { day: "Sun", hours: 4.0 },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={BarChart3}
          badge="VELOCITY METRICS"
          title="Productivity & Analytics"
          description="Quantified self metrics, code commit frequency, deep work duration, and discipline consistency curves."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
            <div className="text-xs font-mono text-[#98A69D] mb-1">WEEKLY DEEP WORK</div>
            <div className="text-3xl font-bold text-[#10B981]">48.3 hrs</div>
            <div className="text-xs text-[#98A69D] mt-2">+12% vs last week</div>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
            <div className="text-xs font-mono text-[#98A69D] mb-1">TASK THROUGHPUT</div>
            <div className="text-3xl font-bold text-[#F3F7F4]">34 Tasks</div>
            <div className="text-xs text-[#98A69D] mt-2">Closed in current sprint</div>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
            <div className="text-xs font-mono text-[#98A69D] mb-1">DISCIPLINE RATIO</div>
            <div className="text-3xl font-bold text-[#F59E0B]">94.2%</div>
            <div className="text-xs text-[#98A69D] mt-2">Habit completion rate</div>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
            <div className="text-xs font-mono text-[#98A69D] mb-1">AI ACCELERATION</div>
            <div className="text-3xl font-bold text-[#3B82F6]">3.2x</div>
            <div className="text-xs text-[#98A69D] mt-2">Estimated velocity multiplier</div>
          </div>
        </div>

        {/* Deep Work Velocity Chart Visualization */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <h3 className="text-base font-semibold text-[#F3F7F4] mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#10B981]" />
            Daily Deep Work Velocity (Hours / Day)
          </h3>

          <div className="h-48 flex items-end gap-4 sm:gap-8 pt-4">
            {weeklyVelocity.map((item) => {
              const heightPercent = (item.hours / 10) * 100;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[11px] font-mono font-semibold text-[#10B981]">
                    {item.hours}h
                  </span>
                  <div className="w-full max-w-[48px] bg-[#101915] rounded-t-xl overflow-hidden border border-[#25352C] flex items-end h-[120px]">
                    <div
                      className="w-full bg-gradient-to-t from-[#059669] to-[#10B981] rounded-t-xl transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-[#98A69D]">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
