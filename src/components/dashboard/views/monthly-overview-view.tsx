"use client";

import React from "react";
import {
  CalendarDays,
  Target,
  CircleDollarSign,
  GraduationCap,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MonthlyOverviewViewProps {
  balance: number;
  income: number;
  expenses: number;
}

export function MonthlyOverviewView({
  balance,
  income,
  expenses,
}: MonthlyOverviewViewProps) {
  const okrs = [
    {
      title: "Launch Aurelius IELTS Speech Engine",
      target: "Sub-500ms Whisper Latency",
      progress: 78,
      status: "ON TRACK",
    },
    {
      title: "Master IELTS Academic Writing & Speaking",
      target: "Consistent Band 8.5 Benchmark",
      progress: 88,
      status: "ON TRACK",
    },
    {
      title: "Deliver Ravon Avto Dealer CRM Webhooks",
      target: "Idempotent Inventory Sync",
      progress: 92,
      status: "NEAR COMPLETION",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 3 Monthly Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#98A69D]">MONTHLY CASHFLOW</span>
            <CircleDollarSign className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-bold text-[#10B981]">
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-[#98A69D] mt-2 font-mono">
            +{formatCurrency(income)} revenue / -{formatCurrency(expenses)} burn
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#98A69D]">STUDY TIME (THIS MONTH)</span>
            <GraduationCap className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-3xl font-bold text-[#F3F7F4]">
            68.5 hrs
          </div>
          <p className="text-xs text-[#10B981] mt-2 font-mono">
            85% toward monthly 80h goal
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-[#98A69D]">MONTHLY DISCIPLINE</span>
            <Award className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-bold text-[#F59E0B]">
            94.8%
          </div>
          <p className="text-xs text-[#98A69D] mt-2 font-mono">
            21-day consecutive peak streak
          </p>
        </div>
      </div>

      {/* Monthly OKR Progression */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-sm font-bold text-[#F3F7F4]">
              Monthly OKRs & Milestone Status
            </h3>
          </div>
          <span className="text-xs font-mono text-[#98A69D]">November 2026</span>
        </div>

        <div className="space-y-4">
          {okrs.map((okr) => (
            <div
              key={okr.title}
              className="p-4 rounded-xl bg-[#101915] border border-[#25352C] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold text-[#F3F7F4]">{okr.title}</h4>
                  <span className="text-[10px] text-[#98A69D]">{okr.target}</span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#142019] text-[#10B981] border border-[#10B981]/30">
                  {okr.status}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#98A69D] mb-1">
                  <span>Milestone Completion</span>
                  <span className="text-[#10B981] font-semibold">{okr.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#142019] rounded-full overflow-hidden border border-[#25352C]">
                  <div
                    className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full"
                    style={{ width: `${okr.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 28-Day Habit Heatmap */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
        <h3 className="text-sm font-bold text-[#F3F7F4] mb-4 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#10B981]" />
          Discipline Heatmap (Trailing 28 Days)
        </h3>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 28 }).map((_, idx) => {
            const isFilled = idx % 5 !== 0;
            return (
              <div
                key={idx}
                title={`Day ${idx + 1}: ${isFilled ? "100% Protocols Completed" : "Partial (60%)"}`}
                className={`h-9 rounded-lg border transition-all flex items-center justify-center text-[10px] font-mono font-semibold ${
                  isFilled
                    ? "bg-[#10B981]/25 border-[#10B981]/40 text-[#10B981]"
                    : "bg-[#101915] border-[#25352C] text-[#98A69D]"
                }`}
              >
                {idx + 1}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
