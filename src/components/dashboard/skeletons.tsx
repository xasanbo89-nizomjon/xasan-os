"use client";

import React from "react";

export function MetricCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-[#25352C] animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 bg-[#25352C] rounded" />
        <div className="w-8 h-8 rounded-xl bg-[#101915] border border-[#25352C]" />
      </div>
      <div className="h-8 w-20 bg-[#25352C] rounded mb-2" />
      <div className="h-3 w-36 bg-[#25352C]/60 rounded mt-3" />
    </div>
  );
}

export function WidgetSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 border border-[#25352C] animate-pulse flex flex-col justify-between ${height}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-[#25352C]" />
            <div className="h-4 w-32 bg-[#25352C] rounded" />
          </div>
          <div className="h-3 w-16 bg-[#25352C] rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-12 w-full bg-[#101915] rounded-xl border border-[#25352C]" />
          <div className="h-12 w-full bg-[#101915] rounded-xl border border-[#25352C]" />
        </div>
      </div>
      <div className="h-3 w-40 bg-[#25352C]/50 rounded mt-4" />
    </div>
  );
}

export function DashboardHeaderSkeleton() {
  return (
    <div className="pb-4 border-b border-[#25352C] animate-pulse">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 w-28 bg-[#10B981]/20 rounded-full" />
        <div className="h-3 w-36 bg-[#25352C] rounded" />
      </div>
      <div className="h-8 w-64 bg-[#25352C] rounded mb-2" />
      <div className="h-4 w-96 max-w-full bg-[#25352C]/60 rounded" />
    </div>
  );
}
