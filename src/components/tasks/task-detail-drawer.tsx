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
import { useTranslation } from "@/stores/language-store";

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
  const { dict, isUz } = useTranslation();
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
    if (!confirm(dict.tasks.drawer.delete_confirm)) return;
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
              {dict.tasks.drawer.details}
            </span>
            {task.project && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#142019] text-[#98A69D] border border-[#25352C]">
                {task.project.name}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors cursor-pointer"
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
                {dict.tasks.drawer.status_label}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value={TaskStatus.PENDING}>{dict.statuses.pending}</option>
                <option value={TaskStatus.IN_PROGRESS}>{dict.statuses.in_progress}</option>
                <option value={TaskStatus.COMPLETED}>{dict.statuses.completed}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
                {dict.tasks.modal.priority}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value={Priority.LOW}>{dict.priorities.low}</option>
                <option value={Priority.NORMAL}>{dict.priorities.normal}</option>
                <option value={Priority.HIGH}>{dict.priorities.high}</option>
                <option value={Priority.URGENT}>{dict.priorities.urgent}</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
              {dict.tasks.modal.task_title}
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
              {dict.common.description}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] leading-relaxed resize-none"
              placeholder={dict.tasks.modal.description_placeholder}
            />
          </div>

          {/* Category & Recurrence */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
                {dict.tasks.modal.category}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              >
                <option value="General">{isUz ? "Umumiy" : "General"}</option>
                <option value="Work">{isUz ? "Ish" : "Work"}</option>
                <option value="Dev">{isUz ? "Dasturlash" : "Dev / Software"}</option>
                <option value="Study">{isUz ? "Ta'lim" : "Study / IELTS"}</option>
                <option value="Health">{isUz ? "Salomatlik" : "Health / Discipline"}</option>
                <option value="Personal">{isUz ? "Shaxsiy" : "Personal"}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
                {isUz ? "Davriylik" : "Recurrence"}
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value="NONE">{isUz ? "Yo‘q" : "None"}</option>
                <option value="DAILY">{isUz ? "Har kuni" : "Daily"}</option>
                <option value="WEEKLY">{isUz ? "Haftalik" : "Weekly"}</option>
                <option value="MONTHLY">{isUz ? "Oylik" : "Monthly"}</option>
              </select>
            </div>
          </div>

          {/* Dates: Start & Due */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#10B981]" /> {isUz ? "Boshlanish sanasi" : "Start Date"}
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
                <Calendar className="w-3 h-3 text-[#10B981]" /> {dict.tasks.modal.due_date}
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
                <Clock className="w-4 h-4 text-[#10B981]" /> {isUz ? "Sarflangan Vaqt" : "Time Telemetry"}
              </span>
              <span className="font-mono text-[11px] text-[#98A69D]">
                {actualMinutes}{isUz ? " daq sarflandi / " : "m spent / "}{estimatedMinutes}{isUz ? " daq reja" : "m est."}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Rejalashtirilgan (daq)" : "Est. Minutes"}
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
                  {isUz ? "Amaldagi vaqt (daq)" : "Actual Minutes"}
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
              <span className="text-[10px] font-mono text-[#98A69D]">{isUz ? "Tez qo‘shish:" : "Quick add:"}</span>
              <button
                type="button"
                onClick={() => handleQuickAddActualMinutes(15)}
                className="px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[10px] font-mono text-[#10B981] transition-colors cursor-pointer"
              >
                +15m
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddActualMinutes(25)}
                className="px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[10px] font-mono text-[#10B981] transition-colors cursor-pointer"
              >
                +25m
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddActualMinutes(50)}
                className="px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[10px] font-mono text-[#10B981] transition-colors cursor-pointer"
              >
                +50m
              </button>
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-mono text-[#98A69D] uppercase flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-[#10B981]" /> {dict.tasks.modal.subtasks_title} ({completedSubtasks}/{subtasks.length})
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
                    className="flex items-center gap-2.5 text-xs text-left flex-1 min-w-0 cursor-pointer"
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
                    className="p-1 rounded text-[#98A69D] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                placeholder={dict.tasks.modal.subtask_placeholder}
                className="flex-1 bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              />
              <button
                type="submit"
                disabled={!newSubtaskTitle.trim()}
                className="px-3 py-1.5 rounded-xl bg-[#10B981] text-[#080D0B] hover:bg-[#059669] text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> {dict.tasks.modal.add_subtask}
              </button>
            </form>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#10B981]" /> {dict.common.tags}
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
                {dict.tasks.drawer.start_focus}
              </div>
              <p className="text-[11px] text-[#98A69D]">
                {isUz
                  ? "Ushbu vazifaga diqqatni jamlab, shovqinsiz Pomodoro rejimini yoqing."
                  : "Enter distraction-free Pomodoro mode focused on this task."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartFocus}
              className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isUz ? "Fokusni boshlash" : "Focus Now"}
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
            {isUz ? "Vazifani o‘chirish" : "Delete Task"}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#142019] hover:bg-[#142019]/80 text-[#98A69D] border border-[#25352C] text-xs font-medium transition-colors cursor-pointer"
            >
              {dict.common.cancel}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-md shadow-[#10B981]/20"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? (isUz ? "Saqlanmoqda..." : "Saving...") : dict.common.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
