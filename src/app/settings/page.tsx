import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Settings, Database, Palette, Key, Shield, HardDrive, Check } from "lucide-react";

export default function SettingsPage() {
  const themeTokens = [
    { name: "Primary Background", hex: "#080D0B", role: "Main canvas" },
    { name: "Secondary Background", hex: "#101915", role: "Sidebar & Panels" },
    { name: "Card Background", hex: "#142019", role: "Glassmorphism cards" },
    { name: "Primary Accent", hex: "#10B981", role: "Emerald glow" },
    { name: "Hover Accent", hex: "#059669", role: "Interactive hover" },
    { name: "Main Text", hex: "#F3F7F4", role: "High-contrast headings" },
    { name: "Secondary Text", hex: "#98A69D", role: "Subtitles & meta" },
    { name: "Border", hex: "#25352C", role: "Structural outlines" },
    { name: "Error", hex: "#EF4444", role: "Urgent alerts" },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Settings}
          badge="SYSTEM CONFIG"
          title="Settings & System Control"
          description="Theme specifications, database connectivity, Prisma schemas, and environmental telemetry."
        />

        {/* Design System & Theme Specification Display */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#F3F7F4] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#10B981]" />
              Dark Emerald Theme Specification (PRD Section 1)
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {themeTokens.map((token) => (
              <div
                key={token.name}
                className="p-3 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg border border-[#25352C] shadow-inner shrink-0"
                    style={{ backgroundColor: token.hex }}
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[#F3F7F4]">
                      {token.name}
                    </h4>
                    <span className="text-[10px] text-[#98A69D]">{token.role}</span>
                  </div>
                </div>
                <code className="text-[11px] font-mono text-[#10B981]">
                  {token.hex}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Database & Architecture Settings */}
        <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#F3F7F4] flex items-center gap-2">
              <Database className="w-4 h-4 text-[#10B981]" />
              PostgreSQL & Prisma Engine Architecture (PRD Section 2)
            </h3>
            <span className="text-xs font-mono text-[#10B981] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Prisma v6 Client Ready
            </span>
          </div>

          <div className="space-y-3 text-xs text-[#98A69D]">
            <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#F3F7F4]">User Data Isolation Mode:</span>
                <p className="text-[11px] mt-0.5">Strict UUID foreign keys & multi-model user relations</p>
              </div>
              <span className="font-mono text-[#10B981] px-2 py-1 bg-[#142019] rounded border border-[#25352C]">
                ENFORCED (userId)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#F3F7F4]">Registered Database Models:</span>
                <p className="text-[11px] mt-0.5">User, Task, Habit, HabitLog, Project, Transaction, KnowledgeNote, Goal</p>
              </div>
              <span className="font-mono text-[#10B981] px-2 py-1 bg-[#142019] rounded border border-[#25352C]">
                8 Models Configured
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
