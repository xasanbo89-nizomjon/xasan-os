"use client";

import React, { useState } from "react";
import {
  Plus,
  X,
  CheckSquare,
  Sparkles,
  BookOpen,
  CircleDollarSign,
  Clock,
  Layers,
} from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";

interface FloatingActionButtonProps {
  onOpenQuickCreate: (type?: string) => void;
}

export function FloatingActionButton({
  onOpenQuickCreate,
}: FloatingActionButtonProps) {
  const [open, setOpen] = useState(false);
  const { startFocusSession } = useDashboardStore();

  const handleSelect = (type: string) => {
    setOpen(false);
    if (type === "focus") {
      startFocusSession(50);
    } else {
      onOpenQuickCreate(type);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none">
      {/* Speed Dial Menu items */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-30 bg-[#080D0B]/40 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <div className="flex flex-col items-end gap-2.5 mb-3 z-40 animate-in fade-in slide-in-from-bottom-4 duration-150">
            <button
              onClick={() => handleSelect("focus")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-xs font-semibold text-[#F3F7F4] shadow-xl hover:scale-105 transition-all group cursor-pointer"
            >
              <span className="text-[10px] text-[#98A69D] group-hover:text-[#10B981]">
                50m Focus Block
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                <Clock className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleSelect("task")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-xs font-semibold text-[#F3F7F4] shadow-xl hover:scale-105 transition-all group cursor-pointer"
            >
              <span className="text-[10px] text-[#98A69D] group-hover:text-[#10B981]">
                New Task
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                <CheckSquare className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleSelect("note")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-xs font-semibold text-[#F3F7F4] shadow-xl hover:scale-105 transition-all group cursor-pointer"
            >
              <span className="text-[10px] text-[#98A69D] group-hover:text-[#10B981]">
                New Knowledge Note
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#3B82F6]">
                <BookOpen className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={() => handleSelect("transaction")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-xs font-semibold text-[#F3F7F4] shadow-xl hover:scale-105 transition-all group cursor-pointer"
            >
              <span className="text-[10px] text-[#98A69D] group-hover:text-[#10B981]">
                New Transaction
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                <CircleDollarSign className="w-4 h-4" />
              </div>
            </button>
          </div>
        </>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Quick Action Floating Menu"
        className={`w-13 h-13 rounded-2xl flex items-center justify-center text-[#080D0B] font-bold shadow-xl transition-all duration-200 cursor-pointer active:scale-95 z-40 ${
          open
            ? "bg-[#EF4444] text-[#F3F7F4] rotate-45 shadow-[#EF4444]/25"
            : "bg-gradient-to-tr from-[#10B981] to-[#059669] hover:scale-105 emerald-glow shadow-[#10B981]/30"
        }`}
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>
    </div>
  );
}
