import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { Terminal, GitBranch, ExternalLink, Code2, Plus } from "lucide-react";
import { getDashboardData } from "@/server/actions/os";

export default async function DeveloperHubPage() {
  const data = await getDashboardData();
  const { projects } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={Terminal}
          badge="CODE ENGINE"
          title="Developer Hub"
          description="Ecosystem management for core ventures: Aurelius IELTS, LinguaHub, Ravon Avto, and specialized software architectures."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981] group-hover:border-[#10B981]/50 transition-colors">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                    {proj.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#F3F7F4] mb-2 group-hover:text-[#10B981] transition-colors">
                  {proj.name}
                </h3>
                <p className="text-xs text-[#98A69D] leading-relaxed mb-4">
                  {proj.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="text-[11px] text-[#98A69D] font-mono">Tech Stack:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#98A69D] mb-1.5">
                  <span>Milestone Completion</span>
                  <span className="text-[#10B981] font-semibold">{proj.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#101915] rounded-full overflow-hidden border border-[#25352C] mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#25352C] text-xs">
                  {proj.repositoryUrl ? (
                    <a
                      href={proj.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#98A69D] hover:text-[#10B981] transition-colors"
                    >
                      <GitBranch className="w-4 h-4" />
                      <span>Repository</span>
                    </a>
                  ) : (
                    <span className="text-[#98A69D]/60 text-[11px]">Private Codebase</span>
                  )}

                  {proj.liveUrl ? (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#10B981] hover:underline"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[#98A69D]/60 text-[11px]">Staging only</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
