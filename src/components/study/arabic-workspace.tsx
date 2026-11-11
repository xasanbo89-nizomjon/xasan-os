"use client";

import React, { useState } from "react";
import { ArabicPracticeLogSummary } from "@/types";
import {
  BookOpen,
  Headphones,
  FileText,
  Mic,
  Award,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  X,
  Target,
  Languages,
} from "lucide-react";
import {
  createArabicLogAction,
  deleteArabicLogAction,
} from "@/server/actions/study";
import { formatDate } from "@/lib/utils";

interface ArabicWorkspaceProps {
  initialLogs: ArabicPracticeLogSummary[];
  onOpenVocabTab?: () => void;
}

export function ArabicWorkspace({
  initialLogs,
  onOpenVocabTab,
}: ArabicWorkspaceProps) {
  const [logs, setLogs] = useState<ArabicPracticeLogSummary[]>(initialLogs);
  const [selectedSkill, setSelectedSkill] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [skill, setSkill] = useState("GRAMMAR");
  const [topic, setTopic] = useState("");
  const [cefrLevel, setCefrLevel] = useState("B2");
  const [grammarFocus, setGrammarFocus] = useState("");
  const [notes, setNotes] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const skills = [
    { id: "ALL", label: "All Skills" },
    { id: "GRAMMAR", label: "Nahw & Sarf (النحو والصرف)" },
    { id: "READING", label: "Reading (القراءة)" },
    { id: "LISTENING", label: "Listening (الاستماع)" },
    { id: "SPEAKING", label: "Speaking (المحادثة)" },
    { id: "WRITING", label: "Writing (الكتابة)" },
  ];

  const filteredLogs = logs.filter((l) => {
    if (selectedSkill === "ALL") return true;
    return l.skill.toUpperCase() === selectedSkill.toUpperCase();
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await createArabicLogAction({
        skill,
        topic: topic.trim(),
        cefrLevel,
        grammarFocus: grammarFocus.trim() || undefined,
        notes: notes.trim() || undefined,
        durationMinutes: Number(durationMinutes),
      });

      if (res.success && res.log) {
        setLogs((prev) => [res.log as ArabicPracticeLogSummary, ...prev]);
        setIsModalOpen(false);
        setTopic("");
        setGrammarFocus("");
        setNotes("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete Arabic practice log?")) return;
    setLogs((prev) => prev.filter((l) => l.id !== id));
    await deleteArabicLogAction(id);
  };

  return (
    <div className="space-y-6">
      {/* Arabic CEFR Proficiency & Telemetry Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-[#10B981]/40 bg-[#101915] space-y-2 emerald-glow-sm">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>CEFR Proficiency Target</span>
            <Target className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#10B981] flex items-baseline gap-2">
            B2 <span className="text-sm font-semibold text-[#98A69D]">→ C1 Advanced</span>
          </div>
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] font-mono text-[#98A69D]">
              <span>B1 Independent</span>
              <span className="text-[#10B981] font-bold">B2 Upper (72%)</span>
              <span>C1 Mastery</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#142019] overflow-hidden border border-[#25352C]">
              <div className="h-full bg-[#10B981] rounded-full" style={{ width: "72%" }} />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>Nahw & Grammar Drills</span>
            <BookOpen className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#3B82F6]">
            {logs.filter((l) => l.skill === "GRAMMAR").length} <span className="text-xs font-normal text-[#98A69D]">modules</span>
          </div>
          <p className="text-[11px] text-[#98A69D]">
            I&apos;rab syntax parsing, Jumla Ismiyya, Bab Fa&apos;ala & Irregular verbs
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="flex items-center justify-between text-[#98A69D] text-xs font-mono uppercase">
            <span>Vocabulary Mastery</span>
            <Languages className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#F59E0B]">
            Classical & Fusha
          </div>
          <p className="text-[11px] text-[#98A69D] flex items-center justify-between">
            <span>Root-based lexical expansion</span>
            {onOpenVocabTab && (
              <button
                type="button"
                onClick={onOpenVocabTab}
                className="text-[#10B981] hover:underline font-mono text-[10px]"
              >
                Open Flashcards →
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Filter Toolbar & Add Practice Action */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {skills.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSkill(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                selectedSkill === s.id
                  ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                  : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Log Arabic Practice
        </button>
      </div>

      {/* Practice Logs List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#10B981]" />
          Arabic Skills & Syntax Practice History ({filteredLogs.length})
        </h3>

        {filteredLogs.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center border border-[#25352C] bg-[#101915]/50 text-xs text-[#98A69D]">
            No Arabic practice logs found. Click &quot;Log Arabic Practice&quot; to add syntax or reading records.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#142019]/90 hover:border-[#10B981]/40 transition-all duration-200 space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#10B981] border border-[#10B981]/30 font-bold">
                        {log.skill}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#3B82F6] border border-[#3B82F6]/30">
                        Level: {log.cefrLevel}
                      </span>
                      {log.grammarFocus && (
                        <span className="text-xs font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-0.5 rounded border border-[#F59E0B]/30 font-semibold">
                          {log.grammarFocus}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                      {log.topic}
                    </h4>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(log.id)}
                    className="p-1 rounded text-[#98A69D] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {log.notes && (
                  <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C] text-xs text-[#98A69D] leading-relaxed">
                    {log.notes}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D] pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#10B981]" />
                    {log.durationMinutes} mins practice
                  </span>
                  <span>{formatDate(log.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Arabic Practice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-lg border border-[#25352C] bg-[#101915] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F3F7F4]">
                    Log Arabic Practice Session
                  </h3>
                  <p className="text-xs text-[#98A69D]">
                    Record Nahw analysis, Classical reading, or listening drills
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    Language Skill
                  </label>
                  <select
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="GRAMMAR">Grammar & Syntax (النحو)</option>
                    <option value="READING">Reading (القراءة)</option>
                    <option value="LISTENING">Listening (الاستماع)</option>
                    <option value="SPEAKING">Speaking (المحادثة)</option>
                    <option value="WRITING">Writing (الكتابة)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    CEFR Proficiency Level
                  </label>
                  <select
                    value={cefrLevel}
                    onChange={(e) => setCefrLevel(e.target.value)}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                  >
                    <option value="B1">B1 (Intermediate)</option>
                    <option value="B2">B2 (Upper Intermediate)</option>
                    <option value="C1">C1 (Advanced Classical)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Practice Topic / Text Source <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Nahw: Inna wa Akhawatuha & I'rab parsing"
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-sm text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    Grammar Focus / Rule
                  </label>
                  <input
                    type="text"
                    value={grammarFocus}
                    onChange={(e) => setGrammarFocus(e.target.value)}
                    placeholder="e.g. I'rab (الإعراب), Bab Fa'ala"
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Grammar Notes, Roots & Reflections
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Sentence parsing analysis, new root patterns, or comprehension highlights..."
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] resize-none"
                />
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
                  disabled={isSubmitting || !topic.trim()}
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isSubmitting ? "Logging..." : "Log Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
