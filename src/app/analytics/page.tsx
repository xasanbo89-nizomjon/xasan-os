import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { AnalyticsExperience } from "@/components/analytics/analytics-experience";
import { getAnalyticsReportAction } from "@/server/actions/analytics";

export const metadata = {
  title: "Analytics & Reports | XASAN OS",
  description:
    "Quantified self metrics, velocity curves, Recharts data visualization, multi-period reporting, and AI-generated analytical audits.",
};

export default async function AnalyticsPage() {
  const initialReport = await getAnalyticsReportAction("WEEKLY");

  return (
    <AppShell>
      <AnalyticsExperience initialReport={initialReport} />
    </AppShell>
  );
}
