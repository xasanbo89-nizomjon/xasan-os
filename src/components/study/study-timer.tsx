"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Plus,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  History,
  TrendingUp,
  FileSpreadsheet,
  AlertCircle,
  X,
} from "lucide-react";
import { StudySessionSummary, ExamResultSummary } from "@/types";
import { logStudySessionAction, createExamResultAction } from "@/server/actions/study";

interface StudyTimerProps {
  initialSessions: StudySessionSummary[];
  initialExams: ExamResultSummary[];
}

const SUBJECT_PRESETS = [
  { id: "ielts-reading", label: "IELTS Academic Reading", category: "IELTS" },
  { id: "ielts-writing", label: "IELTS Writing Task 2", category: "IELTS" },
  { id: "ielts-speaking", label: "IELTS Speaking Band 8.5 Lab", category: "IELTS" },
  { id: "arabic-nahw", label: "Arabic Grammar (Nahw & Sarf)", category: "ARABIC" },
  { id: "arabic-vocab", label: "Arabic Classical Lexicon", category: "ARABIC" },
  { id: "arch-design", label: "Software Architecture & Scalability", category: "CORE" },
];

const DURATION_PRESETS = [15, 25, 45, 60, 90];

export function StudyTimer({ initialSessions, initialExams }: StudyTimerProps) {
  const [sessions, setSessions] = useState<StudySessionSummary[]>(initialSessions);
  const [exams, setExams] = useState<ExamResultSummary[]>(initialExams);
  const [activeTab, setActiveTab] = useState<"TIMER" | "HISTORY">("TIMER");

  // Timer state
  const [selectedSubject, setSelectedSubject] = useState<string>("IELTS Academic Reading");
  const [targetDurationMinutes, setTargetDurationMinutes] = useState<number>(45);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(45 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [sessionNotes, setSessionNotes] = useState<string>("");
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);

  // New Exam Modal
  const [isExamModalOpen, setIsExamModalOpen] = useState<boolean>(false);
  const [examForm, setExamForm] = useState({
    title: "",
    examType: "IELTS_ACADEMIC",
    listeningScore: 8.5,
    readingScore: 8.5,
    writingScore: 7.5,
    speakingScore: 8.5,
    notes: "",
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Interval hook
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            setIsPaused(false);
            setIsLogModalOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused]);

  // Set preset duration
  const handleSelectDuration = (minutes: number) => {
    if (isActive) return;
    setTargetDurationMinutes(minutes);
    setSecondsRemaining(minutes * 60);
  };

  const handleStartTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseTimer = () => {
    setIsPaused(true);
  };

  const handleResumeTimer = () => {
    setIsPaused(false);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setSecondsRemaining(targetDurationMinutes * 60);
  };

  const handleAddMinutes = (min: number) => {
    setSecondsRemaining((prev) => prev + min * 60);
    setTargetDurationMinutes((prev) => prev + min);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const totalSeconds = targetDurationMinutes * 60;
  const progressPercentage = totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0;

  // Save Session
  const handleSaveSession = async () => {
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60) || targetDurationMinutes);
    const res = await logStudySessionAction({
      subject: selectedSubject,
      durationMinutes: elapsedMinutes,
      notes: sessionNotes || undefined,
    });

    if (res.success && res.session) {
      const newSession: StudySessionSummary = {
        ...res.session,
        completedAt: typeof res.session.completedAt === "string" ? res.session.completedAt : new Date(res.session.completedAt).toISOString(),
      };
      setSessions((prev) => [newSession, ...prev]);
    }

    setIsLogModalOpen(false);
    setSessionNotes("");
    handleResetTimer();
  };

  // Save Exam Result
  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examForm.title.trim()) return;

    const res = await createExamResultAction({
      examType: examForm.examType,
      title: examForm.title,
      listeningScore: Number(examForm.listeningScore),
      readingScore: Number(examForm.readingScore),
      writingScore: Number(examForm.writingScore),
      speakingScore: Number(examForm.speakingScore),
      notes: examForm.notes,
    });

    if (res.success && res.result) {
      const newExam: ExamResultSummary = {
        ...res.result,
        date: typeof res.result.date === "string" ? res.result.date : new Date(res.result.date).toISOString(),
        createdAt: typeof res.result.createdAt === "string" ? res.result.createdAt : new Date(res.result.createdAt).toISOString(),
      };
      setExams((prev) => [newExam, ...prev]);
      setIsExamModalOpen(false);
      setExamForm({
        title: "",
        examType: "IELTS_ACADEMIC",
        listeningScore: 8.5,
        readingScore: 8.5,
        writingScore: 7.5,
        speakingScore: 8.5,
        notes: "",
      });
    }
  };

  // Exam stats
  const averageBand =
    exams.length > 0
      ? (exams.reduce((sum, e) => sum + e.overallBand, 0) / exams.length).toFixed(2)
      : "8.0";

  const highestBand =
    exams.length > 0 ? Math.max(...exams.map((e) => e.overallBand)).toFixed(1) : "8.5";

  const totalStudyMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("TIMER")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "TIMER"
                ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20"
                : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Interactive Study Timer</span>
          </button>
          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "HISTORY"
                ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20"
                : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Exam History & Benchmarks</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#142019] text-[#98A69D] font-mono">
              {exams.length}
            </span>
          </button>
        </div>

        {activeTab === "HISTORY" && (
          <button
            onClick={() => setIsExamModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Log Mock Exam</span>
          </button>
        )}
      </div>

      {/* ===================== VIEW 1: INTERACTIVE STUDY TIMER ===================== */}
      {activeTab === "TIMER" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Timer Display */}
          <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-[#25352C] flex flex-col items-center justify-between min-h-[460px] bg-gradient-to-b from-[#142019] to-[#101915]">
            {/* Subject Selector */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pb-6 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#10B981]" />
                <span className="text-xs font-mono text-[#98A69D]">CURRENT SUBJECT:</span>
              </div>
              <select
                disabled={isActive}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#101915] border border-[#25352C] text-xs font-semibold text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              >
                {SUBJECT_PRESETS.map((p) => (
                  <option key={p.id} value={p.label}>
                    [{p.category}] {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Circular Visualizer & Digital Display */}
            <div className="relative my-8 flex items-center justify-center">
              {/* Outer SVG Circular Ring */}
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#25352C"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 110}
                  strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercentage / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-linear"
                />
              </svg>

              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-5xl font-mono font-bold tracking-tight text-[#F3F7F4] drop-shadow-md">
                  {formatTime(secondsRemaining)}
                </div>
                <div className="text-xs font-mono text-[#98A69D] mt-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>
                    {isActive ? (isPaused ? "Paused" : "Deep Focus Active") : "Ready"}
                  </span>
                </div>
              </div>
            </div>

            {/* Duration Presets & Quick Add */}
            <div className="w-full space-y-4">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {DURATION_PRESETS.map((min) => (
                  <button
                    key={min}
                    disabled={isActive}
                    onClick={() => handleSelectDuration(min)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      targetDurationMinutes === min
                        ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
                        : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C] disabled:opacity-40"
                    }`}
                  >
                    {min}m
                  </button>
                ))}

                <div className="h-4 w-px bg-[#25352C] mx-1" />

                <button
                  onClick={() => handleAddMinutes(5)}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-[#10B981]"
                >
                  +5m
                </button>
                <button
                  onClick={() => handleAddMinutes(15)}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-[#10B981]"
                >
                  +15m
                </button>
              </div>

              {/* Primary Controls */}
              <div className="flex items-center justify-center gap-4 pt-2">
                {!isActive ? (
                  <button
                    onClick={handleStartTimer}
                    className="px-8 py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-sm shadow-xl shadow-[#10B981]/20 flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Session</span>
                  </button>
                ) : isPaused ? (
                  <button
                    onClick={handleResumeTimer}
                    className="px-8 py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-sm shadow-xl shadow-[#10B981]/20 flex items-center gap-2 transition-all"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Resume</span>
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTimer}
                    className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-[#080D0B] font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={handleResetTimer}
                  className="p-3 rounded-2xl bg-[#101915] border border-[#25352C] hover:border-[#EF4444] text-[#98A69D] hover:text-[#EF4444] transition-all"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {isActive && (
                  <button
                    onClick={() => {
                      setIsActive(false);
                      setIsPaused(false);
                      setIsLogModalOpen(true);
                    }}
                    className="px-4 py-3 rounded-2xl bg-[#142019] border border-[#25352C] hover:border-[#10B981] text-xs font-semibold text-[#10B981] transition-all"
                  >
                    Finish Early
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Recent Completed Sessions Sidebar */}
          <div className="glass-card rounded-3xl p-6 border border-[#25352C] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#25352C] mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-[#10B981]" />
                  <h3 className="text-xs font-semibold text-[#F3F7F4] uppercase tracking-wider font-mono">
                    Study Session History
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-[#98A69D]">
                  {Math.round(totalStudyMinutes / 60)} hrs total
                </span>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {sessions.map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F3F7F4] truncate max-w-[160px]">
                        {sess.subject}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#10B981]">
                        {sess.durationMinutes} min
                      </span>
                    </div>
                    {sess.notes && (
                      <p className="text-[11px] text-[#98A69D] line-clamp-2 italic">
                        &quot;{sess.notes}&quot;
                      </p>
                    )}
                    <div className="text-[10px] font-mono text-[#98A69D] flex items-center justify-between pt-1 border-t border-[#25352C]/40">
                      <span>{new Date(sess.completedAt).toLocaleDateString()}</span>
                      <span>{new Date(sess.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}

                {sessions.length === 0 && (
                  <div className="text-center py-8 text-xs text-[#98A69D]">
                    No study sessions logged yet. Complete a timer session to track your hours.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#25352C] text-center">
              <span className="text-[11px] text-[#98A69D]">
                Consistent 90-minute daily sessions guarantee IELTS 8.5 retention.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW 2: EXAM HISTORY & BENCHMARKS ===================== */}
      {activeTab === "HISTORY" && (
        <div className="space-y-6">
          {/* Top Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
              <div className="flex items-center justify-between text-xs text-[#98A69D] mb-2 font-mono">
                <span>AVERAGE OVERALL</span>
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="text-3xl font-bold font-mono text-[#10B981]">{averageBand}</div>
              <p className="text-xs text-[#98A69D] mt-1">Across all completed official & mock tests</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
              <div className="flex items-center justify-between text-xs text-[#98A69D] mb-2 font-mono">
                <span>PEAK BAND SCORE</span>
                <Award className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-cyan-400">{highestBand}</div>
              <p className="text-xs text-[#98A69D] mt-1">Target threshold: Band 8.5</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
              <div className="flex items-center justify-between text-xs text-[#98A69D] mb-2 font-mono">
                <span>TESTS COMPLETED</span>
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-[#F3F7F4]">{exams.length}</div>
              <p className="text-xs text-[#98A69D] mt-1">Full 4-skill diagnostic simulations</p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]/80">
              <div className="flex items-center justify-between text-xs text-[#98A69D] mb-2 font-mono">
                <span>TARGET OBJECTIVE</span>
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              </div>
              <div className="text-3xl font-bold font-mono text-[#10B981]">Band 8.5</div>
              <p className="text-xs text-[#98A69D] mt-1">L: 9.0 | R: 9.0 | W: 8.0 | S: 8.5</p>
            </div>
          </div>

          {/* Exam Results Table */}
          <div className="glass-card rounded-2xl border border-[#25352C] overflow-hidden">
            <div className="p-4 border-b border-[#25352C] flex items-center justify-between bg-[#101915]">
              <h3 className="text-xs font-semibold text-[#F3F7F4] uppercase font-mono tracking-wider">
                Historical Exam Benchmark Records
              </h3>
              <span className="text-xs text-[#98A69D] font-mono">Official & Diagnostic Mocks</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#25352C] bg-[#142019]/60 text-[#98A69D] font-mono text-[11px]">
                    <th className="py-3 px-4">Exam Title</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-center">Listening</th>
                    <th className="py-3 px-4 text-center">Reading</th>
                    <th className="py-3 px-4 text-center">Writing</th>
                    <th className="py-3 px-4 text-center">Speaking</th>
                    <th className="py-3 px-4 text-center">Overall</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#25352C]">
                  {exams.map((ex) => (
                    <tr key={ex.id} className="hover:bg-[#101915]/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#F3F7F4]">{ex.title}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#101915] border border-[#25352C] text-[#10B981]">
                          {ex.examType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[#F3F7F4]">
                        {ex.listeningScore.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[#F3F7F4]">
                        {ex.readingScore.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[#F3F7F4]">
                        {ex.writingScore.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[#F3F7F4]">
                        {ex.speakingScore.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-[#10B981] font-bold text-xs border border-emerald-500/30">
                          {ex.overallBand.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#98A69D] font-mono">
                        {new Date(ex.date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-[#98A69D] max-w-xs truncate">
                        {ex.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== LOG SESSION MODAL ===================== */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-md w-full bg-[#101915] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">Session Completed!</h3>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#142019] border border-[#25352C] space-y-1">
                <div className="text-xs text-[#98A69D] font-mono">SUBJECT COMPLETED</div>
                <div className="text-sm font-bold text-[#F3F7F4]">{selectedSubject}</div>
                <div className="text-xs font-mono text-[#10B981]">
                  Duration: {Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60))} minutes
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Session Reflections & Takeaways (Optional)
                </label>
                <textarea
                  rows={3}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="e.g. Mastered Cambridge 18 Reading passage 3 (Heading matching), identified inference weakness..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#98A69D] hover:text-[#F3F7F4]"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSaveSession}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all"
                >
                  Save to Study Log
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== NEW EXAM MODAL ===================== */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-lg w-full bg-[#101915] space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">Log Mock Exam Result</h3>
              </div>
              <button
                onClick={() => setIsExamModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Exam Title / Test Source *
                </label>
                <input
                  type="text"
                  required
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  placeholder="e.g. Cambridge IELTS 19 Academic Test 4"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Listening Band
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    required
                    value={examForm.listeningScore}
                    onChange={(e) => setExamForm({ ...examForm, listeningScore: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Reading Band
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    required
                    value={examForm.readingScore}
                    onChange={(e) => setExamForm({ ...examForm, readingScore: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Writing Band
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    required
                    value={examForm.writingScore}
                    onChange={(e) => setExamForm({ ...examForm, writingScore: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Speaking Band
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    required
                    value={examForm.speakingScore}
                    onChange={(e) => setExamForm({ ...examForm, speakingScore: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Section Analysis & Notes
                </label>
                <textarea
                  rows={3}
                  value={examForm.notes}
                  onChange={(e) => setExamForm({ ...examForm, notes: e.target.value })}
                  placeholder="e.g. Reading passage 2 took 24 mins. Writing Task 2 had strong lexical cohesion."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#98A69D] hover:text-[#F3F7F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all"
                >
                  Save Exam Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
