"use client";

import React, { useState } from "react";
import { HeatmapDayData } from "@/types";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "@/stores/language-store";

interface ActivityHeatmapProps {
  data: HeatmapDayData[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const { isUz } = useTranslation();
  const [hoveredDay, setHoveredDay] = useState<HeatmapDayData | null>(null);

  const getCellColor = (level: number) => {
    switch (level) {
      case 4:
        return "bg-[#10B981] border-[#10B981] text-[#080D0B]";
      case 3:
        return "bg-[#10B981]/70 border-[#10B981]/80 text-[#080D0B]";
      case 2:
        return "bg-[#10B981]/40 border-[#10B981]/50 text-[#F3F7F4]";
      case 1:
        return "bg-[#10B981]/20 border-[#10B981]/30 text-[#98A69D]";
      default:
        return "bg-[#101915] border-[#25352C] text-[#98A69D]";
    }
  };

  return (
    <div className="space-y-3">
      {/* Heatmap Grid (4 rows x 7 cols or 7 cols x 4 rows) */}
      <div className="grid grid-cols-7 gap-2">
        {data.map((day) => (
          <div
            key={day.date}
            onMouseEnter={() => setHoveredDay(day)}
            onMouseLeave={() => setHoveredDay(null)}
            className={`h-11 rounded-xl border flex flex-col items-center justify-center p-1 cursor-pointer transition-all hover:scale-105 ${getCellColor(
              day.level
            )}`}
          >
            <span className="text-[10px] font-mono font-bold leading-none">
              {new Date(day.date).getDate()}
            </span>
            <span className="text-[9px] font-mono opacity-80 leading-none mt-1">
              {Math.round(day.studyMinutes / 60)}{isUz ? "s" : "h"}
            </span>
          </div>
        ))}
      </div>

      {/* Hover Information / Summary */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-[#25352C] min-h-[32px]">
        {hoveredDay ? (
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#F3F7F4]">
            <span className="text-[#10B981] font-bold">{formatDate(hoveredDay.date)}</span>
            <span>&bull;</span>
            <span>{hoveredDay.studyMinutes} {isUz ? "daqiqa o‘qish" : "m study"}</span>
            <span>&bull;</span>
            <span>{hoveredDay.tasksCompleted} {isUz ? "ta vazifa" : "tasks"}</span>
            <span>&bull;</span>
            <span>{hoveredDay.habitsCompleted}/6 {isUz ? "ta odat" : "habits"}</span>
          </div>
        ) : (
          <span className="text-[11px] font-mono text-[#98A69D]">
            {isUz
              ? "Kunlik tafsilotlarni ko‘rish uchun katakcha ustiga sichqonchani olib boring"
              : "Hover over any day tile for detailed focus & task breakdown"}
          </span>
        )}

        {/* Legend */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#98A69D]">
          <span>{isUz ? "Kam" : "Less"}</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-[#101915] border border-[#25352C]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]/20 border border-[#10B981]/30" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]/40 border border-[#10B981]/50" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#10B981]/70 border border-[#10B981]/80" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#10B981] border border-[#10B981]" />
          <span>{isUz ? "Ko‘p" : "More"}</span>
        </div>
      </div>
    </div>
  );
}
