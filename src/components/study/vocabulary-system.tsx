"use client";

import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  RotateCw,
  Volume2,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Check,
  Flame,
  Layers,
  X,
  Trash2,
  Languages,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { VocabularyCardSummary } from "@/types";
import { useStudyStore } from "@/stores/study-store";

interface VocabularySystemProps {
  initialCards: VocabularyCardSummary[];
}

export function VocabularySystem({ initialCards }: VocabularySystemProps) {
  const storeCards = useStudyStore((s) => s.vocabCards);
  const addVocabCard = useStudyStore((s) => s.addVocabCard);
  const reviewVocabCard = useStudyStore((s) => s.reviewVocabCard);
  const deleteVocabCard = useStudyStore((s) => s.deleteVocabCard);
  const isHydrated = useStudyStore((s) => s.isHydrated);

  const cards = isHydrated ? storeCards : initialCards;
  const [activeTab, setActiveTab] = useState<"REVIEW" | "LIBRARY">("REVIEW");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Review session state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [reviewedSessionCount, setReviewedSessionCount] = useState<number>(0);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    word: "",
    translation: "",
    language: "ENGLISH",
    difficulty: "C1",
    topic: "Academic IELTS",
    phonetic: "",
    exampleSentence: "",
    exampleTranslation: "",
  });

  // Filter cards due for review or in learning queue
  const reviewQueue = useMemo(() => {
    const now = new Date();
    // Prioritize cards due today or earlier, or cards in NEW/LEARNING/REVIEWING state
    const due = cards.filter((c) => {
      if (selectedLanguage !== "ALL" && c.language !== selectedLanguage) return false;
      return new Date(c.nextReviewDate) <= now || c.status === "NEW" || c.status === "LEARNING";
    });
    // If no overdue cards, allow practicing all non-mastered or all cards in deck
    if (due.length === 0) {
      return cards.filter((c) => {
        if (selectedLanguage !== "ALL" && c.language !== selectedLanguage) return false;
        return c.status !== "MASTERED";
      });
    }
    return due;
  }, [cards, selectedLanguage]);

  const currentCard = reviewQueue[currentIndex];

  // Filter library cards
  const filteredLibrary = useMemo(() => {
    return cards.filter((card) => {
      if (selectedLanguage !== "ALL" && card.language !== selectedLanguage) return false;
      if (selectedStatus !== "ALL" && card.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          card.word.toLowerCase().includes(q) ||
          card.translation.toLowerCase().includes(q) ||
          card.topic.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cards, selectedLanguage, selectedStatus, searchQuery]);

  // Statistics
  const masteredCount = cards.filter((c) => c.status === "MASTERED").length;
  const learningCount = cards.filter((c) => c.status === "LEARNING" || c.status === "REVIEWING").length;
  const dueCount = cards.filter((c) => new Date(c.nextReviewDate) <= new Date()).length;

  // Handle Review Grade with local SM-2
  const handleReview = (rating: 0 | 1 | 2 | 3) => {
    if (!currentCard || isSubmitting) return;
    setIsSubmitting(true);

    try {
      reviewVocabCard(currentCard.id, rating);
      setReviewedSessionCount((prev) => prev + 1);
      setIsFlipped(false);

      if (currentIndex + 1 < reviewQueue.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setSessionCompleted(true);
      }
    } catch (err) {
      console.error("Review submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePronounce = (text: string, lang: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "ARABIC" ? "ar-SA" : "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.translation.trim()) return;

    addVocabCard({
      word: formData.word,
      translation: formData.translation,
      language: formData.language,
      difficulty: formData.difficulty,
      topic: formData.topic,
      phonetic: formData.phonetic,
      exampleSentence: formData.exampleSentence,
      exampleTranslation: formData.exampleTranslation,
    });

    setIsCreateModalOpen(false);
    setFormData({
      word: "",
      translation: "",
      language: "ENGLISH",
      difficulty: "C1",
      topic: "Academic IELTS",
      phonetic: "",
      exampleSentence: "",
      exampleTranslation: "",
    });
  };

  const handleDeleteCard = (id: string) => {
    if (confirm("Are you sure you want to delete this vocabulary card?")) {
      deleteVocabCard(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-xs text-[#98A69D] mb-2 font-mono">
            <span>DUE REVIEWS</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#F3F7F4]">{dueCount}</div>
          <p className="text-xs text-[#98A69D] mt-1">Cards requiring recall verification today</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-xs text-[#98A69D] mb-2 font-mono">
            <span>IN PROGRESS</span>
            <RotateCw className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">{learningCount}</div>
          <p className="text-xs text-[#98A69D] mt-1">Cards in SM-2 learning/review loop</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-xs text-[#98A69D] mb-2 font-mono">
            <span>MASTERED</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#10B981]">{masteredCount}</div>
          <p className="text-xs text-[#98A69D] mt-1">Retained cards with repetition &gt;= 4</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-xs text-[#98A69D] mb-2 font-mono">
            <span>TOTAL LEXICON</span>
            <Languages className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-[#F3F7F4]">{cards.length}</div>
          <p className="text-xs text-[#98A69D] mt-1">Across English C1/C2 & Arabic B2/C1</p>
        </div>
      </div>

      {/* Mode Navigation & Action Bar */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setActiveTab("REVIEW");
              setIsFlipped(false);
              setSessionCompleted(false);
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "REVIEW"
                ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20"
                : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spaced Repetition Drill</span>
            {dueCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                {dueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("LIBRARY")}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "LIBRARY"
                ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20"
                : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vocabulary Library</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#142019] text-[#98A69D] font-mono">
              {cards.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Language filter pill */}
          <div className="flex items-center bg-[#101915] border border-[#25352C] rounded-xl p-1 text-xs">
            {["ALL", "ENGLISH", "ARABIC"].map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setSelectedLanguage(lang);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-all ${
                  selectedLanguage === lang
                    ? "bg-[#142019] text-[#10B981] font-semibold border border-[#25352C]"
                    : "text-[#98A69D] hover:text-[#F3F7F4]"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* ===================== VIEW 1: SM-2 FLASHCARD DRILL ===================== */}
      {activeTab === "REVIEW" && (
        <div className="max-w-3xl mx-auto space-y-6">
          {sessionCompleted || !currentCard ? (
            <div className="glass-card rounded-3xl p-10 border border-[#25352C] text-center space-y-5 bg-[#101915]/60">
              <div className="w-16 h-16 rounded-2xl bg-[#142019] border border-[#10B981]/30 text-[#10B981] flex items-center justify-center mx-auto shadow-xl shadow-[#10B981]/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#F3F7F4]">All Caught Up!</h3>
                <p className="text-xs text-[#98A69D] max-w-md mx-auto leading-relaxed">
                  You have reviewed {reviewedSessionCount} card{reviewedSessionCount === 1 ? "" : "s"} in this session. The SM-2 algorithm has dynamically adjusted the review intervals.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setIsFlipped(false);
                    setSessionCompleted(false);
                    setReviewedSessionCount(0);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#142019] border border-[#25352C] hover:border-[#10B981] text-[#F3F7F4] flex items-center gap-2"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Restart Drill</span>
                </button>
                <button
                  onClick={() => setActiveTab("LIBRARY")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Explore Library</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs text-[#98A69D] font-mono px-1">
                <span>
                  Card {currentIndex + 1} of {reviewQueue.length}
                </span>
                <span className="text-emerald-400">
                  {Math.round(((currentIndex + 1) / reviewQueue.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full h-1 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                <div
                  className="h-full bg-[#10B981] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / reviewQueue.length) * 100}%` }}
                />
              </div>

              {/* Flashcard Component */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer group relative min-h-[340px] rounded-3xl p-8 border border-[#25352C] bg-gradient-to-b from-[#142019] to-[#101915] hover:border-[#10B981]/50 transition-all duration-300 flex flex-col justify-between shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#101915] border border-[#25352C] text-[#10B981]">
                      {currentCard.language} • {currentCard.difficulty}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-[#101915] border border-[#25352C] text-[#98A69D]">
                      {currentCard.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentCard.phonetic && (
                      <span className="text-xs font-mono text-[#98A69D]">{currentCard.phonetic}</span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePronounce(currentCard.word, currentCard.language);
                      }}
                      className="p-1.5 rounded-lg bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-[#10B981] transition-colors"
                      title="Pronounce"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Central Body: Front / Back */}
                <div className="text-center py-6 space-y-4">
                  {!isFlipped ? (
                    <div className="space-y-3">
                      <div
                        className={`text-3xl md:text-4xl font-bold tracking-wide text-[#F3F7F4] ${
                          currentCard.language === "ARABIC" ? "font-serif" : ""
                        }`}
                      >
                        {currentCard.word}
                      </div>
                      <p className="text-xs text-[#98A69D] flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Click card to reveal definition & examples</span>
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                      <div>
                        <div
                          className={`text-2xl md:text-3xl font-bold text-[#10B981] mb-1 ${
                            currentCard.language === "ARABIC" ? "font-serif" : ""
                          }`}
                        >
                          {currentCard.word}
                        </div>
                        <div className="text-lg font-medium text-[#F3F7F4]">
                          {currentCard.translation}
                        </div>
                      </div>

                      {currentCard.exampleSentence && (
                        <div className="p-4 rounded-xl bg-[#080D0B]/80 border border-[#25352C] text-left space-y-1.5 max-w-xl mx-auto">
                          <p className="text-xs text-[#F3F7F4] italic leading-relaxed">
                            &quot;{currentCard.exampleSentence}&quot;
                          </p>
                          {currentCard.exampleTranslation && (
                            <p className="text-xs text-[#98A69D] leading-relaxed">
                              {currentCard.exampleTranslation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer State Indicators */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D] pt-4 border-t border-[#25352C]/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Interval: {currentCard.interval}d</span>
                    <span>•</span>
                    <span>Repetition #{currentCard.repetition}</span>
                  </div>
                  <div>
                    <span>Status: {currentCard.status}</span>
                  </div>
                </div>
              </div>

              {/* SM-2 Grade Buttons (Visible when flipped) */}
              {isFlipped ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <button
                    onClick={() => handleReview(0)}
                    disabled={isSubmitting}
                    className="p-3.5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 hover:border-[#EF4444] text-[#F3F7F4] transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                    <span className="text-xs font-bold text-red-400 group-hover:scale-105 transition-transform">
                      Again (0)
                    </span>
                    <span className="text-[10px] text-[#98A69D] font-mono">&lt; 10 min (1d)</span>
                  </button>

                  <button
                    onClick={() => handleReview(1)}
                    disabled={isSubmitting}
                    className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-[#F3F7F4] transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                    <span className="text-xs font-bold text-amber-400 group-hover:scale-105 transition-transform">
                      Hard (1)
                    </span>
                    <span className="text-[10px] text-[#98A69D] font-mono">2 days</span>
                  </button>

                  <button
                    onClick={() => handleReview(2)}
                    disabled={isSubmitting}
                    className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 text-[#F3F7F4] transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                    <span className="text-xs font-bold text-emerald-400 group-hover:scale-105 transition-transform">
                      Good (2)
                    </span>
                    <span className="text-[10px] text-[#98A69D] font-mono">4 days</span>
                  </button>

                  <button
                    onClick={() => handleReview(3)}
                    disabled={isSubmitting}
                    className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 text-[#F3F7F4] transition-all flex flex-col items-center justify-center gap-1 group"
                  >
                    <span className="text-xs font-bold text-cyan-400 group-hover:scale-105 transition-transform">
                      Easy (3)
                    </span>
                    <span className="text-[10px] text-[#98A69D] font-mono">8+ days</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="w-full py-3.5 rounded-2xl bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-xs font-semibold text-[#F3F7F4] transition-all flex items-center justify-center gap-2"
                >
                  <span>Show Answer / Definition</span>
                  <ChevronRight className="w-4 h-4 text-[#10B981]" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ===================== VIEW 2: VOCABULARY LIBRARY & LEXICON ===================== */}
      {activeTab === "LIBRARY" && (
        <div className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="glass-card rounded-2xl p-4 border border-[#25352C] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A69D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search word, Uzbek translation, topic..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101915] border border-[#25352C] text-xs text-[#F3F7F4] placeholder-[#98A69D] focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-[#98A69D] flex items-center gap-1 shrink-0 font-mono">
                <Filter className="w-3.5 h-3.5 text-[#10B981]" /> Status:
              </span>
              {["ALL", "NEW", "LEARNING", "REVIEWING", "MASTERED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all shrink-0 ${
                    selectedStatus === st
                      ? "bg-[#10B981] text-[#080D0B] font-bold"
                      : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLibrary.map((c) => (
              <div
                key={c.id}
                className="glass-card rounded-2xl p-5 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#101915] border border-[#25352C] text-[#10B981]">
                      {c.language} • {c.difficulty}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        c.status === "MASTERED"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : c.status === "REVIEWING"
                          ? "bg-cyan-500/20 text-cyan-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-lg font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors ${
                          c.language === "ARABIC" ? "font-serif" : ""
                        }`}
                      >
                        {c.word}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handlePronounce(c.word, c.language)}
                        className="p-1 text-[#98A69D] hover:text-[#10B981]"
                        title="Pronounce"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {c.phonetic && (
                      <p className="text-[11px] font-mono text-[#98A69D]">{c.phonetic}</p>
                    )}
                    <p className="text-xs text-[#98A69D] mt-1 font-medium">{c.translation}</p>
                  </div>

                  {c.exampleSentence && (
                    <div className="p-2.5 rounded-lg bg-[#101915] border border-[#25352C] text-[11px] text-[#98A69D] italic">
                      &quot;{c.exampleSentence}&quot;
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#25352C] flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
                  <span className="truncate max-w-[140px]">{c.topic}</span>
                  <div className="flex items-center gap-2">
                    <span>Int: {c.interval}d</span>
                    <button
                      onClick={() => handleDeleteCard(c.id)}
                      className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-[#101915]"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLibrary.length === 0 && (
            <div className="glass-card rounded-2xl p-8 border border-[#25352C] text-center space-y-2">
              <HelpCircle className="w-8 h-8 text-[#98A69D] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#F3F7F4]">No vocabulary cards found</p>
              <p className="text-xs text-[#98A69D]">Try adjusting your search query or language filter.</p>
            </div>
          )}
        </div>
      )}

      {/* ===================== CREATE CARD MODAL ===================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-lg w-full bg-[#101915] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">New Vocabulary Card</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="ENGLISH">English</option>
                    <option value="ARABIC">Arabic</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    CEFR Level
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="B1">B1 (Intermediate)</option>
                    <option value="B2">B2 (Vantage)</option>
                    <option value="C1">C1 (Effective Fluency)</option>
                    <option value="C2">C2 (Mastery)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Word / Phrase *
                </label>
                <input
                  type="text"
                  required
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  placeholder="e.g. ubiquitous, exacerbate, تَفَاقَمَ"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Translation (Uzbek/En) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.translation}
                    onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
                    placeholder="e.g. Hamma joyda uchraydigan"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Phonetics (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.phonetic}
                    onChange={(e) => setFormData({ ...formData, phonetic: e.target.value })}
                    placeholder="/juːˈbɪk.wɪ.təs/"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Topic / Category</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g. Academic IELTS, Philosophy, Nahw"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Example Sentence</label>
                <textarea
                  rows={2}
                  value={formData.exampleSentence}
                  onChange={(e) => setFormData({ ...formData, exampleSentence: e.target.value })}
                  placeholder="Target sentence displaying natural academic syntax..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Example Sentence Translation
                </label>
                <input
                  type="text"
                  value={formData.exampleTranslation}
                  onChange={(e) => setFormData({ ...formData, exampleTranslation: e.target.value })}
                  placeholder="Uzbek translation of the example sentence..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#98A69D] hover:text-[#F3F7F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all"
                >
                  Add Card to Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
