import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Compass } from "lucide-react";
import { getGoalsAction, getVisionItemsAction } from "@/server/actions/goals";
import { GoalsExperience } from "@/components/goals/goals-experience";

export const metadata = {
  title: "Goals & Vision | XASAN OS",
  description: "Strategic Objectives & Key Results (OKRs), timeline roadmaps, and personal vision board.",
};

export default async function GoalsPage() {
  const [goals, visionItems] = await Promise.all([
    getGoalsAction(),
    getVisionItemsAction(),
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Compass}
          badge="STRATEGIC DIRECTION"
          title="Goals & Vision"
          description="High-level vision, quarterly Objectives & Key Results (OKRs), roadmap milestones, and lifelong aspirations."
        />

        <GoalsExperience
          initialGoals={goals}
          initialVisionItems={visionItems}
        />
      </div>
    </AppShell>
  );
}
