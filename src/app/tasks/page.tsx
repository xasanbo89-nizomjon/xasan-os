import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import { CheckSquare, Filter, Plus, Clock, Tag } from "lucide-react";
import { getDashboardData } from "@/server/actions/os";
import { formatDate } from "@/lib/utils";

export default async function TasksPage() {
  const data = await getDashboardData();
  const { recentTasks } = data;

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={CheckSquare}
          badge="EXECUTION ENGINE"
          title="Tasks & Pipelines"
          description="Granular work items, prioritization matrices, and engineering task execution tracking."
        />

        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#101915] border border-[#25352C]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs font-semibold text-[#F3F7F4]">Filters:</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#142019] text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-medium">
              All Tasks ({recentTasks.length})
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] text-xs font-medium cursor-pointer">
              Urgent
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] text-xs font-medium cursor-pointer">
              In Progress
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] text-xs font-medium cursor-pointer">
              Completed
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              className="glass-card rounded-2xl p-4 sm:p-5 border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                    {task.title}
                  </h3>
                  {task.project && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C]">
                      {task.project.name}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      task.priority === "URGENT"
                        ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30"
                        : task.priority === "HIGH"
                        ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                        : "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                {task.description && (
                  <p className="text-xs text-[#98A69D] leading-relaxed">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-3 pt-1 text-[11px] text-[#98A69D]">
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                      Due: {formatDate(task.dueDate)}
                    </span>
                  )}
                  {task.tags.map((t) => (
                    <span key={t} className="flex items-center gap-0.5 font-mono text-[10px]">
                      <Tag className="w-2.5 h-2.5 text-[#10B981]" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#101915] text-[#98A69D] border border-[#25352C]">
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
