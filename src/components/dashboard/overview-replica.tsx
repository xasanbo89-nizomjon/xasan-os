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
  ShieldCheck,
  ArrowRight,
  CircleDollarSign,
  Dumbbell,
  Moon,
  ChevronRight,
  ChevronDown,
  Zap,
  Calendar,
  Wifi,
  Activity,
  Trophy,
  Droplets,
  Bell,
  Play,
  CheckCircle2,
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

  // 1. Task item state matching image
  const [tasks, setTasks] = useState([
    {
      id: "task-1",
      title: "IELTS reading practice",
      priority: "Medium",
      priorityColor: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
      completed: true,
    },
    {
      id: "task-2",
      title: "XASAN OS kodini yangilash",
      priority: "High",
      priorityColor: "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30",
      completed: true,
    },
    {
      id: "task-3",
      title: "Arab tili yangi so‘zlar",
      priority: "Medium",
      priorityColor: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30",
      completed: false,
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
      priorityColor: "bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30",
      completed: false,
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // 2. Study tab active state
  const [studyTab, setStudyTab] = useState<"IELTS" | "Arabic" | "Vocabulary">("IELTS");

  // 3. Financial Bar Chart Data
  const financialChartData = [
    { day: "D", daromad: 320, xarajat: 180 },
    { day: "S", daromad: 480, xarajat: 260 },
    { day: "C", daromad: 280, xarajat: 140 },
    { day: "P", daromad: 620, xarajat: 390 },
    { day: "J", daromad: 510, xarajat: 210 },
    { day: "S", daromad: 390, xarajat: 190 },
    { day: "Y", daromad: 220, xarajat: 90 },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300 select-none">
      {/* ========================================================================= */}
      {/* 1. HERO MOUNTAIN BANNER CARD (Snow-capped mountain + Blue Aurora Sky)     */}
      {/* ========================================================================= */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1E2D4D] bg-[#0C1424] min-h-[145px] sm:min-h-[160px] flex items-center justify-between p-5 sm:p-7 shadow-xl shadow-[#0284C7]/5 group">
        {/* Mountain Range with Aurora Background */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-85 transition-transform duration-700 group-hover:scale-102"
          style={{
            backgroundImage: `url('/images/hero-banner-blue.jpg'), url('/images/mountain-blue.jpg')`,
            backgroundPosition: "center right",
          }}
        />
        {/* Soft gradient fade so left text is 100% legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/75 to-transparent pointer-events-none" />

        {/* Left: Greeting & Date/Time Protocol */}
        <div className="relative z-10 space-y-2 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F1F5F9] tracking-tight flex items-center gap-2">
            <span>Assalomu alaykum, Xasan!</span>
            <span className="animate-wave inline-block origin-bottom-right">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-medium">
            Bugungi kuning muvaffaqiyatli o‘tsin!
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#94A3B8] pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-[#F1F5F9] font-medium">16-iyun, 2025</span>
              <span className="text-[#38BDF8]">•</span>
              <span className="text-[#38BDF8] font-semibold">Dushanba</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-[#F1F5F9] font-bold">14:35</span>
            </div>
          </div>
        </div>

        {/* Right: Frosted Floating Quote Card from Image */}
        <div className="relative z-10 hidden md:flex flex-col justify-between max-w-xs p-3.5 sm:p-4 rounded-xl bg-[#070B14]/80 backdrop-blur-md border border-[#1E2D4D]/80 shadow-lg text-xs space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 text-sm leading-none shrink-0">★</span>
            <p className="text-[#F1F5F9] font-medium italic leading-relaxed text-[11px]">
              “Buyuk maqsadlar kichik qadamlar bilan boshlanadi.”
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono font-bold text-[#38BDF8]">
              — XASAN OS
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. 5 KPI / PROGRESS STAT CARDS (Exact match to image)                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Kunlik progress (78% Ring) */}
        <div className="glass-card rounded-2xl p-4 border border-[#1E2D4D] bg-[#0D1527] flex items-center gap-3 hover:border-[#38BDF8]/50 transition-all shadow-sm">
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-[#152238] stroke-current"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#38BDF8] stroke-current"
                strokeDasharray="78, 100"
                strokeLinecap="round"
                strokeWidth="3.5"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold font-mono text-[#F1F5F9]">78%</span>
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-[#F1F5F9] truncate">Kunlik progress</h4>
            <p className="text-[11px] text-[#94A3B8] font-mono">7 / 9 vazifa</p>
            <span className="text-[10px] font-mono font-bold text-[#38BDF8] flex items-center gap-0.5">
              <span>↑</span> +12%
            </span>
          </div>
        </div>

        {/* Card 2: O'qish va o'rganish */}
        <div className="glass-card rounded-2xl p-4 border border-[#1E2D4D] bg-[#0D1527] flex items-center gap-3 hover:border-[#38BDF8]/50 transition-all shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-[#0284C7]/20 border border-[#0284C7]/40 flex items-center justify-center text-[#38BDF8] shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold font-mono text-[#F1F5F9] leading-tight">120h</div>
            <h4 className="text-xs font-medium text-[#94A3B8] truncate">O‘qish va o‘rganish</h4>
            <span className="text-[10px] font-mono font-bold text-[#38BDF8] flex items-center gap-0.5">
              <span>↑</span> +8%
            </span>
          </div>
        </div>

        {/* Card 3: Bajarilgan vazifalar */}
        <div className="glass-card rounded-2xl p-4 border border-[#1E2D4D] bg-[#0D1527] flex items-center gap-3 hover:border-[#38BDF8]/50 transition-all shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold font-mono text-[#F1F5F9] leading-tight">24</div>
            <h4 className="text-xs font-medium text-[#94A3B8] truncate">Bajarilgan vazifalar</h4>
            <span className="text-[10px] font-mono font-bold text-[#38BDF8] flex items-center gap-0.5">
              <span>↑</span> +20%
            </span>
          </div>
        </div>

        {/* Card 4: Oylik maqsad */}
        <div className="glass-card rounded-2xl p-4 border border-[#1E2D4D] bg-[#0D1527] flex items-center gap-3 hover:border-[#38BDF8]/50 transition-all shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444] shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xl font-bold font-mono text-[#F1F5F9] leading-tight">67%</div>
            <h4 className="text-xs font-medium text-[#94A3B8] truncate">Oylik maqsad</h4>
            <div className="w-full bg-[#152238] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-[#38BDF8] h-full rounded-full" style={{ width: "67%" }} />
            </div>
          </div>
        </div>

        {/* Card 5: Hisob qoldig'i */}
        <div className="glass-card rounded-2xl p-4 border border-[#1E2D4D] bg-[#0D1527] flex items-center gap-3 hover:border-[#38BDF8]/50 transition-all shadow-sm col-span-2 sm:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B] shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-bold font-mono text-[#F1F5F9] leading-tight">$3,250</div>
            <h4 className="text-xs font-medium text-[#94A3B8] truncate">Hisob qoldig‘i</h4>
            <span className="text-[10px] font-mono font-bold text-[#38BDF8] flex items-center gap-0.5">
              <span>↑</span> +5%
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. ROW 2: (Bugungi vazifalar | Study Progress | Moliyaviy hisobot)         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* Card 1: Bugungi vazifalar */}
        <div className="glass-card rounded-2xl p-5 border border-[#1E2D4D] bg-[#0D1527] space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1E2D4D]">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="text-sm font-bold text-[#F1F5F9]">Bugungi vazifalar</h3>
            </div>
            <Link
              href="/tasks"
              className="text-xs text-[#38BDF8] hover:text-[#60A5FA] font-medium flex items-center gap-1 transition-colors"
            >
              <span>Hammasi</span>
              <span>→</span>
            </Link>
          </div>

          {/* Task list with checkboxes matching image */}
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-2.5 rounded-xl border transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer ${
                  task.completed
                    ? "bg-[#070B14]/60 border-[#1E2D4D] opacity-80"
                    : "bg-[#070B14] border-[#1E2D4D] hover:border-[#38BDF8]/50 hover:bg-[#070B14]/90"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    aria-label="Toggle task"
                    className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                      task.completed
                        ? "bg-[#38BDF8] border-[#38BDF8] text-[#060A12]"
                        : "border-[#1E2D4D] bg-[#101B33] hover:border-[#38BDF8]"
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <span
                    className={`text-xs font-medium truncate ${
                      task.completed
                        ? "text-[#94A3B8]"
                        : "text-[#F1F5F9]"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded-md border shrink-0 font-bold ${task.priorityColor}`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Study Progress */}
        <div className="glass-card rounded-2xl p-5 border border-[#1E2D4D] bg-[#0D1527] space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1E2D4D]">
            <h3 className="text-sm font-bold text-[#F1F5F9]">Study Progress</h3>
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#94A3B8] bg-[#070B14] px-2 py-0.5 rounded-md border border-[#1E2D4D] cursor-pointer">
              <span>Bu oy</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Tabs: IELTS | Arabic | Vocabulary */}
          <div className="flex items-center gap-2">
            {(["IELTS", "Arabic", "Vocabulary"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStudyTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  studyTab === tab
                    ? "bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm"
                    : "text-[#94A3B8] hover:text-[#F1F5F9]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Gauge + Skills row */}
          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Left Gauge: 7.5 Overall Band */}
            <div className="col-span-5 flex flex-col items-center justify-center p-2">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-[#152238] stroke-current"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#38BDF8] stroke-current"
                    strokeDasharray="83, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center flex flex-col items-center">
                  <span className="text-base font-black font-mono text-[#F1F5F9] leading-none">7.5</span>
                  <span className="text-[8px] font-mono uppercase text-[#94A3B8]">Overall</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#38BDF8] mt-1">
                ↑ +0.5
              </span>
            </div>

            {/* Right Skills: Listening, Reading, Writing, Speaking */}
            <div className="col-span-7 space-y-2 text-xs">
              {[
                { name: "Listening", score: "8.0", width: "89%" },
                { name: "Reading", score: "7.5", width: "83%" },
                { name: "Writing", score: "7.0", width: "78%" },
                { name: "Speaking", score: "7.5", width: "83%" },
              ].map((skill) => (
                <div key={skill.name} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#94A3B8] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                      {skill.name}
                    </span>
                    <span className="font-mono font-bold text-[#F1F5F9]">{skill.score}</span>
                  </div>
                  <div className="w-full bg-[#152238] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#38BDF8] h-full rounded-full" style={{ width: skill.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Wave Trend Line */}
          <div className="h-10 w-full pt-1">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 260 30" preserveAspectRatio="none">
              <path
                d="M 0 24 Q 65 18 130 14 T 260 4"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="0" cy="24" r="3" fill="#0D1527" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="65" cy="18" r="3" fill="#0D1527" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="130" cy="14" r="3" fill="#0D1527" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="195" cy="9" r="3" fill="#0D1527" stroke="#38BDF8" strokeWidth="2" />
              <circle cx="260" cy="4" r="4" fill="#38BDF8" stroke="#F1F5F9" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 3: Moliyaviy hisobot */}
        <div className="glass-card rounded-2xl p-5 border border-[#1E2D4D] bg-[#0D1527] space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1E2D4D]">
            <h3 className="text-sm font-bold text-[#F1F5F9]">Moliyaviy hisobot</h3>
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#94A3B8] bg-[#070B14] px-2 py-0.5 rounded-md border border-[#1E2D4D] cursor-pointer">
              <span>Bu oy</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Amount & 3D Wallet */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-black font-mono text-[#F1F5F9]">$892</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-[#94A3B8]">Jami xarajatlar</span>
                <span className="text-[10px] font-mono font-bold text-[#38BDF8]">↑ +12%</span>
              </div>
            </div>

            {/* 3D Wallet Icon Illustration */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-[#0284C7]/25 text-[#060A12]">
              <Wallet className="w-6 h-6 stroke-[2.2]" />
            </div>
          </div>

          {/* Income vs Expenses Legend */}
          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-[#94A3B8]">Daromad</span>
              <span className="font-bold text-[#F1F5F9]">$2,500</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span className="text-[#94A3B8]">Xarajat</span>
              <span className="font-bold text-[#F1F5F9]">$1,608</span>
            </div>
          </div>

          {/* Vertical Cash Flow Bar Chart */}
          <div className="h-28 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialChartData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  stroke="#94A3B8"
                  fontSize={10}
                  fontFamily="monospace"
                  axisLine={{ stroke: "#1E2D4D" }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={10}
                  fontFamily="monospace"
                  axisLine={{ stroke: "#1E2D4D" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#070B14",
                    borderColor: "#1E2D4D",
                    borderRadius: "10px",
                    fontSize: "11px",
                    color: "#F1F5F9",
                  }}
                />
                <Bar dataKey="daromad" name="Daromad" fill="#38BDF8" radius={[3, 3, 0, 0]} />
                <Bar dataKey="xarajat" name="Xarajat" fill="#EF4444" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ROW 3: (Loyihalar | Odatiy odatlar | Tez amallar & XASAN AI)            */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
        {/* Card 1: Loyihalar */}
        <div className="glass-card rounded-2xl p-5 border border-[#1E2D4D] bg-[#0D1527] space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1E2D4D]">
            <h3 className="text-sm font-bold text-[#F1F5F9]">Loyihalar</h3>
            <Link
              href="/developer-hub"
              className="text-xs text-[#38BDF8] hover:text-[#60A5FA] font-medium flex items-center gap-1 transition-colors"
            >
              <span>Hammasi</span>
              <span>→</span>
            </Link>
          </div>

          <div className="space-y-3">
            {/* Project 1: XASAN OS */}
            <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4D] space-y-2 hover:border-[#38BDF8]/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F1F5F9]">XASAN OS</h4>
                    <span className="text-[10px] text-[#94A3B8] font-mono">Personal OS project</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#38BDF8]">75%</span>
                  <span className="text-[#94A3B8] text-xs">⟳</span>
                </div>
              </div>
              <div className="w-full bg-[#152238] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#38BDF8] h-full rounded-full" style={{ width: "75%" }} />
              </div>
            </div>

            {/* Project 2: Aurelius IELTS */}
            <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4D] space-y-2 hover:border-[#38BDF8]/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xs">
                    A
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F1F5F9]">Aurelius IELTS</h4>
                    <span className="text-[10px] text-[#94A3B8] font-mono">IELTS learning platform</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#38BDF8]">60%</span>
                  <span className="text-[#94A3B8] text-xs">⟳</span>
                </div>
              </div>
              <div className="w-full bg-[#152238] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#38BDF8] h-full rounded-full" style={{ width: "60%" }} />
              </div>
            </div>

            {/* Project 3: Ravon Avto Market */}
            <div className="p-3 rounded-xl bg-[#070B14] border border-[#1E2D4D] space-y-2 hover:border-[#38BDF8]/40 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#EF4444]/20 border border-[#EF4444]/40 flex items-center justify-center text-[#EF4444]">
                    <Car className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#F1F5F9]">Ravon Avto Market</h4>
                    <span className="text-[10px] text-[#94A3B8] font-mono">Auto marketplace</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#38BDF8]">90%</span>
                  <span className="text-amber-400 text-xs">▲</span>
                </div>
              </div>
              <div className="w-full bg-[#152238] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#38BDF8] h-full rounded-full" style={{ width: "90%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Odatiy odatlar */}
        <div className="glass-card rounded-2xl p-5 border border-[#1E2D4D] bg-[#0D1527] space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1E2D4D]">
            <h3 className="text-sm font-bold text-[#F1F5F9]">Odatiy odatlar</h3>
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#94A3B8] bg-[#070B14] px-2 py-0.5 rounded-md border border-[#1E2D4D] cursor-pointer">
              <span>Bu hafta</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* 4 Circular Rings: Sport, O'qish, Suv, Uyqu */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            {/* 1. Sport 5/7 */}
            <div className="flex flex-col items-center space-y-1">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-[#152238] stroke-current"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#38BDF8] stroke-current"
                    strokeDasharray="71, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold font-mono text-[#F1F5F9]">5/7</span>
              </div>
              <span className="text-[10px] font-medium text-[#94A3B8]">Sport</span>
            </div>

            {/* 2. O'qish 6/7 */}
            <div className="flex flex-col items-center space-y-1">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-[#152238] stroke-current"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#38BDF8] stroke-current"
                    strokeDasharray="86, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold font-mono text-[#F1F5F9]">6/7</span>
              </div>
              <span className="text-[10px] font-medium text-[#94A3B8]">O‘qish</span>
            </div>

            {/* 3. Suv 7/8 */}
            <div className="flex flex-col items-center space-y-1">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-[#152238] stroke-current"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#38BDF8] stroke-current"
                    strokeDasharray="88, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold font-mono text-[#F1F5F9]">7/8</span>
              </div>
              <span className="text-[10px] font-medium text-[#94A3B8]">Suv</span>
            </div>

            {/* 4. Uyqu 7/7 */}
            <div className="flex flex-col items-center space-y-1">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-[#152238] stroke-current"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#38BDF8] stroke-current"
                    strokeDasharray="100, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold font-mono text-[#F1F5F9]">7/7</span>
              </div>
              <span className="text-[10px] font-medium text-[#94A3B8]">Uyqu</span>
            </div>
          </div>

          {/* Trophy streak encouragement banner */}
          <div className="p-2.5 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/25 flex items-center gap-2 text-xs text-[#38BDF8]">
            <span className="text-amber-400 text-sm">🏆</span>
            <span className="font-semibold text-[11px] leading-tight">
              Ajoyib! Bu haftada 4 kun ketma-ket odatlarga rioya qildingiz!
            </span>
          </div>
        </div>

        {/* Card 3: TWO SUBCARDS (Tez amallar & XASAN AI) SIDE BY SIDE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Subcard A: Tez amallar */}
          <div className="glass-card rounded-2xl p-4 border border-[#1E2D4D] bg-[#0D1527] space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-[#F1F5F9] pb-1 border-b border-[#1E2D4D]">Tez amallar</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onOpenQuickCreate?.("task")}
                className="p-2 rounded-xl bg-[#070B14] border border-[#1E2D4D] hover:border-[#38BDF8]/50 text-center flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] text-[#94A3B8] font-medium truncate w-full">Yangi vazifa</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenQuickCreate?.("reminder")}
                className="p-2 rounded-xl bg-[#070B14] border border-[#1E2D4D] hover:border-[#38BDF8]/50 text-center flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-amber-400/15 text-amber-400 flex items-center justify-center">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] text-[#94A3B8] font-medium truncate w-full">Eslatma</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenQuickCreate?.("note")}
                className="p-2 rounded-xl bg-[#070B14] border border-[#1E2D4D] hover:border-[#38BDF8]/50 text-center flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-purple-400/15 text-purple-400 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] text-[#94A3B8] font-medium truncate w-full">Note</span>
              </button>

              <Link
                href="/focus"
                className="p-2 rounded-xl bg-[#070B14] border border-[#1E2D4D] hover:border-[#38BDF8]/50 text-center flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
                <span className="text-[9px] text-[#94A3B8] font-medium truncate w-full">Focus Mode</span>
              </Link>

              <Link
                href="/focus"
                className="p-2 rounded-xl bg-[#070B14] border border-[#1E2D4D] hover:border-[#38BDF8]/50 text-center flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-rose-400/15 text-rose-400 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] text-[#94A3B8] font-medium truncate w-full">Pomodoro</span>
              </Link>

              <Link
                href="/xasan-ai"
                className="p-2 rounded-xl bg-[#070B14] border border-[#1E2D4D] hover:border-[#38BDF8]/50 text-center flex flex-col items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-[#38BDF8]/15 text-[#38BDF8] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] text-[#94A3B8] font-medium truncate w-full">AI Chat</span>
              </Link>
            </div>
          </div>

          {/* Subcard B: XASAN AI */}
          <div className="glass-card rounded-2xl p-4 border border-[#38BDF8]/40 bg-gradient-to-b from-[#101B33] to-[#0D1527] flex flex-col items-center justify-between text-center space-y-2 relative overflow-hidden shadow-md shadow-[#0284C7]/15">
            {/* Glowing Neural Logo */}
            <div className="relative w-12 h-12 rounded-xl bg-[#070B14] border border-[#38BDF8]/40 flex items-center justify-center shadow-lg shadow-[#38BDF8]/20">
              <svg
                className="w-7 h-7 text-[#38BDF8] animate-spin-slow"
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

            <div>
              <h4 className="text-xs font-bold text-[#F1F5F9]">XASAN AI</h4>
              <p className="text-[9px] text-[#94A3B8] leading-tight">Sizning shaxsiy yordamchingiz</p>
            </div>

            <Link
              href="/xasan-ai"
              className="w-full py-1.5 px-3 rounded-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0284C7] text-[#060A12] font-bold text-[11px] transition-all shadow-md shadow-[#38BDF8]/20 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Chat boshlash</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. SYSTEM FOOTER BAR (Exact match to image)                              */}
      {/* ========================================================================= */}
      <div className="glass-card rounded-2xl px-5 py-3 border border-[#1E2D4D] bg-[#0D1527] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#94A3B8]">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="font-bold text-[#F1F5F9]">XASAN OS v1.0.0 Ultimate</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 text-[#38BDF8]">
            <Wifi className="w-3.5 h-3.5" />
            <span>Online</span>
          </div>
          <span className="text-[#1E2D4D]">•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span>Sinxronizatsiya: 2 daqiqa oldin</span>
          </div>
          <span className="text-[#1E2D4D]">•</span>
          <div className="flex items-center gap-1.5 text-[#10B981]">
            <Activity className="w-3.5 h-3.5" />
            <span>Server: Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
