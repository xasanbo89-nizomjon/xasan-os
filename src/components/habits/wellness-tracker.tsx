"use client";

import React, { useState } from "react";
import { WellnessLogSummary } from "@/types";
import {
  Moon,
  Activity,
  Droplets,
  Smile,
  Zap,
  Save,
  Plus,
  CheckCircle2,
  Calendar,
  Sparkles,
  FileText,
} from "lucide-react";
import { logWellnessAction } from "@/server/actions/habits";
import { formatDate } from "@/lib/utils";

interface WellnessTrackerProps {
  initialLogs: WellnessLogSummary[];
}

export function WellnessTracker({ initialLogs }: WellnessTrackerProps) {
  const [logs, setLogs] = useState<WellnessLogSummary[]>(initialLogs);
  const today = new Date().toISOString().slice(0, 10);
  const todayLog = logs.find((l) => l.date === today);

  const [sleepHours, setSleepHours] = useState<number>(todayLog?.sleepHours || 7.5);
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(todayLog?.exerciseMinutes || 45);
  const [waterGlasses, setWaterGlasses] = useState<number>(todayLog?.waterGlasses || 8);
  const [mood, setMood] = useState<string>(todayLog?.mood || "Energized");
  const [energyLevel, setEnergyLevel] = useState<number>(todayLog?.energyLevel || 4);
  const [notes, setNotes] = useState<string>(todayLog?.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const moods = ["Energized", "Focused", "Calm", "Reflective", "Tired", "Challenged"];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await logWellnessAction({
        date: today,
        sleepHours: Number(sleepHours),
        exerciseMinutes: Number(exerciseMinutes),
        waterGlasses: Number(waterGlasses),
        mood,
        energyLevel: Number(energyLevel),
        notes: notes.trim() || undefined,
      });

      if (res.success && res.log) {
        setLogs((prev) => {
          const filtered = prev.filter((l) => l.date !== today);
          return [res.log as WellnessLogSummary, ...filtered];
        });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Input Form */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] bg-[#101915] space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F3F7F4]">
                Daily Wellness Protocol
              </h3>
              <p className="text-xs text-[#98A69D]">
                Non-medical physical recovery, hydration, rest, and cognitive stamina telemetry
              </p>
            </div>
          </div>

          <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full border border-[#10B981]/30">
            {today}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sleep Hours */}
            <div className="p-4 rounded-xl bg-[#142019] border border-[#25352C] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#F3F7F4]">
                <span className="flex items-center gap-1.5 text-[#3B82F6]">
                  <Moon className="w-4 h-4" /> Sleep Duration
                </span>
                <span className="font-mono text-sm font-bold text-[#3B82F6]">
                  {sleepHours} hrs
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-[#3B82F6] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#98A69D]">
                <span>4h</span>
                <span>8h (Optimum)</span>
                <span>12h</span>
              </div>
            </div>

            {/* Exercise Minutes */}
            <div className="p-4 rounded-xl bg-[#142019] border border-[#25352C] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#F3F7F4]">
                <span className="flex items-center gap-1.5 text-[#F59E0B]">
                  <Activity className="w-4 h-4" /> Exercise / Movement
                </span>
                <span className="font-mono text-sm font-bold text-[#F59E0B]">
                  {exerciseMinutes} mins
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={exerciseMinutes}
                onChange={(e) => setExerciseMinutes(Number(e.target.value))}
                className="w-full accent-[#F59E0B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#98A69D]">
                <span>0m</span>
                <span>45m (Target)</span>
                <span>120m</span>
              </div>
            </div>

            {/* Water Intake */}
            <div className="p-4 rounded-xl bg-[#142019] border border-[#25352C] space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#F3F7F4]">
                <span className="flex items-center gap-1.5 text-[#10B981]">
                  <Droplets className="w-4 h-4" /> Water Hydration
                </span>
                <span className="font-mono text-sm font-bold text-[#10B981]">
                  {waterGlasses} glasses
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1 overflow-x-auto">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-7 rounded transition-colors ${
                        i < waterGlasses ? "bg-[#10B981]" : "bg-[#101915] border border-[#25352C]"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setWaterGlasses((prev) => prev + 1)}
                  className="px-2.5 py-1 rounded-lg bg-[#101915] hover:bg-[#10B981]/20 text-[#10B981] border border-[#25352C] text-xs font-mono font-bold"
                >
                  +1
                </button>
              </div>
            </div>
          </div>

          {/* Mood & Energy Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mood selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-[#98A69D] flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-[#10B981]" /> Dominant Cognitive State
              </label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      mood === m
                        ? "bg-[#10B981] text-[#080D0B] font-bold"
                        : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level 1-5 */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-[#98A69D] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#F59E0B]" /> Energy & Stamina Rating (1 to 5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setEnergyLevel(level)}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      energyLevel >= level
                        ? "bg-[#F59E0B] text-[#080D0B]"
                        : "bg-[#142019] text-[#98A69D] border border-[#25352C]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[#98A69D] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#10B981]" /> Wellness Notes & Physical Sensations
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Completed 5km zone 2 recovery run. Rested well, zero mental fog..."
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] resize-none"
            />
          </div>

          <div className="flex justify-end items-center gap-3 pt-2">
            {savedSuccess && (
              <span className="text-xs font-mono text-[#10B981] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Telemetry saved successfully!
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Logging..." : "Log Wellness Day"}
            </button>
          </div>
        </form>
      </div>

      {/* Historical Wellness Logs */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] bg-[#101915] space-y-4">
        <h4 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#10B981]" />
          Historical Wellness Records
        </h4>

        <div className="space-y-2.5">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-[#142019] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#10B981]">
                    {log.date}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#3B82F6] border border-[#3B82F6]/30">
                    {log.sleepHours}h Sleep
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#F59E0B] border border-[#F59E0B]/30">
                    {log.exerciseMinutes}m Exercise
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#10B981] border border-[#10B981]/30">
                    {log.waterGlasses} Glasses
                  </span>
                </div>
                {log.notes && (
                  <p className="text-xs text-[#98A69D] leading-relaxed">
                    {log.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-[#101915] text-[#F3F7F4] border border-[#25352C] font-mono">
                  {log.mood}
                </span>
                <span className="text-xs px-2 py-1 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-mono">
                  ⚡ {log.energyLevel}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
