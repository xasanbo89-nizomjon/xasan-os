"use client";

import React from "react";
import { HabitSummary } from "@/types";
import { Flame, CheckCircle2, Circle, MoreVertical, Archive, Trash2, Clock, Calendar, AlertTriangle } from "lucide-react";

interface HabitCardProps {
  habit: HabitSummary;
  onToggleToday: (habitId: string) => void;
  onToggleDate?: (habitId: string, date: string) => void;
  onArchive: (habitId: string, archived: boolean) => void;
  onDelete: (habitId: string) => void;
}

export function HabitCard({
  habit,
  onToggleToday,
  onToggleDate,
  onArchive,
  onDelete,
}: HabitCardProps) {
  // Generate past 7 days for mini check-in streak
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "narrow" });
    const isCompleted = habit.recentLogs?.some((l) => l.date === dateStr) || (i === 6 && habit.isCompletedToday);
    const isToday = i === 6;
    return { dateStr, dayLabel, isCompleted, isToday };
  });

  const getCategoryBadge = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes("study") || c.includes("education")) return "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30";
    if (c.includes("fitness") || c.includes("health")) return "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30";
    if (c.includes("reading")) return "bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30";
    return "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#142019]/90 hover:border-[#10B981]/40 transition-all duration-200 space-y-4 group">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: habit.color || "#10B981" }}
            />
            <h4 className="text-sm font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors truncate">
              {habit.name}
            </h4>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getCategoryBadge(habit.category)}`}>
              {habit.category}
            </span>
            <span className="text-[10px] font-mono text-[#98A69D] bg-[#101915] px-2 py-0.5 rounded border border-[#25352C]">
              {habit.frequency}
            </span>
          </div>

          {habit.description && (
            <p className="text-xs text-[#98A69D] line-clamp-1 leading-relaxed">
              {habit.description}
            </p>
          )}
        </div>

        {/* Streak Counter Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#101915] border border-[#25352C] text-xs font-mono font-bold text-[#F59E0B] shrink-0">
          <Flame className="w-4 h-4 fill-current animate-pulse" />
          <span>{habit.streak}d</span>
          <span className="text-[10px] text-[#98A69D] font-normal hidden sm:inline">
            (best: {habit.bestStreak}d)
          </span>
        </div>
      </div>

      {/* Middle Row: Telemetry (Completion rate & Missed days) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1 text-[11px] font-mono text-[#98A69D]">
        <div className="bg-[#101915] p-2 rounded-xl border border-[#25352C]">
          <span className="text-[10px] block opacity-70">Target:</span>
          <span className="text-xs font-semibold text-[#F3F7F4]">
            {habit.targetCount} {habit.unit} / {habit.frequency === "DAILY" ? "day" : "wk"}
          </span>
        </div>

        <div className="bg-[#101915] p-2 rounded-xl border border-[#25352C]">
          <span className="text-[10px] block opacity-70">30d Rate:</span>
          <span className="text-xs font-semibold text-[#10B981]">
            {habit.completionRate || 85}%
          </span>
        </div>

        <div className="bg-[#101915] p-2 rounded-xl border border-[#25352C] col-span-2 sm:col-span-1">
          <span className="text-[10px] block opacity-70">Reminder:</span>
          <span className="text-xs font-semibold text-[#F3F7F4] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#10B981]" />
            {habit.reminderTime || "None"}
          </span>
        </div>
      </div>

      {/* Bottom Row: 7-Day Mini Heatmap Check-in & Today Action */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#25352C]/60">
        {/* Past 7 Days circles */}
        <div className="flex items-center gap-1.5">
          {past7Days.map((d, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onToggleDate && onToggleDate(habit.id, d.dateStr)}
              className={`flex flex-col items-center justify-center w-7 h-9 rounded-lg border transition-all cursor-pointer ${
                d.isCompleted
                  ? "bg-[#10B981] border-[#10B981] text-[#080D0B] font-bold shadow-sm shadow-[#10B981]/20"
                  : d.isToday
                  ? "bg-[#101915] border-[#10B981] text-[#10B981]"
                  : "bg-[#101915] border-[#25352C] text-[#98A69D] hover:border-[#10B981]/40"
              }`}
              title={`${d.dateStr}: ${d.isCompleted ? "Completed" : "Not logged"}`}
            >
              <span className="text-[9px] font-mono leading-none">{d.dayLabel}</span>
              <div className="mt-1">
                {d.isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Circle className="w-3 h-3 opacity-40" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleToday(habit.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              habit.isCompletedToday
                ? "bg-[#142019] text-[#10B981] border border-[#10B981]/40 shadow-sm"
                : "bg-[#10B981] text-[#080D0B] hover:bg-[#059669] shadow-md shadow-[#10B981]/20"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {habit.isCompletedToday ? "Done Today" : "Log Today"}
          </button>

          <button
            type="button"
            onClick={() => onArchive(habit.id, !habit.archived)}
            className="p-2 rounded-xl bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C] transition-colors"
            title={habit.archived ? "Unarchive Habit" : "Archive Habit"}
          >
            <Archive className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete habit "${habit.name}"?`)) onDelete(habit.id);
            }}
            className="p-2 rounded-xl bg-[#101915] text-[#98A69D] hover:text-[#EF4444] border border-[#25352C] transition-colors"
            title="Delete Habit"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
