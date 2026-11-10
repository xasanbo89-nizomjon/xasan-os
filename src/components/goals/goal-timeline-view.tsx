"use client";

import React from "react";
import { GoalSummary } from "@/types";
import { Target, CheckCircle2, Circle, Calendar, Clock, Flag, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface GoalTimelineViewProps {
  goals: GoalSummary[];
  onToggleMilestone: (milestoneId: string, completed: boolean) => void;
}

export function GoalTimelineView({ goals, onToggleMilestone }: GoalTimelineViewProps) {
  // Sort goals by target date
  const sortedGoals = [...goals].sort((a, b) => {
    if (!a.targetDate) return 1;
    if (!b.targetDate) return -1;
    return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
  });

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 border border-[#25352C] bg-[#101915] space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#25352C]">
        <div>
          <h3 className="text-base font-bold text-[#F3F7F4] flex items-center gap-2">
            <Flag className="w-4 h-4 text-[#10B981]" />
            Chronological Strategic Roadmap
          </h3>
          <p className="text-xs text-[#98A69D]">
            Sequential timeline progression of Objectives, Key Results, and target delivery windows
          </p>
        </div>
        <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/15 px-3 py-1 rounded-full border border-[#10B981]/30">
          {goals.length} Milestones Trajectory
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#10B981]/30 space-y-8 py-2">
        {sortedGoals.map((goal, index) => {
          const milestones = goal.milestones || [];
          const completedCount = milestones.filter((m) => m.isCompleted).length;

          return (
            <div key={goal.id} className="relative group">
              {/* Timeline Node Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  goal.isAchieved
                    ? "bg-[#10B981] border-[#10B981] text-[#080D0B]"
                    : "bg-[#101915] border-[#10B981] text-[#10B981]"
                }`}
              >
                {goal.isAchieved ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                )}
              </div>

              {/* Goal Card Container */}
              <div className="p-5 rounded-2xl bg-[#142019] border border-[#25352C] hover:border-[#10B981]/40 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#10B981] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {goal.targetDate ? formatDate(goal.targetDate) : "Ongoing"}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C]">
                      {goal.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C]">
                      {goal.timeframe.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#10B981]">
                      {goal.progress}%
                    </span>
                    <div className="w-20 h-1.5 rounded-full bg-[#101915] overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                    {goal.title}
                  </h4>
                  {goal.description && (
                    <p className="text-xs text-[#98A69D] mt-1 leading-relaxed">
                      {goal.description}
                    </p>
                  )}
                </div>

                {/* Milestones in Timeline */}
                {milestones.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#25352C]">
                    <div className="text-[10px] font-mono text-[#98A69D] uppercase">
                      Key Results Checklist ({completedCount}/{milestones.length}):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {milestones.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => onToggleMilestone(m.id, m.isCompleted)}
                          className="flex items-center gap-2 p-2 rounded-xl bg-[#101915] border border-[#25352C] text-left text-xs text-[#F3F7F4] hover:border-[#10B981]/30 transition-colors"
                        >
                          {m.isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-[#98A69D] shrink-0" />
                          )}
                          <span
                            className={`truncate ${
                              m.isCompleted ? "line-through text-[#98A69D]" : ""
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
