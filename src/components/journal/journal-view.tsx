"use client";

import React, { useState, useMemo } from "react";
import { JournalEntrySummary } from "@/types";
import {
  BookOpen,
  Search,
  Plus,
  Lock,
  Unlock,
  Archive,
  Trash2,
  Calendar,
  Tag,
  Smile,
  X,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  createJournalEntryAction,
  updateJournalEntryAction,
  toggleArchiveJournalEntryAction,
  deleteJournalEntryAction,
} from "@/server/actions/journal";
import { formatDate } from "@/lib/utils";

interface JournalViewProps {
  initialEntries: JournalEntrySummary[];
}

export function JournalView({ initialEntries }: JournalViewProps) {
  const [entries, setEntries] = useState<JournalEntrySummary[]>(initialEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState("ALL");
  const [showArchived, setShowArchived] = useState(false);
  const [unlockedPrivateIds, setUnlockedPrivateIds] = useState<string[]>([]);

  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [mood, setMood] = useState("Reflective");
  const [tagsInput, setTagsInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = ["ALL", "Energized", "Productive", "Reflective", "Focused", "Challenged"];

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (!showArchived && e.isArchived) return false;
      if (showArchived && !e.isArchived) return false;
      if (selectedMood !== "ALL" && e.mood.toLowerCase() !== selectedMood.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = e.title.toLowerCase().includes(q);
        const matchContent = e.content.toLowerCase().includes(q);
        const matchTags = e.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchContent && !matchTags) return false;
      }
      return true;
    });
  }, [entries, searchQuery, selectedMood, showArchived]);

  const handleToggleUnlock = (id: string) => {
    if (unlockedPrivateIds.includes(id)) {
      setUnlockedPrivateIds((prev) => prev.filter((i) => i !== id));
    } else {
      setUnlockedPrivateIds((prev) => [...prev, id]);
    }
  };

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await createJournalEntryAction({
        title: title.trim(),
        content: content.trim(),
        date,
        mood,
        tags,
        isPrivate,
      });

      if (res.success && res.entry) {
        setEntries((prev) => [res.entry as JournalEntrySummary, ...prev]);
        setIsCreateModalOpen(false);
        setTitle("");
        setContent("");
        setDate(new Date().toISOString().slice(0, 10));
        setMood("Reflective");
        setTagsInput("");
        setIsPrivate(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleArchive = async (id: string, currentArchived: boolean) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isArchived: !currentArchived } : e))
    );
    await toggleArchiveJournalEntryAction(id, currentArchived);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this journal reflection?")) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await deleteJournalEntryAction(id);
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter Toolbar & Add Entry Trigger */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#98A69D] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reflections, insights, or tags..."
            className="w-full bg-[#142019] border border-[#25352C] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F3F7F4] placeholder-[#98A69D] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Mood filter & Archive toggle & Create button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {moods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMood(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedMood === m
                    ? "bg-[#142019] text-[#10B981] border border-[#10B981]/40 font-semibold"
                    : "bg-[#142019]/60 text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors ${
              showArchived
                ? "bg-[#142019] text-[#F59E0B] border-[#F59E0B]/40"
                : "bg-[#142019] text-[#98A69D] border-[#25352C] hover:text-[#F3F7F4]"
            }`}
          >
            {showArchived ? "Archived View" : "Active Entries"}
          </button>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Reflection
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-[#25352C] bg-[#101915]/50 flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#F3F7F4]">
              No Journal Reflections Found
            </h3>
            <p className="text-xs text-[#98A69D] max-w-sm">
              Capture your engineering breakthroughs, IELTS essay reviews, and philosophical reflections.
            </p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Write First Reflection
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const isUnlocked = unlockedPrivateIds.includes(entry.id);
            const isBlurProtected = entry.isPrivate && !isUnlocked;

            return (
              <div
                key={entry.id}
                className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] bg-[#142019]/90 hover:border-[#10B981]/40 transition-all duration-200 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-[#F3F7F4]">
                        {entry.title}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#10B981] border border-[#10B981]/30">
                        {entry.mood}
                      </span>
                      {entry.isPrivate && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> Confidential
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#98A69D]">
                      <span className="flex items-center gap-1 text-[#10B981]">
                        <Calendar className="w-3 h-3" />
                        {entry.date}
                      </span>
                      {entry.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5 text-[#98A69D]" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {entry.isPrivate && (
                      <button
                        type="button"
                        onClick={() => handleToggleUnlock(entry.id)}
                        className="p-1.5 rounded-lg bg-[#101915] text-[#98A69D] hover:text-[#10B981] border border-[#25352C] transition-colors"
                        title={isUnlocked ? "Lock entry" : "Reveal private reflection"}
                      >
                        {isUnlocked ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleToggleArchive(entry.id, entry.isArchived)}
                      className="p-1.5 rounded-lg bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C] transition-colors"
                      title={entry.isArchived ? "Unarchive" : "Archive"}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      className="p-1.5 rounded-lg bg-[#101915] text-[#98A69D] hover:text-[#EF4444] border border-[#25352C] transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Reflection Body */}
                <div
                  className={`text-xs text-[#F3F7F4] leading-relaxed transition-all ${
                    isBlurProtected
                      ? "filter blur-sm select-none opacity-40 cursor-pointer"
                      : ""
                  }`}
                  onClick={() => isBlurProtected && handleToggleUnlock(entry.id)}
                >
                  {isBlurProtected
                    ? "This reflection is locked with privacy encryption. Click reveal icon to view content."
                    : entry.content}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Journal Entry Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-lg border border-[#25352C] bg-[#101915] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F3F7F4]">
                    Record Journal Reflection
                  </h3>
                  <p className="text-xs text-[#98A69D]">
                    Capture thoughts, technical breakthroughs, or daily retrospective
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-4 pt-4">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Title <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Architectural Latency Breakthrough in WebSockets"
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-sm text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    Dominant Mood
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="Energized">Energized</option>
                    <option value="Productive">Productive</option>
                    <option value="Reflective">Reflective</option>
                    <option value="Focused">Focused</option>
                    <option value="Challenged">Challenged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Reflection Content <span className="text-[#EF4444]">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Deep architectural realizations, IELTS speaking practice notes, personal insights..."
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] leading-relaxed resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Engineering, IELTS, Philosophy, Architecture"
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                />
              </div>

              {/* Private toggle */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#142019] border border-[#25352C]">
                <input
                  type="checkbox"
                  id="privateCheck"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 rounded border-[#25352C] bg-[#101915] text-[#10B981] focus:ring-0 accent-[#10B981]"
                />
                <label htmlFor="privateCheck" className="text-xs text-[#F3F7F4] cursor-pointer flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#EF4444]" />
                  Mark as Confidential (Blur-Protected)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#25352C]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#142019] hover:bg-[#142019]/80 text-[#98A69D] border border-[#25352C] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isSubmitting ? "Saving..." : "Save Reflection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
