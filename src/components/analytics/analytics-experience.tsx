"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Flame,
  Code2,
  Wallet,
  Target,
  Database,
  ArrowUpRight,
  PieChart as PieIcon,
  Activity,
  Layers,
  ChevronRight,
} from "lucide-react";
import {
  PeriodReportSummary,
  AnalyticsTimePeriod,
} from "@/types";
import { TrendLineChart } from "./charts/trend-line-chart";
import { ComparisonBarChart } from "./charts/comparison-bar-chart";
import { DistributionPieChart } from "./charts/distribution-pie-chart";
import { ActivityHeatmap } from "./charts/activity-heatmap";
import { AiReportModal } from "./ai-report-modal";
import { getAnalyticsReportAction } from "@/server/actions/analytics";

interface AnalyticsExperienceProps {
  initialReport: PeriodReportSummary;
}

export function AnalyticsExperience({ initialReport }: AnalyticsExperienceProps) {
  const [report, setReport] = useState<PeriodReportSummary>(initialReport);
  const [period, setPeriod] = useState<AnalyticsTimePeriod>(initialReport.period);
  const [comparisonType, setComparisonType] = useState<"STUDY" | "FINANCE">("STUDY");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePeriodChange = async (newPeriod: AnalyticsTimePeriod) => {
    setPeriod(newPeriod);
    setIsUpdating(true);
    try {
      const data = await getAnalyticsReportAction(newPeriod);
      setReport(data);
    } catch (err) {
      console.error("Failed to update analytics report:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const { metrics } = report;

  return (
    <div className="space-y-6">
      {/* Top Header & Period Switcher */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              QUANTIFIED SOVEREIGNTY
            </span>
            <span className="text-xs text-[#98A69D] font-mono flex items-center gap-1">
              <Database className="w-3 h-3 text-[#10B981]" />
              {report.dataSource}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#F3F7F4] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#10B981]" />
            Analytics & Reports
          </h1>
          <p className="text-xs text-[#98A69D] mt-1 font-mono">
            Date Window: <span className="text-[#F3F7F4] font-semibold">{report.startDate}</span> to{" "}
            <span className="text-[#F3F7F4] font-semibold">{report.endDate}</span>
          </p>
        </div>

        {/* Controls: Period Switcher & AI Modal Trigger */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Period selector */}
          <div className="flex items-center bg-[#080D0B] p-1 rounded-xl border border-[#25352C] text-xs font-mono">
            {(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as AnalyticsTimePeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriodChange(p)}
                disabled={isUpdating}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  period === p
                    ? "bg-[#10B981] text-[#080D0B] font-bold shadow-sm"
                    : "text-[#98A69D] hover:text-[#F3F7F4]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* AI Report Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#142019] hover:bg-[#10B981] text-[#10B981] hover:text-[#080D0B] border border-[#10B981]/40 text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate AI Report</span>
          </button>
        </div>
      </div>

      {/* 6 Core KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Tasks Throughput */}
        <div className="glass-card rounded-2xl p-4 border border-[#25352C] space-y-2 hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono">
            <span>TASK VELOCITY</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold text-[#F3F7F4]">
            {metrics.completedTasks}{" "}
            <span className="text-xs text-[#98A69D] font-normal font-mono">
              / {metrics.totalTasks}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#10B981]">
            <span>{metrics.taskCompletionRate}% rate</span>
            <span className="text-[#98A69D]">Score: {metrics.taskVelocityScore}</span>
          </div>
        </div>

        {/* 2. Deep Study Duration */}
        <div className="glass-card rounded-2xl p-4 border border-[#25352C] space-y-2 hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono">
            <span>DEEP STUDY</span>
            <Clock className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold text-[#10B981]">
            {metrics.totalStudyHours}h
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
            <span>Target: {metrics.targetStudyHours}h</span>
            <span className="text-[#10B981]">Band {metrics.estimatedBandScore}</span>
          </div>
        </div>

        {/* 3. Habit Discipline */}
        <div className="glass-card rounded-2xl p-4 border border-[#25352C] space-y-2 hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono">
            <span>DISCIPLINE</span>
            <Flame className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-bold text-[#F59E0B]">
            {metrics.avgConsistencyRate}%
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
            <span>Avg Streak: {metrics.currentStreakAvg}d</span>
            <span className="text-[#F59E0B]">Best: {metrics.longestStreakRecord}d</span>
          </div>
        </div>

        {/* 4. Developer Ventures */}
        <div className="glass-card rounded-2xl p-4 border border-[#25352C] space-y-2 hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono">
            <span>VENTURES</span>
            <Code2 className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-2xl font-bold text-[#3B82F6]">
            {metrics.overallProgressAvg}%
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
            <span>{metrics.activeProjects} Active / {metrics.totalProjects}</span>
            <span className="text-[#3B82F6]">{metrics.completedProjects} Ready</span>
          </div>
        </div>

        {/* 5. Sovereign Treasury */}
        <div className="glass-card rounded-2xl p-4 border border-[#25352C] space-y-2 hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono">
            <span>TREASURY</span>
            <Wallet className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold text-[#F3F7F4]">
            ${metrics.totalBalance.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#10B981]">
            <span>Savings: {metrics.savingsRate}%</span>
            <span className="text-[#10B981]">+${metrics.netSavings.toLocaleString()}</span>
          </div>
        </div>

        {/* 6. Strategic Goals */}
        <div className="glass-card rounded-2xl p-4 border border-[#25352C] space-y-2 hover:border-[#10B981]/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono">
            <span>VISION GOALS</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">
            {metrics.avgGoalProgress}%
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
            <span>{metrics.totalGoals} Goals</span>
            <span className="text-purple-400">{metrics.completedGoals} Achieved</span>
          </div>
        </div>
      </div>

      {/* Row 1: Trend Charts & Target Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Area Chart */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                Velocity & Deep Study Hours Trajectory
              </h3>
              <p className="text-[11px] text-[#98A69D] font-mono">
                Comparative actual hours versus baseline targets
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142019] text-[#10B981] border border-[#25352C]">
              {period}
            </span>
          </div>

          <TrendLineChart data={report.trendData} period={period} />
        </div>

        {/* Comparison Bar Chart */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#10B981]" />
                {comparisonType === "STUDY" ? "Target vs Actual Study Hours" : "Treasury Cashflow: Income vs Expenses"}
              </h3>
              <p className="text-[11px] text-[#98A69D] font-mono">
                Differential variance across reporting milestones
              </p>
            </div>

            <div className="flex items-center gap-1 bg-[#080D0B] p-1 rounded-lg border border-[#25352C] text-[10px] font-mono">
              <button
                onClick={() => setComparisonType("STUDY")}
                className={`px-2 py-0.5 rounded ${
                  comparisonType === "STUDY" ? "bg-[#10B981] text-[#080D0B] font-bold" : "text-[#98A69D]"
                }`}
              >
                Study
              </button>
              <button
                onClick={() => setComparisonType("FINANCE")}
                className={`px-2 py-0.5 rounded ${
                  comparisonType === "FINANCE" ? "bg-[#10B981] text-[#080D0B] font-bold" : "text-[#98A69D]"
                }`}
              >
                Finance
              </button>
            </div>
          </div>

          <ComparisonBarChart data={report.trendData} type={comparisonType} />
        </div>
      </div>

      {/* Row 2: Subject Time Allocation & Expense Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Subject Allocation Pie Chart */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-[#10B981]" />
                Study Time Allocation
              </h3>
              <p className="text-[11px] text-[#98A69D] font-mono">
                Total: {metrics.totalStudyHours} hours
              </p>
            </div>
          </div>

          <DistributionPieChart
            data={report.studyBreakdown}
            valueFormatter={(val) => `${val} hrs`}
          />
        </div>

        {/* Expense Category Distribution */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#3B82F6]" />
                Expense Outflow Distribution
              </h3>
              <p className="text-[11px] text-[#98A69D] font-mono">
                Total: ${metrics.expenses.toLocaleString()}
              </p>
            </div>
          </div>

          <DistributionPieChart
            data={report.expenseBreakdown}
            valueFormatter={(val) => `$${val.toLocaleString()}`}
          />
        </div>

        {/* Task Priority Distribution & Health */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#F59E0B]" />
                Task Priority Health
              </h3>
              <p className="text-[11px] text-[#98A69D] font-mono">
                Throughput: {metrics.completedTasks} / {metrics.totalTasks} closed
              </p>
            </div>
          </div>

          <DistributionPieChart
            data={report.taskPriorityDistribution}
            valueFormatter={(val) => `${val} tasks`}
          />
        </div>
      </div>

      {/* Row 3: 28-Day Activity Heatmap Matrix */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#10B981]" />
              28-Day Sovereign Activity & Discipline Matrix
            </h3>
            <p className="text-[11px] text-[#98A69D] font-mono">
              Multi-dimensional density score combining deep study minutes, task closures, and habit checks
            </p>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142019] text-[#10B981] border border-[#25352C]">
            Past 4 Weeks
          </span>
        </div>

        <ActivityHeatmap data={report.heatmapData} />
      </div>

      {/* AI Report Modal */}
      <AiReportModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentPeriod={period}
      />
    </div>
  );
}
