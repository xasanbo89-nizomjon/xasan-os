"use client";

import React, { useState } from "react";
import { X, Plus, Flame, Clock, Sparkles } from "lucide-react";

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateHabit: (data: {
    name: string;
    description?: string;
    frequency?: string;
    targetDaysPerWeek?: number;
    targetCount?: number;
    unit?: string;
    category?: string;
    color?: string;
    reminderTime?: string;
  }) => Promise<void>;
}

export function CreateHabitModal({
  isOpen,
  onClose,
  onCreateHabit,
}: CreateHabitModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState("DAILY");
  const [targetDaysPerWeek, setTargetDaysPerWeek] = useState(7);
  const [targetCount, setTargetCount] = useState(1);
  const [unit, setUnit] = useState("times");
  const [category, setCategory] = useState("Productivity");
  const [color, setColor] = useState("#10B981");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = [
    "Education",
    "Health",
    "Fitness",
    "Reading",
    "Personal Development",
    "Productivity",
    "Other",
  ];

  const colors = [
    "#10B981", // Emerald
    "#3B82F6", // Blue
    "#F59E0B", // Amber
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#14B8A6", // Teal
    "#EF4444", // Red
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateHabit({
        name: name.trim(),
        description: description.trim() || undefined,
        frequency,
        targetDaysPerWeek: Number(targetDaysPerWeek),
        targetCount: Number(targetCount),
        unit,
        category,
        color,
        reminderTime: reminderTime || undefined,
      });

      // Reset
      setName("");
      setDescription("");
      setFrequency("DAILY");
      setTargetDaysPerWeek(7);
      setTargetCount(1);
      setUnit("times");
      setCategory("Productivity");
      setColor("#10B981");
      setReminderTime("08:00");
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
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F3F7F4]">
                Create Discipline Protocol
              </h3>
              <p className="text-xs text-[#98A69D]">
                Define a high-leverage daily ritual or weekly discipline habit
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
              Habit Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Deep Architecture & Coding"
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-sm text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
              Description / Standard of Excellence
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Minimum 2 hours uninterrupted deep work session with zero distractions..."
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                Cadence / Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
              </select>
            </div>
          </div>

          {/* Target count & unit */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                Target Value
              </label>
              <input
                type="number"
                min="1"
                value={targetCount}
                onChange={(e) => setTargetCount(Number(e.target.value))}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="minutes, times, pages"
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#10B981]" /> Reminder
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-2.5 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              />
            </div>
          </div>

          {/* Color palette selector */}
          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-3">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-xl transition-all ${
                    color === c ? "ring-2 ring-[#F3F7F4] scale-110" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20"
            >
              <Plus className="w-3.5 h-3.5" />
              {isSubmitting ? "Creating..." : "Establish Protocol"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
