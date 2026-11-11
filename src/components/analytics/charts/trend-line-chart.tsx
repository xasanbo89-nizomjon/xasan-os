"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TimeTrendPoint } from "@/types";

interface TrendLineChartProps {
  data: TimeTrendPoint[];
  period: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#101915] border border-[#25352C] rounded-xl p-3 shadow-2xl text-xs space-y-1">
        <div className="font-mono font-bold text-[#F3F7F4] border-b border-[#25352C] pb-1 mb-1">
          {label}
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-[11px]" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-semibold text-[#F3F7F4]">
              {entry.value} {entry.dataKey === "studyHours" || entry.dataKey === "targetHours" ? "hrs" : ""}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function TrendLineChart({ data, period }: TrendLineChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#25352C" vertical={false} opacity={0.6} />

          <XAxis
            dataKey="label"
            stroke="#98A69D"
            tick={{ fill: "#98A69D", fontSize: 11, fontFamily: "monospace" }}
            axisLine={{ stroke: "#25352C" }}
            tickLine={false}
          />
          <YAxis
            stroke="#98A69D"
            tick={{ fill: "#98A69D", fontSize: 11, fontFamily: "monospace" }}
            axisLine={{ stroke: "#25352C" }}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "10px", fontFamily: "monospace" }}
          />

          <Area
            type="monotone"
            dataKey="studyHours"
            name="Actual Study Hours"
            stroke="#10B981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#emeraldGradient)"
          />
          <Area
            type="monotone"
            dataKey="targetHours"
            name="Target Hours"
            stroke="#98A69D"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="completedTasks"
            name="Tasks Completed"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#blueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
