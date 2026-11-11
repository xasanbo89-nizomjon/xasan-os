"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Calendar,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Percent,
  CheckCircle2,
  Lock,
  Clock,
  Layers,
} from "lucide-react";
import { FinancialReportSummary } from "@/types";
import { getFinancialReportAction } from "@/server/actions/finance";
import { formatCurrency } from "@/lib/utils";

interface FinancialReportsProps {
  initialReport: FinancialReportSummary;
}

export function FinancialReports({ initialReport }: FinancialReportsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY">(initialReport.period);
  const [report, setReport] = useState<FinancialReportSummary>(initialReport);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPeriod = async (period: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY") => {
    setSelectedPeriod(period);
    setIsLoading(true);
    try {
      const data = await getFinancialReportAction(period);
      setReport(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Strict Safety Assurance Banner (PRD Requirement 5) */}
      <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-[#10B981] flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
              <span>Deterministic Financial Safety Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-[#10B981] font-bold">
                VERIFIED LOCAL LEDGER
              </span>
            </h4>
            <p className="text-xs text-[#98A69D] mt-0.5">
              All financial reports, cashflow velocity, and tax balances are computed strictly from stored, user-verified transactions. Zero third-party banking credentials or simulated sync scripts are assumed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-xs font-mono text-[#10B981] bg-[#101915] px-3 py-1.5 rounded-xl border border-[#25352C]">
          <Lock className="w-3.5 h-3.5" />
          <span>Client Isolation: Active</span>
        </div>
      </div>

      {/* Period Selector Tabs */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#10B981]" />
          <span className="text-xs font-mono font-semibold text-[#F3F7F4] uppercase">
            Reporting Window:
          </span>
          <span className="text-xs font-mono text-[#98A69D]">
            {report.startDate} → {report.endDate}
          </span>
        </div>

        <div className="flex items-center bg-[#101915] border border-[#25352C] rounded-xl p-1 text-xs">
          {(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"] as const).map((period) => (
            <button
              key={period}
              onClick={() => handleSelectPeriod(period)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all font-semibold ${
                selectedPeriod === period
                  ? "bg-[#142019] text-[#10B981] border border-[#25352C] shadow-sm"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Core Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono mb-2">
            <span>TOTAL REVENUE</span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#10B981]">
            {formatCurrency(report.totalIncome)}
          </div>
          <p className="text-xs text-[#98A69D] mt-1">Recorded income items</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono mb-2">
            <span>TOTAL EXPENSES</span>
            <TrendingDown className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#EF4444]">
            {formatCurrency(report.totalExpenses)}
          </div>
          <p className="text-xs text-[#98A69D] mt-1">Disbursed cashflow out</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono mb-2">
            <span>NET CASHFLOW</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div
            className={`text-3xl font-bold font-mono ${
              report.netCashflow >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
            }`}
          >
            {report.netCashflow >= 0 ? "+" : ""}
            {formatCurrency(report.netCashflow)}
          </div>
          <p className="text-xs text-[#98A69D] mt-1">Retained treasury profit</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono mb-2">
            <span>SAVINGS RATE</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#F3F7F4]">
            {report.savingsRate}%
          </div>
          <p className="text-xs text-[#98A69D] mt-1">
            {report.transactionCount} transactions processed
          </p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Category Distribution */}
        <div className="glass-card rounded-3xl p-6 border border-[#25352C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#EF4444]" />
              <h4 className="text-xs font-mono font-semibold text-[#F3F7F4] uppercase">
                Expense Distribution by Category
              </h4>
            </div>
            <span className="text-[11px] font-mono text-[#98A69D]">
              {report.topExpenseCategories.length} categories
            </span>
          </div>

          <div className="space-y-3">
            {report.topExpenseCategories.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F3F7F4] font-medium">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#98A69D]">{cat.percentage}%</span>
                    <span className="font-bold text-[#EF4444]">{formatCurrency(cat.amount)}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full"
                    style={{ width: `${Math.min(100, cat.percentage)}%` }}
                  />
                </div>
              </div>
            ))}

            {report.topExpenseCategories.length === 0 && (
              <div className="text-center py-8 text-xs text-[#98A69D]">
                Zero expenses logged for this reporting period.
              </div>
            )}
          </div>
        </div>

        {/* Top Income Sources */}
        <div className="glass-card rounded-3xl p-6 border border-[#25352C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <h4 className="text-xs font-mono font-semibold text-[#F3F7F4] uppercase">
                Revenue Inflow Sources
              </h4>
            </div>
            <span className="text-[11px] font-mono text-[#98A69D]">
              {report.topIncomeSources.length} streams
            </span>
          </div>

          <div className="space-y-3">
            {report.topIncomeSources.map((inc) => (
              <div key={inc.source} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F3F7F4] font-medium">{inc.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#98A69D]">{inc.percentage}%</span>
                    <span className="font-bold text-[#10B981]">{formatCurrency(inc.amount)}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                  <div
                    className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full"
                    style={{ width: `${Math.min(100, inc.percentage)}%` }}
                  />
                </div>
              </div>
            ))}

            {report.topIncomeSources.length === 0 && (
              <div className="text-center py-8 text-xs text-[#98A69D]">
                No revenue entries recorded during this window.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
