"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckSquare,
  Sparkles,
  Layers,
  CircleDollarSign,
  BookOpen,
  Check,
  AlertCircle,
  Bell,
} from "lucide-react";
import { useTasksStore } from "@/stores/tasks-store";
import { useHabitsStore } from "@/stores/habits-store";
import { useDeveloperStore } from "@/stores/developer-store";
import { useFinanceStore } from "@/stores/finance-store";
import { useKnowledgeStore } from "@/stores/knowledge-store";
import { useCalendarStore } from "@/stores/calendar-store";
import { Priority, TransactionType } from "@/types";
import { useTranslation } from "@/stores/language-store";

interface QuickCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType?: string;
}

type ActionCategory = "task" | "reminder" | "habit" | "project" | "transaction" | "note";

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

  // Synchronize activeTab when initialType changes upon opening
  useEffect(() => {
    if (open && initialType) {
      if (initialType === "reminder") {
        setActiveTab("reminder");
      } else if (["task", "habit", "project", "transaction", "note"].includes(initialType)) {
        setActiveTab(initialType as ActionCategory);
      }
    }
  }, [open, initialType]);

  // Form states
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<Priority>("NORMAL");
  const [taskDueDate, setTaskDueDate] = useState("");

  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDateTime, setReminderDateTime] = useState("");
  const [reminderCategory, setReminderCategory] = useState("General");

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
      } else if (activeTab === "reminder") {
        if (!reminderTitle.trim()) throw new Error(isUz ? "Eslatma matnini kiriting" : "Reminder title is required");
        useCalendarStore.getState().addReminder({
          title: reminderTitle,
          dueDateTime: reminderDateTime || new Date().toISOString(),
          category: reminderCategory,
        });
        setReminderTitle("");
        setReminderDateTime("");
        setSuccessMessage(isUz ? "Eslatma muvaffaqiyatli saqlandi!" : "Reminder saved!");
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
    { id: "reminder", label: isUz ? "Eslatma" : "Reminder", icon: Bell },
    { id: "habit", label: dict.quick_create.habit, icon: Sparkles },
    { id: "project", label: dict.quick_create.project, icon: Layers },
    { id: "transaction", label: dict.quick_create.transaction, icon: CircleDollarSign },
    { id: "note", label: dict.quick_create.note, icon: BookOpen },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070B14]/80 backdrop-blur-md transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#0D1527] border border-[#1E2D4D] rounded-2xl shadow-2xl overflow-hidden z-10 shadow-[#0284C7]/10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2D4D]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse" />
            <h2 className="text-base font-semibold text-[#F1F5F9]">
              {dict.quick_create.dialog_title}
            </h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-[#94A3B8] hover:text-[#F1F5F9] p-1 rounded-lg hover:bg-[#070B14] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[#1E2D4D] bg-[#070B14]/60 p-1.5 gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id as ActionCategory);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 min-w-[70px] py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#0D1527] text-[#38BDF8] border border-[#1E2D4D] shadow-sm font-bold"
                    : "text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#070B14]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {successMessage && (
            <div className="p-3 rounded-xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] text-xs flex items-center gap-2">
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
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  {isUz ? "Vazifa sarlavhasi *" : "Task Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: IELTS reading practice" : "e.g. Deploy Whisper speech model endpoint"}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  {dict.common.description}
                </label>
                <textarea
                  rows={2}
                  placeholder={dict.quick_create.description_placeholder}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    {isUz ? "Muhimlik" : "Priority"}
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="LOW">{dict.priorities.low}</option>
                    <option value="NORMAL">{dict.priorities.normal}</option>
                    <option value="HIGH">{dict.priorities.high}</option>
                    <option value="URGENT">{dict.priorities.urgent}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    {isUz ? "Muddati" : "Due Date"}
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "reminder" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  {isUz ? "Eslatma matni *" : "Reminder Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: Muhim uchrashuv yoki imtihon..." : "e.g. IELTS mock test at 14:00"}
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    {isUz ? "Vaqti" : "Date & Time"}
                  </label>
                  <input
                    type="datetime-local"
                    value={reminderDateTime}
                    onChange={(e) => setReminderDateTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    {isUz ? "Kategoriya" : "Category"}
                  </label>
                  <select
                    value={reminderCategory}
                    onChange={(e) => setReminderCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="General">{isUz ? "Umumiy" : "General"}</option>
                    <option value="Dev">Dev / IT</option>
                    <option value="Study">{isUz ? "O‘qish" : "Study"}</option>
                    <option value="Health">{isUz ? "Salomatlik" : "Health"}</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === "habit" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  {isUz ? "Odat nomi *" : "Habit Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: Kitob o'qish 30 daqiqa" : "e.g. IELTS Academic Reading 45m"}
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    {dict.common.category}
                  </label>
                  <select
                    value={habitCategory}
                    onChange={(e) => setHabitCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="DISCIPLINE">{isUz ? "Intizom" : "DISCIPLINE"}</option>
                    <option value="CODE">{isUz ? "Dasturlash" : "CODE"}</option>
                    <option value="STUDY">{isUz ? "Ta'lim" : "STUDY"}</option>
                    <option value="HEALTH">{isUz ? "Salomatlik" : "HEALTH"}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    {isUz ? "Davriylik" : "Target"}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={isUz ? "Har kuni (Haftada 7 kun)" : "Daily (7 days/week)"}
                    className="w-full px-3 py-2 bg-[#070B14]/50 border border-[#1E2D4D] rounded-xl text-xs text-[#94A3B8]"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "project" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  {isUz ? "Loyiha nomi *" : "Project Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: Aurelius IELTS, LinguaHub, Ravon Avto" : "e.g. Aurelius IELTS, LinguaHub, Ravon Avto"}
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  {isUz ? "Texnologiyalar (vergul bilan)" : "Tech Stack (comma-separated)"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Next.js 16, TypeScript, Tailwind"
                  value={projectTechStack}
                  onChange={(e) => setProjectTechStack(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>
            </>
          )}

          {activeTab === "transaction" && (
            <>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  {isUz ? "Tranzaksiya nomi *" : "Transaction Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: Server hosting to'lovi" : "e.g. AWS Cloud GPU instances"}
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    {dict.common.amount} ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="250.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                    {dict.common.type}
                  </label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as TransactionType)}
                    className="w-full px-3 py-2 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8]"
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
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  {isUz ? "Qayd sarlavhasi *" : "Note Title *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isUz ? "Masalan: Yangi g'oya yoki reja" : "e.g. System Design: Event-Driven Kafka architecture"}
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">
                  {isUz ? "Mazmuni (Markdown / Qaydlar)" : "Content (Markdown / Notes)"}
                </label>
                <textarea
                  rows={3}
                  placeholder={isUz ? "Asosiy tushunchalar, arxitektura diagrammalari..." : "Key concepts, architecture notes, equations..."}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#070B14] border border-[#1E2D4D] rounded-xl text-sm text-[#F1F5F9] placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] transition-colors resize-none"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1E2D4D]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#070B14] transition-colors cursor-pointer"
            >
              {dict.quick_create.cancel_button}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#38BDF8] text-[#060A12] hover:bg-[#60A5FA] transition-all shadow-md shadow-[#0284C7]/20 disabled:opacity-50 cursor-pointer font-bold"
            >
              {isSubmitting ? (isUz ? "Yaratilmoqda..." : "Creating...") : dict.quick_create.submit_button}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
