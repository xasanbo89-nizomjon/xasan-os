"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Bot, ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/stores/language-store";

interface AiRecommendationsWidgetProps {
  onStartFocus: () => void;
}

export function AiRecommendationsWidget({ onStartFocus }: AiRecommendationsWidgetProps) {
  const { dict, isUz } = useTranslation();

  const recommendations = [
    {
      id: "rec-1",
      badge: isUz ? "ENG QULAY VAQT" : "OPTIMAL TIMING",
      text: isUz
        ? "Eng samarali diqqat oynasi aniqlandi: keyingi 50 daqiqalik blokni Aurelius IELTS audio oqimi uchun ajrating."
        : "Prime focus window detected: Allocate next 50m block to Aurelius IELTS audio streaming pipeline.",
      actionLabel: isUz ? "Fokusni boshlash" : "Start Focus Block",
      action: onStartFocus,
    },
    {
      id: "rec-2",
      badge: isUz ? "IELTS RAVONLIGI" : "IELTS FLUENCY",
      text: isUz
        ? "Nutq mashqi vaqti keldi: Sun'iy intellekt va mehnat bozori mavzusida Part 2 kartasini yakunlang."
        : "Speaking practice interval reached: Complete Part 2 cue-card on Artificial Intelligence and Labor Markets.",
      href: "/study-center",
      actionLabel: isUz ? "Nutq laboratoriyasi" : "Open Speech Lab",
    },
    {
      id: "rec-3",
      badge: isUz ? "TIZIM GIGIYENASI" : "DATABASE HYGIENE",
      text: isUz
        ? "Mahalliy xotirada barcha modullar yaxlitligi va ma'lumotlar xavfsizligi tasdiqlandi."
        : "UUID indexing verified across tasks, habits and projects. All relations isolated.",
      href: "/settings",
      actionLabel: isUz ? "Xotirani ko‘rish" : "View Isolation",
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] relative overflow-hidden emerald-glow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F3F7F4] flex items-center gap-1.5">
              {isUz ? "XASAN AI Tavsiyalari" : "XASAN AI Sovereign Recommendations"}
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            </h3>
            <span className="text-[10px] text-[#98A69D]">
              {isUz ? "Proaktiv AI agenti tahlili va amaliy maslahatlar" : "Proactive agent telemetry & execution nudges"}
            </span>
          </div>
        </div>

        <Link
          href="/xasan-ai"
          className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
        >
          {dict.nav.xasan_ai} <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-[#142019] text-[#10B981] border border-[#10B981]/30 inline-block mb-2">
                {rec.badge}
              </span>
              <p className="text-xs text-[#F3F7F4] leading-relaxed mb-3">
                {rec.text}
              </p>
            </div>

            {rec.href ? (
              <Link
                href={rec.href}
                className="text-xs font-semibold text-[#10B981] hover:text-[#059669] flex items-center gap-1 group self-start"
              >
                <span>{rec.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <button
                onClick={rec.action}
                className="text-xs font-semibold text-[#10B981] hover:text-[#059669] flex items-center gap-1 group self-start cursor-pointer"
              >
                <span>{rec.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
