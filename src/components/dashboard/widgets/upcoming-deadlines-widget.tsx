"use client";

import React from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowUpRight, AlertTriangle, ShieldCheck } from "lucide-react";

export function UpcomingDeadlinesWidget() {
  const deadlines = [
    {
      id: "dl-1",
      title: "Whisper Fine-Tuned Speech Pipeline",
      project: "Aurelius IELTS",
      countdown: "Tomorrow (18h)",
      urgent: true,
      category: "Venture Milestone",
    },
    {
      id: "dl-2",
      title: "IELTS Speaking & Writing Mock #4",
      project: "Study Center",
      countdown: "In 3 days",
      urgent: false,
      category: "Academic Exam",
    },
    {
      id: "dl-3",
      title: "Ravon Avto Dealer Inventory Webhooks",
      project: "Ravon Avto",
      countdown: "In 7 days",
      urgent: false,
      category: "Client Sprint",
    },
    {
      id: "dl-4",
      title: "AWS Cloud GPU Compute Budget Review",
      project: "Finance",
      countdown: "Nov 25",
      urgent: false,
      category: "Audit",
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
                Upcoming Deadlines
              </h3>
              <span className="text-[10px] text-[#98A69D]">
                Chronological milestone horizon
              </span>
            </div>
          </div>

          <Link
            href="/calendar"
            className="text-xs text-[#10B981] hover:underline flex items-center gap-1"
          >
            Calendar <ArrowUpRight className="w-3.5 h-3.5" />
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
