"use client";

import React from "react";
import { HabitSummary } from "@/types";
import { Award, Flame, CheckCircle2, TrendingUp, AlertCircle, ShieldCheck } from "lucide-react";

interface DisciplineReportProps {
  habits: HabitSummary[];
}

export function DisciplineReport({ habits }: DisciplineReportProps) {
  const activeHabits = habits.filter((h) => !h.archived);

  // Overall calculations
  const totalStreaks = activeHabits.reduce((acc, h) => acc + h.streak, 0);
  const longestStreak = activeHabits.reduce((acc, h) => Math.max(acc, h.bestStreak, h.streak), 0);
  const avgCompletionRate = activeHabits.length > 0
    ? Math.round(activeHabits.reduce((acc, h) => acc + (h.completionRate || 80), 0) / activeHabits.length)
    : 0;

  const totalMissedDays = activeHabits.reduce((acc, h) => acc + (h.missedDaysCount || 0), 0);

  // Discipline Tier based on average rate
  const disciplineTier =
    avgCompletionRate >= 90
      ? { tier: "Grandmaster (Tier 4)", color: "text-[#10B981]", desc: "Flawless cognitive & physical execution." }
      : avgCompletionRate >= 80
      ? { tier: "Master (Tier 3)", color: "text-[#3B82F6]", desc: "Consistently superior routine adherence." }
      : avgCompletionRate >= 65
      ? { tier: "Journeyman (Tier 2)", color: "text-[#F59E0B]", desc: "Developing routine momentum." }
      : { tier: "Novice (Tier 1)", color: "text-[#EF4444]", desc: "Routine requires reinforcement." };

  return (
    <div className="space-y-6">
      {/* 4 Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>Overall Adherence</span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#10B981]">
            {avgCompletionRate}%
          </div>
          <p className="text-[11px] text-[#98A69D]">
            30-day trailing consistency across {activeHabits.length} rituals
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>Longest Streak</span>
            <Flame className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#F59E0B]">
            {longestStreak} <span className="text-sm font-normal text-[#98A69D]">days</span>
          </div>
          <p className="text-[11px] text-[#98A69D]">
            Peak uninterrupted momentum achieved
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>Missed Days</span>
            <AlertCircle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#F3F7F4]">
            {totalMissedDays} <span className="text-sm font-normal text-[#98A69D]">days</span>
          </div>
          <p className="text-[11px] text-[#98A69D]">
            Slip recovery within 24h threshold
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>Discipline Rank</span>
            <Award className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className={`text-xl font-bold font-mono ${disciplineTier.color}`}>
            {disciplineTier.tier}
          </div>
          <p className="text-[11px] text-[#98A69D]">
            {disciplineTier.desc}
          </p>
        </div>
      </div>

      {/* Habit Breakdown Table */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] bg-[#101915] space-y-4">
        <h4 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          Routine Reliability Telemetry
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#25352C] text-[#98A69D] font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Habit Protocol</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Target Cadence</th>
                <th className="pb-3 font-semibold">Current Streak</th>
                <th className="pb-3 font-semibold">Best Streak</th>
                <th className="pb-3 font-semibold">30d Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25352C]/60">
              {activeHabits.map((habit) => (
                <tr key={habit.id} className="hover:bg-[#142019]/50 transition-colors">
                  <td className="py-3 font-medium text-[#F3F7F4] flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: habit.color || "#10B981" }}
                    />
                    {habit.name}
                  </td>
                  <td className="py-3 text-[#98A69D] font-mono text-[11px]">
                    {habit.category}
                  </td>
                  <td className="py-3 text-[#98A69D] font-mono">
                    {habit.targetCount} {habit.unit} ({habit.frequency})
                  </td>
                  <td className="py-3 font-mono font-bold text-[#F59E0B]">
                    {habit.streak} days
                  </td>
                  <td className="py-3 font-mono text-[#98A69D]">
                    {habit.bestStreak} days
                  </td>
                  <td className="py-3 font-mono">
                    <span className="text-[#10B981] font-bold">
                      {habit.completionRate || 85}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
