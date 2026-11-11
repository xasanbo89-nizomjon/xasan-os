"use client";

import React, { useState, useMemo } from "react";
import { GoalSummary, VisionItemSummary } from "@/types";
import {
  Compass,
  Target,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  Flag,
  Layers,
} from "lucide-react";
import { GoalCard } from "./goal-card";
import { CreateGoalModal } from "./create-goal-modal";
import { GoalTimelineView } from "./goal-timeline-view";
import { VisionBoard } from "./vision-board";
import { useGoalsStore } from "@/stores/goals-store";
import { useTranslation } from "@/stores/language-store";

type GoalViewTab =
  | "all"
  | "short-term"
  | "annual"
  | "long-term"
  | "completed"
  | "timeline"
  | "vision";

interface GoalsExperienceProps {
  initialGoals: GoalSummary[];
  initialVisionItems: VisionItemSummary[];
}

export function GoalsExperience({
  initialGoals,
  initialVisionItems,
}: GoalsExperienceProps) {
  const { isUz, dict } = useTranslation();
  const storeGoals = useGoalsStore((s) => s.goals);
  const storeVision = useGoalsStore((s) => s.visionItems);
  const addGoal = useGoalsStore((s) => s.addGoal);
  const deleteGoal = useGoalsStore((s) => s.deleteGoal);
  const toggleMilestone = useGoalsStore((s) => s.toggleMilestone);
  const isHydrated = useGoalsStore((s) => s.isHydrated);

  const goals = isHydrated ? storeGoals : initialGoals;
  const visionItems = isHydrated ? storeVision : initialVisionItems;

  const [activeTab, setActiveTab] = useState<GoalViewTab>("all");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categories = [
    { id: "ALL", label: isUz ? "Barchasi" : "ALL" },
    { id: "Education", label: isUz ? "Ta'lim" : "Education" },
    { id: "Career", label: isUz ? "Karyera" : "Career" },
    { id: "Technology", label: isUz ? "Texnologiya" : "Technology" },
    { id: "Finance", label: isUz ? "Moliya" : "Finance" },
    { id: "Health", label: isUz ? "Salomatlik" : "Health" },
    { id: "Personal Development", label: isUz ? "Shaxsiy rivojlanish" : "Personal Development" },
    { id: "Travel", label: isUz ? "Sayohat" : "Travel" },
  ];

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: goals.length,
      shortTerm: goals.filter((g) => g.timeframe === "SHORT_TERM" && !g.isAchieved).length,
      annual: goals.filter((g) => g.timeframe === "ANNUAL" && !g.isAchieved).length,
      longTerm: goals.filter((g) => g.timeframe === "LONG_TERM" && !g.isAchieved).length,
      completed: goals.filter((g) => g.isAchieved).length,
    };
  }, [goals]);

  // Filtered goals
  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      // 1. Tab filter
      if (activeTab === "short-term") {
        if (goal.timeframe !== "SHORT_TERM" || goal.isAchieved) return false;
      } else if (activeTab === "annual") {
        if (goal.timeframe !== "ANNUAL" || goal.isAchieved) return false;
      } else if (activeTab === "long-term") {
        if (goal.timeframe !== "LONG_TERM" || goal.isAchieved) return false;
      } else if (activeTab === "completed") {
        if (!goal.isAchieved) return false;
      }

      // 2. Category filter
      if (selectedCategory !== "ALL") {
        if (goal.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
      }

      return true;
    });
  }, [goals, activeTab, selectedCategory]);

  // Milestone checkoff handler
  const handleToggleMilestone = (milestoneId: string, _completed: boolean) => {
    const parentGoal = goals.find((g) => g.milestones?.some((m) => m.id === milestoneId));
    if (parentGoal) {
      toggleMilestone(parentGoal.id, milestoneId);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm(isUz ? "Ushbu strategik maqsadni o‘chirmoqchimisiz?" : "Delete this strategic goal?")) {
      deleteGoal(goalId);
    }
  };

  const handleCreateGoal = async (data: any) => {
    addGoal(data);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Primary Navigation Tabs */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-[#25352C] bg-[#101915] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "all"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {isUz ? "Barcha maqsadlar" : "All Goals"} ({tabCounts.all})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("short-term")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "short-term"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            {isUz ? "Qisqa muddatli" : "Short-Term"} ({tabCounts.shortTerm})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("annual")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "annual"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            {isUz ? "Yillik OKR" : "Annual OKRs"} ({tabCounts.annual})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("long-term")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "long-term"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            {isUz ? "Uzoq muddatli" : "Long-Term"} ({tabCounts.longTerm})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "completed"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isUz ? "Erishilgan" : "Achieved"} ({tabCounts.completed})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("timeline")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "timeline"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Flag className="w-3.5 h-3.5 text-[#F59E0B]" />
            {isUz ? "Xronologik xarita" : "Timeline Roadmap"}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("vision")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "vision"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#3B82F6]" />
            {isUz ? "Vizual doska" : "Vision Board"}
          </button>
        </div>

        {/* Create Goal Action */}
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer shrink-0 self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          {isUz ? "Yangi maqsad" : "Establish Goal"}
        </button>
      </div>

      {/* Category Pills Filter (if not in Vision Board tab) */}
      {activeTab !== "vision" && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none p-3 rounded-2xl bg-[#101915] border border-[#25352C]">
          <span className="text-[11px] font-mono text-[#98A69D] flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-[#10B981]" /> {isUz ? "Soha:" : "Domain:"}
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#142019] text-[#10B981] border border-[#10B981]/40 font-semibold"
                  : "bg-[#142019]/60 text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Content Presentation */}
      <div>
        {activeTab === "vision" ? (
          <VisionBoard initialItems={initialVisionItems} />
        ) : activeTab === "timeline" ? (
          <GoalTimelineView
            goals={filteredGoals}
            onToggleMilestone={handleToggleMilestone}
          />
        ) : (
          <div className="space-y-4">
            {filteredGoals.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center border border-[#25352C] bg-[#101915]/50 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[#F3F7F4]">
                  {isUz ? "Ushbu bo‘limda maqsadlar mavjud emas" : "No Objectives In This View"}
                </h3>
                <p className="text-xs text-[#98A69D] max-w-sm">
                  {isUz
                    ? "Strategik vazifalar, aniq natijalar va hayotiy maqsadlarni belgilang."
                    : "Define strategic targets, measurable key results, and life aspirations."}
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  {isUz ? "Birinchi maqsadni belgilash" : "Define First Objective"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onToggleMilestone={handleToggleMilestone}
                    onDeleteGoal={handleDeleteGoal}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGoal={handleCreateGoal}
      />
    </div>
  );
}