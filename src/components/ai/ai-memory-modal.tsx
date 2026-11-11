"use client";

import React, { useState } from "react";
import {
  Brain,
  X,
  Plus,
  Trash2,
  Tag,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
} from "lucide-react";
import { AiUserMemorySummary } from "@/types";
import { saveAiMemoryAction, deleteAiMemoryAction } from "@/server/actions/ai-chat";
import { useTranslation } from "@/stores/language-store";

interface AiMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: AiUserMemorySummary[];
  onMemoriesUpdated: (updated: AiUserMemorySummary[]) => void;
}

export function AiMemoryModal({
  isOpen,
  onClose,
  memories,
  onMemoriesUpdated,
}: AiMemoryModalProps) {
  const { isUz } = useTranslation();
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newCategory, setNewCategory] = useState("PREFERENCE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: "PREFERENCE", label: isUz ? "Afzallik" : "PREFERENCE" },
    { id: "GOAL", label: isUz ? "Maqsad" : "GOAL" },
    { id: "CONSTRAINT", label: isUz ? "Cheklov" : "CONSTRAINT" },
    { id: "STYLE", label: isUz ? "Uslub" : "STYLE" },
  ];

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await saveAiMemoryAction({
        key: newKey.trim(),
        value: newValue.trim(),
        category: newCategory,
      });

      if (res.success) {
        const newMemoryItem: AiUserMemorySummary = {
          id: `mem-${Date.now()}`,
          userId: "demo-user-uuid-1",
          category: newCategory,
          key: newKey.trim(),
          value: newValue.trim(),
          isPinned: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const existingIdx = memories.findIndex((m) => m.key === newKey.trim());
        if (existingIdx >= 0) {
          const updated = [...memories];
          updated[existingIdx] = newMemoryItem;
          onMemoriesUpdated(updated);
        } else {
          onMemoriesUpdated([newMemoryItem, ...memories]);
        }

        setNewKey("");
        setNewValue("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteAiMemoryAction(id);
    onMemoriesUpdated(memories.filter((m) => m.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#101915] border border-[#25352C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-[#25352C] bg-[#080D0B] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
                {isUz ? "AI kognitiv xotirasi va afzalliklari" : "AI Cognitive Memory & Preferences"}
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                {isUz
                  ? "Har bir avtonom muloqotga avtomatik qo‘shiladigan doimiy shaxsiy kontekst."
                  : "Persistent sovereign context injected into every autonomous reasoning turn."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Add New Memory Section */}
          <form
            onSubmit={handleAddMemory}
            className="p-4 rounded-xl bg-[#080D0B] border border-[#25352C] space-y-3"
          >
            <div className="flex items-center justify-between text-xs font-mono font-semibold text-[#10B981]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {isUz ? "Doimiy parametr qo‘shish" : "Add Persistent Context Invariant"}
              </span>
              <span className="text-[10px] text-[#98A69D]">{isUz ? "Shifrlangan • Alohida xotirada" : "Encrypted • User Isolated"}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder={isUz ? "Kalit so‘z (Masalan: Maqsadli ball)" : "Key / Topic (e.g. Target Band)"}
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="bg-[#142019] text-xs text-[#F3F7F4] placeholder-[#98A69D] px-3 py-2 rounded-lg border border-[#25352C] focus:outline-none focus:border-[#10B981]"
                required
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="bg-[#142019] text-xs text-[#F3F7F4] px-3 py-2 rounded-lg border border-[#25352C] focus:outline-none focus:border-[#10B981]"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={isSubmitting || !newKey.trim() || !newValue.trim()}
                className="bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isUz ? "Saqlash" : "Save Invariant"}</span>
              </button>
            </div>

            <textarea
              placeholder={isUz ? "Qiymat / Qoida (Masalan: 'Writing Task 2 da qat'iy akademik uslubda yozish')" : "Value / Constraint (e.g. 'Target overall 8.5 with strict lexical hedging in Academic Writing Task 2.')"}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              rows={2}
              className="w-full bg-[#142019] text-xs text-[#F3F7F4] placeholder-[#98A69D] p-3 rounded-lg border border-[#25352C] focus:outline-none focus:border-[#10B981] resize-none"
              required
            />
          </form>

          {/* Active Memories List */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono font-semibold text-[#98A69D] uppercase tracking-wider px-1">
              {isUz ? "Faol saqlangan xotiralar" : "Active Stored Memories"} ({memories.length})
            </h4>

            {memories.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#98A69D]">
                {isUz ? "Hozircha saqlangan xotiralar mavjud emas." : "No memory invariants defined yet."}
              </div>
            ) : (
              memories.map((mem) => (
                <div
                  key={mem.id}
                  className="glass-card rounded-xl p-3.5 border border-[#25352C] flex items-start justify-between gap-3 group hover:border-[#10B981]/40 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#080D0B] text-[#10B981] border border-[#10B981]/30">
                        {categories.find((c) => c.id === mem.category)?.label || mem.category}
                      </span>
                      <span className="text-xs font-bold text-[#F3F7F4]">
                        {mem.key}
                      </span>
                    </div>
                    <p className="text-xs text-[#98A69D] leading-relaxed">
                      {mem.value}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(mem.id)}
                    className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#EF4444] hover:bg-[#142019] transition-colors cursor-pointer"
                    title={isUz ? "O‘chirish" : "Delete Memory"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#25352C] bg-[#080D0B] flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#10B981]" />
            {isUz ? "Xavfsiz xotira • Foydalanuvchi UUID profiliga bog‘langan" : "Stored strictly in PostgreSQL • Scoped to your User UUID"}
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#142019] text-[#F3F7F4] hover:bg-[#25352C] rounded-lg transition-colors text-xs font-medium cursor-pointer"
          >
            {isUz ? "Yopish" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}