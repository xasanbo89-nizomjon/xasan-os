"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Flame, Check, ArrowUpRight, Plus, Sparkles } from "lucide-react";
import { HabitSummary } from "@/types";
import { useTranslation } from "@/stores/language-store";

interface HabitCompletionWidgetProps {
  initialHabits: HabitSummary[];
}

export function HabitCompletionWidget({
  initialHabits,
}: HabitCompletionWidgetProps) {
  const { dict, isUz } = useTranslation();
  const [habits, setHabits] = useState(
    initialHabits.map((h, i) => ({
      ...h,
      completedToday: i < 2, // demo status
    }))
  );

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completedToday: !h.completedToday,
              streak: h.completedToday ? h.streak - 1 : h.streak + 1,
            }
          : h
      )
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#F59E0B]">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                {dict.dashboard.widgets.habit_tracker}
              </h3>
              <span className="text-[10px] text-[#98A69D]">
                {isUz ? "Kunlik odatlar va davomiylik zanjirlari" : "Daily rituals & active streaks"}
              </span>
            </div>
          </div>

          <Link
            href="/life-tracker"
            className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
          >
            {isUz ? "Odatlar" : "Tracker"} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {habits.map((habit) => (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className="p-3 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/40 transition-colors flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    habit.completedToday
                      ? "bg-[#10B981] border-[#10B981] text-[#080D0B]"
                      : "border-[#25352C] group-hover:border-[#10B981]"
                  }`}
                >
                  {habit.completedToday && (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-xs font-semibold ${
                      habit.completedToday ? "text-[#F3F7F4]" : "text-[#98A69D]"
                    }`}
                  >
                    {habit.name}
                  </h4>
                  <span className="text-[10px] text-[#98A69D]/80">
                    {habit.targetCount} {habit.unit} • {habit.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-[#F59E0B] font-mono">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{habit.streak}{isUz ? " kun" : "d"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
