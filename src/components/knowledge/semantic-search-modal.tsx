"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Sparkles,
  X,
  FileText,
  Tag,
  ArrowRight,
  Folder,
  Layers,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { SemanticSearchResult, KnowledgeNoteSummary } from "@/types";
import { semanticSearchNotesAction } from "@/server/actions/knowledge";

interface SemanticSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNote: (note: KnowledgeNoteSummary) => void;
}

const SAMPLE_QUERIES = [
  "Distributed consensus Raft vs Paxos invariants",
  "IELTS Band 8.5 Task 2 lexical cohesion & hedging",
  "Multi-tenant PostgreSQL schema isolation",
  "Arabic CEFR B2 root-and-pattern morphology",
  "High-performance write-ahead logging (WAL)",
];

export function SemanticSearchModal({
  isOpen,
  onClose,
  onSelectNote,
}: SemanticSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await semanticSearchNotesAction(query);
        setResults(res);
      } catch (err) {
        console.error("Semantic search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#101915] border border-[#25352C] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#25352C] bg-[#080D0B] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question or describe a concept (semantic retrieval)..."
              className="w-full bg-transparent text-sm text-[#F3F7F4] placeholder-[#98A69D] focus:outline-none"
            />
          </div>

          {loading && (
            <div className="w-4 h-4 rounded-full border-2 border-[#10B981]/30 border-t-[#10B981] animate-spin shrink-0" />
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {query.trim().length === 0 ? (
            <div className="p-4 space-y-3">
              <p className="text-[11px] font-mono font-semibold text-[#98A69D] uppercase tracking-wider">
                Semantic Query Suggestions:
              </p>
              <div className="space-y-2">
                {SAMPLE_QUERIES.map((sq, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(sq)}
                    className="w-full text-left p-2.5 rounded-xl bg-[#142019] border border-[#25352C] hover:border-[#10B981]/40 text-xs text-[#F3F7F4] hover:text-[#10B981] transition-colors flex items-center justify-between group"
                  >
                    <span>{sq}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#98A69D] group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D] px-1">
                <span>
                  Found {results.length} relevant note{results.length > 1 ? "s" : ""}
                </span>
                <span className="text-[#10B981]">
                  Confidence threshold &ge; 45%
                </span>
              </div>

              {results.map((res) => {
                const percent = Math.round(res.similarityScore * 100);
                return (
                  <div
                    key={res.note.id}
                    onClick={() => {
                      onSelectNote(res.note);
                      onClose();
                    }}
                    className="glass-card rounded-xl p-4 border border-[#25352C] hover:border-[#10B981] cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#101915] text-[#10B981] border border-[#10B981]/30">
                          {res.note.contentType}
                        </span>
                        <span className="text-[10px] font-mono text-[#98A69D]">
                          {res.note.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-[10px] font-mono font-bold border border-[#10B981]/30">
                        <Sparkles className="w-3 h-3" />
                        <span>{percent}% Match</span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                      {res.note.title}
                    </h4>

                    <p className="text-xs text-[#98A69D] line-clamp-2 leading-relaxed bg-[#080D0B] p-2.5 rounded-lg border border-[#25352C]/60 font-mono text-[11px]">
                      {res.matchedSnippet}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-[#98A69D] pt-1">
                      <span className="text-[#10B981]/80 italic">
                        {res.relevanceReason}
                      </span>
                      <span className="group-hover:text-[#F3F7F4] flex items-center gap-1">
                        Open Note <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !loading ? (
            <div className="p-8 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-[#98A69D] mx-auto" />
              <p className="text-sm font-semibold text-[#F3F7F4]">
                No High-Confidence Conceptual Matches
              </p>
              <p className="text-xs text-[#98A69D] max-w-sm mx-auto">
                No notes matched query &ldquo;{query}&rdquo; with confidence &ge; 45%. Try broader system or study terms.
              </p>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#25352C] bg-[#080D0B] flex items-center justify-between text-[10px] font-mono text-[#98A69D]">
          <span>Tip: Press ESC to close &bull; Click card to load into editor</span>
          <span className="text-[#10B981]">XASAN OS Neural Retrieval v1.0</span>
        </div>
      </div>
    </div>
  );
}
