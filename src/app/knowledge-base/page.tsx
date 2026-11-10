import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { BookOpen, Pin, Tag, Search, Plus } from "lucide-react";
import { getDashboardData } from "@/server/actions/os";
import { formatDate } from "@/lib/utils";

export default async function KnowledgeBasePage() {
  const data = await getDashboardData();
  const { pinnedNotes } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={BookOpen}
          badge="SECOND BRAIN"
          title="Knowledge Base"
          description="Centralized repository of architectural patterns, system design memos, IELTS frameworks & technical documentation."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pinnedNotes.map((note) => (
            <div
              key={note.id}
              className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col justify-between group hover:border-[#10B981]/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded bg-[#101915] text-[#10B981] border border-[#10B981]/30">
                    {note.category}
                  </span>
                  {note.isPinned && (
                    <div className="flex items-center gap-1 text-[#10B981] text-xs font-mono">
                      <Pin className="w-3.5 h-3.5 fill-current" />
                      <span>PINNED</span>
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#F3F7F4] mb-2 group-hover:text-[#10B981] transition-colors">
                  {note.title}
                </h3>
                <p className="text-xs text-[#98A69D] leading-relaxed mb-4">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#25352C] text-[11px] text-[#98A69D]">
                <div className="flex items-center gap-1.5">
                  {note.tags.map((t) => (
                    <span key={t} className="font-mono text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
                <span>Updated: {formatDate(note.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
