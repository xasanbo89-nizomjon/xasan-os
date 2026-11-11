"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Check,
  Plus,
  ArrowUpRight,
  Clock,
  AlertCircle,
  Tag,
} from "lucide-react";
import { TaskSummary } from "@/types";
import { formatDate } from "@/lib/utils";
import { createTaskAction } from "@/server/actions/os";
import { useTranslation } from "@/stores/language-store";

interface TodayTasksWidgetProps {
  initialTasks: TaskSummary[];
  onOpenQuickCreate: () => void;
}

export function TodayTasksWidget({
  initialTasks,
  onOpenQuickCreate,
}: TodayTasksWidgetProps) {
  const { dict, isUz } = useTranslation();
  const [tasks, setTasks] = useState<TaskSummary[]>(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const getPriorityLocalized = (p: string) => {
    switch (p) {
      case "URGENT": return dict.priorities.urgent;
      case "HIGH": return dict.priorities.high;
      case "NORMAL": return dict.priorities.normal;
      case "LOW": return dict.priorities.low;
      default: return p;
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === "COMPLETED" ? "PENDING" : "COMPLETED",
            }
          : t
      )
    );
  };

  const handleInlineAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsAdding(true);

    try {
      const res = await createTaskAction({
        title: newTitle,
        priority: "NORMAL",
      });

      if (res.success && res.task) {
        const taskTags = "tags" in res.task && Array.isArray(res.task.tags) ? res.task.tags : [];
        setTasks((prev) => [
          {
            id: res.task.id,
            userId: res.task.userId,
            title: res.task.title,
            priority: res.task.priority,
            status: res.task.status,
            tags: taskTags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
        setNewTitle("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                {dict.dashboard.widgets.todays_priorities}
              </h3>
              <span className="text-[10px] text-[#98A69D]">
                {isUz
                  ? `Ustuvor navbat • ${tasks.filter((t) => t.status !== "COMPLETED").length} ta qoldi`
                  : `Prioritized queue • ${tasks.filter((t) => t.status !== "COMPLETED").length} remaining`}
              </span>
            </div>
          </div>

          <Link
            href="/tasks"
            className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
          >
            {dict.dashboard.actions.view_all_tasks} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Inline Quick Add Input */}
        <form onSubmit={handleInlineAdd} className="mb-3.5">
          <div className="relative">
            <input
              type="text"
              placeholder={isUz ? "+ Vazifa qo‘shing va Enter bosing..." : "+ Quick add task and press Enter..."}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              disabled={isAdding}
              className="w-full pl-3 pr-8 py-2 bg-[#101915] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
            />
            {newTitle && (
              <button
                type="submit"
                className="absolute right-2 top-2 p-1 text-[#10B981] hover:text-[#059669]"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </form>

        {/* Task Items List */}
        <div className="space-y-2.5">
          {tasks.slice(0, 5).map((task) => {
            const isDone = task.status === "COMPLETED";
            return (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group ${
                  isDone
                    ? "bg-[#101915]/40 border-[#25352C]/40 opacity-60"
                    : "bg-[#101915] border-[#25352C] hover:border-[#10B981]/40"
                }`}
              >
                {/* Custom Checkbox */}
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isDone
                      ? "bg-[#10B981] border-[#10B981] text-[#080D0B]"
                      : "border-[#25352C] group-hover:border-[#10B981]"
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isDone
                          ? "line-through text-[#98A69D]"
                          : "text-[#F3F7F4] group-hover:text-[#10B981] transition-colors"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded border shrink-0 ${
                        task.priority === "URGENT"
                          ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30"
                          : task.priority === "HIGH"
                          ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                          : "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                      }`}
                    >
                      {getPriorityLocalized(task.priority)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[10px] text-[#98A69D]">
                    {task.project && (
                      <span className="font-mono text-[9px] px-1.5 bg-[#142019] rounded border border-[#25352C]">
                        {task.project.name}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#10B981]" />
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
