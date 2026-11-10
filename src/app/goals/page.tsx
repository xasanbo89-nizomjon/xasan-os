import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Compass, Target, CheckCircle2, Trophy } from "lucide-react";

export default function GoalsPage() {
  const okrs = [
    {
      title: "Achieve IELTS Band 8.5 Overall",
      category: "ACADEMICS",
      progress: 88,
      keyResults: [
        "Complete 30 full mock tests with speech analysis",
        "Master 3,500 advanced lexical items",
        "Achieve consistent 8.0+ in Academic Writing Task 2",
      ],
    },
    {
      title: "Launch Aurelius IELTS SaaS into Production",
      category: "VENTURE",
      progress: 74,
      keyResults: [
        "Deploy sub-500ms Whisper audio transcription pipeline",
        "Implement Stripe global checkout & subscription tiering",
        "Onboard first 500 active beta learners",
      ],
    },
    {
      title: "Master High-Scale Distributed Systems Design",
      category: "ENGINEERING",
      progress: 90,
      keyResults: [
        "Write 15 deep architecture whitepapers & analysis memos",
        "Build Raft consensus engine in TypeScript/Go",
        "Publish technical breakdown on distributed read replicas",
      ],
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Compass}
          badge="STRATEGIC DIRECTION"
          title="Goals & Vision"
          description="High-level vision, quarterly Objectives & Key Results (OKRs), and lifelong aspiration tracking."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {okrs.map((okr) => (
            <div
              key={okr.title}
              className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded bg-[#101915] text-[#10B981] border border-[#10B981]/30">
                    {okr.category}
                  </span>
                  <Target className="w-4 h-4 text-[#10B981]" />
                </div>

                <h3 className="text-base font-bold text-[#F3F7F4] mb-4">
                  {okr.title}
                </h3>

                <div className="space-y-2.5 mb-6">
                  {okr.keyResults.map((kr, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#98A69D]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                      <span>{kr}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#98A69D] mb-1.5">
                  <span>OKR Progress</span>
                  <span className="text-[#10B981] font-semibold">{okr.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                  <div
                    className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full"
                    style={{ width: `${okr.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
