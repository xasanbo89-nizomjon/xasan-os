"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface DistributionItem {
  name?: string;
  subject?: string;
  value?: number;
  hours?: number;
  color: string;
  percentage: number;
}

interface DistributionPieChartProps {
  data: DistributionItem[];
  title?: string;
  valueFormatter?: (val: number) => string;
}

const CustomTooltip = ({ active, payload, valueFormatter }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-[#101915] border border-[#25352C] rounded-xl p-3 shadow-2xl text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
          <span className="font-bold text-[#F3F7F4]">{item.name}</span>
        </div>
        <div className="text-[11px] font-mono text-[#98A69D] flex justify-between gap-4">
          <span>Amount:</span>
          <span className="text-[#10B981] font-semibold">
            {valueFormatter ? valueFormatter(item.value) : `${item.value}`}
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#98A69D] flex justify-between gap-4">
          <span>Share:</span>
          <span className="text-[#F3F7F4] font-semibold">{item.payload.percentage}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export function DistributionPieChart({
  data,
  valueFormatter,
}: DistributionPieChartProps) {
  // Normalize data for PieChart
  const chartData = data.map((d) => ({
    name: d.name || d.subject || "Category",
    value: d.value !== undefined ? d.value : d.hours !== undefined ? d.hours : 0,
    color: d.color,
    percentage: d.percentage,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#101915"
                strokeWidth={2}
              />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
