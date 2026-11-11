"use client";

import React, { useState, useEffect } from "react";
import { Priority, TaskStatus, TaskSummary, SubtaskSummary } from "@/types";
import {
  X,
  Calendar,
  Clock,
  ListChecks,
  Plus,
  Trash2,
  Play,
  Save,
  CheckCircle2,
  Circle,
  Repeat,
  Sparkles,
  Tag,
} from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";

interface TaskDetailDrawerProps {
  task: TaskSummary | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: string, updates: any) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
  onCreateSubtask: (taskId: string, title: string) => Promise<void>;
  onToggleSubtask: (subtaskId: string, completed: boolean) => Promise<void>;
  onDeleteSubtask: (subtaskId: string) => Promise<void>;
  onStartFocusOnTask?: (task: TaskSummary) => void;
}

export function TaskDetailDrawer({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onCreateSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onStartFocusOnTask,
}: TaskDetailDrawerProps) {
  const { startFocusSession } = useDashboardStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState<Priority>(Priority.NORMAL);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [dueDate, setDueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [actualMinutes, setActualMinutes] = useState(0);
  const [recurrence, setRecurrence] = useState("NONE");
  const [tagsInput, setTagsInput] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setCategory(task.category || "General");
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "");
      setStartDate(task.startDate ? new Date(task.startDate).toISOString().slice(0, 10) : "");
      setEstimatedMinutes(task.estimatedMinutes || 30);
      setActualMinutes(task.actualMinutes || 0);
      setRecurrence(task.recurrence || "NONE");
      setTagsInput(task.tags?.join(", ") || "");
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await onUpdateTask(task.id, {
        title,
        description,
        category,
        priority,
        status,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        estimatedMinutes: Number(estimatedMinutes),
        actualMinutes: Number(actualMinutes),
        recurrence,
        tags,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setIsDeleting(true);
    try {
      await onDeleteTask(task.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    await onCreateSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle("");
  };

  const handleQuickAddActualMinutes = (mins: number) => {
    setActualMinutes((prev) => prev + mins);
  };

  const handleStartFocus = () => {
    if (onStartFocusOnTask) {
      onStartFocusOnTask(task);
    } else {
      startFocusSession(25);
    }
    onClose();
  };

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 flex justify-end">
      <div className="w-full max-w-xl bg-[#101915] border-l border-[#25352C] h-full overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-[#25352C] flex items-center justify-between sticky top-0 bg-[#101915]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#10B981] font-semibold">
              TASK SPECIFICATION
            </span>
            {task.project && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142019] text-[#98A69D] border border-[#25352C]">
                {task.project.name}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value={TaskStatus.PENDING}>PENDING</option>
                <option value={TaskStatus.IN_PROGRESS}>IN_PROGRESS</option>
                <option value={TaskStatus.COMPLETED}>COMPLETED</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value={Priority.LOW}>LOW</option>
                <option value={Priority.NORMAL}>NORMAL</option>
                <option value={Priority.HIGH}>HIGH</option>
                <option value={Priority.URGENT}>URGENT</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2.5 text-sm text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-medium"
              placeholder="e.g., Implement SuperMemo-2 SRS algorithm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
              Description / Engineering Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] leading-relaxed resize-none"
              placeholder="Detail technical requirements, architecture constraints, or references..."
            />
          </div>

          {/* Category & Recurrence */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Dev">Dev / Software</option>
                <option value="Study">Study / IELTS</option>
                <option value="Health">Health / Discipline</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
                Recurrence
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value="NONE">None</option>
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
              </select>
            </div>
          </div>

          {/* Dates: Start & Due */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#10B981]" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#10B981]" /> Due Date / Deadline
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              />
            </div>
          </div>

          {/* Time Tracking: Estimated vs Actual */}
          <div className="p-4 rounded-xl bg-[#142019] border border-[#25352C] space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#F3F7F4]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#10B981]" /> Time Telemetry
              </span>
              <span className="font-mono text-[11px] text-[#98A69D]">
                {actualMinutes}m spent / {estimatedMinutes}m est.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-[#98A69D] block mb-1">
                  Est. Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  className="w-full bg-[#101915] border border-[#25352C] rounded-lg px-2.5 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#98A69D] block mb-1">
                  Actual Minutes
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={actualMinutes}
                  onChange={(e) => setActualMinutes(Number(e.target.value))}
                  className="w-full bg-[#101915] border border-[#25352C] rounded-lg px-2.5 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                />
              </div>
            </div>

            {/* Quick add buttons */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-[#98A69D]">Quick add:</span>
              <button
                type="button"
                onClick={() => handleQuickAddActualMinutes(15)}
                className="px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[10px] font-mono text-[#10B981] transition-colors"
              >
                +15m
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddActualMinutes(25)}
                className="px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[10px] font-mono text-[#10B981] transition-colors"
              >
                +25m
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddActualMinutes(50)}
                className="px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[10px] font-mono text-[#10B981] transition-colors"
              >
                +50m
              </button>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-[#98A69D] uppercase flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-[#10B981]" /> Subtask Checklist ({completedSubtasks}/{subtasks.length})
              </label>
            </div>

            {/* Subtask list */}
            <div className="space-y-1.5">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#142019] border border-[#25352C] group"
                >
                  <button
                    type="button"
                    onClick={() => onToggleSubtask(st.id, st.completed)}
                    className="flex items-center gap-2.5 text-xs text-left flex-1 min-w-0"
                  >
                    {st.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#98A69D] shrink-0 group-hover:text-[#10B981]" />
                    )}
                    <span
                      className={`truncate ${
                        st.completed ? "line-through text-[#98A69D]" : "text-[#F3F7F4]"
                      }`}
                    >
                      {st.title}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteSubtask(st.id)}
                    className="p-1 rounded text-[#98A69D] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Add actionable subtask..."
                className="flex-1 bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-3 py-1.5 rounded-xl bg-[#10B981] text-[#080D0B] hover:bg-[#059669] text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#10B981]" /> Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              placeholder="AI, Audio, Backend, Architecture"
            />
          </div>

          {/* Quick Focus Mode Action */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#10B981]/10 to-[#101915] border border-[#10B981]/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-[#F3F7F4] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                Hyperfocus Deep Work Session
              </div>
              <p className="text-[11px] text-[#98A69D]">
                Enter distraction-free Pomodoro mode focused on this task.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartFocus}
              className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Focus Now
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#25352C] bg-[#101915]/95 backdrop-blur-md flex items-center justify-between gap-3 sticky bottom-0 z-10">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#142019] hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 text-xs font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Task
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#142019] hover:bg-[#142019]/80 text-[#98A69D] border border-[#25352C] text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-[#10B981]/20"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
