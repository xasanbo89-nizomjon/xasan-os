"use client";

import React, { useState } from "react";
import { VisionItemSummary } from "@/types";
import { Compass, Plus, Pin, Trash2, Calendar, Sparkles, X, Image as ImageIcon } from "lucide-react";
import { createVisionItemAction, deleteVisionItemAction } from "@/server/actions/goals";

interface VisionBoardProps {
  initialItems: VisionItemSummary[];
}

export function VisionBoard({ initialItems }: VisionBoardProps) {
  const [items, setItems] = useState<VisionItemSummary[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [category, setCategory] = useState("Technology");
  const [imageUrl, setImageUrl] = useState("");
  const [targetYear, setTargetYear] = useState(2027);
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Technology", "Education", "Health", "Career", "Finance", "Travel"];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !statement.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createVisionItemAction({
        title: title.trim(),
        statement: statement.trim(),
        category,
        imageUrl: imageUrl.trim() || undefined,
        targetYear: Number(targetYear),
        isPinned,
      });

      if (res.success && res.item) {
        setItems((prev) => [res.item as VisionItemSummary, ...prev]);
        setIsModalOpen(false);
        setTitle("");
        setStatement("");
        setImageUrl("");
        setTargetYear(2027);
        setIsPinned(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vision card?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteVisionItemAction(id);
  };

  return (
    <div className="space-y-6">
      {/* Vision Header & Add Action */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] bg-[#101915] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
              <Compass className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-[#F3F7F4]">
              Personal Future Vision Board
            </h3>
          </div>
          <p className="text-xs text-[#98A69D]">
            Motivational imagery, sovereign future milestones, and life aspiration statements
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Vision Card
        </button>
      </div>

      {/* Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl border border-[#25352C] bg-[#142019] overflow-hidden hover:border-[#10B981]/40 transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Image Banner if available */}
            {item.imageUrl ? (
              <div className="h-44 w-full relative overflow-hidden bg-[#101915]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#142019] via-transparent to-transparent opacity-90" />
                {item.isPinned && (
                  <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#080D0B]/80 text-[#10B981] backdrop-blur-sm border border-[#10B981]/30">
                    <Pin className="w-3.5 h-3.5 fill-current" />
                  </div>
                )}
              </div>
            ) : (
              <div className="h-28 w-full bg-gradient-to-br from-[#10B981]/15 to-[#101915] p-4 flex items-start justify-between border-b border-[#25352C]">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#10B981] border border-[#10B981]/30">
                  {item.category}
                </span>
                {item.isPinned && (
                  <Pin className="w-3.5 h-3.5 text-[#10B981] fill-current" />
                )}
              </div>
            )}

            {/* Content Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                    Target: {item.targetYear || 2027}
                  </span>
                  <span className="text-[10px] font-mono text-[#98A69D]">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-base font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors leading-snug">
                  {item.title}
                </h4>

                <p className="text-xs text-[#98A69D] leading-relaxed italic border-l-2 border-[#10B981]/40 pl-3 py-0.5">
                  &ldquo;{item.statement}&rdquo;
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#25352C] flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded text-[#98A69D] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Vision Card Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-lg border border-[#25352C] bg-[#101915] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F3F7F4]">
                    Add Vision Board Card
                  </h3>
                  <p className="text-xs text-[#98A69D]">
                    Manifest your long-term future direction & aspiration
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Vision Title <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sovereign Engineering Architect & IELTS Thought Leader"
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-sm text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Motivational Statement / Affirmation <span className="text-[#EF4444]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Build world-class autonomous software operating systems and master advanced English academic discourse..."
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] leading-relaxed resize-none"
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
                    Target Milestone Year
                  </label>
                  <input
                    type="number"
                    min="2026"
                    max="2035"
                    value={targetYear}
                    onChange={(e) => setTargetYear(Number(e.target.value))}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-[#10B981]" /> Image URL (Unsplash or local image)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#142019] border border-[#25352C]">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded border-[#25352C] bg-[#101915] text-[#10B981] focus:ring-0 accent-[#10B981]"
                />
                <label htmlFor="pinCheck" className="text-xs text-[#F3F7F4] cursor-pointer flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 text-[#10B981]" />
                  Pin Card to Top of Vision Board
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#25352C]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#142019] hover:bg-[#142019]/80 text-[#98A69D] border border-[#25352C] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !statement.trim()}
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isSubmitting ? "Adding..." : "Add to Vision Board"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
