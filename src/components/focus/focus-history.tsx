"use client";

import React from "react";
import { FocusSessionSummary } from "@/types";
import { Clock, Brain, Flame, Sparkles, FileText, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface FocusHistoryProps {
  sessions: FocusSessionSummary[];
  stats: {
    totalMinutesToday: number;
    sessionsCompletedToday: number;
    totalFocusHoursAllTime: number;
  };
}

export function FocusHistory({ sessions, stats }: FocusHistoryProps) {
  const getModeColor = (mode: string) => {
    switch (mode) {
      case "DEEP_WORK":
        return "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
      case "POMODORO":
        return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20";
      case "SHORT_BREAK":
        return "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30";
      case "LONG_BREAK":
        return "bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30";
      default:
        return "bg-[#98A69D]/15 text-[#98A69D] border-[#25352C]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-2">
          <div className="flex items-center justify-between text-[#98A69D]">
            <span className="text-xs font-mono uppercase tracking-wider">
              Focus Today
            </span>
            <Clock className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F3F7F4]">
            {stats.totalMinutesToday} <span className="text-xs font-normal text-[#98A69D]">mins</span>
          </div>
          <div className="text-[11px] text-[#98A69D]">
            Across {stats.sessionsCompletedToday} completed session{stats.sessionsCompletedToday === 1 ? "" : "s"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-2">
          <div className="flex items-center justify-between text-[#98A69D]">
            <span className="text-xs font-mono uppercase tracking-wider">
              Sessions Completed
            </span>
            <Brain className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F3F7F4]">
            {sessions.length} <span className="text-xs font-normal text-[#98A69D]">logged</span>
          </div>
          <div className="text-[11px] text-[#10B981]">
            High cognitive flow sustained
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-2">
          <div className="flex items-center justify-between text-[#98A69D]">
            <span className="text-xs font-mono uppercase tracking-wider">
              Cumulative Focus
            </span>
            <Flame className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F3F7F4]">
            {stats.totalFocusHoursAllTime} <span className="text-xs font-normal text-[#98A69D]">hours</span>
          </div>
          <div className="text-[11px] text-[#98A69D]">
            Architecture & IELTS Band 8.5 work
          </div>
        </div>
      </div>

      {/* Session History Log */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] bg-[#101915] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-sm font-bold text-[#F3F7F4]">
              Completed Focus Log
            </h3>
          </div>
          <span className="text-xs font-mono text-[#98A69D]">
            Past Sessions
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-8 text-[#98A69D] text-xs">
            No focus sessions logged yet. Start a timer to track your deep work.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-[#142019] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#10B981]/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#F3F7F4]">
                      {session.subject}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getModeColor(
                        session.mode
                      )}`}
                    >
                      {session.mode}
                    </span>
                    <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                      +{session.durationMinutes}m
                    </span>
                  </div>

                  {session.notes && (
                    <p className="text-xs text-[#98A69D] leading-relaxed flex items-start gap-1.5 pt-0.5">
                      <FileText className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{session.notes}</span>
                    </p>
                  )}
                </div>

                <div className="text-[11px] font-mono text-[#98A69D] shrink-0 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#10B981]" />
                  {formatDate(session.completedAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
