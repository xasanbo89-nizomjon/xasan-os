"use client";

import React from "react";
import {
  X,
  Sliders,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  LayoutGrid,
} from "lucide-react";
import { useDashboardStore, WidgetConfig } from "@/stores/dashboard-store";
import { useTranslation } from "@/stores/language-store";

interface LayoutCustomizerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LayoutCustomizerDialog({
  open,
  onOpenChange,
}: LayoutCustomizerDialogProps) {
  const { dict, isUz } = useTranslation();
  const {
    widgets,
    density,
    setDensity,
    toggleWidget,
    moveWidget,
    resetLayout,
  } = useDashboardStore();

  if (!open) return null;

  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  const getDensityLabel = (d: string) => {
    switch (d) {
      case "compact": return isUz ? "Ixcham" : "Compact";
      case "standard": return isUz ? "Standart" : "Standard";
      case "expanded": return isUz ? "Kengaytirilgan" : "Expanded";
      default: return d;
    }
  };

  const getWidgetLocalized = (id: string, label: string, desc: string) => {
    switch (id) {
      case "ai": return { label: isUz ? "XASAN AI Tavsiyalari" : label, desc: isUz ? "Proaktiv AI agenti tahlili va amaliy maslahatlar" : desc };
      case "tasks": return { label: dict.dashboard.widgets.todays_priorities, desc: isUz ? "Kunlik muhim vazifalar va ustuvorliklar" : desc };
      case "habits": return { label: dict.dashboard.widgets.habit_tracker, desc: isUz ? "Kunlik intizom va odatlar davomiyligi" : desc };
      case "projects": return { label: dict.dashboard.widgets.project_status, desc: isUz ? "Faol startaplar va dasturiy platformalar" : desc };
      case "deadlines": return { label: dict.dashboard.widgets.upcoming_deadlines, desc: isUz ? "Yaqinlashib kelayotgan muhim muddatlar" : desc };
      case "study": return { label: dict.dashboard.widgets.active_study, desc: isUz ? "Akademik ta'lim va IELTS 8.5 ko‘rsatkichi" : desc };
      case "finance": return { label: dict.dashboard.widgets.financial_overview, desc: isUz ? "Keshflo, tushum va xarajatlar tahlili" : desc };
      default: return { label, desc };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080D0B]/80 backdrop-blur-md transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg bg-[#101915] border border-[#25352C] rounded-2xl shadow-2xl overflow-hidden z-10 emerald-glow">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#25352C]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#10B981]" />
            <h2 className="text-base font-bold text-[#F3F7F4]">
              {dict.dashboard.actions.customize_layout}
            </h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-[#98A69D] hover:text-[#F3F7F4] p-1 rounded-lg hover:bg-[#142019] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Density Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#98A69D] mb-2 font-mono uppercase tracking-wider">
              {isUz ? "Vidjetlar zichligi va oraliq masofasi" : "Widget Spacing & Density"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["compact", "standard", "expanded"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`py-2 rounded-xl text-xs font-semibold capitalize border transition-all cursor-pointer ${
                    density === d
                      ? "bg-[#142019] text-[#10B981] border-[#10B981] shadow"
                      : "bg-[#101915] text-[#98A69D] border-[#25352C] hover:text-[#F3F7F4]"
                  }`}
                >
                  {getDensityLabel(d)}
                </button>
              ))}
            </div>
          </div>

          {/* Widgets List & Reordering */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#98A69D] font-mono uppercase tracking-wider">
                {isUz ? "Faol Vidjetlar" : "Active Widgets"} ({widgets.filter((w) => w.enabled).length} / {widgets.length})
              </label>
              <button
                onClick={resetLayout}
                className="text-[11px] text-[#10B981] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{dict.dashboard.actions.reset_layout}</span>
              </button>
            </div>

            <div className="space-y-2">
              {sortedWidgets.map((widget, idx) => {
                const loc = getWidgetLocalized(widget.id, widget.label, widget.description);
                return (
                  <div
                    key={widget.id}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      widget.enabled
                        ? "bg-[#142019] border-[#25352C]"
                        : "bg-[#101915]/50 border-[#25352C]/40 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleWidget(widget.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          widget.enabled
                            ? "bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]"
                            : "bg-[#101915] border-[#25352C] text-[#98A69D]"
                        }`}
                      >
                        {widget.enabled ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#F3F7F4] truncate">
                          {loc.label}
                        </div>
                        <div className="text-[10px] text-[#98A69D] truncate">
                          {loc.desc}
                        </div>
                      </div>
                    </div>

                    {/* Move Up / Down Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveWidget(widget.id, "up")}
                        className="p-1 rounded-md text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915] disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sortedWidgets.length - 1}
                        onClick={() => moveWidget(widget.id, "down")}
                        className="p-1 rounded-md text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915] disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#25352C] bg-[#080D0B]/40 flex items-center justify-between">
          <span className="text-[11px] text-[#98A69D] font-mono">
            {isUz ? "Xotirada avtomatik saqlanadi" : "Layout auto-persisted in local state"}
          </span>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-xl bg-[#10B981] text-[#080D0B] font-bold text-xs hover:bg-[#059669] transition-all cursor-pointer shadow-md shadow-[#10B981]/20"
          >
            {isUz ? "Tayyor" : "Done"}
          </button>
        </div>
      </div>
    </div>
  );
}
