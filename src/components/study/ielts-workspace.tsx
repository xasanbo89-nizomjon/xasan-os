"use client";

import React, { useState } from "react";
import { IeltsPracticeRecordSummary, ExamResultSummary } from "@/types";
import {
  Mic,
  FileText,
  BookOpen,
  Headphones,
  Award,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  Target,
} from "lucide-react";
import {
  createIeltsRecordAction,
  deleteIeltsRecordAction,
  createExamResultAction,
  deleteExamResultAction,
} from "@/server/actions/study";
import { formatDate } from "@/lib/utils";

interface IeltsWorkspaceProps {
  initialRecords: IeltsPracticeRecordSummary[];
  initialExamResults: ExamResultSummary[];
}

export function IeltsWorkspace({
  initialRecords,
  initialExamResults,
}: IeltsWorkspaceProps) {
  const [records, setRecords] = useState<IeltsPracticeRecordSummary[]>(initialRecords);
  const [examResults, setExamResults] = useState<ExamResultSummary[]>(initialExamResults);
  const [selectedSection, setSelectedSection] = useState<string>("ALL");

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Record Form
  const [recordSection, setRecordSection] = useState("SPEAKING");
  const [recordTitle, setRecordTitle] = useState("");
  const [recordTaskType, setRecordTaskType] = useState("PART_2");
  const [recordPrompt, setRecordPrompt] = useState("");
  const [recordSubmission, setRecordSubmission] = useState("");
  const [recordBandScore, setRecordBandScore] = useState(8.5);
  const [recordDuration, setRecordDuration] = useState(20);
  const [recordWordCount, setRecordWordCount] = useState<number | undefined>(undefined);
  const [recordFeedback, setRecordFeedback] = useState("");
  const [isSubmittingRecord, setIsSubmittingRecord] = useState(false);

  // Exam Form
  const [examTitle, setExamTitle] = useState("");
  const [examListening, setExamListening] = useState(8.5);
  const [examReading, setExamReading] = useState(8.5);
  const [examWriting, setExamWriting] = useState(8.0);
  const [examSpeaking, setExamSpeaking] = useState(8.5);
  const [examNotes, setExamNotes] = useState("");
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  const sections = [
    { id: "ALL", label: "All Sections", icon: BookOpen },
    { id: "SPEAKING", label: "Speaking Lab", icon: Mic },
    { id: "WRITING", label: "Academic Writing", icon: FileText },
    { id: "READING", label: "Academic Reading", icon: BookOpen },
    { id: "LISTENING", label: "Listening", icon: Headphones },
  ];

  const filteredRecords = records.filter((r) => {
    if (selectedSection === "ALL") return true;
    return r.section.toUpperCase() === selectedSection.toUpperCase();
  });

  const getSectionIcon = (sec: string) => {
    switch (sec.toUpperCase()) {
      case "SPEAKING":
        return <Mic className="w-4 h-4 text-[#10B981]" />;
      case "WRITING":
        return <FileText className="w-4 h-4 text-[#3B82F6]" />;
      case "READING":
        return <BookOpen className="w-4 h-4 text-[#F59E0B]" />;
      case "LISTENING":
        return <Headphones className="w-4 h-4 text-[#8B5CF6]" />;
      default:
        return <Award className="w-4 h-4 text-[#10B981]" />;
    }
  };

  const getSectionColor = (sec: string) => {
    switch (sec.toUpperCase()) {
      case "SPEAKING":
        return "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
      case "WRITING":
        return "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30";
      case "READING":
        return "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30";
      case "LISTENING":
        return "bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30";
      default:
        return "bg-[#98A69D]/15 text-[#98A69D] border-[#25352C]";
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordTitle.trim()) return;

    setIsSubmittingRecord(true);
    try {
      const res = await createIeltsRecordAction({
        section: recordSection,
        title: recordTitle.trim(),
        taskType: recordTaskType,
        prompt: recordPrompt.trim() || undefined,
        submission: recordSubmission.trim() || undefined,
        bandScore: Number(recordBandScore),
        durationMinutes: Number(recordDuration),
        wordCount: recordWordCount ? Number(recordWordCount) : undefined,
        feedback: recordFeedback.trim() || undefined,
      });

      if (res.success && res.record) {
        setRecords((prev) => [res.record as IeltsPracticeRecordSummary, ...prev]);
        setIsRecordModalOpen(false);
        setRecordTitle("");
        setRecordPrompt("");
        setRecordSubmission("");
        setRecordFeedback("");
      }
    } finally {
      setIsSubmittingRecord(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm("Delete practice record?")) return;
    setRecords((prev) => prev.filter((r) => r.id !== id));
    await deleteIeltsRecordAction(id);
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examTitle.trim()) return;

    setIsSubmittingExam(true);
    try {
      const res = await createExamResultAction({
        title: examTitle.trim(),
        listeningScore: Number(examListening),
        readingScore: Number(examReading),
        writingScore: Number(examWriting),
        speakingScore: Number(examSpeaking),
        notes: examNotes.trim() || undefined,
      });

      if (res.success && res.result) {
        setExamResults((prev) => [res.result as ExamResultSummary, ...prev]);
        setIsExamModalOpen(false);
        setExamTitle("");
        setExamNotes("");
      }
    } finally {
      setIsSubmittingExam(false);
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm("Delete mock exam result?")) return;
    setExamResults((prev) => prev.filter((r) => r.id !== id));
    await deleteExamResultAction(id);
  };

  // Recent mock overall band
  const latestMock = examResults[0];

  return (
    <div className="space-y-6">
      {/* Target Band & Diagnostic Telemetry Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-[#10B981]/40 bg-[#101915] space-y-1.5 emerald-glow-sm">
          <div className="text-xs font-mono text-[#98A69D] uppercase tracking-wider flex items-center justify-between">
            <span>Target Band</span>
            <Target className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#10B981]">
            8.5 <span className="text-xs font-normal text-[#98A69D]">Overall</span>
          </div>
          <p className="text-[11px] text-[#98A69D]">
            Global Academic & Thought Leader standard
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="text-xs font-mono text-[#98A69D] uppercase tracking-wider flex items-center justify-between">
            <span>Current Estimated Band</span>
            <Award className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#3B82F6]">
            {latestMock ? latestMock.overallBand : 8.0}
          </div>
          <p className="text-[11px] text-[#98A69D]">
            Based on {examResults.length} proctored mock examinations
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="text-xs font-mono text-[#98A69D] uppercase tracking-wider flex items-center justify-between">
            <span>Practice Drills</span>
            <FileText className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-black font-mono text-[#F59E0B]">
            {records.length} <span className="text-xs font-normal text-[#98A69D]">sessions</span>
          </div>
          <p className="text-[11px] text-[#98A69D]">
            Writing essays, speaking evaluations & reading tests
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-1.5">
          <div className="text-xs font-mono text-[#98A69D] uppercase tracking-wider flex items-center justify-between">
            <span>Mock Simulation Score</span>
            <Sparkles className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-xs font-mono text-[#F3F7F4] space-y-0.5 pt-1">
            <div className="flex justify-between">
              <span>L: {latestMock?.listeningScore || 9.0}</span>
              <span>R: {latestMock?.readingScore || 8.5}</span>
            </div>
            <div className="flex justify-between text-[#98A69D]">
              <span>W: {latestMock?.writingScore || 8.0}</span>
              <span>S: {latestMock?.speakingScore || 8.5}</span>
            </div>
          </div>
          <p className="text-[10px] text-[#10B981] pt-1">
            Ready for official testing
          </p>
        </div>
      </div>

      {/* Section Filter Toolbar & Action Buttons */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSection(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  selectedSection === sec.id
                    ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                    : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {sec.label}
              </button>
            );
          })}
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsExamModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#142019] hover:bg-[#101915] text-[#3B82F6] border border-[#3B82F6]/40 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            Log Mock Exam
          </button>

          <button
            type="button"
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Log Practice Drill
          </button>
        </div>
      </div>

      {/* Practice Records Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#10B981]" />
          Section Practice Records ({filteredRecords.length})
        </h3>

        {filteredRecords.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center border border-[#25352C] bg-[#101915]/50 text-xs text-[#98A69D]">
            No practice sessions logged in this category. Click &quot;Log Practice Drill&quot; to add one.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map((rec) => (
              <div
                key={rec.id}
                className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#142019]/90 hover:border-[#10B981]/40 transition-all duration-200 space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getSectionColor(rec.section)}`}>
                        {rec.section}
                      </span>
                      {rec.taskType && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C]">
                          {rec.taskType}
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                        Band {rec.bandScore?.toFixed(1) || "8.0"}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                      {rec.title}
                    </h4>

                    {rec.prompt && (
                      <p className="text-xs text-[#98A69D] italic border-l-2 border-[#10B981]/30 pl-3 py-0.5">
                        &ldquo;{rec.prompt}&rdquo;
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteRecord(rec.id)}
                    className="p-1 rounded text-[#98A69D] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Submission or feedback notes */}
                {rec.feedback && (
                  <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C] space-y-1 text-xs">
                    <div className="text-[10px] font-mono text-[#10B981] font-semibold uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Examiner Assessment & Lexical Telemetry
                    </div>
                    <p className="text-[#98A69D] leading-relaxed">
                      {rec.feedback}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D] pt-1">
                  <div className="flex items-center gap-3">
                    {rec.durationMinutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#10B981]" />
                        {rec.durationMinutes} mins
                      </span>
                    )}
                    {rec.wordCount && (
                      <span>{rec.wordCount} words</span>
                    )}
                  </div>
                  <span>{formatDate(rec.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mock Exams History Section */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] bg-[#101915] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
          <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#10B981]" />
            Full Simulation Mock Exam Benchmarks
          </h3>
          <span className="text-xs font-mono text-[#10B981]">
            {examResults.length} Tests Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#25352C] text-[#98A69D] font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Exam Simulation</th>
                <th className="pb-3 font-semibold">Listening</th>
                <th className="pb-3 font-semibold">Reading</th>
                <th className="pb-3 font-semibold">Writing</th>
                <th className="pb-3 font-semibold">Speaking</th>
                <th className="pb-3 font-semibold">Overall Band</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#25352C]/60">
              {examResults.map((exam) => (
                <tr key={exam.id} className="hover:bg-[#142019]/60 transition-colors">
                  <td className="py-3 font-medium text-[#F3F7F4]">
                    <div>{exam.title}</div>
                    {exam.notes && (
                      <div className="text-[11px] text-[#98A69D] truncate max-w-xs">{exam.notes}</div>
                    )}
                  </td>
                  <td className="py-3 font-mono font-bold text-[#8B5CF6]">{exam.listeningScore.toFixed(1)}</td>
                  <td className="py-3 font-mono font-bold text-[#F59E0B]">{exam.readingScore.toFixed(1)}</td>
                  <td className="py-3 font-mono font-bold text-[#3B82F6]">{exam.writingScore.toFixed(1)}</td>
                  <td className="py-3 font-mono font-bold text-[#10B981]">{exam.speakingScore.toFixed(1)}</td>
                  <td className="py-3 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-extrabold border border-[#10B981]/40">
                      Band {exam.overallBand.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[#98A69D]">{formatDate(exam.date)}</td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => handleDeleteExam(exam.id)}
                      className="p-1 rounded text-[#98A69D] hover:text-[#EF4444]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Practice Drill Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-lg border border-[#25352C] bg-[#101915] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F3F7F4]">
                    Log IELTS Practice Drill
                  </h3>
                  <p className="text-xs text-[#98A69D]">
                    Record essay submission, speaking feedback, or reading score
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRecordModalOpen(false)}
                className="p-1 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    Section
                  </label>
                  <select
                    value={recordSection}
                    onChange={(e) => setRecordSection(e.target.value)}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="SPEAKING">Speaking</option>
                    <option value="WRITING">Writing</option>
                    <option value="READING">Reading</option>
                    <option value="LISTENING">Listening</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    Task / Part Type
                  </label>
                  <input
                    type="text"
                    value={recordTaskType}
                    onChange={(e) => setRecordTaskType(e.target.value)}
                    placeholder="e.g. Task 2, Part 2, Section 4"
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Title <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={recordTitle}
                  onChange={(e) => setRecordTitle(e.target.value)}
                  placeholder="e.g. Cambridge 18 Test 3: Technological Automation"
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-sm text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Prompt / Exam Question
                </label>
                <textarea
                  rows={2}
                  value={recordPrompt}
                  onChange={(e) => setRecordPrompt(e.target.value)}
                  placeholder="Topic card cue, essay prompt, or reading title..."
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    Band Score
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    max="9.0"
                    value={recordBandScore}
                    onChange={(e) => setRecordBandScore(Number(e.target.value))}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    Duration (mins)
                  </label>
                  <input
                    type="number"
                    value={recordDuration}
                    onChange={(e) => setRecordDuration(Number(e.target.value))}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                    Word Count
                  </label>
                  <input
                    type="number"
                    value={recordWordCount || ""}
                    onChange={(e) => setRecordWordCount(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 340"
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Examiner Assessment & Lexical Notes
                </label>
                <textarea
                  rows={3}
                  value={recordFeedback}
                  onChange={(e) => setRecordFeedback(e.target.value)}
                  placeholder="Lexical resource collocations, grammatical range, coherence notes..."
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#25352C]">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#142019] hover:bg-[#142019]/80 text-[#98A69D] border border-[#25352C] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRecord || !recordTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isSubmittingRecord ? "Logging..." : "Save Practice Session"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Mock Exam Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl w-full max-w-lg border border-[#25352C] bg-[#101915] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] flex items-center justify-center border border-[#3B82F6]/30">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F3F7F4]">
                    Log Full Mock Examination
                  </h3>
                  <p className="text-xs text-[#98A69D]">
                    4-Section benchmark simulation with automated overall band
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="p-1 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4 pt-4">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Exam Title / Paper <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Cambridge 18 Test 4 Full Academic Mock"
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-sm text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#8B5CF6] uppercase block mb-1">
                    Listening
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    max="9.0"
                    value={examListening}
                    onChange={(e) => setExamListening(Number(e.target.value))}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#F59E0B] uppercase block mb-1">
                    Reading
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    max="9.0"
                    value={examReading}
                    onChange={(e) => setExamReading(Number(e.target.value))}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#3B82F6] uppercase block mb-1">
                    Writing
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    max="9.0"
                    value={examWriting}
                    onChange={(e) => setExamWriting(Number(e.target.value))}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#10B981] uppercase block mb-1">
                    Speaking
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1.0"
                    max="9.0"
                    value={examSpeaking}
                    onChange={(e) => setExamSpeaking(Number(e.target.value))}
                    className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] font-mono"
                  />
                </div>
              </div>

              {/* Computed Overall Preview */}
              <div className="p-3 rounded-xl bg-[#142019] border border-[#10B981]/30 flex items-center justify-between">
                <span className="text-xs text-[#98A69D] font-mono">Predicted Overall Band:</span>
                <span className="text-sm font-black font-mono text-[#10B981]">
                  Band {(Math.round(((examListening + examReading + examWriting + examSpeaking) / 4) * 2) / 2).toFixed(1)}
                </span>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                  Simulation Notes / Bottlenecks
                </label>
                <textarea
                  rows={2}
                  value={examNotes}
                  onChange={(e) => setExamNotes(e.target.value)}
                  placeholder="Pacing notes, distractor identification in Listening section 3..."
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#25352C]">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#142019] hover:bg-[#142019]/80 text-[#98A69D] border border-[#25352C] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingExam || !examTitle.trim()}
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20"
                >
                  <Award className="w-3.5 h-3.5" />
                  {isSubmittingExam ? "Recording..." : "Record Mock Result"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
