import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { CircleDollarSign, ArrowUpRight, ArrowDownLeft, Wallet, ShieldAlert, Plus } from "lucide-react";
import { getDashboardData } from "@/server/actions/os";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function FinancePage() {
  const data = await getDashboardData();
  const { metrics, recentTransactions } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={CircleDollarSign}
          badge="TREASURY LEDGER"
          title="Finance & Capital Management"
          description="Cashflow velocity, client income, cloud infrastructure burn rates, and financial telemetry."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
            <div className="text-xs font-mono text-[#98A69D] mb-1">TOTAL CASHFLOW BALANCE</div>
            <div className="text-3xl font-bold text-[#10B981]">
              {formatCurrency(metrics.finance.balance)}
            </div>
            <div className="text-xs text-[#98A69D] mt-2 flex items-center gap-1">
              <span className="text-[#10B981] font-medium">+18.4%</span> vs prior month
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
            <div className="text-xs font-mono text-[#98A69D] mb-1">REVENUE THIS MONTH</div>
            <div className="text-3xl font-bold text-[#F3F7F4]">
              {formatCurrency(metrics.finance.incomeThisMonth)}
            </div>
            <div className="text-xs text-[#98A69D] mt-2">Architecture contracts & software</div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-[#25352C]">
            <div className="text-xs font-mono text-[#98A69D] mb-1">INFRASTRUCTURE BURN</div>
            <div className="text-3xl font-bold text-[#EF4444]">
              {formatCurrency(metrics.finance.expensesThisMonth)}
            </div>
            <div className="text-xs text-[#98A69D] mt-2">AWS GPU nodes, OpenAI & SaaS</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <h3 className="text-base font-semibold text-[#F3F7F4] mb-4">
            Recent Financial Ledger
          </h3>

          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                      tx.type === "INCOME"
                        ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]"
                        : "bg-[#EF4444]/10 border-[#EF4444]/30 text-[#EF4444]"
                    }`}
                  >
                    {tx.type === "INCOME" ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#F3F7F4]">
                      {tx.title}
                    </h4>
                    <p className="text-[11px] text-[#98A69D]">
                      {tx.category} • {tx.account} • {formatDate(tx.date)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold font-mono ${
                      tx.type === "INCOME" ? "text-[#10B981]" : "text-[#EF4444]"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
