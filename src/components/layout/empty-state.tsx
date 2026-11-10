"use client";

import React from "react";
import { LucideIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 border border-[#25352C] relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-radial from-[#10B981]/5 to-transparent pointer-events-none" />
      <div className="w-14 h-14 rounded-2xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981] mb-4 emerald-glow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-semibold text-[#F3F7F4] mb-2">{title}</h3>
      <p className="text-sm text-[#98A69D] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all duration-150 font-semibold shadow-lg shadow-[#10B981]/20 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}
