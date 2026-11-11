"use client";

import React from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowUpRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/stores/language-store";

export function UpcomingDeadlinesWidget() {
  const { dict, isUz } = useTranslation();

  const deadlines = [
    {
      id: "dl-1",
      title: isUz ? "Whisper Fine-Tuned nutq tahlili" : "Whisper Fine-Tuned Speech Pipeline",
      project: "Aurelius IELTS",
      countdown: isUz ? "Ertaga (18s)" : "Tomorrow (18h)",
      urgent: true,
      category: isUz ? "Loyiha marrasi" : "Venture Milestone",
    },
    {
      id: "dl-2",
      title: isUz ? "IELTS Speaking & Writing Mock #4" : "IELTS Speaking & Writing Mock #4",
      project: isUz ? "O‘quv markazi" : "Study Center",
      countdown: isUz ? "3 kundan so‘ng" : "In 3 days",
      urgent: false,
      category: isUz ? "Akademik imtihon" : "Academic Exam",
    },
    {
      id: "dl-3",
      title: isUz ? "Ravon Avto diler vebxuklari" : "Ravon Avto Dealer Inventory Webhooks",
      project: "Ravon Avto",
      countdown: isUz ? "7 kundan so‘ng" : "In 7 days",
      urgent: false,
      category: isUz ? "Mijoz sprinti" : "Client Sprint",
    },
    {
      id: "dl-4",
      title: isUz ? "AWS Cloud GPU hisoblash byudjeti auditi" : "AWS Cloud GPU Compute Budget Review",
      project: isUz ? "Moliya" : "Finance",
      countdown: isUz ? "25-noyabr" : "Nov 25",
      urgent: false,
      category: isUz ? "Audit tekshiruvi" : "Audit",
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#F59E0B]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                {dict.dashboard.widgets.upcoming_deadlines}
              </h3>
              <span className="text-[10px] text-[#98A69D]">
                {isUz ? "Xronologik muddatlar gorizonti" : "Chronological milestone horizon"}
              </span>
            </div>
          </div>

          <Link
            href="/calendar"
            className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
          >
            {dict.nav.calendar} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {deadlines.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-[#101915] border border-[#25352C] hover:border-[#10B981]/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-semibold text-[#F3F7F4] truncate">
                  {item.title}
                </h4>
                <span
                  className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 ${
                    item.urgent
                      ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30 animate-pulse"
                      : "bg-[#142019] text-[#10B981] border-[#10B981]/30"
                  }`}
                >
                  {item.countdown}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#98A69D]">
                <span>{item.project}</span>
                <span className="font-mono">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
