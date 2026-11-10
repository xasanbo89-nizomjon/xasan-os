"use client";

import React, { useState } from "react";
import { Priority } from "@prisma/client";
import { ProjectSummary } from "@/types";
import { X, Plus, Calendar, Clock, Tag, ListChecks, Sparkles } from "lucide-react";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects?: ProjectSummary[];
  onCreateTask: (data: {
    title: string;
    description?: string;
    category?: string;
    priority?: Priority;
    projectId?: string;
    startDate?: string;
    dueDate?: string;
    estimatedMinutes?: number;
    recurrence?: string;
    tags?: string[];
    subtasks?: string[];
  }) => Promise<void>;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  projects = [],
  onCreateTask,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Dev");
  const [priority, setPriority] = useState<Priority>(Priority.NORMAL);
  const [projectId, setProjectId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [recurrence, setRecurrence] = useState("NONE");
  const [tagsInput, setTagsInput] = useState("");
  const [subtasksInput, setSubtasksInput] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setSubtasksInput([...subtasksInput, newSubtask.trim()]);
    setNewSubtask("");
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasksInput(subtasksInput.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await onCreateTask({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        priority,
        projectId: projectId || undefined,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        recurrence,
        tags,
        subtasks: subtasksInput,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("Dev");
      setPriority(Priority.NORMAL);
      setProjectId("");
      setStartDate("");
      setDueDate("");
      setEstimatedMinutes(45);
      setRecurrence("NONE");
      setTagsInput("");
      setSubtasksInput([]);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl w-full max-w-lg border border-[#25352C] bg-[#101915] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#25352C]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F3F7F4]">
                Create Work Pipeline Item
              </h3>
              <p className="text-xs text-[#98A69D]">
                Define actionable engineering or study deliverables
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
              Title <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Build WebSockets streaming layer"
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-sm text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope, acceptance criteria, or architectural considerations..."
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-2.5 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              >
                <option value="Dev">Dev / Software</option>
                <option value="Study">Study / IELTS</option>
                <option value="Work">Work / Client</option>
                <option value="Health">Health</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-2.5 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value={Priority.LOW}>LOW</option>
                <option value={Priority.NORMAL}>NORMAL</option>
                <option value={Priority.HIGH}>HIGH</option>
                <option value={Priority.URGENT}>URGENT</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-2.5 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              >
                <option value="">No Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#10B981]" /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#10B981]" /> Est. Time (mins)
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              />
            </div>
          </div>

          {/* Subtasks breakdown */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-[#98A69D] uppercase flex items-center gap-1">
              <ListChecks className="w-3 h-3 text-[#10B981]" /> Subtask Milestones
            </label>

            {subtasksInput.length > 0 && (
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {subtasksInput.map((st, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-1.5 px-2.5 rounded-lg bg-[#142019] text-xs text-[#F3F7F4] border border-[#25352C]"
                  >
                    <span>{st}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(i)}
                      className="text-[#98A69D] hover:text-[#EF4444]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask step..."
                className="flex-1 bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (newSubtask.trim()) {
                      setSubtasksInput([...subtasksInput, newSubtask.trim()]);
                      setNewSubtask("");
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => handleAddSubtask(e)}
                className="px-3 py-1.5 rounded-xl bg-[#142019] hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-xs font-semibold"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#10B981]" /> Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. AI, Backend, Latency (comma-separated)"
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#25352C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#142019] hover:bg-[#142019]/80 text-[#98A69D] border border-[#25352C] text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
