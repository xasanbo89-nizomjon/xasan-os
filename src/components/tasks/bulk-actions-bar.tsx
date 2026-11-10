"use client";

import React from "react";
import { CheckCircle2, Clock, Trash2, X, AlertTriangle } from "lucide-react";
import { TaskStatus, Priority } from "@prisma/client";

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkStatusUpdate: (status: TaskStatus) => void;
  onBulkDelete: () => void;
  isProcessing?: boolean;
}

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkStatusUpdate,
  onBulkDelete,
  isProcessing = false,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-5 duration-200">
      <div className="glass-card rounded-2xl p-3 sm:px-5 sm:py-3.5 border border-[#10B981]/50 bg-[#101915]/95 shadow-2xl emerald-glow flex items-center gap-3 sm:gap-4 select-none">
        <div className="flex items-center gap-2 pr-2 border-r border-[#25352C]">
          <span className="w-6 h-6 rounded-lg bg-[#10B981] text-[#080D0B] font-mono font-bold text-xs flex items-center justify-center">
            {selectedCount}
          </span>
          <span className="text-xs text-[#F3F7F4] font-medium hidden sm:inline">
            selected
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onBulkStatusUpdate(TaskStatus.COMPLETED)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#142019] hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mark</span> Done
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onBulkStatusUpdate(TaskStatus.IN_PROGRESS)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#142019] hover:bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">In</span> Progress
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={onBulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#142019] hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>

        <button
          type="button"
          onClick={onClearSelection}
          className="p-1 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] transition-colors cursor-pointer ml-1"
          title="Deselect all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
