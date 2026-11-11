"use client";

import React, { useState } from "react";
import {
  PieChart,
  Plus,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  TrendingDown,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  Edit2,
  X,
} from "lucide-react";
import { BudgetSummary } from "@/types";
import { setBudgetLimitAction } from "@/server/actions/finance";
import { formatCurrency } from "@/lib/utils";
import { useFinanceStore } from "@/stores/finance-store";

interface BudgetManagementProps {
  initialBudgets: BudgetSummary[];
}

const CATEGORIES = [
  { id: "ALL", label: "Overall Monthly Budget" },
  { id: "Technology", label: "Technology & Cloud" },
  { id: "Transport", label: "Transport & Auto" },
  { id: "Food", label: "Food & Groceries" },
  { id: "Education", label: "Education & IELTS" },
  { id: "Health", label: "Health & Fitness" },
  { id: "Entertainment", label: "Entertainment & Leisure" },
  { id: "Shopping", label: "Shopping & Gear" },
];

export function BudgetManagement({ initialBudgets }: BudgetManagementProps) {
  const storeBudgets = useFinanceStore((s) => s.budgets);
  const setBudgetLimit = useFinanceStore((s) => s.setBudgetLimit);
  const isHydrated = useFinanceStore((s) => s.isHydrated);

  const budgets = isHydrated ? storeBudgets : initialBudgets;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("2026-11");

  // Form State
  const [formCategory, setFormCategory] = useState("Technology");
  const [formLimit, setFormLimit] = useState("500");

  const overallBudget = budgets.find((b) => b.category === "ALL") || {
    id: "bud-all",
    userId: "demo",
    category: "ALL",
    month: selectedMonth,
    monthlyLimit: 2500,
    spentAmount: 1640,
    percentageUsed: 65.6,
    currency: "USD",
  };

  const categoryBudgets = budgets.filter((b) => b.category !== "ALL");

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLimit || parseFloat(formLimit) <= 0) return;

    const limit = parseFloat(formLimit);
    setBudgetLimit(formCategory, limit, selectedMonth);
    setIsModalOpen(false);
  };

  const getAlertBadge = (pct: number) => {
    if (pct >= 100) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1">
          <AlertOctagon className="w-3 h-3" />
          <span>OVER BUDGET</span>
        </span>
      );
    }
    if (pct >= 80) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>WARNING (80%+)</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-[#10B981] border border-emerald-500/30 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" />
        <span>HEALTHY</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Overall Monthly Budget Progress */}
      <div className="glass-card rounded-3xl p-6 border border-[#25352C] bg-gradient-to-b from-[#142019] to-[#101915] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#98A69D]">
              CURRENT CYCLE: {selectedMonth}
            </span>
            {getAlertBadge(overallBudget.percentageUsed)}
          </div>
          <h3 className="text-2xl font-bold text-[#F3F7F4]">Overall Monthly Spending Ceiling</h3>
          <p className="text-xs text-[#98A69D] max-w-lg leading-relaxed">
            Allocated spending limit is strictly tracked against recorded expense transactions. Automated alerts trigger when nearing 80% threshold.
          </p>
        </div>

        <div className="w-full md:w-80 space-y-3 bg-[#080D0B]/80 p-5 rounded-2xl border border-[#25352C]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#98A69D]">Total Spent</span>
            <span className="font-bold text-[#F3F7F4]">{formatCurrency(overallBudget.spentAmount)}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#98A69D]">Budget Limit</span>
            <span className="font-bold text-[#10B981]">{formatCurrency(overallBudget.monthlyLimit)}</span>
          </div>

          <div className="w-full h-2.5 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                overallBudget.percentageUsed >= 100
                  ? "bg-red-500"
                  : overallBudget.percentageUsed >= 80
                  ? "bg-amber-400"
                  : "bg-[#10B981]"
              }`}
              style={{ width: `${Math.min(100, overallBudget.percentageUsed)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
            <span>{overallBudget.percentageUsed}% Utilized</span>
            <span>{formatCurrency(Math.max(0, overallBudget.monthlyLimit - overallBudget.spentAmount))} remaining</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#10B981]" />
          <h4 className="text-xs font-mono font-semibold text-[#F3F7F4] uppercase">
            Category Spending Limits & Utilization
          </h4>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all flex items-center gap-1.5 shadow-md shadow-[#10B981]/20 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Adjust Budget Limit</span>
        </button>
      </div>

      {/* Category Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryBudgets.map((b) => (
          <div
            key={b.id}
            className="glass-card rounded-2xl p-5 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex flex-col justify-between space-y-4 group bg-gradient-to-b from-[#142019]/60 to-[#101915]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                  {b.category}
                </span>
                {getAlertBadge(b.percentageUsed)}
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#98A69D]">
                  <span>Spent: <strong className="text-[#F3F7F4]">{formatCurrency(b.spentAmount)}</strong></span>
                  <span>Limit: <strong className="text-[#10B981]">{formatCurrency(b.monthlyLimit)}</strong></span>
                </div>
              </div>

              <div className="w-full h-2 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    b.percentageUsed >= 100
                      ? "bg-red-500"
                      : b.percentageUsed >= 80
                      ? "bg-amber-400"
                      : "bg-[#10B981]"
                  }`}
                  style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#25352C] flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
              <span>{b.percentageUsed}% of limit</span>
              <button
                onClick={() => {
                  setFormCategory(b.category);
                  setFormLimit(String(b.monthlyLimit));
                  setIsModalOpen(true);
                }}
                className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Adjust</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Adjust Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-md w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">Set Category Spending Limit</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Target Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Monthly Limit (USD) *
                </label>
                <input
                  type="number"
                  step="10"
                  min="1"
                  required
                  value={formLimit}
                  onChange={(e) => setFormLimit(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Active Cycle</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-xs text-[#98A69D]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  Save Budget Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
