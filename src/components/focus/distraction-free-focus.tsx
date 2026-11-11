"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, X, Maximize2, Minimize2, CheckCircle2, Volume2, VolumeX, Sparkles, FileText, Check } from "lucide-react";
import { useTranslation } from "@/stores/language-store";

interface DistractionFreeFocusProps {
  isOpen: boolean;
  onClose: () => void;
  secondsRemaining: number;
  totalSeconds: number;
  isActive: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  onAddMinutes: (mins: number) => void;
  subject: string;
  taskTitle?: string;
  notes: string;
  onChangeNotes: (notes: string) => void;
  onCompleteSession: () => void;
}

export function DistractionFreeFocus({
  isOpen,
  onClose,
  secondsRemaining,
  totalSeconds,
  isActive,
  onTogglePlay,
  onReset,
  onAddMinutes,
  subject,
  taskTitle,
  notes,
  onChangeNotes,
  onCompleteSession,
}: DistractionFreeFocusProps) {
  const { isUz } = useTranslation();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ambientSound, setAmbientSound] = useState<string>("off"); // off, binaural, rain

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const progressPercent = totalSeconds > 0
    ? Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100)
    : 0;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request error:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.warn("Exit fullscreen error:", err);
      });
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#080D0B] text-[#F3F7F4] flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#10B981] font-bold">
            {isUz ? "CHALG‘ITUVCHILARSIZ PROTOKOL" : "DISTRACTION-FREE PROTOCOL"}
          </span>
          {taskTitle && (
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#101915] text-[#98A69D] border border-[#25352C] hidden sm:inline">
              {isUz ? "Vazifa: " : "Task: "}{taskTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Sound Mode */}
          <div className="flex items-center bg-[#101915] rounded-xl p-1 border border-[#25352C]">
            <button
              type="button"
              onClick={() => setAmbientSound(ambientSound === "off" ? "binaural" : "off")}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
                ambientSound !== "off"
                  ? "bg-[#142019] text-[#10B981]"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
            >
              {ambientSound !== "off" ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">
                {ambientSound === "off"
                  ? (isUz ? "Fon Ovozi O‘chiq" : "Ambient Off")
                  : "432Hz Focus"}
              </span>
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C] transition-colors cursor-pointer"
            title={isUz ? "To‘liq ekranga o‘tish" : "Toggle Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Exit Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#101915] text-[#98A69D] hover:text-[#EF4444] border border-[#25352C] transition-colors cursor-pointer"
            title={isUz ? "Rejimdan chiqish" : "Exit Distraction-Free Mode"}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Center Timer & Focus Subject */}
      <div className="max-w-xl mx-auto w-full text-center space-y-8 my-auto">
        <div className="space-y-2">
          <span className="text-xs font-mono text-[#98A69D] uppercase tracking-wider">
            {isUz ? "Hozirgi Yagona Diqqat Vazifasi" : "Current Single-Task Focus"}
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#F3F7F4] tracking-tight">
            {subject || (isUz ? "Chuqur Muhandislik va Arxitektura Ishi" : "Deep Architecture & Engineering Work")}
          </h2>
        </div>

        {/* Massive Timer Countdown */}
        <div className="relative py-4 select-none">
          <div className="text-7xl sm:text-9xl font-black font-mono text-[#F3F7F4] tracking-widest text-shadow-emerald">
            {timeFormatted}
          </div>

          <div className="w-64 max-w-full mx-auto h-2 rounded-full bg-[#101915] border border-[#25352C] overflow-hidden mt-6">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] transition-all duration-1000 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-xs font-mono text-[#98A69D] mt-2">
            {progressPercent}% {isUz ? "bajarildi" : "completed"} ({Math.round((totalSeconds - secondsRemaining) / 60)}{isUz ? "d" : "m"} / {Math.round(totalSeconds / 60)}{isUz ? "d" : "m"})
          </div>
        </div>

        {/* Minimalist Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onAddMinutes(5)}
            className="px-3.5 py-2 rounded-xl bg-[#101915] hover:bg-[#142019] text-[#98A69D] hover:text-[#10B981] border border-[#25352C] text-xs font-mono transition-colors cursor-pointer"
          >
            {isUz ? "+5d" : "+5m"}
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isActive
                ? "bg-[#142019] border border-[#10B981] text-[#10B981] shadow-lg shadow-[#10B981]/20"
                : "bg-[#10B981] text-[#080D0B] hover:bg-[#059669] shadow-xl shadow-[#10B981]/30 font-bold"
            }`}
          >
            {isActive ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-1" />
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="p-3 rounded-xl bg-[#101915] hover:bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C] transition-colors cursor-pointer"
            title={isUz ? "Intervalni qayta boshlash" : "Reset interval"}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onCompleteSession}
            className="px-4 py-2.5 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isUz ? "Yakunlash va Saqlash" : "Finish & Log"}
          </button>
        </div>
      </div>

      {/* Bottom Scratchpad for Session Notes */}
      <div className="max-w-xl mx-auto w-full">
        <div className="p-4 rounded-2xl bg-[#101915]/90 border border-[#25352C] space-y-2 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-[#98A69D]">
            <span className="flex items-center gap-1.5 text-[#10B981] font-semibold">
              <FileText className="w-3.5 h-3.5" /> {isUz ? "Seans Qaydnomasi" : "Session Scratchpad"}
            </span>
            <span className="text-[10px]">
              {isUz
                ? "Ish oqimini buzmasdan tezkor fikrlarni yozib boring"
                : "Jot notes & breakthroughs without breaking flow"}
            </span>
          </div>

          <textarea
            rows={2}
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder={
              isUz
                ? "Muhim fikrlar, natijalar yoki keyingi qadamlarni yozing..."
                : "Record insights, latency numbers, or immediate next steps..."
            }
            className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] placeholder-[#98A69D]/60 focus:outline-none focus:border-[#10B981] resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
