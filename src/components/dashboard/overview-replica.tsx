"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Check,
  Plus,
  Flame,
  BookOpen,
  GraduationCap,
  Target,
  Wallet,
  TrendingUp,
  Clock,
  Sparkles,
  Terminal,
  Car,
  Headphones,
  FileText,
  Mic,
  Edit3,
  ShieldCheck,
  ArrowRight,
  CircleDollarSign,
  Dumbbell,
  Moon,
  ChevronRight,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useTranslation } from "@/stores/language-store";

interface OverviewReplicaProps {
  onOpenQuickCreate?: (type?: string) => void;
  onStartFocus?: () => void;
}

export function OverviewReplica({
  onOpenQuickCreate,
  onStartFocus,
}: OverviewReplicaProps) {
  const { isUz } = useTranslation();

  // 1. Task item state
  const [tasks, setTasks] = useState([
    {
      id: "task-1",
      title: "IELTS reading practice",
      priority: "Medium",
      priorityColor: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
      completed: false,
    },
    {
      id: "task-2",
      title: "XASAN OS kodini yangilash",
      priority: "High",
      priorityColor: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
      completed: false,
    },
    {
      id: "task-3",
      title: "Arab tili yangi so‘zlar",
      priority: "Medium",
      priorityColor: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
      completed: true,
    },
    {
      id: "task-4",
      title: "Ravon Avto Market loyihasini tekshirish",
      priority: "High",
      priorityColor: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
      completed: false,
    },
    {
      id: "task-5",
      title: "Sport bilan shug‘ullanish",
      priority: "Low",
      priorityColor: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
      completed: true,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // 2. Financial Bar Chart Data
  const financialChartData = [
    { day: "Dush", daromad: 400, xarajat: 220 },
    { day: "Sesh", daromad: 600, xarajat: 310 },
    { day: "Chor", daromad: 350, xarajat: 180 },
    { day: "Pay", daromad: 800, xarajat: 450 },
    { day: "Juma", daromad: 500, xarajat: 260 },
    { day: "Shan", daromad: 250, xarajat: 120 },
    { day: "Yak", daromad: 100, xarajat: 60 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Greeting & Quote Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Welcome Greeting Banner */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 sm:p-7 border border-[#25352C] bg-[#101915] flex flex-col justify-center relative overflow-hidden emerald-glow-sm">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F3F7F4] tracking-tight flex items-center gap-2">
            Assalomu alaykum, Xasan! <span className="animate-wave inline-block origin-bottom-right">👋</span>
          </h1>
          <p className="text-sm text-[#98A69D] mt-2 font-medium">
            Bugungi kuning muvaffaqiyatli o‘tsin!
          </p>
        </div>

        {/* Quote Card */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-[#25352C] bg-[#142019] flex flex-col justify-between relative overflow-hidden group hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-start gap-2.5">
            <span className="text-xl text-[#10B981] font-serif leading-none select-none">“</span>
            <p className="text-xs sm:text-sm font-medium text-[#F3F7F4] italic leading-relaxed">
              Buyuk maqsadlar kichik qadamlar bilan boshlanadi.”
            </p>
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-[#25352C]/60 text-right">
            <span className="text-xs font-mono font-bold text-[#10B981]">
              — XASAN OS
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Row: 5 Progress / KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Stat 1: Kunlik progress */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-[#25352C] bg-[#142019] space-y-2 hover:border-[#10B981]/50 transition-all duration-200">
          <div className="flex items-center justify-between text-[#98A69D]">
            <span className="text-xs font-medium truncate">Kunlik progress</span>
            <div className="w-7 h-7 rounded-lg bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-2xl font-bold font-mono text-[#F3F7F4]">7/9</span>
            <span className="text-[11px] font-mono font-semibold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded border border-[#10B981]/30 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          {/* Mini progress bar */}
          <div className="w-full bg-[#101915] h-1.5 rounded-full overflow-hidden border border-[#25352C]">
            <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: "78%" }} />
          </div>
        </div>

        {/* Stat 2: O‘qish va o‘rganish */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-[#25352C] bg-[#142019] space-y-2 hover:border-[#10B981]/50 transition-all duration-200">
          <div className="flex items-center justify-between text-[#98A69D]">
            <span className="text-xs font-medium truncate">O‘qish va o‘rganish</span>
            <div className="w-7 h-7 rounded-lg bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-2xl font-bold font-mono text-[#F3F7F4]">120h</span>
            <span className="text-[11px] font-mono font-semibold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded border border-[#10B981]/30 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +8%
            </span>
          </div>
          <p className="text-[11px] text-[#98A69D] font-mono flex items-center gap-1">
            <span>IELTS & Arab tili</span>
          </p>
        </div>

        {/* Stat 3: Bajarilgan vazifalar */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-[#25352C] bg-[#142019] space-y-2 hover:border-[#10B981]/50 transition-all duration-200">
          <div className="flex items-center justify-between text-[#98A69D]">
            <span className="text-xs font-medium truncate">Bajarilgan vazifalar</span>
            <div className="w-7 h-7 rounded-lg bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-2xl font-bold font-mono text-[#F3F7F4]">24</span>
            <span className="text-[11px] font-mono font-semibold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded border border-[#10B981]/30 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +20%
            </span>
          </div>
          <p className="text-[11px] text-[#98A69D] font-mono">
            Ushbu haftada
          </p>
        </div>

        {/* Stat 4: Oylik maqsad */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-[#25352C] bg-[#142019] space-y-2 hover:border-[#10B981]/50 transition-all duration-200">
          <div className="flex items-center justify-between text-[#98A69D]">
            <span className="text-xs font-medium truncate">Oylik maqsad</span>
            <div className="w-7 h-7 rounded-lg bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-2xl font-bold font-mono text-[#10B981]">67%</span>
            <span className="text-[11px] font-mono font-semibold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded border border-[#10B981]/30 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +5%
            </span>
          </div>
          <div className="w-full bg-[#101915] h-1.5 rounded-full overflow-hidden border border-[#25352C]">
            <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: "67%" }} />
          </div>
        </div>

        {/* Stat 5: Hisob qoldig‘i */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-[#25352C] bg-[#142019] space-y-2 hover:border-[#10B981]/50 transition-all duration-200 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-[#98A69D]">
            <span className="text-xs font-medium truncate">Hisob qoldig‘i</span>
            <div className="w-7 h-7 rounded-lg bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-center justify-between gap-1">
            <span className="text-2xl font-bold font-mono text-[#F3F7F4]">$3,250</span>
            <span className="text-[11px] font-mono font-semibold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded border border-[#10B981]/30 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +12%
            </span>
          </div>
          <p className="text-[11px] text-[#10B981] font-mono">
            +18% keshflo
          </p>
        </div>
      </div>

      {/* 3. Main 3-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ========================================================= */}
        {/* COLUMN 1: Tasks & Projects                                */}
        {/* ========================================================= */}
        <div className="space-y-6">
          {/* Card 1: Bugungi vazifalar */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] bg-[#142019] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F3F7F4]">Bugungi vazifalar</h3>
                  <span className="text-[11px] text-[#98A69D] font-mono">5 ta vazifa rejalashtirilgan</span>
                </div>
              </div>
              <Link
                href="/tasks"
                className="text-xs text-[#10B981] hover:text-[#059669] font-medium flex items-center gap-1 transition-colors"
              >
                <span>Barchasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Task list with exact items */}
            <div className="space-y-2.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                    task.completed
                      ? "bg-[#101915]/60 border-[#25352C] opacity-70"
                      : "bg-[#101915] border-[#25352C] hover:border-[#10B981]/50 hover:bg-[#101915]/90"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      aria-label="Toggle task"
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        task.completed
                          ? "bg-[#10B981] border-[#10B981] text-[#080D0B]"
                          : "border-[#25352C] bg-[#142019] hover:border-[#10B981]"
                      }`}
                    >
                      {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <span
                      className={`text-xs font-medium truncate ${
                        task.completed
                          ? "line-through text-[#98A69D]"
                          : "text-[#F3F7F4]"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 font-semibold ${task.priorityColor}`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick add task trigger */}
            <button
              type="button"
              onClick={() => onOpenQuickCreate?.("task")}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#25352C] hover:border-[#10B981]/60 text-xs text-[#98A69D] hover:text-[#10B981] hover:bg-[#101915] transition-all flex items-center justify-center gap-1.5 cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi vazifa qo‘shish</span>
            </button>
          </div>

          {/* Card 2: Loyihalar */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] bg-[#142019] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F3F7F4]">Loyihalar</h3>
                  <span className="text-[11px] text-[#98A69D] font-mono">3 ta faol loyiha</span>
                </div>
              </div>
              <Link
                href="/developer-hub"
                className="text-xs text-[#10B981] hover:text-[#059669] font-medium flex items-center gap-1 transition-colors"
              >
                <span>Barchasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Project Rows */}
            <div className="space-y-3.5">
              {/* Project 1: XASAN OS */}
              <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] space-y-2 hover:border-[#10B981]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                      <Terminal className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F3F7F4]">XASAN OS</h4>
                      <span className="text-[10px] text-[#98A69D] font-mono">Sovereign Executive OS</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#10B981]">75%</span>
                </div>
                <div className="w-full bg-[#142019] h-2 rounded-full overflow-hidden border border-[#25352C]">
                  <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: "75%" }} />
                </div>
              </div>

              {/* Project 2: Aurelius IELTS */}
              <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] space-y-2 hover:border-[#10B981]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#3B82F6]">
                      <Headphones className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F3F7F4]">Aurelius IELTS</h4>
                      <span className="text-[10px] text-[#98A69D] font-mono">AI Speech & Band 8.5</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#3B82F6]">60%</span>
                </div>
                <div className="w-full bg-[#142019] h-2 rounded-full overflow-hidden border border-[#25352C]">
                  <div className="bg-[#3B82F6] h-full rounded-full transition-all duration-500" style={{ width: "60%" }} />
                </div>
              </div>

              {/* Project 3: Ravon Avto Market */}
              <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] space-y-2 hover:border-[#10B981]/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#F59E0B]">
                      <Car className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F3F7F4]">Ravon Avto Market</h4>
                      <span className="text-[10px] text-[#98A69D] font-mono">Auto Tuning Marketplace</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F59E0B]">90%</span>
                </div>
                <div className="w-full bg-[#142019] h-2 rounded-full overflow-hidden border border-[#25352C]">
                  <div className="bg-[#F59E0B] h-full rounded-full transition-all duration-500" style={{ width: "90%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 2: Study Progress & Financial Report              */}
        {/* ========================================================= */}
        <div className="space-y-6">
          {/* Card 1: Study Progress (IELTS Band 7.5) */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] bg-[#142019] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F3F7F4]">O‘quv natijalari</h3>
                  <span className="text-[11px] text-[#98A69D] font-mono">IELTS Academic & Skills</span>
                </div>
              </div>
              <Link
                href="/study-center"
                className="text-xs text-[#10B981] hover:text-[#059669] font-medium flex items-center gap-1 transition-colors"
              >
                <span>Barchasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Overall Band Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#101915] to-[#142019] border border-[#10B981]/40 flex items-center justify-between emerald-glow-sm">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#98A69D]">
                  Hozirgi umumiy ball
                </span>
                <h4 className="text-lg font-black text-[#F3F7F4] flex items-center gap-2">
                  <span>Overall Band 7.5</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                    C1 Advanced
                  </span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-[#98A69D]">Maqsad</span>
                <div className="text-sm font-bold text-[#10B981] font-mono">Band 8.5</div>
              </div>
            </div>

            {/* Band Progress Visual Trend Line */}
            <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#98A69D] font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                  Ball o‘sish trend chizig‘i
                </span>
                <span className="font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                  +1.0 Band
                </span>
              </div>
              <div className="h-14 w-full relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 280 45" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="bandTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Shaded Area */}
                  <path
                    d="M 0 38 Q 70 30 140 22 T 280 6 L 280 45 L 0 45 Z"
                    fill="url(#bandTrendGrad)"
                  />
                  {/* Glowing Stroke */}
                  <path
                    d="M 0 38 Q 70 30 140 22 T 280 6"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Points */}
                  <circle cx="0" cy="38" r="3" fill="#101915" stroke="#10B981" strokeWidth="2" />
                  <circle cx="70" cy="30" r="3" fill="#101915" stroke="#10B981" strokeWidth="2" />
                  <circle cx="140" cy="22" r="3" fill="#101915" stroke="#10B981" strokeWidth="2" />
                  <circle cx="210" cy="14" r="3" fill="#101915" stroke="#10B981" strokeWidth="2" />
                  <circle cx="280" cy="6" r="4" fill="#10B981" stroke="#F3F7F4" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-[#98A69D] px-0.5">
                <span>Yan 6.5</span>
                <span>Fev 6.8</span>
                <span>Mar 7.0</span>
                <span>May 7.2</span>
                <span className="text-[#10B981] font-bold">Iyun 7.5</span>
              </div>
            </div>

            {/* 4 Skill Score Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Listening */}
              <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C] space-y-1.5">
                <div className="flex items-center justify-between text-[#98A69D]">
                  <span className="text-xs font-medium flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-[#3B82F6]" />
                    Listening
                  </span>
                  <span className="text-sm font-bold font-mono text-[#F3F7F4]">8.0</span>
                </div>
                <div className="w-full bg-[#142019] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#3B82F6] h-full rounded-full" style={{ width: "89%" }} />
                </div>
              </div>

              {/* Reading */}
              <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C] space-y-1.5">
                <div className="flex items-center justify-between text-[#98A69D]">
                  <span className="text-xs font-medium flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#10B981]" />
                    Reading
                  </span>
                  <span className="text-sm font-bold font-mono text-[#F3F7F4]">7.5</span>
                </div>
                <div className="w-full bg-[#142019] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#10B981] h-full rounded-full" style={{ width: "83%" }} />
                </div>
              </div>

              {/* Writing */}
              <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C] space-y-1.5">
                <div className="flex items-center justify-between text-[#98A69D]">
                  <span className="text-xs font-medium flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Writing
                  </span>
                  <span className="text-sm font-bold font-mono text-[#F3F7F4]">7.0</span>
                </div>
                <div className="w-full bg-[#142019] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: "78%" }} />
                </div>
              </div>

              {/* Speaking */}
              <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C] space-y-1.5">
                <div className="flex items-center justify-between text-[#98A69D]">
                  <span className="text-xs font-medium flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-purple-400" />
                    Speaking
                  </span>
                  <span className="text-sm font-bold font-mono text-[#F3F7F4]">7.5</span>
                </div>
                <div className="w-full bg-[#142019] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full rounded-full" style={{ width: "83%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Moliyaviy hisobot */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] bg-[#142019] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                  <CircleDollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F3F7F4]">Moliyaviy hisobot</h3>
                  <span className="text-[11px] text-[#98A69D] font-mono">Oylik keshflo tahlili</span>
                </div>
              </div>
              <Link
                href="/finance"
                className="text-xs text-[#10B981] hover:text-[#059669] font-medium flex items-center gap-1 transition-colors"
              >
                <span>Barchasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Exact 3 Financial Metrics */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-base sm:text-lg font-bold font-mono text-[#F3F7F4]">
                    $892
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-[#10B981] bg-[#10B981]/15 px-1 py-0.2 rounded border border-[#10B981]/30">
                    +12%
                  </span>
                </div>
                <span className="text-[10px] text-[#98A69D] font-medium mt-0.5 block leading-tight">
                  Jami xarajatlar
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
                <div className="text-base sm:text-lg font-bold font-mono text-[#10B981]">
                  $2,500
                </div>
                <span className="text-[10px] text-[#98A69D] font-medium mt-0.5 block leading-tight">
                  Daromad
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
                <div className="text-base sm:text-lg font-bold font-mono text-[#EF4444]">
                  $1,600
                </div>
                <span className="text-[10px] text-[#98A69D] font-medium mt-0.5 block leading-tight">
                  Xarajat
                </span>
              </div>
            </div>

            {/* Cashflow Bar Chart */}
            <div className="pt-2">
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialChartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <XAxis
                      dataKey="day"
                      stroke="#98A69D"
                      fontSize={10}
                      fontFamily="monospace"
                      axisLine={{ stroke: "#25352C" }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#98A69D"
                      fontSize={10}
                      fontFamily="monospace"
                      axisLine={{ stroke: "#25352C" }}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#101915",
                        borderColor: "#25352C",
                        borderRadius: "12px",
                        fontSize: "11px",
                        color: "#F3F7F4",
                      }}
                    />
                    <Bar dataKey="daromad" name="Daromad" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="xarajat" name="Xarajat" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMN 3: Habits, Quick Actions, and XASAN AI            */}
        {/* ========================================================= */}
        <div className="space-y-6">
          {/* Card 1: Odatiy odatlar */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] bg-[#142019] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                  <Flame className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#F3F7F4]">Odatiy odatlar</h3>
                  <span className="text-[11px] text-[#98A69D] font-mono">Haftalik intizom zanjiri</span>
                </div>
              </div>
              <Link
                href="/life-tracker"
                className="text-xs text-[#10B981] hover:text-[#059669] font-medium flex items-center gap-1 transition-colors"
              >
                <span>Barchasi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4 Circular Progress Rings */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              {/* Ring 1: Sport 5/7 */}
              <div className="flex flex-col items-center space-y-1.5">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                    <path
                      className="text-[#101915] stroke-current"
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#10B981] stroke-current"
                      strokeDasharray="71, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-bold font-mono text-[#F3F7F4]">5/7</span>
                </div>
                <span className="text-[11px] font-medium text-[#98A69D] flex items-center gap-1">
                  <Dumbbell className="w-3 h-3 text-[#10B981]" />
                  Sport
                </span>
              </div>

              {/* Ring 2: O‘qish 6/7 */}
              <div className="flex flex-col items-center space-y-1.5">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                    <path
                      className="text-[#101915] stroke-current"
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#3B82F6] stroke-current"
                      strokeDasharray="86, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-bold font-mono text-[#F3F7F4]">6/7</span>
                </div>
                <span className="text-[11px] font-medium text-[#98A69D] flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[#3B82F6]" />
                  O‘qish
                </span>
              </div>

              {/* Ring 3: O‘qish 7/8 */}
              <div className="flex flex-col items-center space-y-1.5">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                    <path
                      className="text-[#101915] stroke-current"
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#F59E0B] stroke-current"
                      strokeDasharray="88, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-bold font-mono text-[#F3F7F4]">7/8</span>
                </div>
                <span className="text-[11px] font-medium text-[#98A69D] flex items-center gap-1">
                  <GraduationCap className="w-3 h-3 text-[#F59E0B]" />
                  O‘qish
                </span>
              </div>

              {/* Ring 4: Uyqu 7/7 */}
              <div className="flex flex-col items-center space-y-1.5">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                    <path
                      className="text-[#101915] stroke-current"
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#10B981] stroke-current"
                      strokeDasharray="100, 100"
                      strokeLinecap="round"
                      strokeWidth="3.5"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-bold font-mono text-[#10B981]">7/7</span>
                </div>
                <span className="text-[11px] font-medium text-[#98A69D] flex items-center gap-1">
                  <Moon className="w-3 h-3 text-purple-400" />
                  Uyqu
                </span>
              </div>
            </div>

            {/* Encouragement streak banner */}
            <div className="p-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center gap-2.5 text-xs text-[#10B981]">
              <Flame className="w-4 h-4 shrink-0 text-[#10B981] animate-pulse" />
              <span className="font-semibold leading-tight">
                Ajoyib! Bu haftada 4 kun ketma-ket odatlarga rioya qildingiz!
              </span>
            </div>
          </div>

          {/* Card 2: Tez amallar (Quick Actions) */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] bg-[#142019] space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-[#25352C]">
              <Zap className="w-4 h-4 text-[#10B981]" />
              <h3 className="text-sm font-bold text-[#F3F7F4]">Tez amallar</h3>
            </div>

            {/* 6 Quick Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onOpenQuickCreate?.("task")}
                className="p-3 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/60 hover:bg-[#10B981]/10 text-xs font-semibold text-[#F3F7F4] flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981] shrink-0">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Yangi vazifa</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenQuickCreate?.("habit")}
                className="p-3 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/60 hover:bg-[#10B981]/10 text-xs font-semibold text-[#F3F7F4] flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#F59E0B] shrink-0">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Odat kiritish</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenQuickCreate?.("transaction")}
                className="p-3 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/60 hover:bg-[#10B981]/10 text-xs font-semibold text-[#F3F7F4] flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#3B82F6] shrink-0">
                  <CircleDollarSign className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Tranzaksiya</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenQuickCreate?.("note")}
                className="p-3 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/60 hover:bg-[#10B981]/10 text-xs font-semibold text-[#F3F7F4] flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-purple-400 shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Qayd yozish</span>
              </button>

              <Link
                href="/focus"
                className="p-3 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/60 hover:bg-[#10B981]/10 text-xs font-semibold text-[#F3F7F4] flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981] shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">Pomodoro</span>
              </Link>

              <Link
                href="/xasan-ai"
                className="p-3 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/60 hover:bg-[#10B981]/10 text-xs font-semibold text-[#F3F7F4] flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981] shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">AI Suhbat</span>
              </Link>
            </div>
          </div>

          {/* Card 3: XASAN AI Card */}
          <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#10B981]/40 bg-gradient-to-b from-[#142019] to-[#101915] space-y-4 relative overflow-hidden emerald-glow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F3F7F4]">XASAN AI</h3>
                <p className="text-[11px] text-[#98A69D]">Sizning shaxsiy yordamchingiz</p>
              </div>
            </div>

            {/* Emerald ChatGPT-Style Neural Logo Graphic */}
            <div className="flex flex-col items-center justify-center py-4 select-none">
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#080D0B] to-[#142019] border border-[#10B981]/40 flex items-center justify-center shadow-lg shadow-[#10B981]/20 group">
                <div className="absolute inset-0 bg-[#10B981]/10 rounded-2xl blur-xl animate-pulse" />
                <svg
                  className="w-10 h-10 text-[#10B981] animate-spin-slow transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                  <path d="M12 12 2.1 12.5" />
                  <path d="m4.93 4.93 4.24 4.24" />
                  <path d="m14.83 9.17 4.24-4.24" />
                  <path d="m14.83 14.83 4.24 4.24" />
                  <path d="m9.17 14.83-4.24 4.24" />
                </svg>
              </div>
            </div>

            {/* Chat boshlash button */}
            <Link
              href="/xasan-ai"
              className="w-full py-2.5 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-all shadow-md shadow-[#10B981]/25 flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Chat boshlash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Footer System Bar */}
      <div className="glass-card rounded-2xl px-5 py-3.5 border border-[#25352C] bg-[#101915] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#98A69D]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#F3F7F4]">XASAN OS v1.0.0 Ultimate</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#25352C]" />
          <div className="flex items-center gap-1.5 text-[#10B981]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="font-semibold">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span>Sinxronizatsiya: 2 daqiqa oldin</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#25352C]" />
          <div className="flex items-center gap-1.5 text-[#10B981]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Server: Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
