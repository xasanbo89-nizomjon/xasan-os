"use client";

import React, { useState } from "react";
import {
  Activity,
  CheckSquare,
  Flame,
  CircleDollarSign,
  BookOpen,
  Clock,
  Filter,
} from "lucide-react";
import { TaskSummary, HabitSummary, TransactionSummary, KnowledgeNoteSummary } from "@/types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { useTranslation } from "@/stores/language-store";

interface ActivityViewProps {
  tasks: TaskSummary[];
  habits: HabitSummary[];
  transactions: TransactionSummary[];
  notes: KnowledgeNoteSummary[];
}

export function ActivityView({
  tasks,
  habits,
  transactions,
  notes,
}: ActivityViewProps) {
  const { dict, isUz } = useTranslation();
  const [filter, setFilter] = useState<"all" | "tasks" | "habits" | "finance" | "notes">("all");

  const activities = [
    {
      id: "act-1",
      type: "tasks",
      title: isUz ? "Bajarilgan vazifa: Diler ombori sinxronlash vebxuklari" : "Completed Task: Finalize dealer inventory automated sync webhooks",
      meta: "Ravon Avto • API & Webhooks",
      time: isUz ? "20 daqiqa oldin" : "20 minutes ago",
      icon: CheckSquare,
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/15",
    },
    {
      id: "act-2",
      type: "habits",
      title: isUz ? "Qayd etilgan odat: Dasturlash va Chuqur Arxitektura (120 daq)" : "Logged Discipline: Deep Architecture & Coding (120 mins)",
      meta: isUz ? "21 kunlik davomiylik zanjiri qayd etildi" : "21-day streak milestone recorded",
      time: isUz ? "1 soat oldin" : "1 hour ago",
      icon: Flame,
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/15",
    },
    {
      id: "act-3",
      type: "finance",
      title: isUz ? "Daromad qayd etildi: Yuqori yuklamali tizimlar konsaltingi" : "Recorded Revenue: High-Performance Arch Consulting",
      meta: `+$4,850.00 • Business Wire Client Account`,
      time: isUz ? "2 kun oldin" : "2 days ago",
      icon: CircleDollarSign,
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/15",
    },
    {
      id: "act-4",
      type: "notes",
      title: isUz ? "Qadalgan qayd: Taqsimlangan konsensus (Raft vs Multi-Paxos)" : "Pinned Note: Distributed Consensus (Raft vs Multi-Paxos)",
      meta: isUz ? "Kategoriya: Taqsimlangan tizimlar • Arxitektura bilimlari" : "Category: Distributed Systems • Architecture Second Brain",
      time: isUz ? "3 kun oldin" : "3 days ago",
      icon: BookOpen,
      color: "text-[#3B82F6]",
      bg: "bg-[#3B82F6]/15",
    },
    {
      id: "act-5",
      type: "habits",
      title: isUz ? "Qayd etilgan odat: IELTS murakkab so‘z boyligi va o‘qish (30 daq)" : "Logged Habit: IELTS Advanced Vocabulary & Reading (30 mins)",
      meta: isUz ? "14 kunlik uzluksiz davomiylik saqlandi" : "14-day streak maintained",
      time: isUz ? "4 kun oldin" : "4 days ago",
      icon: Flame,
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/15",
    },
    {
      id: "act-6",
      type: "finance",
      title: isUz ? "Bulut xarajati: AWS GPU hisoblash quvvati" : "Cloud Compute Expense: AWS GPU Nodes",
      meta: `-$320.00 • Corporate Card`,
      time: isUz ? "5 kun oldin" : "5 days ago",
      icon: CircleDollarSign,
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/15",
    },
  ];

  const filtered = filter === "all" ? activities : activities.filter((a) => a.type === filter);

  const tabs = [
    { id: "all", label: isUz ? "Barcha faoliyat" : "All Activity" },
    { id: "tasks", label: isUz ? "Vazifalar" : "Tasks" },
    { id: "habits", label: isUz ? "Odatlar" : "Habits" },
    { id: "finance", label: isUz ? "Moliya" : "Finance" },
    { id: "notes", label: isUz ? "Qaydlar" : "Notes" },
  ] as const;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Filter Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#101915] border border-[#25352C] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#10B981]" />
          <span className="text-xs font-semibold text-[#F3F7F4]">
            {isUz ? "Filtr:" : "Filter Feed:"}
          </span>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-[#142019] text-[#10B981] border border-[#25352C]"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] font-mono text-[#98A69D]">
          {filtered.length} {isUz ? "ta amal qayd etilgan" : "Recorded Actions"}
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
        {filtered.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="p-4 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/40 transition-colors flex items-start gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl border border-[#25352C] flex items-center justify-center shrink-0 ${act.bg} ${act.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-[#F3F7F4] truncate">
                    {act.title}
                  </h4>
                  <span className="text-[11px] font-mono text-[#98A69D] shrink-0">
                    {act.time}
                  </span>
                </div>
                <p className="text-xs text-[#98A69D]">{act.meta}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
