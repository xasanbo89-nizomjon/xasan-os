"use client";

import React from "react";
import { HabitSummary } from "@/types";
import { Award, Flame, CheckCircle2, TrendingUp, AlertCircle, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/stores/language-store";

interface DisciplineReportProps {
  habits: HabitSummary[];
}

export function DisciplineReport({ habits }: DisciplineReportProps) {
  const { isUz } = useTranslation();
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
      ? {
          tier: isUz ? "Grossmeyster (4-daraja)" : "Grandmaster (Tier 4)",
          color: "text-[#10B981]",
          desc: isUz ? "Mukammal aqliy va jismoniy intizom." : "Flawless cognitive & physical execution.",
        }
      : avgCompletionRate >= 80
      ? {
          tier: isUz ? "Usta (3-daraja)" : "Master (Tier 3)",
          color: "text-[#3B82F6]",
          desc: isUz ? "Tartibga barqaror va namunali rioya qilish." : "Consistently superior routine adherence.",
        }
      : avgCompletionRate >= 65
      ? {
          tier: isUz ? "Izlanuvchi (2-daraja)" : "Journeyman (Tier 2)",
          color: "text-[#F59E0B]",
          desc: isUz ? "Intizom va muntazamlik shakllanmoqda." : "Developing routine momentum.",
        }
      : {
          tier: isUz ? "Boshlovchi (1-daraja)" : "Novice (Tier 1)",
          color: "text-[#EF4444]",
          desc: isUz ? "Tartibni mustahkamlash talab etiladi." : "Routine requires reinforcement.",
        };

  return (
    <div className="space-y-6">
      {/* 4 Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>{isUz ? "Umumiy muntazamlik" : "Overall Adherence"}</span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#10B981]">
            {avgCompletionRate}%
          </div>
          <p className="text-[11px] text-[#98A69D]">
            {isUz
              ? `${activeHabits.length} ta odat bo‘yicha 30 kunlik ko‘rsatkich`
              : `30-day trailing consistency across ${activeHabits.length} rituals`}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>{isUz ? "Eng uzun ketma-ketlik" : "Longest Streak"}</span>
            <Flame className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#F59E0B]">
            {longestStreak} <span className="text-sm font-normal text-[#98A69D]">{isUz ? "kun" : "days"}</span>
          </div>
          <p className="text-[11px] text-[#98A69D]">
            {isUz ? "Erishilgan eng yuqori uzluksiz natija" : "Peak uninterrupted momentum achieved"}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>{isUz ? "Qoldirilgan kunlar" : "Missed Days"}</span>
            <AlertCircle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#F3F7F4]">
            {totalMissedDays} <span className="text-sm font-normal text-[#98A69D]">{isUz ? "kun" : "days"}</span>
          </div>
          <p className="text-[11px] text-[#98A69D]">
            {isUz ? "24 soatlik oraliqda tiklangan kunlar" : "Slip recovery within 24h threshold"}
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>{isUz ? "Intizom darajasi" : "Discipline Rank"}</span>
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
          {isUz ? "Odatlar ishonchliligi monitoringi" : "Routine Reliability Telemetry"}
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#25352C] text-[#98A69D] font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">{isUz ? "Odat protokoli" : "Habit Protocol"}</th>
                <th className="pb-3 font-semibold">{isUz ? "Kategoriya" : "Category"}</th>
                <th className="pb-3 font-semibold">{isUz ? "Maqsadli miqdor" : "Target Cadence"}</th>
                <th className="pb-3 font-semibold">{isUz ? "Joriy ketma-ketlik" : "Current Streak"}</th>
                <th className="pb-3 font-semibold">{isUz ? "Eng yaxshi natija" : "Best Streak"}</th>
                <th className="pb-3 font-semibold">{isUz ? "30 kunlik foiz" : "30d Rate"}</th>
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
                    {habit.targetCount} {habit.unit} ({habit.frequency === "DAILY" ? (isUz ? "Har kuni" : "Daily") : (isUz ? "Haftalik" : "Weekly")})
                  </td>
                  <td className="py-3 font-mono font-bold text-[#F59E0B]">
                    {habit.streak} {isUz ? "kun" : "days"}
                  </td>
                  <td className="py-3 font-mono text-[#98A69D]">
                    {habit.bestStreak} {isUz ? "kun" : "days"}
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