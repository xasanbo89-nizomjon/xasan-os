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
import {
  createGoalAction,
  toggleMilestoneAction,
  deleteGoalAction,
} from "@/server/actions/goals";

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
  const [goals, setGoals] = useState<GoalSummary[]>(initialGoals);
  const [activeTab, setActiveTab] = useState<GoalViewTab>("all");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categories = [
    "ALL",
    "Education",
    "Career",
    "Technology",
    "Finance",
    "Health",
    "Personal Development",
    "Travel",
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
  const handleToggleMilestone = async (milestoneId: string, completed: boolean) => {
    // Optimistic update
    setGoals((prev) =>
      prev.map((g) => {
        const hasMilestone = g.milestones?.some((m) => m.id === milestoneId);
        if (!hasMilestone) return g;

        const updatedMilestones = (g.milestones || []).map((m) =>
          m.id === milestoneId ? { ...m, isCompleted: !completed } : m
        );
        const completedMilestones = updatedMilestones.filter((m) => m.isCompleted).length;
        const progress = Math.round((completedMilestones / updatedMilestones.length) * 100);
        const isAchieved = progress === 100;

        return {
          ...g,
          progress,
          isAchieved,
          milestones: updatedMilestones,
        };
      })
    );

    await toggleMilestoneAction(milestoneId, completed);
  };

  const handleDeleteGoal = async (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    await deleteGoalAction(goalId);
  };

  const handleCreateGoal = async (data: any) => {
    const res = await createGoalAction(data);
    if (res.success && res.goal) {
      setGoals((prev) => [res.goal as GoalSummary, ...prev]);
    }
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
            All Goals ({tabCounts.all})
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
            Short-Term ({tabCounts.shortTerm})
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
            Annual OKRs ({tabCounts.annual})
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
            Long-Term ({tabCounts.longTerm})
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
            Achieved ({tabCounts.completed})
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
            Timeline Roadmap
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
            Vision Board
          </button>
        </div>

        {/* Create Goal Action */}
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer shrink-0 self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          Establish Goal
        </button>
      </div>

      {/* Category Pills Filter (if not in Vision Board tab) */}
      {activeTab !== "vision" && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none p-3 rounded-2xl bg-[#101915] border border-[#25352C]">
          <span className="text-[11px] font-mono text-[#98A69D] flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-[#10B981]" /> Domain:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                selectedCategory === cat
                  ? "bg-[#142019] text-[#10B981] border border-[#10B981]/40 font-semibold"
                  : "bg-[#142019]/60 text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
              }`}
            >
              {cat}
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
                  No Objectives In This View
                </h3>
                <p className="text-xs text-[#98A69D] max-w-sm">
                  Define strategic targets, measurable key results, and life aspirations.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Define First Objective
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
