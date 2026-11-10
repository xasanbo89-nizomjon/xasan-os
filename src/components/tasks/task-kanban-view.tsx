"use client";

import React, { useState } from "react";
import { TaskStatus, Priority } from "@prisma/client";
import { TaskSummary } from "@/types";
import { TaskCard } from "./task-card";
import { Plus, ArrowLeft, ArrowRight, Clock, CheckCircle2, Circle } from "lucide-react";

interface TaskKanbanViewProps {
  tasks: TaskSummary[];
  selectedTaskIds: string[];
  onSelectTask: (id: string, selected: boolean) => void;
  onToggleStatus: (task: TaskSummary) => void;
  onOpenTaskDetail: (task: TaskSummary) => void;
  onOpenCreateTask: (status?: TaskStatus) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
}

export function TaskKanbanView({
  tasks,
  selectedTaskIds,
  onSelectTask,
  onToggleStatus,
  onOpenTaskDetail,
  onOpenCreateTask,
  onUpdateTaskStatus,
}: TaskKanbanViewProps) {
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const columns: {
    status: TaskStatus;
    title: string;
    badgeColor: string;
    accentBorder: string;
  }[] = [
    {
      status: TaskStatus.PENDING,
      title: "To Do / Backlog",
      badgeColor: "bg-[#98A69D]/15 text-[#98A69D] border-[#25352C]",
      accentBorder: "border-[#25352C]",
    },
    {
      status: TaskStatus.IN_PROGRESS,
      title: "In Execution",
      badgeColor: "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30",
      accentBorder: "border-[#3B82F6]/40",
    },
    {
      status: TaskStatus.COMPLETED,
      title: "Completed",
      badgeColor: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
      accentBorder: "border-[#10B981]/40",
    },
  ];

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: TaskStatus) => {
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onUpdateTaskStatus(taskId, status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        const totalEstimatedMins = columnTasks.reduce(
          (acc, curr) => acc + (curr.estimatedMinutes || 0),
          0
        );
        const isTarget = dragOverColumn === col.status;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={(e) => handleDragLeave(e, col.status)}
            onDrop={(e) => handleDrop(e, col.status)}
            className={`rounded-2xl bg-[#101915] border p-4 transition-all duration-200 min-h-[500px] flex flex-col ${
              isTarget
                ? "border-[#10B981] bg-[#142019] emerald-glow-sm"
                : "border-[#25352C]"
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#F3F7F4]">
                  {col.title}
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${col.badgeColor}`}
                >
                  {columnTasks.length}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {totalEstimatedMins > 0 && (
                  <span className="text-[10px] font-mono text-[#98A69D] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#10B981]" />
                    {totalEstimatedMins}m
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onOpenCreateTask(col.status)}
                  className="p-1 rounded-lg text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019] transition-colors"
                  title="Add task to this column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {columnTasks.length === 0 ? (
                <div
                  className={`h-36 rounded-xl border border-dashed flex flex-col items-center justify-center text-center p-4 transition-colors ${
                    isTarget
                      ? "border-[#10B981] bg-[#10B981]/5 text-[#10B981]"
                      : "border-[#25352C] text-[#98A69D]"
                  }`}
                >
                  <p className="text-xs font-mono">Drop tasks here</p>
                  <p className="text-[10px] opacity-70 mt-1">or create a new task</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div key={task.id} className="relative group/kanban">
                    <TaskCard
                      task={task}
                      isSelected={selectedTaskIds.includes(task.id)}
                      onSelect={onSelectTask}
                      onToggleStatus={onToggleStatus}
                      onClick={onOpenTaskDetail}
                      onDragStart={handleDragStart}
                      compact={true}
                    />

                    {/* Quick Move Buttons (visible on hover) */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover/kanban:opacity-100 transition-opacity bg-[#101915]/90 rounded-lg p-0.5 border border-[#25352C]">
                      {col.status !== TaskStatus.PENDING && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const prev =
                              col.status === TaskStatus.COMPLETED
                                ? TaskStatus.IN_PROGRESS
                                : TaskStatus.PENDING;
                            onUpdateTaskStatus(task.id, prev);
                          }}
                          className="p-1 rounded text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
                          title="Move left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      )}

                      {col.status !== TaskStatus.COMPLETED && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const next =
                              col.status === TaskStatus.PENDING
                                ? TaskStatus.IN_PROGRESS
                                : TaskStatus.COMPLETED;
                            onUpdateTaskStatus(task.id, next);
                          }}
                          className="p-1 rounded text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019]"
                          title="Advance stage"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
