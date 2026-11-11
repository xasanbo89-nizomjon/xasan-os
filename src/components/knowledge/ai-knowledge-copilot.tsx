"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  Copy,
  Check,
  BookOpen,
  HelpCircle,
  Layers,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Zap,
  Brain,
  Lightbulb,
  Cpu,
  ArrowRight,
} from "lucide-react";
import {
  KnowledgeNoteSummary,
  AiNoteAnalysisResult,
} from "@/types";
import {
  aiSummarizeNoteAction,
  aiExplainContentAction,
  aiGenerateQuestionsAction,
  aiExtractKeyInfoAction,
} from "@/server/actions/knowledge";
import { useTranslation } from "@/stores/language-store";

interface AiKnowledgeCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  activeNote: KnowledgeNoteSummary | null;
  initialAction?: "SUMMARIZE" | "EXPLAIN" | "GENERATE_QUESTIONS" | "EXTRACT_INFO" | null;
}

type CopilotTab = "SUMMARIZE" | "EXPLAIN" | "GENERATE_QUESTIONS" | "EXTRACT_INFO";

export function AiKnowledgeCopilot({
  isOpen,
  onClose,
  activeNote,
  initialAction = "SUMMARIZE",
}: AiKnowledgeCopilotProps) {
  const { isUz } = useTranslation();
  const [activeTab, setActiveTab] = useState<CopilotTab>(initialAction || "SUMMARIZE");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AiNoteAnalysisResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [customQuery, setCustomQuery] = useState("");

  useEffect(() => {
    if (initialAction) {
      setActiveTab(initialAction);
    }
  }, [initialAction]);

  useEffect(() => {
    if (isOpen && activeNote) {
      handleRunAnalysis(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeNote?.id, activeTab]);

  const handleRunAnalysis = async (action: CopilotTab) => {
    if (!activeNote) return;
    setLoading(true);
    setRevealedAnswers({});
    try {
      let res: AiNoteAnalysisResult;
      if (action === "SUMMARIZE") {
        res = await aiSummarizeNoteAction(activeNote.id);
      } else if (action === "EXPLAIN") {
        res = await aiExplainContentAction(activeNote.id, customQuery || undefined);
      } else if (action === "GENERATE_QUESTIONS") {
        res = await aiGenerateQuestionsAction(activeNote.id);
      } else {
        res = await aiExtractKeyInfoAction(activeNote.id);
      }
      setResult(res);
    } catch (err) {
      console.error("AI Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAnswer = (idx: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-[#101915] border-l border-[#25352C] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#25352C] flex items-center justify-between bg-[#080D0B]/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#F3F7F4] tracking-wide">
                {isUz ? "AI Bilim Yordamchisi" : "AI Knowledge Copilot"}
              </h3>
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#98A69D] truncate max-w-[260px]">
              {activeNote ? activeNote.title : (isUz ? "Qayd tanlanmagan" : "No note selected")}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors"
          title={isUz ? "Yordamchini yopish" : "Close Copilot"}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 border-b border-[#25352C] bg-[#080D0B]/40 text-[11px] font-medium p-1 gap-1">
        <button
          onClick={() => setActiveTab("SUMMARIZE")}
          className={`py-2 px-1 rounded-md text-center transition-colors flex flex-col items-center gap-1 ${
            activeTab === "SUMMARIZE"
              ? "bg-[#142019] text-[#10B981] font-semibold border border-[#10B981]/30 shadow-sm"
              : "text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isUz ? "Xulosa" : "Summarize"}</span>
        </button>
        <button
          onClick={() => setActiveTab("EXPLAIN")}
          className={`py-2 px-1 rounded-md text-center transition-colors flex flex-col items-center gap-1 ${
            activeTab === "EXPLAIN"
              ? "bg-[#142019] text-[#10B981] font-semibold border border-[#10B981]/30 shadow-sm"
              : "text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>{isUz ? "Tushuntirish" : "Explain"}</span>
        </button>
        <button
          onClick={() => setActiveTab("GENERATE_QUESTIONS")}
          className={`py-2 px-1 rounded-md text-center transition-colors flex flex-col items-center gap-1 ${
            activeTab === "GENERATE_QUESTIONS"
              ? "bg-[#142019] text-[#10B981] font-semibold border border-[#10B981]/30 shadow-sm"
              : "text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{isUz ? "Test savollar" : "Recall Quiz"}</span>
        </button>
        <button
          onClick={() => setActiveTab("EXTRACT_INFO")}
          className={`py-2 px-1 rounded-md text-center transition-colors flex flex-col items-center gap-1 ${
            activeTab === "EXTRACT_INFO"
              ? "bg-[#142019] text-[#10B981] font-semibold border border-[#10B981]/30 shadow-sm"
              : "text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isUz ? "Invariantlar" : "Entities"}</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!activeNote ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#98A69D]">
            <BookOpen className="w-10 h-10 stroke-1 text-[#25352C] mb-3" />
            <p className="text-sm font-medium text-[#F3F7F4]">
              {isUz ? "Faol qayd tanlanmagan" : "No Active Note"}
            </p>
            <p className="text-xs text-[#98A69D] mt-1">
              {isUz
                ? "Semantik tahlil va faol takrorlash imkoniyatlarini ishga tushirish uchun qayd tanlang."
                : "Select or open a note to invoke semantic reasoning and active study features."}
            </p>
          </div>
        ) : loading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#10B981]/20 border-t-[#10B981] animate-spin" />
            <p className="text-xs font-mono text-[#10B981]">
              {isUz
                ? "Semantik invariantlar va tushunchalar tahlil qilinmoqda..."
                : "Analyzing semantic embeddings & invariants..."}
            </p>
          </div>
        ) : result ? (
          <div className="space-y-4">
            {/* Action Meta */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D] pb-2 border-b border-[#25352C]">
              <span className="flex items-center gap-1 text-[#10B981]">
                <Cpu className="w-3.5 h-3.5" />
                {isUz ? "Deterministik tahlil mexanizmi" : "Deterministic Copilot Engine"}
              </span>
              <button
                onClick={() => handleRunAnalysis(activeTab)}
                className="flex items-center gap-1 hover:text-[#F3F7F4] transition-colors"
                title={isUz ? "Qayta tahlil qilish" : "Regenerate"}
              >
                <RefreshCw className="w-3 h-3" />
                {isUz ? "Qayta tahlil" : "Regenerate"}
              </button>
            </div>

            {/* Custom Query for Explain Mode */}
            {activeTab === "EXPLAIN" && (
              <div className="p-3 bg-[#080D0B] rounded-xl border border-[#25352C] space-y-2">
                <label className="text-[11px] font-mono text-[#98A69D]">
                  {isUz ? "Fokus so‘rov yoki tushuncha (ixtiyoriy):" : "Focus Query or Concept (Optional):"}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder={isUz ? "Masalan: WAL arxitekturasi va invariantlar..." : "e.g. Write-ahead logging invariant..."}
                    className="flex-1 bg-[#142019] text-xs text-[#F3F7F4] px-3 py-1.5 rounded-lg border border-[#25352C] focus:outline-none focus:border-[#10B981]"
                  />
                  <button
                    onClick={() => handleRunAnalysis("EXPLAIN")}
                    className="px-3 py-1.5 bg-[#10B981] text-[#080D0B] font-semibold text-xs rounded-lg hover:bg-[#059669] transition-colors flex items-center gap-1"
                  >
                    {isUz ? "So‘rash" : "Ask"}
                  </button>
                </div>
              </div>
            )}

            {/* Main Result Card */}
            <div className="glass-card rounded-xl p-4 border border-[#25352C] space-y-3 relative group">
              <button
                onClick={() =>
                  handleCopy(
                    `${result.result}\n\n${(result.bullets || []).join("\n")}`
                  )
                }
                className="absolute top-3 right-3 p-1.5 rounded-md bg-[#101915] text-[#98A69D] hover:text-[#10B981] border border-[#25352C] transition-colors"
                title={isUz ? "Natijani nusxalash" : "Copy result to clipboard"}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <h4 className="text-xs font-mono font-semibold text-[#10B981] uppercase tracking-wider">
                {result.action === "SUMMARIZE" && (isUz ? "Qisqacha Ijroiy Xulosa" : "Executive Synthesis")}
                {result.action === "EXPLAIN" && (isUz ? "Chuqur Arxitektura Tahlili" : "Architectural Deep Dive")}
                {result.action === "GENERATE_QUESTIONS" && (isUz ? "Faol Takrorlash Diagnostikasi" : "Active Recall Diagnostic")}
                {result.action === "EXTRACT_INFO" && (isUz ? "Tarkibiy Qoidalar va Invariantlar" : "Structural Invariants")}
              </h4>

              <p className="text-xs text-[#F3F7F4] leading-relaxed whitespace-pre-line pr-6">
                {result.result}
              </p>
            </div>

            {/* Bullets Section */}
            {result.bullets && result.bullets.length > 0 && (
              <div className="glass-card rounded-xl p-4 border border-[#25352C] space-y-2.5">
                <h5 className="text-[11px] font-mono font-semibold text-[#98A69D] uppercase tracking-wider">
                  {isUz ? "Asosiy Invariantlar va Muhim Xulosalar" : "Key Invariants & Takeaways"}
                </h5>
                <ul className="space-y-2">
                  {result.bullets.map((b, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-[#F3F7F4] flex items-start gap-2 leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mt-1.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Points / Invariants */}
            {result.keyPoints && result.keyPoints.length > 0 && (
              <div className="glass-card rounded-xl p-4 border border-[#25352C] space-y-2.5">
                <h5 className="text-[11px] font-mono font-semibold text-[#98A69D] uppercase tracking-wider">
                  {isUz ? "Qarorlar va Amaliy Vazifalar" : "Decisions & Operational Action Items"}
                </h5>
                <div className="space-y-1.5">
                  {result.keyPoints.map((kp, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono text-[#10B981] bg-[#080D0B] p-2 rounded-lg border border-[#25352C] flex items-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3 shrink-0" />
                      <span>{kp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Questions (For Active Recall Mode) */}
            {result.questions && result.questions.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-[11px] font-mono font-semibold text-[#98A69D] uppercase tracking-wider px-1">
                  {isUz
                    ? `Interaktiv Savol-Javob Kartalari (${result.questions.length})`
                    : `Flashcard Recall Deck (${result.questions.length})`}
                </h5>
                {result.questions.map((q, idx) => {
                  const isRevealed = revealedAnswers[idx];
                  return (
                    <div
                      key={idx}
                      className="glass-card rounded-xl p-3.5 border border-[#25352C] space-y-2 hover:border-[#10B981]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold text-[#10B981] px-1.5 py-0.5 rounded bg-[#101915] border border-[#10B981]/20">
                          {isUz ? "S" : "Q"}{idx + 1}
                        </span>
                        <p className="text-xs font-semibold text-[#F3F7F4] flex-1">
                          {q.question}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#25352C]">
                        <button
                          onClick={() => toggleAnswer(idx)}
                          className="w-full flex items-center justify-between text-[11px] font-mono text-[#98A69D] hover:text-[#10B981] py-1 transition-colors"
                        >
                          <span>
                            {isRevealed
                              ? (isUz ? "Javobni yashirish" : "Hide Model Answer")
                              : (isUz ? "To‘g‘ri javobni ko‘rsatish" : "Reveal Model Answer")}
                          </span>
                          {isRevealed ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isRevealed && (
                          <div className="mt-2 p-2.5 rounded-lg bg-[#080D0B] border border-[#10B981]/30 text-xs text-[#F3F7F4] leading-relaxed animate-in fade-in duration-200">
                            {q.answer}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-[#25352C] bg-[#080D0B]/80 text-center">
        <p className="text-[10px] font-mono text-[#98A69D]">
          {isUz
            ? "XASAN OS Neyron Yadrosi • Intervalli Takrorlash Protokoli"
            : "Powered by XASAN OS Neural Kernel • Spaced Repetition Protocol"}
        </p>
      </div>
    </div>
  );
}
