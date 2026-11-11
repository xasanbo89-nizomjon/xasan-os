"use client";

import React from "react";
import { GoalSummary } from "@/types";
import {
  Target,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Trash2,
  ListChecks,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/stores/language-store";

interface GoalCardProps {
  goal: GoalSummary;
  onToggleMilestone: (milestoneId: string, completed: boolean) => void;
  onDeleteGoal: (goalId: string) => void;
}

export function GoalCard({
  goal,
  onToggleMilestone,
  onDeleteGoal,
}: GoalCardProps) {
  const { isUz } = useTranslation();
  const milestones = goal.milestones || [];
  const completedCount = milestones.filter((m) => m.isCompleted).length;

  // Category badge styles
  const getCategoryBadge = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "education":
        return "bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30";
      case "career":
        return "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
      case "technology":
        return "bg-[#8B5CF6]/15 text-[#8B5CF6] border-[#8B5CF6]/30";
      case "finance":
        return "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30";
      case "health":
        return "bg-[#EC4899]/15 text-[#EC4899] border-[#EC4899]/30";
      default:
        return "bg-[#98A69D]/15 text-[#98A69D] border-[#25352C]";
    }
  };

  const getPriorityBadge = (pri: string) => {
    switch (pri) {
      case "URGENT":
        return "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30";
      case "HIGH":
        return "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30";
      default:
        return "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";
    }
  };

  const getCategoryLabel = (cat: string) => {
    if (!isUz) return cat;
    switch (cat.toLowerCase()) {
      case "education":
        return "Ta’lim";
      case "career":
        return "Karyera";
      case "technology":
        return "Texnologiya";
      case "finance":
        return "Moliya";
      case "health":
        return "Salomatlik";
      default:
        return cat;
    }
  };

  const getTimeframeLabel = (tf: string) => {
    if (!isUz) return tf.replace("_", " ");
    switch (tf) {
      case "SHORT_TERM":
        return "Qisqa muddatli";
      case "ANNUAL":
        return "Yillik";
      case "LONG_TERM":
        return "Uzoq muddatli";
      default:
        return tf;
    }
  };

  const getPriorityLabel = (pri: string) => {
    if (!isUz) return pri;
    switch (pri) {
      case "URGENT":
        return "SHOSHILINCH";
      case "HIGH":
        return "YUQORI";
      case "NORMAL":
        return "O‘RTA";
      case "LOW":
        return "PAST";
      default:
        return pri;
    }
  };

  // Calculate days remaining until target date
  let daysRemaining: number | null = null;
  if (goal.targetDate) {
    const diff = new Date(goal.targetDate).getTime() - Date.now();
    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] bg-[#142019]/90 hover:border-[#10B981]/40 transition-all duration-200 space-y-4 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getCategoryBadge(
                goal.category
              )}`}
            >
              {getCategoryLabel(goal.category)}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C]">
              {getTimeframeLabel(goal.timeframe)}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${getPriorityBadge(
                goal.priority
              )}`}
            >
              {getPriorityLabel(goal.priority)}
            </span>
          </div>

          <h4 className="text-base font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors leading-snug">
            {goal.title}
          </h4>

          {goal.description && (
            <p className="text-xs text-[#98A69D] leading-relaxed">
              {goal.description}
            </p>
          )}
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => {
            const confirmMsg = isUz
              ? `"${goal.title}" maqsadini o‘chirmoqchimisiz?`
              : `Delete goal "${goal.title}"?`;
            if (confirm(confirmMsg)) onDeleteGoal(goal.id);
          }}
          className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar & Target Date Countdown */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-[#98A69D] flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#10B981]" />
            <span>{isUz ? "Asosiy natijalar jarayoni" : "Key Results Progress"}</span>
          </span>
          <span className="font-bold text-[#10B981]">{goal.progress}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-[#101915] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] transition-all duration-300 rounded-full"
            style={{ width: `${goal.progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D] pt-1">
          {goal.targetDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#10B981]" />
              {isUz ? "Muddati: " : "Target: "}{formatDate(goal.targetDate)}
            </span>
          )}

          {daysRemaining !== null && (
            <span
              className={
                daysRemaining > 0
                  ? "text-[#10B981]"
                  : "text-[#EF4444] font-bold"
              }
            >
              {daysRemaining > 0
                ? (isUz ? `${daysRemaining} kun qoldi` : `${daysRemaining} days remaining`)
                : (isUz ? "Muddat yetib keldi" : "Deadline reached")}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Milestones Checklist */}
      {milestones.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#25352C]/60">
          <div className="text-[11px] font-mono text-[#98A69D] uppercase flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ListChecks className="w-3 h-3 text-[#10B981]" />
              <span>{isUz ? "Bosqichli marralar" : "Key Milestones"}</span>
            </span>
            <span>
              {completedCount}/{milestones.length} {isUz ? "bajarildi" : "achieved"}
            </span>
          </div>

          <div className="space-y-1.5">
            {milestones.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onToggleMilestone(m.id, m.isCompleted)}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/40 text-left transition-colors cursor-pointer"
              >
                {m.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#98A69D] shrink-0 hover:text-[#10B981]" />
                )}
                <span
                  className={`text-xs ${
                    m.isCompleted
                      ? "line-through text-[#98A69D]"
                      : "text-[#F3F7F4]"
                  }`}
                >
                  {m.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
