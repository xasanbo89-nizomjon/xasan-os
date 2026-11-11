"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ArrowUpRight, BookOpen, Mic, Award } from "lucide-react";
import { useTranslation } from "@/stores/language-store";

export function StudyTimeStatisticsWidget() {
  const { dict, isUz } = useTranslation();

  return (
    <div className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#3B82F6]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                {dict.dashboard.widgets.active_study}
              </h3>
              <span className="text-[10px] text-[#98A69D]">
                {isUz ? "Akademik o‘zlashtirish va IELTS Band 8.5 ko‘rsatkichi" : "Academic mastery & Band 8.5 progression"}
              </span>
            </div>
          </div>

          <Link
            href="/study-center"
            className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
          >
            {dict.nav.study_center} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
            <span className="text-[9px] font-mono text-[#98A69D]">{isUz ? "BUGUN" : "TODAY"}</span>
            <div className="text-sm font-bold text-[#F3F7F4] mt-0.5">3.5 {isUz ? "soat" : "hrs"}</div>
            <span className="text-[9px] text-[#10B981]">{isUz ? "Reja bo‘yicha" : "On target"}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
            <span className="text-[9px] font-mono text-[#98A69D]">{isUz ? "SRS KARTALAR" : "SRS CARDS"}</span>
            <div className="text-sm font-bold text-[#3B82F6] mt-0.5">140 / 150</div>
            <span className="text-[9px] text-[#98A69D]">{isUz ? "Takrorlangan" : "Reviews"}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
            <span className="text-[9px] font-mono text-[#98A69D]">{isUz ? "TAXMINIY BAND" : "EST. BAND"}</span>
            <div className="text-sm font-bold text-[#10B981] mt-0.5">8.5</div>
            <span className="text-[9px] text-[#10B981]">{isUz ? "Nutq 8.5" : "Speaking 8.5"}</span>
          </div>
        </div>

        {/* Band Progress Bars */}
        <div className="space-y-2">
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#98A69D] mb-1">
              <span>{isUz ? "Nutq ravonligi va talaffuz" : "Speaking Fluency & Pronunciation"}</span>
              <span className="text-[#10B981] font-mono font-semibold">88%</span>
            </div>
            <div className="w-full h-1.5 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
              <div className="h-full bg-[#10B981] rounded-full w-[88%]" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] text-[#98A69D] mb-1">
              <span>{isUz ? "Akademik yozish Task 2 mantiqiy bog‘lanish" : "Academic Writing Task 2 Cohesion"}</span>
              <span className="text-[#3B82F6] font-mono font-semibold">76%</span>
            </div>
            <div className="w-full h-1.5 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
              <div className="h-full bg-[#3B82F6] rounded-full w-[76%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
