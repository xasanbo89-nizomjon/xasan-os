"use client";

import React, { useState } from "react";
import { TaskSummary } from "@/types";
import { ChevronLeft, ChevronRight, Clock, Plus, Tag, Calendar as CalendarIcon } from "lucide-react";

interface TaskCalendarViewProps {
  tasks: TaskSummary[];
  onOpenTaskDetail: (task: TaskSummary) => void;
  onOpenCreateTask: (dateString?: string) => void;
}

export function TaskCalendarView({
  tasks,
  onOpenTaskDetail,
  onOpenCreateTask,
}: TaskCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-[#25352C] bg-[#101915]">
      {/* Month Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#F3F7F4]">
            {monthName} {year}
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-mono hidden sm:inline">
            Execution Schedule
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg bg-[#142019] border border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4] hover:border-[#10B981] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="px-2.5 py-1 rounded-lg bg-[#142019] border border-[#25352C] text-xs font-mono text-[#F3F7F4] hover:text-[#10B981]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg bg-[#142019] border border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4] hover:border-[#10B981] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-[#98A69D] pb-3 border-b border-[#25352C]">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2 pt-3">
        {/* Leading empty slots */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="min-h-[100px] p-2 rounded-xl bg-[#080D0B]/40 border border-transparent opacity-40"
          />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const dayDate = new Date(year, month, dayNumber);
          const dateString = dayDate.toISOString().slice(0, 10);

          const isToday =
            new Date().toDateString() === dayDate.toDateString();

          // Match tasks due on this date
          const dayTasks = tasks.filter((t) => {
            if (!t.dueDate) return false;
            return new Date(t.dueDate).toISOString().slice(0, 10) === dateString;
          });

          return (
            <div
              key={dayNumber}
              onClick={() => onOpenCreateTask(dateString)}
              className={`min-h-[100px] p-2 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
                isToday
                  ? "bg-[#142019] border-[#10B981] emerald-glow-sm"
                  : "bg-[#142019]/60 border-[#25352C]/70 hover:border-[#10B981]/50 hover:bg-[#142019]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-mono font-semibold ${
                    isToday ? "text-[#10B981]" : "text-[#F3F7F4]"
                  }`}
                >
                  {dayNumber}
                </span>

                {isToday && (
                  <span className="text-[9px] px-1 bg-[#10B981] text-[#080D0B] rounded font-bold">
                    TODAY
                  </span>
                )}
              </div>

              {/* Day Tasks Chips */}
              <div className="space-y-1 mt-1.5 flex-1">
                {dayTasks.slice(0, 3).map((task) => {
                  const isDone = task.status === "COMPLETED";
                  return (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTaskDetail(task);
                      }}
                      className={`p-1 rounded text-[10px] font-medium truncate border transition-colors cursor-pointer ${
                        isDone
                          ? "bg-[#101915] text-[#98A69D] line-through border-[#25352C]"
                          : task.priority === "URGENT"
                          ? "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40 hover:bg-[#EF4444]/30"
                          : task.priority === "HIGH"
                          ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40 hover:bg-[#F59E0B]/30"
                          : "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40 hover:bg-[#10B981]/30"
                      }`}
                    >
                      {task.title}
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="text-[10px] font-mono text-[#98A69D] text-center pt-0.5">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
