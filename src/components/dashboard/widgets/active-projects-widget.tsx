"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ArrowUpRight, Code2 } from "lucide-react";
import { ProjectSummary } from "@/types";

interface ActiveProjectsWidgetProps {
  projects: ProjectSummary[];
}

export function ActiveProjectsWidget({ projects }: ActiveProjectsWidgetProps) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                Active Developer Hub Projects
              </h3>
              <span className="text-[10px] text-[#98A69D]">
                Ventures & core platforms
              </span>
            </div>
          </div>

          <Link
            href="/developer-hub"
            className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
          >
            Dev Hub <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-bold text-[#F3F7F4] truncate">
                    {proj.name}
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#142019] text-[#10B981] border border-[#10B981]/30">
                    {proj.progress}%
                  </span>
                </div>
                <p className="text-[10px] text-[#98A69D] line-clamp-2 mb-3 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div>
                <div className="w-full h-1.5 bg-[#142019] rounded-full overflow-hidden border border-[#25352C]">
                  <div
                    className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
