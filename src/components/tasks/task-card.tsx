"use client";

import React from "react";
import { Priority, TaskStatus, TaskSummary } from "@/types";
import {
  CheckCircle2,
  Circle,
  Clock,
  Tag,
  ListChecks,
  Repeat,
  AlertCircle,
  MoreVertical,
  Flame,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/stores/language-store";

interface TaskCardProps {
  task: TaskSummary;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onToggleStatus?: (task: TaskSummary) => void;
  onClick?: (task: TaskSummary) => void;
  onDragStart?: (e: React.DragEvent, taskId: string) => void;
  compact?: boolean;
}

export function TaskCard({
  task,
  isSelected = false,
  onSelect,
  onToggleStatus,
  onClick,
  onDragStart,
  compact = false,
}: TaskCardProps) {
  const { dict, isUz } = useTranslation();
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isInProgress = task.status === TaskStatus.IN_PROGRESS;

  const isOverdue =
    task.dueDate &&
    !isCompleted &&
    new Date(task.dueDate).getTime() < Date.now();

  const subtasksCount = task.subtasks?.length || 0;
  const subtasksDone =
    task.subtasks?.filter((st) => st.completed).length || 0;
  const subtaskProgress =
    subtasksCount > 0 ? Math.round((subtasksDone / subtasksCount) * 100) : 0;

  const priorityConfig = {
    URGENT: {
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/15 border-[#EF4444]/30",
      label: dict.priorities.urgent,
    },
    HIGH: {
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/15 border-[#F59E0B]/30",
      label: dict.priorities.high,
    },
    NORMAL: {
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/15 border-[#10B981]/30",
      label: dict.priorities.normal,
    },
    LOW: {
      color: "text-[#98A69D]",
      bg: "bg-[#142019] border-[#25352C]",
      label: dict.priorities.low,
    },
  }[task.priority || "NORMAL"];

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      className={`glass-card rounded-2xl border transition-all duration-200 group relative ${
        isSelected
          ? "border-[#10B981] bg-[#10B981]/10 emerald-glow-sm"
          : isCompleted
          ? "border-[#25352C]/60 bg-[#101915]/40 opacity-75"
          : "border-[#25352C] bg-[#142019]/90 hover:border-[#10B981]/40 hover:bg-[#142019]"
      } ${compact ? "p-3" : "p-4 sm:p-5"}`}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        {onDragStart && (
          <div className="hidden sm:flex text-[#98A69D]/40 group-hover:text-[#98A69D] cursor-grab active:cursor-grabbing pt-1">
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        {/* Bulk select checkbox */}
        {onSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(task.id, e.target.checked);
            }}
            className="mt-1 w-4 h-4 rounded border-[#25352C] bg-[#101915] text-[#10B981] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#10B981]"
          />
        )}

        {/* Status toggle circle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus?.(task);
          }}
          className="mt-0.5 text-[#98A69D] hover:text-[#10B981] transition-colors cursor-pointer shrink-0"
          title={`Mark ${isCompleted ? "pending" : "completed"}`}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
          ) : isInProgress ? (
            <div className="w-5 h-5 rounded-full border-2 border-[#10B981] border-t-transparent animate-spin" />
          ) : (
            <Circle className="w-5 h-5 text-[#98A69D]/60 hover:text-[#10B981]" />
          )}
        </button>

        {/* Main Content Area */}
        <div
          className="flex-1 min-w-0 cursor-pointer space-y-2"
          onClick={() => onClick?.(task)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <h4
                className={`text-sm font-semibold transition-colors ${
                  isCompleted
                    ? "line-through text-[#98A69D]"
                    : "text-[#F3F7F4] group-hover:text-[#10B981]"
                }`}
              >
                {task.title}
              </h4>

              {task.description && !compact && (
                <p className="text-xs text-[#98A69D] line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>

            {/* Priority Badge */}
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${priorityConfig.bg} ${priorityConfig.color} font-medium`}
            >
              {priorityConfig.label}
            </span>
          </div>

          {/* Subtask Progress Bar (if task has subtasks) */}
          {subtasksCount > 0 && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono">
                <span className="flex items-center gap-1">
                  <ListChecks className="w-3.5 h-3.5 text-[#10B981]" />
                  {subtasksDone}/{subtasksCount} {isUz ? "kichik vazifa" : "subtasks"}
                </span>
                <span>{subtaskProgress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#101915] overflow-hidden">
                <div
                  className="h-full bg-[#10B981] transition-all duration-300 rounded-full"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Badges / Meta row */}
          <div className="flex items-center flex-wrap gap-2 pt-1 text-[11px] text-[#98A69D]">
            {/* Project Pill */}
            {task.project && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C] flex items-center gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: task.project.color || "#10B981" }}
                />
                {task.project.name}
              </span>
            )}

            {/* Category */}
            {task.category && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C]">
                {task.category}
              </span>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <span
                className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded ${
                  isOverdue
                    ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30"
                    : "text-[#98A69D]"
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3 text-[#EF4444]" />
                ) : (
                  <Clock className="w-3 h-3 text-[#10B981]" />
                )}
                {formatDate(task.dueDate)}
              </span>
            )}

            {/* Estimated time */}
            {task.estimatedMinutes && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[#98A69D] bg-[#101915] px-2 py-0.5 rounded border border-[#25352C]">
                <Clock className="w-2.5 h-2.5 text-[#10B981]" />
                {task.actualMinutes ? `${task.actualMinutes}m / ` : ""}
                {task.estimatedMinutes}m
              </span>
            )}

            {/* Recurrence */}
            {task.recurrence && task.recurrence !== "NONE" && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                <Repeat className="w-2.5 h-2.5" />
                {task.recurrence}
              </span>
            )}

            {/* Tags */}
            {task.tags &&
              task.tags.map((tag) => (
                <span
                  key={tag}
                  className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono text-[#98A69D]"
                >
                  <Tag className="w-2.5 h-2.5 text-[#10B981]/70" />
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Right arrow to open details */}
        <button
          type="button"
          onClick={() => onClick?.(task)}
          className="text-[#98A69D]/40 group-hover:text-[#10B981] transition-colors p-1"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
