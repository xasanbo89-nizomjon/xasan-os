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
import { useTasksStore } from "@/stores/tasks-store";
import { useHabitsStore } from "@/stores/habits-store";
import { useDeveloperStore } from "@/stores/developer-store";
import { useFinanceStore } from "@/stores/finance-store";
import { useKnowledgeStore } from "@/stores/knowledge-store";
import { Priority, TransactionType } from "@/types";
import { useTranslation } from "@/stores/language-store";

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
  const { dict, isUz } = useTranslation();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (activeTab === "task") {
        if (!taskTitle.trim()) throw new Error(isUz ? "Vazifa sarlavhasini kiriting" : "Task title is required");
        useTasksStore.getState().addTask({
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          dueDate: taskDueDate || undefined,
        });
        setTaskTitle("");
        setTaskDescription("");
        setSuccessMessage(dict.toast.task_created);
      } else if (activeTab === "habit") {
        if (!habitName.trim()) throw new Error(isUz ? "Odat nomini kiriting" : "Habit name is required");
        useHabitsStore.getState().addHabit({
          name: habitName,
          description: habitDescription,
          category: habitCategory,
        });
        setHabitName("");
        setHabitDescription("");
        setSuccessMessage(dict.toast.habit_logged);
      } else if (activeTab === "project") {
        if (!projectName.trim()) throw new Error(isUz ? "Loyiha nomini kiriting" : "Project name is required");
        useDeveloperStore.getState().addProject({
          name: projectName,
          slug: projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: projectDescription,
          techStack: projectTechStack ? projectTechStack.split(",").map((s) => s.trim()) : [],
        });
        setProjectName("");
        setProjectDescription("");
        setProjectTechStack("");
        setSuccessMessage(isUz ? "Loyiha muvaffaqiyatli yaratildi!" : "Project created!");
      } else if (activeTab === "transaction") {
        if (!txTitle.trim() || !txAmount) throw new Error(isUz ? "Sarlavha va summa kiritilishi shart" : "Title and amount are required");
        useFinanceStore.getState().addTransaction({
          title: txTitle,
          amount: parseFloat(txAmount),
          type: txType,
          category: txCategory,
        });
        setTxTitle("");
        setTxAmount("");
        setSuccessMessage(isUz ? "Tranzaksiya muvaffaqiyatli saqlandi!" : "Transaction recorded!");
      } else if (activeTab === "note") {
        if (!noteTitle.trim()) throw new Error(isUz ? "Qayd sarlavhasini kiriting" : "Note title is required");
        useKnowledgeStore.getState().addNote({
          title: noteTitle,
          content: noteContent,
          category: noteCategory,
        });
        setNoteTitle("");
        setNoteContent("");
        setSuccessMessage(isUz ? "Bilim qaydi saqlandi!" : "Knowledge Note saved!");
      }

      setTimeout(() => {
        onOpenChange(false);
        setSuccessMessage(null);
      }, 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (isUz ? "Xatolik yuz berdi" : "An error occurred");
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "task", label: dict.quick_create.task, icon: CheckSquare },
    { id: "habit", label: dict.quick_create.habit, icon: Sparkles },
    { id: "project", label: dict.quick_create.project, icon: Layers },
    { id: "transaction", label: dict.quick_create.transaction, icon: CircleDollarSign },
    { id: "note", label: dict.quick_create.note, icon: BookOpen },
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
              {dict.quick_create.dialog_title}
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
                  {isUz ? "Vazifa sarlavhasi *" : "Task Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: Whisper modelini sozlash" : "e.g. Deploy Whisper speech model endpoint"}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  {dict.common.description}
                </label>
                <textarea
                  rows={2}
                  placeholder={dict.quick_create.description_placeholder}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    {isUz ? "Muhimlik" : "Priority"}
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-[#142019] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="LOW">{dict.priorities.low}</option>
                    <option value="NORMAL">{dict.priorities.normal}</option>
                    <option value="HIGH">{dict.priorities.high}</option>
                    <option value="URGENT">{dict.priorities.urgent}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    {isUz ? "Muddati" : "Due Date"}
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
                  {isUz ? "Odat nomi *" : "Habit Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: IELTS Academic Reading 45 daq" : "e.g. IELTS Academic Reading 45m"}
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    {dict.common.category}
                  </label>
                  <select
                    value={habitCategory}
                    onChange={(e) => setHabitCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#142019] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="DISCIPLINE">{isUz ? "Intizom" : "DISCIPLINE"}</option>
                    <option value="CODE">{isUz ? "Dasturlash" : "CODE"}</option>
                    <option value="STUDY">{isUz ? "Ta'lim" : "STUDY"}</option>
                    <option value="HEALTH">{isUz ? "Salomatlik" : "HEALTH"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    {isUz ? "Davriylik" : "Target"}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={isUz ? "Har kuni (Haftada 7 kun)" : "Daily (7 days/week)"}
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
                  {isUz ? "Loyiha nomi *" : "Project Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: Aurelius IELTS, LinguaHub, Ravon Avto" : "e.g. Aurelius IELTS, LinguaHub, Ravon Avto"}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  {isUz ? "Texnologiyalar (vergul bilan)" : "Tech Stack (comma-separated)"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js 16, TypeScript, Tailwind"
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
                  {isUz ? "Tranzaksiya nomi *" : "Transaction Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: AWS Cloud GPU hisobi" : "e.g. AWS Cloud GPU instances"}
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                    {dict.common.amount} ($) *
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
                    {dict.common.type}
                  </label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 bg-[#142019] border border-[#25352C] rounded-xl text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="EXPENSE">{isUz ? "Xarajat (Expense)" : "EXPENSE"}</option>
                    <option value="INCOME">{isUz ? "Daromad (Income)" : "INCOME"}</option>
                    <option value="TRANSFER">{isUz ? "O‘tkazma (Transfer)" : "TRANSFER"}</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === "note" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  {isUz ? "Qayd sarlavhasi *" : "Note Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: Event-Driven Kafka arxitekturasi" : "e.g. System Design: Event-Driven Kafka architecture"}
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-sm text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                  {isUz ? "Mazmuni (Markdown / Qaydlar)" : "Content (Markdown / Notes)"}
                </label>
                <textarea
                  rows={3}
                  placeholder={isUz ? "Asosiy tushunchalar, arxitektura diagrammalari..." : "Key concepts, architecture notes, equations..."}
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
              {dict.quick_create.cancel_button}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all shadow-md shadow-[#10B981]/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (isUz ? "Yaratilmoqda..." : "Creating...") : dict.quick_create.submit_button}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
