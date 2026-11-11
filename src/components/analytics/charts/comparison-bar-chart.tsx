"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TimeTrendPoint } from "@/types";

interface ComparisonBarChartProps {
  data: TimeTrendPoint[];
  type?: "STUDY" | "FINANCE";
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
              {entry.name.includes("Amount") || entry.name.includes("Income") || entry.name.includes("Expenses")
                ? `$${entry.value.toLocaleString()}`
                : `${entry.value} hrs`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ComparisonBarChart({ data, type = "STUDY" }: ComparisonBarChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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

          {type === "STUDY" ? (
            <>
              <Bar
                dataKey="targetHours"
                name="Target Hours"
                fill="#25352C"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="studyHours"
                name="Actual Hours"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </>
          ) : (
            <>
              <Bar
                dataKey="income"
                name="Income"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
