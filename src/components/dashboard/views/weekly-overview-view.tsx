"use client";

import React from "react";
import {
  CalendarRange,
  Clock,
  Flame,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";
import { HabitSummary, TaskSummary } from "@/types";

interface WeeklyOverviewViewProps {
  habits: HabitSummary[];
  tasks: TaskSummary[];
}

export function WeeklyOverviewView({ habits, tasks }: WeeklyOverviewViewProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const velocityData = [
    { day: "Mon", hours: 7.2, target: 8 },
    { day: "Tue", hours: 8.5, target: 8 },
    { day: "Wed", hours: 6.8, target: 8 },
    { day: "Thu", hours: 9.2, target: 8 },
    { day: "Fri", hours: 8.0, target: 8 },
    { day: "Sat", hours: 5.5, target: 6 },
    { day: "Sun", hours: 4.5, target: 4 },
  ];

  const totalHours = velocityData.reduce((acc, d) => acc + d.hours, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 4 Telemetry Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
          <span className="text-[10px] font-mono text-[#98A69D]">TOTAL SPRINT VELOCITY</span>
          <div className="text-2xl font-bold text-[#10B981] mt-1">{totalHours.toFixed(1)} hrs</div>
          <span className="text-xs text-[#98A69D] mt-1 block">+14% vs previous sprint</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
          <span className="text-[10px] font-mono text-[#98A69D]">SPRINT TASKS CLOSED</span>
          <div className="text-2xl font-bold text-[#F3F7F4] mt-1">26 Tasks</div>
          <span className="text-xs text-[#10B981] mt-1 block">92% completion rate</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
          <span className="text-[10px] font-mono text-[#98A69D]">IELTS PREPARATION</span>
          <div className="text-2xl font-bold text-[#3B82F6] mt-1">16.5 hrs</div>
          <span className="text-xs text-[#98A69D] mt-1 block">Speaking & Lexical modules</span>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
          <span className="text-[10px] font-mono text-[#98A69D]">DISCIPLINE SCORE</span>
          <div className="text-2xl font-bold text-[#F59E0B] mt-1">96.4%</div>
          <span className="text-xs text-[#98A69D] mt-1 block">Zero missed protocols</span>
        </div>
      </div>

      {/* 7-Day Velocity Chart */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-sm font-bold text-[#F3F7F4]">
              Daily Deep Work Allocation (Hours)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#98A69D]">Target: 8.0 hrs/day</span>
        </div>

        <div className="h-44 flex items-end gap-3 sm:gap-6 pt-4">
          {velocityData.map((d) => {
            const heightPercent = (d.hours / 10) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-mono font-bold text-[#10B981]">
                  {d.hours}h
                </span>
                <div className="w-full max-w-[48px] bg-[#101915] rounded-t-xl overflow-hidden border border-[#25352C] flex items-end h-[120px]">
                  <div
                    className="w-full bg-gradient-to-t from-[#059669] to-[#10B981] rounded-t-xl"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-[#98A69D]">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Habit Consistency Matrix */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#F59E0B] fill-current" />
            <h3 className="text-sm font-bold text-[#F3F7F4]">
              Weekly Habit Consistency Matrix
            </h3>
          </div>
          <span className="text-xs text-[#10B981] font-mono">Current Week</span>
        </div>

        <div className="space-y-3">
          {/* Days Header */}
          <div className="grid grid-cols-12 gap-2 text-xs font-mono text-[#98A69D] pb-2 border-b border-[#25352C]">
            <div className="col-span-5">Habit Protocol</div>
            <div className="col-span-7 grid grid-cols-7 gap-1 text-center">
              {days.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          {/* Habit rows */}
          {habits.map((h, i) => (
            <div
              key={h.id}
              className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl bg-[#101915] border border-[#25352C] text-xs"
            >
              <div className="col-span-5 font-semibold text-[#F3F7F4] truncate">
                {h.name}
              </div>
              <div className="col-span-7 grid grid-cols-7 gap-1">
                {days.map((_, dayIndex) => {
                  const isDone = dayIndex < 6 || i === 0;
                  return (
                    <div
                      key={dayIndex}
                      className={`h-6 rounded-md flex items-center justify-center border text-[10px] ${
                        isDone
                          ? "bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]"
                          : "bg-[#142019] border-[#25352C] text-[#98A69D]"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : "-"}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
