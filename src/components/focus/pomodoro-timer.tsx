"use client";

import React, { useState, useEffect, useRef } from "react";
import { TaskSummary } from "@/types";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  CheckCircle2,
  Coffee,
  Brain,
  ListTodo,
} from "lucide-react";
import { DistractionFreeFocus } from "./distraction-free-focus";
import { logFocusSessionAction } from "@/server/actions/focus";
import { useTranslation } from "@/stores/language-store";

type TimerMode = "POMODORO" | "DEEP_WORK" | "SHORT_BREAK" | "LONG_BREAK" | "CUSTOM";

interface PomodoroTimerProps {
  tasks: TaskSummary[];
  onSessionLogged?: () => void;
  initialTaskId?: string;
}

export function PomodoroTimer({ tasks, onSessionLogged, initialTaskId }: PomodoroTimerProps) {
  const { dict, isUz } = useTranslation();
  const [mode, setMode] = useState<TimerMode>("DEEP_WORK");
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTaskId || "");
  const [customSubject, setCustomSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isDistractionFreeOpen, setIsDistractionFreeOpen] = useState(false);

  // Default durations in seconds
  const modeDurations: Record<TimerMode, number> = {
    POMODORO: 25 * 60,
    DEEP_WORK: 50 * 60,
    SHORT_BREAK: 5 * 60,
    LONG_BREAK: 15 * 60,
    CUSTOM: 45 * 60,
  };

  const [totalSeconds, setTotalSeconds] = useState(modeDurations.DEEP_WORK);
  const [secondsRemaining, setSecondsRemaining] = useState(modeDurations.DEEP_WORK);
  const [isActive, setIsActive] = useState(false);

  // Play audio chime via Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      const tones = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
      tones.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0.001, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.15 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.7);
      });
    } catch (e) {
      console.warn("Audio chime could not play:", e);
    }
  };

  // Interval timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsRemaining <= 0) {
      setIsActive(false);
      playChime();
      handleCompleteSession();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const handleModeChange = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    const secs = modeDurations[newMode];
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
  };

  const handleTogglePlay = () => {
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsRemaining(totalSeconds);
  };

  const handleAddMinutes = (mins: number) => {
    const additionalSecs = mins * 60;
    setTotalSeconds((prev) => prev + additionalSecs);
    setSecondsRemaining((prev) => prev + additionalSecs);
  };

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const activeSubject =
    customSubject.trim() ||
    selectedTask?.title ||
    (mode === "SHORT_BREAK" || mode === "LONG_BREAK"
      ? (isUz ? "Dam Olish va Tiklanish" : "Mind Renewal & Rest")
      : (isUz ? "Chuqur Ishlash Bloki" : "Deep Work Block"));

  const handleCompleteSession = async () => {
    const durationMinutes = Math.round((totalSeconds - secondsRemaining) / 60) || 1;

    await logFocusSessionAction({
      taskId: selectedTaskId || undefined,
      subject: activeSubject,
      durationMinutes,
      notes: notes.trim() || undefined,
      mode,
    });

    onSessionLogged?.();
    setIsDistractionFreeOpen(false);
    setIsActive(false);
    setNotes("");

    // Reset timer
    setSecondsRemaining(totalSeconds);
  };

  // SVG Circular math
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalSeconds > 0 ? (totalSeconds - secondsRemaining) / totalSeconds : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const getModeDisplay = (m: TimerMode) => {
    if (!isUz) return m.replace("_", " ");
    switch (m) {
      case "POMODORO":
        return "POMODORO";
      case "DEEP_WORK":
        return "CHUQUR ISHLASH";
      case "SHORT_BREAK":
        return "QISQA TANAFFUS";
      case "LONG_BREAK":
        return "UZOQ TANAFFUS";
      default:
        return "MAXSUS REJIM";
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#25352C] bg-[#101915] flex flex-col items-center">
      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[#142019] border border-[#25352C] mb-8">
        <button
          type="button"
          onClick={() => handleModeChange("POMODORO")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === "POMODORO"
              ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
              : "text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          {isUz ? "Pomodoro (25d)" : "Pomodoro (25m)"}
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("DEEP_WORK")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === "DEEP_WORK"
              ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
              : "text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          {isUz ? "Chuqur Ishlash (50d)" : "Deep Work (50m)"}
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("SHORT_BREAK")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === "SHORT_BREAK"
              ? "bg-[#3B82F6] text-[#F3F7F4] shadow-md shadow-[#3B82F6]/20 font-bold"
              : "text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          {isUz ? "Qisqa Tanaffus (5d)" : "Short Break (5m)"}
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("LONG_BREAK")}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            mode === "LONG_BREAK"
              ? "bg-[#8B5CF6] text-[#F3F7F4] shadow-md shadow-[#8B5CF6]/20 font-bold"
              : "text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <Coffee className="w-3.5 h-3.5" />
          {isUz ? "Uzoq Tanaffus (15d)" : "Long Break (15m)"}
        </button>
      </div>

      {/* Task & Subject Selector */}
      <div className="w-full max-w-md space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <ListTodo className="w-4 h-4 text-[#10B981]" />
          <span className="text-xs font-semibold text-[#F3F7F4]">
            {isUz ? "Vazifa yoki Ish Rejasini Biriktirish:" : "Attach Task or Work Pipeline Item:"}
          </span>
        </div>

        <select
          value={selectedTaskId}
          onChange={(e) => {
            setSelectedTaskId(e.target.value);
            if (e.target.value) {
              const t = tasks.find((item) => item.id === e.target.value);
              if (t) setCustomSubject(t.title);
            }
          }}
          className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
        >
          <option value="">{isUz ? "Vazifa biriktirilmagan (Maxsus Mavzu)" : "No Task Linked (Custom Subject)"}</option>
          {tasks
            .filter((t) => t.status !== "COMPLETED")
            .map((t) => (
              <option key={t.id} value={t.id}>
                [{t.priority}] {t.title}
              </option>
            ))}
        </select>

        {!selectedTaskId && (
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            placeholder={isUz ? "Diqqat mavzusi (Masalan: Raft konsensus, IELTS Mock #5)" : "Focus Subject (e.g. Raft Consensus Study, IELTS Mock #5)"}
            className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
          />
        )}
      </div>

      {/* Circular Timer Visual */}
      <div className="relative flex items-center justify-center my-4 select-none">
        <svg
          className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90 transform"
          viewBox="0 0 300 300"
        >
          {/* Background Track */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            className="stroke-[#142019]"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            className="transition-all duration-1000 ease-linear"
            stroke={
              mode === "SHORT_BREAK"
                ? "#3B82F6"
                : mode === "LONG_BREAK"
                ? "#8B5CF6"
                : "#10B981"
            }
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Countdown Display */}
        <div className="absolute flex flex-col items-center justify-center text-center space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#10B981] font-bold">
            {getModeDisplay(mode)}
          </span>
          <div className="text-5xl sm:text-6xl font-black font-mono text-[#F3F7F4] tracking-widest">
            {timeFormatted}
          </div>
          <span className="text-xs text-[#98A69D] max-w-[180px] truncate font-medium">
            {activeSubject}
          </span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-3 mt-6">
        <button
          type="button"
          onClick={() => handleAddMinutes(5)}
          className="px-3 py-2 rounded-xl bg-[#142019] hover:bg-[#101915] text-[#98A69D] hover:text-[#10B981] border border-[#25352C] text-xs font-mono transition-colors cursor-pointer"
          title={isUz ? "5 daqiqa qo‘shish" : "Add 5 minutes"}
        >
          {isUz ? "+5d" : "+5m"}
        </button>

        <button
          type="button"
          onClick={handleTogglePlay}
          className={`px-8 py-3.5 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all shadow-xl cursor-pointer ${
            isActive
              ? "bg-[#142019] text-[#10B981] border border-[#10B981] shadow-[#10B981]/20"
              : "bg-[#10B981] text-[#080D0B] hover:bg-[#059669] shadow-[#10B981]/30"
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 fill-current" /> {isUz ? "To‘xtatish" : "Pause"}
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" /> {isUz ? "Boshlash" : "Start Focus"}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="p-3.5 rounded-2xl bg-[#142019] hover:bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C] transition-colors cursor-pointer"
          title={isUz ? "Taymerni qayta o‘rnatish" : "Reset Timer"}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleCompleteSession}
          className="p-3.5 rounded-2xl bg-[#142019] hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 transition-colors cursor-pointer"
          title={isUz ? "Seansni yakunlash va saqlash" : "Complete and Log Session"}
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
      </div>

      {/* Distraction-Free & Audio Settings Row */}
      <div className="flex items-center justify-between w-full max-w-md pt-8 mt-6 border-t border-[#25352C]">
        <button
          type="button"
          onClick={() => setIsDistractionFreeOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-[#10B981] hover:text-[#059669] transition-colors cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
          {isUz ? "Chalg‘ituvchilarsiz To‘liq Ekran" : "Enter Distraction-Free Overlay"}
        </button>

        <button
          type="button"
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 text-xs text-[#98A69D] hover:text-[#F3F7F4] transition-colors cursor-pointer"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#10B981]" />
          ) : (
            <VolumeX className="w-4 h-4" />
          )}
          <span>{soundEnabled ? (isUz ? "Ovoz Yoqilgan" : "Chime On") : (isUz ? "Ovoz O‘chiq" : "Chime Muted")}</span>
        </button>
      </div>

      {/* Fullscreen Distraction-Free Overlay Component */}
      <DistractionFreeFocus
        isOpen={isDistractionFreeOpen}
        onClose={() => setIsDistractionFreeOpen(false)}
        secondsRemaining={secondsRemaining}
        totalSeconds={totalSeconds}
        isActive={isActive}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        onAddMinutes={handleAddMinutes}
        subject={activeSubject}
        taskTitle={selectedTask?.title}
        notes={notes}
        onChangeNotes={setNotes}
        onCompleteSession={handleCompleteSession}
      />
    </div>
  );
}
