import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Flame, Check, Sparkles, TrendingUp, Award } from "lucide-react";
import { getDashboardData } from "@/server/actions/os";

export default async function LifeTrackerPage() {
  const data = await getDashboardData();
  const { activeHabits } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Flame}
          badge="DISCIPLINE OS"
          title="Life Tracker & Habits"
          description="Consistent routines, streak telemetry, physical health, and personal growth rituals."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
            <div className="text-xs font-mono text-[#98A69D] mb-1">LONGEST STREAK</div>
            <div className="text-2xl font-bold text-[#F59E0B] flex items-center gap-1.5">
              <Flame className="w-6 h-6 fill-current" />
              45 Days
            </div>
            <div className="text-xs text-[#98A69D] mt-2">Deep Architecture & Coding</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
            <div className="text-xs font-mono text-[#98A69D] mb-1">TOTAL LOGS LOGGED</div>
            <div className="text-2xl font-bold text-[#10B981]">142 Rituals</div>
            <div className="text-xs text-[#98A69D] mt-2">94% Monthly discipline rate</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
            <div className="text-xs font-mono text-[#98A69D] mb-1">CURRENT RANK</div>
            <div className="text-2xl font-bold text-[#3B82F6] flex items-center gap-1.5">
              <Award className="w-6 h-6" />
              Grandmaster
            </div>
            <div className="text-xs text-[#98A69D] mt-2">Discipline Tier 4 of 4</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <h3 className="text-base font-semibold text-[#F3F7F4] mb-4">
            Active Habit Protocols
          </h3>

          <div className="space-y-4">
            {activeHabits.map((habit) => (
              <div
                key={habit.id}
                className="p-4 rounded-xl bg-[#101915] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-[#F3F7F4]">
                      {habit.name}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142019] text-[#10B981] border border-[#10B981]/30">
                      {habit.category}
                    </span>
                  </div>
                  {habit.description && (
                    <p className="text-xs text-[#98A69D] mt-1">
                      {habit.description}
                    </p>
                  )}
                  <div className="text-[11px] text-[#98A69D] mt-2 font-mono">
                    Target: {habit.targetCount} {habit.unit} • {habit.targetDaysPerWeek} days/week
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#F59E0B] flex items-center justify-end gap-1">
                      <Flame className="w-4 h-4 fill-current" />
                      {habit.streak} Days
                    </div>
                    <div className="text-[10px] text-[#98A69D]">
                      Best: {habit.bestStreak}d
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-[#10B981] text-[#080D0B] font-semibold text-xs hover:bg-[#059669] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Log Today</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
