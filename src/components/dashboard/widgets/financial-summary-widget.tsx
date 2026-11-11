"use client";

import React from "react";
import Link from "next/link";
import { CircleDollarSign, ArrowUpRight, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useTranslation } from "@/stores/language-store";

interface FinancialSummaryWidgetProps {
  balance: number;
  income: number;
  expenses: number;
}

export function FinancialSummaryWidget({
  balance,
  income,
  expenses,
}: FinancialSummaryWidgetProps) {
  const { dict, isUz } = useTranslation();
  const burnPercent = income > 0 ? Math.min(100, Math.round((expenses / income) * 100)) : 10;

  return (
    <div className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
              <CircleDollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                {dict.dashboard.widgets.financial_overview}
              </h3>
              <span className="text-[10px] text-[#98A69D]">
                {isUz ? "Keshflo va xarajatlar tahlili" : "Cashflow & cloud burn"}
              </span>
            </div>
          </div>

          <Link
            href="/finance"
            className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
          >
            {dict.nav.finance} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 rounded-xl bg-[#101915] border border-[#25352C] mb-3.5">
          <span className="text-[10px] font-mono text-[#98A69D] uppercase">{dict.dashboard.stats.net_cashflow}</span>
          <div className="text-2xl font-bold text-[#10B981] mt-0.5">
            {formatCurrency(balance)}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-3 mt-3 border-t border-[#25352C] font-mono">
            <span className="text-[#10B981]">+{formatCurrency(income)}</span>
            <span className="text-[#EF4444]">-{formatCurrency(expenses)}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[10px] text-[#98A69D] mb-1 font-mono">
            <span>{isUz ? "Infratuzilma xarajatlar ulushi" : "Infrastructure Burn Ratio"}</span>
            <span className="text-[#F3F7F4]">{burnPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] to-[#EF4444] rounded-full"
              style={{ width: `${burnPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
