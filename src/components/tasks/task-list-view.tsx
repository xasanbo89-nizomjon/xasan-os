"use client";

import React, { useState } from "react";
import { TaskSummary } from "@/types";
import { TaskCard } from "./task-card";
import { CheckSquare, ListChecks, Plus } from "lucide-react";

interface TaskListViewProps {
  tasks: TaskSummary[];
  selectedTaskIds: string[];
  onSelectTask: (id: string, selected: boolean) => void;
  onToggleStatus: (task: TaskSummary) => void;
  onOpenTaskDetail: (task: TaskSummary) => void;
  onOpenCreateTask: () => void;
}

export function TaskListView({
  tasks,
  selectedTaskIds,
  onSelectTask,
  onToggleStatus,
  onOpenTaskDetail,
  onOpenCreateTask,
}: TaskListViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center border border-[#25352C] bg-[#101915]/50 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981]">
          <CheckSquare className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-[#F3F7F4]">
          No Tasks In This Pipeline
        </h3>
        <p className="text-xs text-[#98A69D] max-w-sm">
          All items are either completed or matching filter conditions have no results.
        </p>
        <button
          type="button"
          onClick={onOpenCreateTask}
          className="mt-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Task
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isSelected={selectedTaskIds.includes(task.id)}
          onSelect={onSelectTask}
          onToggleStatus={onToggleStatus}
          onClick={onOpenTaskDetail}
        />
      ))}
    </div>
  );
}
