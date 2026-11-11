"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Sun, CheckCircle2, Clock, Calendar, Sparkles, AlertCircle } from "lucide-react";
import { useTasksStore } from "@/stores/tasks-store";
import { useHabitsStore } from "@/stores/habits-store";
import { useTranslation } from "@/stores/language-store";

export default function MyDayPage() {
  const { dict, isUz } = useTranslation();
  const tasks = useTasksStore((state) => state.tasks);
  const habits = useHabitsStore((state) => state.habits);

  const activeTasks = tasks.filter((t) => t.status !== "COMPLETED").slice(0, 5);
  const activeHabits = habits.slice(0, 6);

  const getPriorityLabel = (p: string) => {
    if (!isUz) return p;
    switch (p) {
      case "CRITICAL":
      case "P0":
        return "Favqulodda";
      case "HIGH":
      case "P1":
        return "Yuqori";
      case "NORMAL":
      case "P2":
        return "O‘rta";
      case "LOW":
      case "P3":
        return "Past";
      default:
        return p;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Sun}
          badge={isUz ? "KUNLIK PROTOKOL" : "DAILY PROTOCOL"}
          title={isUz ? "Mening kunim" : "My Day"}
          description={
            isUz
              ? "Yuqori diqqat bilan ishlash, ustuvor vaqt bloklari va kunlik intizom odatlari."
              : "High-focus execution dashboard, prioritized time blocks, and daily discipline rituals."
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Day's Top Priorities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#F3F7F4] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  {isUz ? "Kunlik Diqqat va Ustuvor Maqsadlar" : "Day's Focus & Priority Targets"}
                </h3>
                <span className="text-xs font-mono text-[#98A69D]">
                  {new Date().toLocaleDateString(isUz ? "uz-UZ" : "en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="space-y-3">
                {activeTasks.length === 0 ? (
                  <p className="text-xs text-[#98A69D] py-4 text-center">
                    {isUz ? "Bugungi kun uchun vazifalar yo‘q." : "No tasks for today."}
                  </p>
                ) : (
                  activeTasks.map((task, idx) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl bg-[#101915] border border-[#25352C] flex items-start gap-3 hover:border-[#10B981]/40 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-xs font-mono text-[#10B981] shrink-0 mt-0.5">
                        0{idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-[#F3F7F4]">
                            {task.title}
                          </h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142019] text-[#10B981] border border-[#10B981]/30">
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-[11px] text-[#98A69D] mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Time Blocking Protocol */}
            <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
              <h3 className="text-sm font-semibold text-[#F3F7F4] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#10B981]" />
                {isUz ? "Rejalashtirilgan Diqqat Bloklari" : "Scheduled Focus Blocks"}
              </h3>
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#10B981] font-semibold">08:00 - 10:30</span>
                    <span className="text-[#F3F7F4]">
                      {isUz ? "Chuqur Ishlash 1-blok: Aurelius IELTS Whisper Pipeline" : "Deep Work Block 1: Aurelius IELTS Whisper Pipeline"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] text-[10px] font-mono font-bold">
                    {isUz ? "BAJARILDI" : "DONE"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#101915] border border-[#10B981]/30 flex items-center justify-between text-xs emerald-glow-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[#10B981] font-semibold">14:00 - 16:00</span>
                    <span className="text-[#F3F7F4]">
                      {isUz ? "Chuqur Ishlash 2-blok: XASAN OS Asosiy Arxitekturasi" : "Deep Work Block 2: XASAN OS Foundation Architecture"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#10B981] text-[#080D0B] font-bold text-[10px] font-mono">
                    {isUz ? "JARAYONDA" : "CURRENT"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-between text-xs text-[#98A69D]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono">19:00 - 20:30</span>
                    <span>
                      {isUz ? "IELTS Speaking va Akademik Reading Mashg‘uloti" : "IELTS Speaking & Academic Reading Practice"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#142019] text-[#98A69D] text-[10px] font-mono">
                    {isUz ? "REJALASHTIRILGAN" : "SCHEDULED"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Daily Habits & Rituals */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
              <h3 className="text-sm font-semibold text-[#F3F7F4] mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                {isUz ? "Bugungi Intizom Odatlari" : "Today's Discipline Rituals"}
              </h3>
              <div className="space-y-3">
                {activeHabits.map((habit) => (
                  <div
                    key={habit.id}
                    className="p-3 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-[#F3F7F4]">
                        {habit.name}
                      </h4>
                      <p className="text-[10px] text-[#98A69D]">
                        {isUz ? "Maqsad: " : "Target: "}{habit.targetCount} {habit.unit}
                      </p>
                    </div>
                    <span className="w-5 h-5 rounded-md bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[#10B981]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
