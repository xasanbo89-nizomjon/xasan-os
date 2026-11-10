import React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { getDashboardData } from "@/server/actions/os";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CheckSquare,
  Flame,
  Terminal,
  CircleDollarSign,
  ArrowUpRight,
  Sparkles,
  Clock,
  ShieldCheck,
  TrendingUp,
  Layers,
  BookOpen,
  Calendar,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default async function OverviewPage() {
  const data = await getDashboardData();
  const { metrics, recentTasks, activeHabits, projects, recentTransactions, pinnedNotes } = data;

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#25352C]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                PHASE 1 FOUNDATION
              </span>
              <span className="text-xs text-[#98A69D] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                PostgreSQL & Prisma Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F3F7F4]">
              Executive Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#98A69D] mt-1">
              Unified command center for engineering workflows, IELTS study, financial telemetry & discipline tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/developer-hub"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-[#F3F7F4] transition-all flex items-center gap-2 group"
            >
              <Terminal className="w-4 h-4 text-[#10B981] group-hover:scale-110 transition-transform" />
              <span>Dev Hub ({projects.length})</span>
            </Link>
            <Link
              href="/xasan-ai"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all shadow-md shadow-[#10B981]/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI</span>
            </Link>
          </div>
        </div>

        {/* 4 Core Telemetry Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Tasks */}
          <div className="glass-card rounded-2xl p-5 border border-[#25352C] relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#98A69D] mb-3">
              <span className="text-xs font-medium font-mono uppercase tracking-wider">
                Execution Queue
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#F3F7F4]">
                {metrics.tasks.pending}
              </span>
              <span className="text-xs text-[#98A69D]">active tasks</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[#25352C]/60 text-[#98A69D]">
              <span className="text-[#EF4444] font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {metrics.tasks.urgent} Urgent
              </span>
              <span className="text-[#10B981]">
                {metrics.tasks.completed} Done
              </span>
            </div>
          </div>

          {/* Card 2: Habits & Discipline */}
          <div className="glass-card rounded-2xl p-5 border border-[#25352C] relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#98A69D] mb-3">
              <span className="text-xs font-medium font-mono uppercase tracking-wider">
                Discipline Streaks
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#F59E0B]">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#F3F7F4]">
                {metrics.habits.completionRate}%
              </span>
              <span className="text-xs text-[#98A69D]">consistency rate</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[#25352C]/60 text-[#98A69D]">
              <span>{metrics.habits.completedToday} completed today</span>
              <span className="text-[#10B981] font-mono">{metrics.habits.active} active</span>
            </div>
          </div>

          {/* Card 3: Developer Hub */}
          <div className="glass-card rounded-2xl p-5 border border-[#25352C] relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#98A69D] mb-3">
              <span className="text-xs font-medium font-mono uppercase tracking-wider">
                Active Projects
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#3B82F6]">
                <Terminal className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#F3F7F4]">
                {metrics.projects.active}
              </span>
              <span className="text-xs text-[#98A69D]">in flight</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[#25352C]/60 text-[#98A69D]">
              <span className="truncate">Aurelius, Lingua, Ravon</span>
              <span className="text-[#3B82F6] font-mono">100% On-Track</span>
            </div>
          </div>

          {/* Card 4: Finance */}
          <div className="glass-card rounded-2xl p-5 border border-[#25352C] relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#98A69D] mb-3">
              <span className="text-xs font-medium font-mono uppercase tracking-wider">
                Cashflow Net
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                <CircleDollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#10B981]">
                {formatCurrency(metrics.finance.balance)}
              </span>
              <span className="text-xs text-[#98A69D]">monthly net</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[#25352C]/60 text-[#98A69D]">
              <span className="text-[#10B981]">+{formatCurrency(metrics.finance.incomeThisMonth)}</span>
              <span className="text-[#EF4444]">-{formatCurrency(metrics.finance.expensesThisMonth)}</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Tasks & Habits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Tasks (2 cols) */}
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#10B981]" />
                <h2 className="text-base font-semibold text-[#F3F7F4]">
                  High Priority Execution Queue
                </h2>
              </div>
              <Link
                href="/tasks"
                className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
              >
                View all tasks <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 flex-1">
              {recentTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-[#101915]/80 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                        {task.title}
                      </span>
                      {task.project && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#142019] text-[#98A69D] border border-[#25352C]">
                          {task.project.name}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-[11px] text-[#98A69D] line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 pt-1 text-[10px] text-[#98A69D]">
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-[#98A69D]">
                          <Clock className="w-3 h-3 text-[#10B981]" />
                          Due {formatDate(task.dueDate)}
                        </span>
                      )}
                      {task.tags.map((tag) => (
                        <span key={tag} className="font-mono text-[9px] text-[#98A69D]/80">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
                        task.priority === "URGENT"
                          ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30"
                          : task.priority === "HIGH"
                          ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habits & Streaks (1 col) */}
          <div className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#F59E0B]" />
                <h2 className="text-base font-semibold text-[#F3F7F4]">
                  Discipline Habits
                </h2>
              </div>
              <Link
                href="/life-tracker"
                className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
              >
                Track <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 flex-1">
              {activeHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="p-3.5 rounded-xl bg-[#101915]/80 border border-[#25352C] flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-[#F3F7F4]">
                      {habit.name}
                    </h4>
                    <p className="text-[10px] text-[#98A69D]">
                      {habit.targetCount} {habit.unit} • {habit.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#F59E0B] flex items-center gap-1 justify-end">
                        <Flame className="w-3 h-3 fill-current" />
                        {habit.streak}d
                      </div>
                      <div className="text-[9px] text-[#98A69D]">
                        Best: {habit.bestStreak}d
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Developer Hub Projects Showcase */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#10B981]" />
                <h2 className="text-base font-semibold text-[#F3F7F4]">
                  Developer Hub: Active Codebases
                </h2>
              </div>
              <p className="text-xs text-[#98A69D] mt-0.5">
                Core ventures and software platforms actively maintained by the architect.
              </p>
            </div>
            <Link
              href="/developer-hub"
              className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
            >
              Open Dev Hub <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors flex items-center gap-1.5">
                      {proj.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142019] text-[#10B981] border border-[#10B981]/30">
                      {proj.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#98A69D] mb-4 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#142019] text-[#98A69D] border border-[#25352C]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[#98A69D] mb-1.5 font-mono">
                    <span>Progress</span>
                    <span className="text-[#10B981] font-semibold">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#142019] rounded-full overflow-hidden border border-[#25352C]">
                    <div
                      className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lower Grid: Finance & Knowledge Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Finance Telemetry */}
          <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-[#10B981]" />
                <h2 className="text-base font-semibold text-[#F3F7F4]">
                  Financial Telemetry
                </h2>
              </div>
              <Link
                href="/finance"
                className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
              >
                Ledger <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl bg-[#101915]/80 border border-[#25352C] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-[#F3F7F4]">
                      {tx.title}
                    </h4>
                    <span className="text-[10px] text-[#98A69D]">
                      {tx.category} • {formatDate(tx.date)}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold font-mono ${
                      tx.type === "INCOME" ? "text-[#10B981]" : "text-[#EF4444]"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pinned Knowledge Notes */}
          <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#10B981]" />
                <h2 className="text-base font-semibold text-[#F3F7F4]">
                  Pinned Knowledge & Architecture Memos
                </h2>
              </div>
              <Link
                href="/knowledge-base"
                className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
              >
                Second Brain <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {pinnedNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 rounded-xl bg-[#101915]/80 border border-[#25352C] hover:border-[#10B981]/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-semibold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                      {note.title}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142019] text-[#98A69D] border border-[#25352C]">
                      {note.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#98A69D] line-clamp-2 leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
