"use client";

import React, { useState } from "react";
import {
  X,
  CheckSquare,
  Sparkles,
  Layers,
  CircleDollarSign,
  BookOpen,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  createTaskAction,
  createHabitAction,
  createProjectAction,
  createTransactionAction,
  createKnowledgeNoteAction,
} from "@/server/actions/os";
import { Priority, TransactionType } from "@/types";

interface QuickCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: string;
}

type ActionCategory = "task" | "habit" | "project" | "transaction" | "note";

export function QuickCreateDialog({
  open,
  onOpenChange,
  initialType = "task",
}: QuickCreateDialogProps) {
  const [activeTab, setActiveTab] = useState<ActionCategory>(
    (initialType as ActionCategory) || "task"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<Priority>("NORMAL");
  const [taskDueDate, setTaskDueDate] = useState("");

  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [habitCategory, setHabitCategory] = useState("DISCIPLINE");

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTechStack, setProjectTechStack] = useState("");

  const [txTitle, setTxTitle] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txType, setTxType] = useState<TransactionType>("EXPENSE");
  const [txCategory, setTxCategory] = useState("Cloud Compute");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("Architecture");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (activeTab === "task") {
        if (!taskTitle.trim()) throw new Error("Task title is required");
        const res = await createTaskAction({
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          dueDate: taskDueDate || undefined,
        });
        if (!res.success) throw new Error(res.error || "Failed to create task");
        setTaskTitle("");
        setTaskDescription("");
        setSuccessMessage("Task created successfully!");
      } else if (activeTab === "habit") {
        if (!habitName.trim()) throw new Error("Habit name is required");
        const res = await createHabitAction({
          name: habitName,
          description: habitDescription,
          category: habitCategory,
        });
        if (!res.success) throw new Error(res.error || "Failed to create habit");
        setHabitName("");
        setHabitDescription("");
        setSuccessMessage("Habit registered!");
      } else if (activeTab === "project") {
        if (!projectName.trim()) throw new Error("Project name is required");
        const res = await createProjectAction({
          name: projectName,
          slug: projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: projectDescription,
          techStack: projectTechStack ? projectTechStack.split(",").map((s) => s.trim()) : [],
        });
        if (!res.success) throw new Error(res.error || "Failed to create project");
        setProjectName("");
        setProjectDescription("");
        setProjectTechStack("");
        setSuccessMessage("Project created!");
      } else if (activeTab === "transaction") {
        if (!txTitle.trim() || !txAmount) throw new Error("Title and amount are required");
        const res = await createTransactionAction({
          title: txTitle,
          amount: parseFloat(txAmount),
          type: txType,
          category: txCategory,
        });
        if (!res.success) throw new Error(res.error || "Failed to record transaction");
        setTxTitle("");
        setTxAmount("");
        setSuccessMessage("Transaction recorded!");
      } else if (activeTab === "note") {
        if (!noteTitle.trim()) throw new Error("Note title is required");
        const res = await createKnowledgeNoteAction({
          title: noteTitle,
          content: noteContent,
          category: noteCategory,
        });
        if (!res.success) throw new Error(res.error || "Failed to save note");
        setNoteTitle("");
        setNoteContent("");
        setSuccessMessage("Knowledge Note saved!");
      }

      setTimeout(() => {
        onOpenChange(false);
        setSuccessMessage(null);
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "task", label: "Task", icon: CheckSquare },
    { id: "habit", label: "Habit", icon: Sparkles },
    { id: "project", label: "Project", icon: Layers },
    { id: "transaction", label: "Transaction", icon: CircleDollarSign },
    { id: "note", label: "Note", icon: BookOpen },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080D0B]/80 backdrop-blur-md transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#101915] border border-[#25352C] rounded-2xl shadow-2xl overflow-hidden z-10 emerald-glow">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#25352C]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <h2 className="text-base font-semibold text-[#F3F7F4]">
              Quick Create
            </h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-[#98A69D] hover:text-[#F3F7F4] p-1 rounded-lg hover:bg-[#142019] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#25352C] bg-[#080D0B]/60 p-1.5 gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 min-w-[75px] py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#142019] text-[#10B981] border border-[#25352C] shadow-sm"
                    : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019]/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMessage && (
            <div className="p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === "task" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deploy Whisper speech model endpoint"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Additional context or acceptance criteria..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-[#142019] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="LOW">LOW</option>
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#142019] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "habit" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IELTS Academic Reading 45m"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    Category
                  </label>
                  <select
                    value={habitCategory}
                    onChange={(e) => setHabitCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#142019] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="DISCIPLINE">DISCIPLINE</option>
                    <option value="CODE">CODE</option>
                    <option value="STUDY">STUDY</option>
                    <option value="HEALTH">HEALTH</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    Target
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Daily (7 days/week)"
                    className="w-full px-3 py-2 bg-[#142019]/50 border border-[#25352C] rounded-xl text-xs text-[#98A69D]"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "project" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aurelius IELTS, LinguaHub, Ravon Avto"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js 16, TypeScript, PostgreSQL, Tailwind"
                  value={projectTechStack}
                  onChange={(e) => setProjectTechStack(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>
            </>
          )}

          {activeTab === "transaction" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  Transaction Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Cloud GPU instances"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    Amount ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="250.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#142019] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    Type
                  </label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 bg-[#142019] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="EXPENSE">EXPENSE</option>
                    <option value="INCOME">INCOME</option>
                    <option value="TRANSFER">TRANSFER</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === "note" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Design: Event-Driven Kafka architecture"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  Content (Markdown / Notes)
                </label>
                <textarea
                  rows={3}
                  placeholder="Key concepts, architecture notes, equations..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors resize-none"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all shadow-md shadow-[#10B981]/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Confirm & Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
