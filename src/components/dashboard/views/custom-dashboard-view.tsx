"use client";

import React from "react";
import {
  Sliders,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";

export function CustomDashboardView() {
  const {
    widgets,
    density,
    setDensity,
    toggleWidget,
    moveWidget,
    resetLayout,
  } = useDashboardStore();

  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#25352C]">
          <div>
            <h2 className="text-base font-bold text-[#F3F7F4] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#10B981]" />
              Custom Layout & Widget Configuration
            </h2>
            <p className="text-xs text-[#98A69D] mt-0.5">
              Rearrange cards, adjust information density, and hide unnecessary widgets. Settings persist automatically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetLayout}
              className="px-3 py-1.5 rounded-lg bg-[#101915] border border-[#25352C] hover:border-[#10B981]/50 text-xs font-semibold text-[#10B981] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {/* Density Mode */}
        <div className="py-4 border-b border-[#25352C]">
          <label className="block text-xs font-semibold text-[#98A69D] mb-2 font-mono uppercase tracking-wider">
            Display Spacing & Density
          </label>
          <div className="grid grid-cols-3 gap-3 max-w-md">
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
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Widget Rows */}
        <div className="pt-4 space-y-2.5">
          <label className="block text-xs font-semibold text-[#98A69D] mb-2 font-mono uppercase tracking-wider">
            Reorder & Toggle Widgets
          </label>

          {sortedWidgets.map((widget, idx) => (
            <div
              key={widget.id}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                widget.enabled
                  ? "bg-[#142019] border-[#25352C]"
                  : "bg-[#101915]/50 border-[#25352C]/40 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleWidget(widget.id)}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer ${
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
                    {widget.label}
                  </div>
                  <div className="text-[11px] text-[#98A69D] truncate">
                    {widget.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C]">
                  Pos {idx + 1}
                </span>
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveWidget(widget.id, "up")}
                  className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915] disabled:opacity-20 cursor-pointer"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === sortedWidgets.length - 1}
                  onClick={() => moveWidget(widget.id, "down")}
                  className="p-1.5 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#101915] disabled:opacity-20 cursor-pointer"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
