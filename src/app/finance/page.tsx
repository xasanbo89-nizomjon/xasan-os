import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { FinanceManagerExperience } from "@/components/finance/finance-manager-experience";
import {
  getFinanceMetricsAction,
  getTransactionsAction,
  getBudgetsAction,
  getSavingsGoalsAction,
  getFinancialReportAction,
} from "@/server/actions/finance";

export const metadata = {
  title: "Finance Manager | XASAN OS Ultimate",
  description:
    "Deterministic capital ledger, double-entry cashflow velocity, category budgets, and savings goals.",
};

export default async function FinancePage() {
  const [
    metrics,
    transactions,
    budgets,
    savingsGoals,
    initialReport,
  ] = await Promise.all([
    getFinanceMetricsAction(),
    getTransactionsAction(),
    getBudgetsAction(),
    getSavingsGoalsAction(),
    getFinancialReportAction("MONTHLY"),
  ]);

  return (
    <AppShell>
      <FinanceManagerExperience
        metrics={metrics}
        transactions={transactions}
        budgets={budgets}
        savingsGoals={savingsGoals}
        initialReport={initialReport}
      />
    </AppShell>
  );
}
