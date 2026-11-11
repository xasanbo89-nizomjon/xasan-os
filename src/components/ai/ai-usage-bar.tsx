"use client";

import React from "react";
import {
  ShieldCheck,
  Cpu,
  Brain,
  Zap,
  Lock,
  Database,
  Sliders,
} from "lucide-react";
import { AiUsageSummary } from "@/types";

interface AiUsageBarProps {
  usage: AiUsageSummary;
  onOpenMemoryModal: () => void;
}

export function AiUsageBar({ usage, onOpenMemoryModal }: AiUsageBarProps) {
  const isHighUsage = usage.percentageUsed > 80;

  return (
    <div className="bg-[#101915]/80 backdrop-blur-md border-b border-[#25352C] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Security Invariants Badges */}
      <div className="flex items-center gap-2 overflow-x-auto py-0.5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080D0B] border border-[#10B981]/30 text-[#10B981] font-mono text-[10px] font-semibold shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Read-Only by Default</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080D0B] border border-[#25352C] text-[#98A69D] font-mono text-[10px] shrink-0">
          <Lock className="w-3 h-3 text-[#10B981]" />
          <span>Explicit Authorization for Writes</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#080D0B] border border-[#25352C] text-[#98A69D] font-mono text-[10px] shrink-0">
          <Database className="w-3 h-3 text-[#10B981]" />
          <span>User Data Isolated (UUID)</span>
        </div>
      </div>

      {/* Right: Daily Token Meter & Cognitive Memory Trigger */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Token Usage Gauge */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-[#98A69D]">
              Tokens:{" "}
              <strong className="text-[#F3F7F4] font-semibold">
                {usage.tokensUsedToday.toLocaleString()}
              </strong>{" "}
              / {usage.dailyLimit.toLocaleString()}
            </span>
          </div>

          <div className="w-24 h-2 bg-[#080D0B] rounded-full overflow-hidden border border-[#25352C]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHighUsage ? "bg-amber-400" : "bg-[#10B981]"
              }`}
              style={{ width: `${usage.percentageUsed}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#10B981]">
            {usage.percentageUsed}%
          </span>
        </div>

        {/* Memory Trigger */}
        <button
          onClick={onOpenMemoryModal}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#142019] hover:bg-[#10B981]/15 text-[#F3F7F4] hover:text-[#10B981] border border-[#25352C] hover:border-[#10B981]/30 transition-all font-mono text-[11px]"
          title="Manage AI Cognitive Memory & Saved Preferences"
        >
          <Brain className="w-3.5 h-3.5 text-[#10B981]" />
          <span className="hidden md:inline">Memory</span>
        </button>
      </div>
    </div>
  );
}
