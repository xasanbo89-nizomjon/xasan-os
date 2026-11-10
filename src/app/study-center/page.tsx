import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { GraduationCap, BookOpen, Mic, FileText, Award, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function StudyCenterPage() {
  const ieltsModules = [
    {
      name: "Speaking Band 8.5 Lab",
      desc: "Fluency, lexical range, idiom mastery, and speech phonetics evaluation.",
      icon: Mic,
      target: "Band 8.5",
      progress: 85,
    },
    {
      name: "Academic Writing Task 2",
      desc: "Complex sentence coherence, essay structures, counter-argument balance.",
      icon: FileText,
      target: "Band 8.0+",
      progress: 78,
    },
    {
      name: "Advanced Lexical Decks",
      desc: "3,500 C1/C2 Collocations, academic words & spaced repetition reviews.",
      icon: BookOpen,
      target: "3,500 Words",
      progress: 92,
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={GraduationCap}
          badge="ACADEMIC MASTERY"
          title="Study Center & IELTS Hub"
          description="Dedicated training ground for IELTS Band 8.5+, English academic fluency, and cognitive expansion."
        >
          <Link
            href="/developer-hub"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-[#F3F7F4] flex items-center gap-1.5"
          >
            <span>Linked to Aurelius IELTS</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
          </Link>
        </ModuleHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ieltsModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.name}
                className="glass-card rounded-2xl p-5 border border-[#25352C] flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#F3F7F4] mb-1">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-[#98A69D] leading-relaxed mb-4">
                    {mod.desc}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#98A69D] mb-1.5">
                    <span>Target: {mod.target}</span>
                    <span className="text-[#10B981] font-semibold">{mod.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                    <div
                      className="h-full bg-[#10B981] rounded-full"
                      style={{ width: `${mod.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <h3 className="text-sm font-semibold text-[#F3F7F4] mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#10B981]" />
            Recent Speaking Practice Session Feedback
          </h3>
          <div className="p-4 rounded-xl bg-[#101915] border border-[#25352C] space-y-2 text-xs text-[#98A69D]">
            <div className="flex items-center justify-between font-mono text-[#F3F7F4]">
              <span className="font-semibold text-[#10B981]">Topic: Urban Architecture & Sustainability (Part 3)</span>
              <span>Predicted Score: 8.5</span>
            </div>
            <p>
              &quot;Outstanding usage of idiomatic phrasing and low-frequency discourse markers. Fluency is natural with zero self-correction hesitations.&quot;
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
