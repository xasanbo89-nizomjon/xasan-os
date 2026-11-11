"use client";

import React, { useState } from "react";
import {
  CircleDollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  PieChart,
  PiggyBank,
  FileSpreadsheet,
  TrendingUp,
  Percent,
  Layers,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ModuleHeader } from "@/components/layout/module-header";
import { TransactionManagement } from "@/components/finance/transaction-management";
import { BudgetManagement } from "@/components/finance/budget-management";
import { SavingsGoals } from "@/components/finance/savings-goals";
import { FinancialReports } from "@/components/finance/financial-reports";
import {
  TransactionSummary,
  BudgetSummary,
  SavingsGoalSummary,
  FinanceMetrics,
  FinancialReportSummary,
} from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useTranslation } from "@/stores/language-store";

interface FinanceManagerExperienceProps {
  metrics: FinanceMetrics;
  transactions: TransactionSummary[];
  budgets: BudgetSummary[];
  savingsGoals: SavingsGoalSummary[];
  initialReport: FinancialReportSummary;
}

export function FinanceManagerExperience({
  metrics,
  transactions,
  budgets,
  savingsGoals,
  initialReport,
}: FinanceManagerExperienceProps) {
  const { isUz, dict } = useTranslation();
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "TRANSACTIONS" | "BUDGETS" | "SAVINGS" | "REPORTS">("OVERVIEW");

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <ModuleHeader
        icon={CircleDollarSign}
        badge="CAPITAL MANAGEMENT & TREASURY"
        title="Finance Manager & Capital Ledger"
        description="Double-entry cashflow tracking, category budgets, disciplined savings portfolios, and deterministic financial reports."
      />

      {/* Top 5 Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>{isUz ? "QAYD ETILGAN BALANS" : "RECORDED BALANCE"}</span>
            <Wallet className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#10B981]">
            {formatCurrency(metrics.totalBalance)}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
            {isUz ? "Sof likvid kapital" : "Net Liquid Capital"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>{isUz ? "OYLIK DAROMAD" : "MONTHLY REVENUE"}</span>
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F3F7F4]">
            {formatCurrency(metrics.incomeThisMonth)}
          </div>
          <div className="text-[10px] text-[#98A69D] font-mono mt-0.5">
            {isUz ? "Mijozlar va loyihalar tushumi" : "Client & Venture Inflow"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>{isUz ? "OYLIK XARAJAT" : "MONTHLY BURN"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#EF4444]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#EF4444]">
            {formatCurrency(metrics.expensesThisMonth)}
          </div>
          <div className="text-[10px] text-[#98A69D] font-mono mt-0.5">
            {isUz ? "Server va operatsion xarajatlar" : "Cloud & Operations"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>{isUz ? "SOF JAMG‘ARMA" : "NET SAVINGS"}</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {formatCurrency(metrics.netSavingsThisMonth)}
          </div>
          <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
            {metrics.savingsRatePercentage}% {isUz ? "Jamg‘arma ko‘rsatkichi" : "Savings Rate"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>{isUz ? "BYUDJET ISHLATILISHI" : "BUDGET USAGE"}</span>
            <PieChart className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F3F7F4]">
            {metrics.budgetUtilizationPercentage}%
          </div>
          <div className="text-[10px] text-amber-400 font-mono mt-0.5">
            {formatCurrency(metrics.monthlyBudgetLimit)} {isUz ? "limitidan" : "Limit"}
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="glass-card rounded-2xl p-2 border border-[#25352C] flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("OVERVIEW")}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "OVERVIEW"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isUz ? "Umumiy holat" : "Overview"}</span>
        </button>

        <button
          onClick={() => setActiveTab("TRANSACTIONS")}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "TRANSACTIONS"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>{isUz ? "Tranzaksiyalar" : "Transactions"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {transactions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("BUDGETS")}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "BUDGETS"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>{isUz ? "Byudjetlar" : "Budgets"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {budgets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("SAVINGS")}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "SAVINGS"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span>{isUz ? "Jamg‘arma maqsadlari" : "Savings Goals"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {savingsGoals.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("REPORTS")}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "REPORTS"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{isUz ? "Hisobotlar va Xavfsizlik" : "Reports & Safety"}</span>
        </button>
      </div>

      {/* ===================== VIEW 1: OVERVIEW & DASHBOARD SUMMARY ===================== */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          {/* Quick Cashflow & Budget Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cashflow Velocity */}
            <div className="glass-card rounded-3xl p-6 border border-[#25352C] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
                <h4 className="text-xs font-mono font-semibold text-[#F3F7F4] uppercase">
                  {isUz ? "Oylik pul oqimi tezligi" : "Monthly Cashflow Velocity"}
                </h4>
                <span className="text-[11px] font-mono text-[#10B981]">
                  {isUz ? "Sof:" : "Net:"} +{formatCurrency(metrics.netSavingsThisMonth)}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#98A69D]">{isUz ? "Umumiy tushum" : "Gross Revenue"}</span>
                    <span className="text-[#10B981] font-bold">{formatCurrency(metrics.incomeThisMonth)}</span>
                  </div>
                  <div className="w-full h-2 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                    <div className="h-full bg-[#10B981] rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-[#98A69D]">{isUz ? "Operatsion xarajatlar" : "Operational Expenses"}</span>
                    <span className="text-[#EF4444] font-bold">{formatCurrency(metrics.expensesThisMonth)}</span>
                  </div>
                  <div className="w-full h-2 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                    <div
                      className="h-full bg-[#EF4444] rounded-full"
                      style={{
                        width: `${Math.min(100, (metrics.expensesThisMonth / (metrics.incomeThisMonth || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 text-xs text-[#98A69D] flex items-center justify-between font-mono">
                  <span>{isUz ? "Jamg‘arma samaradorligi" : "Savings Efficiency"}</span>
                  <span className="text-cyan-400 font-bold">
                    {metrics.savingsRatePercentage}% {isUz ? "daromad saqlab qolindi" : "of revenue retained"}
                  </span>
                </div>
              </div>
            </div>

            {/* Budget Health */}
            <div className="glass-card rounded-3xl p-6 border border-[#25352C] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
                <h4 className="text-xs font-mono font-semibold text-[#F3F7F4] uppercase">
                  {isUz ? "Byudjet intizomi va sarf me'yori" : "Budget Discipline Health"}
                </h4>
                <span className="text-[11px] font-mono text-amber-400">
                  {metrics.budgetUtilizationPercentage}% {isUz ? "sarflandi" : "Used"}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#98A69D]">{isUz ? "Sarflangan" : "Disbursed"}</span>
                  <span className="font-bold text-[#F3F7F4]">{formatCurrency(metrics.expensesThisMonth)}</span>
                </div>
                <div className="w-full h-3 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      metrics.budgetUtilizationPercentage >= 100
                        ? "bg-red-500"
                        : metrics.budgetUtilizationPercentage >= 80
                        ? "bg-amber-400"
                        : "bg-[#10B981]"
                    }`}
                    style={{ width: `${Math.min(100, metrics.budgetUtilizationPercentage)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
                  <span>{isUz ? "Limit:" : "Ceiling:"} {formatCurrency(metrics.monthlyBudgetLimit)}</span>
                  <span>{formatCurrency(Math.max(0, metrics.monthlyBudgetLimit - metrics.expensesThisMonth))} {isUz ? "qoldi" : "remaining"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent 5 Transactions Snapshot */}
          <div className="glass-card rounded-3xl p-6 border border-[#25352C] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#10B981]" />
                <h4 className="text-xs font-mono font-semibold text-[#F3F7F4] uppercase">
                  {isUz ? "Oxirgi tranzaksiyalar faolligi" : "Recent Ledger Activity"}
                </h4>
              </div>
              <button
                onClick={() => setActiveTab("TRANSACTIONS")}
                className="text-xs text-[#10B981] hover:underline font-mono cursor-pointer"
              >
                {isUz ? `Barchasini ko‘rish (${transactions.length}) →` : `View All (${transactions.length}) →`}
              </button>
            </div>

            <div className="divide-y divide-[#25352C]">
              {transactions.slice(0, 5).map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between text-xs hover:bg-[#101915]/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        tx.type === "INCOME"
                          ? "bg-emerald-500/10 text-[#10B981]"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {tx.type === "INCOME" ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-[#F3F7F4]">{tx.title}</div>
                      <div className="text-[11px] text-[#98A69D]">
                        {tx.category} • {tx.account}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div
                      className={`font-bold ${
                        tx.type === "INCOME" ? "text-[#10B981]" : "text-red-400"
                      }`}
                    >
                      {tx.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </div>
                    <div className="text-[10px] text-[#98A69D]">
                      {new Date(tx.date).toLocaleDateString(isUz ? "uz-UZ" : "en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW 2: TRANSACTIONS LEDGER ===================== */}
      {activeTab === "TRANSACTIONS" && (
        <TransactionManagement initialTransactions={transactions} />
      )}

      {/* ===================== VIEW 3: BUDGET MANAGEMENT ===================== */}
      {activeTab === "BUDGETS" && (
        <BudgetManagement initialBudgets={budgets} />
      )}

      {/* ===================== VIEW 4: SAVINGS GOALS ===================== */}
      {activeTab === "SAVINGS" && (
        <SavingsGoals initialGoals={savingsGoals} />
      )}

      {/* ===================== VIEW 5: REPORTS & SAFETY ===================== */}
      {activeTab === "REPORTS" && (
        <FinancialReports initialReport={initialReport} />
      )}
    </div>
  );
}