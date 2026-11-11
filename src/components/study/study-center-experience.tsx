"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Award,
  ArrowUpRight,
  Sparkles,
  Flame,
  Languages,
  Timer,
  Layers,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { ModuleHeader } from "@/components/layout/module-header";
import { IeltsWorkspace } from "@/components/study/ielts-workspace";
import { ArabicWorkspace } from "@/components/study/arabic-workspace";
import { VocabularySystem } from "@/components/study/vocabulary-system";
import { StudyTimer } from "@/components/study/study-timer";
import {
  IeltsPracticeRecordSummary,
  ExamResultSummary,
  ArabicPracticeLogSummary,
  VocabularyCardSummary,
  StudySessionSummary,
  StudyCenterMetrics,
} from "@/types";

interface StudyCenterExperienceProps {
  metrics: StudyCenterMetrics;
  ieltsRecords: IeltsPracticeRecordSummary[];
  examResults: ExamResultSummary[];
  arabicLogs: ArabicPracticeLogSummary[];
  vocabCards: VocabularyCardSummary[];
  studySessions: StudySessionSummary[];
}

export function StudyCenterExperience({
  metrics,
  ieltsRecords,
  examResults,
  arabicLogs,
  vocabCards,
  studySessions,
}: StudyCenterExperienceProps) {
  const [activeTab, setActiveTab] = useState<"IELTS" | "ARABIC" | "VOCAB" | "TIMER">("IELTS");

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <ModuleHeader
        icon={GraduationCap}
        badge="ACADEMIC MASTERY & LINGUISTICS"
        title="Study Center & Cognitive Expansion"
        description="Dual-track workspace for IELTS Band 8.5 preparation, Arabic CEFR C1 mastery, and SuperMemo-2 spaced repetition."
      >
        <Link
          href="/developer-hub"
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-[#F3F7F4] flex items-center gap-1.5 transition-all group"
        >
          <span>Linked to Aurelius IELTS</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </ModuleHeader>

      {/* Top High-Level Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>IELTS TARGET</span>
            <Award className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F3F7F4]">
            {metrics.estimatedBand.toFixed(1)}{" "}
            <span className="text-xs text-[#98A69D] font-normal">/ {metrics.targetBand.toFixed(1)}</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Est. CEFR C2</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>ARABIC CEFR</span>
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {metrics.arabicCefrLevel.split(" ")[0]}
          </div>
          <div className="text-[10px] text-[#98A69D] font-mono mt-0.5">Target C1 Fluency</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>STUDY TIME</span>
            <Timer className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F3F7F4]">
            {metrics.totalStudyHours} <span className="text-xs text-[#98A69D] font-normal">hrs</span>
          </div>
          <div className="text-[10px] text-amber-400 font-mono mt-0.5">Focus Sessions</div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>VOCABULARY</span>
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#10B981]">
            {metrics.cardsMastered}
          </div>
          <div className="text-[10px] text-[#98A69D] font-mono mt-0.5">
            {metrics.cardsReviewDue} Due for SM-2
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>MOCK TESTS</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F3F7F4]">
            {metrics.mockTestsCompleted}{" "}
            <span className="text-xs text-emerald-400 font-normal">({metrics.averageMockScore} avg)</span>
          </div>
          <div className="text-[10px] text-[#98A69D] font-mono mt-0.5">Official & Practice</div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="glass-card rounded-2xl p-2 border border-[#25352C] flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("IELTS")}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "IELTS"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>IELTS Band 8.5 Lab</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {ieltsRecords.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ARABIC")}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "ARABIC"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>Arabic CEFR Workspace</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {arabicLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("VOCAB")}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "VOCAB"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Vocabulary & Spaced Repetition</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {vocabCards.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("TIMER")}
          className={`flex-1 min-w-[150px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "TIMER"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <Timer className="w-4 h-4" />
          <span>Study Timer & Exams</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {examResults.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "IELTS" && (
        <IeltsWorkspace
          initialRecords={ieltsRecords}
          initialExamResults={examResults}
        />
      )}

      {activeTab === "ARABIC" && (
        <ArabicWorkspace
          initialLogs={arabicLogs}
          onOpenVocabTab={() => setActiveTab("VOCAB")}
        />
      )}

      {activeTab === "VOCAB" && (
        <VocabularySystem initialCards={vocabCards} />
      )}

      {activeTab === "TIMER" && (
        <StudyTimer
          initialSessions={studySessions}
          initialExams={examResults}
        />
      )}
    </div>
  );
}
