"use client";

import React, { useState } from "react";
import { Priority } from "@/types";
import { X, Plus, Target, Calendar, ListChecks, Sparkles } from "lucide-react";
import { useTranslation } from "@/stores/language-store";

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (data: {
    title: string;
    description?: string;
    category?: string;
    timeframe?: string;
    priority?: Priority;
    targetDate?: string;
    milestones?: string[];
  }) => Promise<void>;
}

export function CreateGoalModal({
  isOpen,
  onClose,
  onCreateGoal,
}: CreateGoalModalProps) {
  const { isUz } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Career");
  const [timeframe, setTimeframe] = useState("ANNUAL");
  const [priority, setPriority] = useState<Priority>(Priority.HIGH);
  const [targetDate, setTargetDate] = useState("");
  const [milestonesInput, setMilestonesInput] = useState<string[]>([]);
  const [newMilestone, setNewMilestone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = isUz
    ? [
        { id: "Education", label: "Ta’lim" },
        { id: "Career", label: "Karyera va Ish" },
        { id: "Finance", label: "Moliya" },
        { id: "Health", label: "Salomatlik" },
        { id: "Technology", label: "Texnologiya" },
        { id: "Personal Development", label: "Shaxsiy rivojlanish" },
        { id: "Travel", label: "Sayohat" },
      ]
    : [
        { id: "Education", label: "Education" },
        { id: "Career", label: "Career" },
        { id: "Finance", label: "Finance" },
        { id: "Health", label: "Health" },
        { id: "Technology", label: "Technology" },
        { id: "Personal Development", label: "Personal Development" },
        { id: "Travel", label: "Travel" },
      ];

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;
    setMilestonesInput([...milestonesInput, newMilestone.trim()]);
    setNewMilestone("");
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestonesInput(milestonesInput.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        timeframe,
        priority,
        targetDate: targetDate || undefined,
        milestones: milestonesInput,
      });

      // Reset
      setTitle("");
      setDescription("");
      setCategory("Career");
      setTimeframe("ANNUAL");
      setPriority(Priority.HIGH);
      setTargetDate("");
      setMilestonesInput([]);
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
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F3F7F4]">
                {isUz ? "Strategik Maqsad va OKR Belgilash" : "Establish Strategic Goal & OKR"}
              </h3>
              <p className="text-xs text-[#98A69D]">
                {isUz
                  ? "Yillik yoki hayotiy katta maqsad va uning asosiy natijalarini belgilang"
                  : "Define major lifelong or annual Objective & Key Results"}
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
              {isUz ? "Maqsad Sarlavhasi" : "Objective Title"} <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isUz ? "Masalan: Tarmoqlangan tizimlar arxitekturasini mukammal o‘rganish" : "e.g. Master High-Scale Distributed Systems Architecture"}
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-sm text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
              {isUz ? "Tavsif / Strategik Sabab" : "Description / Strategic Rationale"}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isUz ? "Nima sababdan bu maqsad muhandislik yoki akademik yuksalish uchun muhim..." : "Why this objective matters to sovereign engineering and academic mastery..."}
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] resize-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                {isUz ? "Kategoriya" : "Category"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-2.5 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                {isUz ? "Muddat" : "Timeframe"}
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-2.5 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value="SHORT_TERM">{isUz ? "Qisqa muddatli" : "Short-Term"}</option>
                <option value="ANNUAL">{isUz ? "Yillik" : "Annual"}</option>
                <option value="LONG_TERM">{isUz ? "Uzoq muddatli" : "Long-Term"}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                {isUz ? "Ustuvorlik" : "Priority"}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-2.5 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value={Priority.LOW}>{isUz ? "PAST" : "LOW"}</option>
                <option value={Priority.NORMAL}>{isUz ? "O‘RTA" : "NORMAL"}</option>
                <option value={Priority.HIGH}>{isUz ? "YUQORI" : "HIGH"}</option>
                <option value={Priority.URGENT}>{isUz ? "SHOSHILINCH" : "URGENT"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#10B981]" />
              <span>{isUz ? "Erishish Sanasi" : "Target Completion Date"}</span>
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
            />
          </div>

          {/* Key Milestones */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-[#98A69D] uppercase flex items-center gap-1">
              <ListChecks className="w-3 h-3 text-[#10B981]" />
              <span>{isUz ? "Bosqichli Marralar va Asosiy Natijalar" : "Key Milestones & Key Results"}</span>
            </label>

            {milestonesInput.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {milestonesInput.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#142019] text-xs text-[#F3F7F4] border border-[#25352C]"
                  >
                    <span>{m}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
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
                value={newMilestone}
                onChange={(e) => setNewMilestone(e.target.value)}
                placeholder={isUz ? "O‘lchanadigan oraliq marra qo‘shing..." : "Add measurable milestone..."}
                className="flex-1 bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (newMilestone.trim()) {
                      setMilestonesInput([...milestonesInput, newMilestone.trim()]);
                      setNewMilestone("");
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-3 py-1.5 rounded-xl bg-[#142019] hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-xs font-semibold"
              >
                {isUz ? "+ Qo‘shish" : "+ Add"}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#25352C]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#142019] hover:bg-[#142019]/80 text-[#98A69D] border border-[#25352C] text-xs font-medium transition-colors"
            >
              {isUz ? "Bekor qilish" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              {isSubmitting ? (isUz ? "Yaratilmoqda..." : "Creating...") : (isUz ? "Maqsadni yaratish" : "Establish Objective")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
