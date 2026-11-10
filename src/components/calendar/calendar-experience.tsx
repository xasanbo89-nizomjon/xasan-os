"use client";

import React, { useState, useMemo } from "react";
import { CalendarEventSummary, ReminderSummary, ProjectSummary } from "@/types";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  MapPin,
  Bell,
  CheckCircle2,
  Circle,
  Trash2,
  Repeat,
  Filter,
  List,
  Columns3,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import { EventDialog } from "./event-dialog";
import {
  createCalendarEventAction,
  updateCalendarEventAction,
  deleteCalendarEventAction,
  createReminderAction,
  toggleReminderAction,
  deleteReminderAction,
} from "@/server/actions/calendar";
import { formatDate } from "@/lib/utils";

type CalendarViewMode = "month" | "week" | "day" | "agenda";

interface CalendarExperienceProps {
  initialEvents: CalendarEventSummary[];
  initialReminders: ReminderSummary[];
  projects: ProjectSummary[];
}

export function CalendarExperience({
  initialEvents,
  initialReminders,
  projects,
}: CalendarExperienceProps) {
  const [events, setEvents] = useState<CalendarEventSummary[]>(initialEvents);
  const [reminders, setReminders] = useState<ReminderSummary[]>(initialReminders);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 10, 10)); // Default to Nov 10, 2026

  // Dialog states
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [activeEventToEdit, setActiveEventToEdit] = useState<CalendarEventSummary | null>(null);
  const [selectedDateForNewEvent, setSelectedDateForNewEvent] = useState<string>("");

  // Reminder input
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderDue, setNewReminderDue] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === "week") {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    } else {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setCurrentDate(prevDay);
    }
  };

  const handleNext = () => {
    if (viewMode === "month") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === "week") {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    } else {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 10, 10));
  };

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (selectedCategory === "ALL") return events;
    return events.filter(
      (e) => e.category.toUpperCase() === selectedCategory.toUpperCase()
    );
  }, [events, selectedCategory]);

  // Color config helper
  const getCategoryStyles = (cat: string) => {
    const c = cat.toUpperCase();
    if (c === "EDUCATION" || c === "STUDY" || c === "IELTS") {
      return {
        bg: "bg-[#3B82F6]/20",
        border: "border-[#3B82F6]/40",
        text: "text-[#3B82F6]",
        dot: "#3B82F6",
      };
    }
    if (c === "PROJECT" || c === "DEV") {
      return {
        bg: "bg-[#F59E0B]/20",
        border: "border-[#F59E0B]/40",
        text: "text-[#F59E0B]",
        dot: "#F59E0B",
      };
    }
    if (c === "PERSONAL" || c === "HEALTH") {
      return {
        bg: "bg-[#8B5CF6]/20",
        border: "border-[#8B5CF6]/40",
        text: "text-[#8B5CF6]",
        dot: "#8B5CF6",
      };
    }
    // Default WORK
    return {
      bg: "bg-[#10B981]/20",
      border: "border-[#10B981]/40",
      text: "text-[#10B981]",
      dot: "#10B981",
    };
  };

  // Event CRUD Handlers
  const handleSaveEvent = async (data: any) => {
    if (data.id) {
      // Update
      setEvents((prev) =>
        prev.map((e) => (e.id === data.id ? { ...e, ...data } : e))
      );
      await updateCalendarEventAction(data.id, data);
    } else {
      // Create
      const res = await createCalendarEventAction(data);
      if (res.success && res.event) {
        setEvents((prev) => [...prev, res.event as CalendarEventSummary]);
      }
    }
  };

  const handleDeleteEvent = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    await deleteCalendarEventAction(id);
  };

  // Reminders Handlers
  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle.trim()) return;

    const due = newReminderDue
      ? new Date(newReminderDue).toISOString()
      : new Date(Date.now() + 3600000 * 24).toISOString();

    const res = await createReminderAction({
      title: newReminderTitle.trim(),
      dueDateTime: due,
      category: "General",
    });

    if (res.success && res.reminder) {
      setReminders((prev) => [...prev, res.reminder as ReminderSummary]);
      setNewReminderTitle("");
      setNewReminderDue("");
    }
  };

  const handleToggleReminder = async (rem: ReminderSummary) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === rem.id ? { ...r, isCompleted: !rem.isCompleted } : r
      )
    );
    await toggleReminderAction(rem.id, rem.isCompleted);
  };

  const handleDeleteReminder = async (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    await deleteReminderAction(id);
  };

  // Month grid calculations
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Week view calculations (current week)
  const currentDayOfWeek = (currentDate.getDay() + 6) % 7; // Monday = 0
  const mondayOfWeek = new Date(currentDate);
  mondayOfWeek.setDate(currentDate.getDate() - currentDayOfWeek);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mondayOfWeek);
    d.setDate(mondayOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation Bar */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#F3F7F4]">
                {viewMode === "day"
                  ? currentDate.toLocaleDateString("default", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : `${monthName} ${year}`}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                Synchronized
              </span>
            </div>
            <p className="text-xs text-[#98A69D]">
              Deep work architecture blocks, project releases, and milestones
            </p>
          </div>
        </div>

        {/* View Mode Switcher, Date Controls, and Add Event Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View switcher buttons */}
          <div className="flex items-center bg-[#142019] rounded-xl p-1 border border-[#25352C]">
            <button
              type="button"
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === "month"
                  ? "bg-[#101915] text-[#10B981] font-semibold"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === "week"
                  ? "bg-[#101915] text-[#10B981] font-semibold"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === "day"
                  ? "bg-[#101915] text-[#10B981] font-semibold"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
            >
              Day
            </button>
            <button
              type="button"
              onClick={() => setViewMode("agenda")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === "agenda"
                  ? "bg-[#101915] text-[#10B981] font-semibold"
                  : "text-[#98A69D] hover:text-[#F3F7F4]"
              }`}
            >
              Agenda
            </button>
          </div>

          {/* Date arrows */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-[#142019] border border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4] hover:border-[#10B981] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="px-2.5 py-1.5 rounded-xl bg-[#142019] border border-[#25352C] text-xs font-mono text-[#F3F7F4] hover:text-[#10B981]"
            >
              Today
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-[#142019] border border-[#25352C] text-[#98A69D] hover:text-[#F3F7F4] hover:border-[#10B981] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* New Event Button */}
          <button
            type="button"
            onClick={() => {
              setActiveEventToEdit(null);
              setSelectedDateForNewEvent(new Date().toISOString().slice(0, 10));
              setIsEventDialogOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors shadow-lg shadow-[#10B981]/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Schedule Block
          </button>
        </div>
      </div>

      {/* Category Filter Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-2xl bg-[#101915] border border-[#25352C]">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-[#10B981]" />
          <span className="text-xs font-semibold text-[#F3F7F4]">Categories:</span>
          {[
            { id: "ALL", label: "All Blocks" },
            { id: "WORK", label: "Work & Arch", color: "#10B981" },
            { id: "EDUCATION", label: "IELTS & Study", color: "#3B82F6" },
            { id: "PROJECT", label: "Projects", color: "#F59E0B" },
            { id: "PERSONAL", label: "Personal / Fitness", color: "#8B5CF6" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? "bg-[#142019] text-[#10B981] border border-[#10B981]/40 font-semibold"
                  : "bg-[#142019]/60 text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
              }`}
            >
              {cat.color && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] font-mono text-[#98A69D]">
          {filteredEvents.length} scheduled event{filteredEvents.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Main Grid: Calendar on Left (8 cols) + Reminders on Right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Calendar Presentation (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* MONTH VIEW */}
          {viewMode === "month" && (
            <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]">
              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-[#98A69D] pb-3 border-b border-[#25352C]">
                {daysOfWeek.map((day) => (
                  <div key={day} className="py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid of Dates */}
              <div className="grid grid-cols-7 gap-2 pt-3">
                {/* Empty offset days */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div
                    key={`offset-${i}`}
                    className="min-h-[96px] p-2 rounded-xl bg-[#080D0B]/30 border border-transparent opacity-30"
                  />
                ))}

                {/* Real Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dayDate = new Date(year, month, dayNum);
                  const dateStr = dayDate.toISOString().slice(0, 10);
                  const isToday =
                    dayNum === 10 && month === 10 && year === 2026;

                  // Find events matching this day
                  const dayEvents = filteredEvents.filter((ev) => {
                    const evDateStr = new Date(ev.startDate).toISOString().slice(0, 10);
                    return evDateStr === dateStr;
                  });

                  return (
                    <div
                      key={dayNum}
                      onClick={() => {
                        setActiveEventToEdit(null);
                        setSelectedDateForNewEvent(dateStr);
                        setIsEventDialogOpen(true);
                      }}
                      className={`min-h-[96px] p-2 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
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
                          {dayNum}
                        </span>
                        {isToday && (
                          <span className="text-[8px] px-1 bg-[#10B981] text-[#080D0B] rounded font-bold">
                            TODAY
                          </span>
                        )}
                      </div>

                      {/* Event Chips */}
                      <div className="space-y-1 mt-1 flex-1">
                        {dayEvents.slice(0, 2).map((ev) => {
                          const style = getCategoryStyles(ev.category);
                          return (
                            <div
                              key={ev.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveEventToEdit(ev);
                                setIsEventDialogOpen(true);
                              }}
                              className={`p-1 rounded text-[10px] truncate border font-medium ${style.bg} ${style.border} ${style.text} hover:opacity-80 transition-opacity`}
                            >
                              {ev.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] font-mono text-[#98A69D] text-center">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* WEEK VIEW */}
          {viewMode === "week" && (
            <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915]">
              <div className="grid grid-cols-7 gap-3">
                {weekDays.map((d, index) => {
                  const dateStr = d.toISOString().slice(0, 10);
                  const isToday =
                    d.getDate() === 10 && d.getMonth() === 10 && d.getFullYear() === 2026;
                  const dayEvents = filteredEvents.filter(
                    (ev) =>
                      new Date(ev.startDate).toISOString().slice(0, 10) === dateStr
                  );

                  return (
                    <div
                      key={index}
                      className={`min-h-[420px] rounded-xl border p-3 flex flex-col justify-between ${
                        isToday
                          ? "bg-[#142019] border-[#10B981] emerald-glow-sm"
                          : "bg-[#142019]/50 border-[#25352C]"
                      }`}
                    >
                      <div className="border-b border-[#25352C] pb-2 text-center">
                        <div className="text-[11px] font-mono text-[#98A69D]">
                          {daysOfWeek[index]}
                        </div>
                        <div
                          className={`text-sm font-bold font-mono mt-0.5 ${
                            isToday ? "text-[#10B981]" : "text-[#F3F7F4]"
                          }`}
                        >
                          {d.getDate()}
                        </div>
                      </div>

                      <div className="space-y-2 py-2 flex-1">
                        {dayEvents.map((ev) => {
                          const style = getCategoryStyles(ev.category);
                          const time = new Date(ev.startDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          });

                          return (
                            <div
                              key={ev.id}
                              onClick={() => {
                                setActiveEventToEdit(ev);
                                setIsEventDialogOpen(true);
                              }}
                              className={`p-2 rounded-xl border text-xs cursor-pointer hover:scale-[1.02] transition-transform ${style.bg} ${style.border}`}
                            >
                              <div className="text-[10px] font-mono text-[#98A69D] flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 text-[#10B981]" />
                                {time}
                              </div>
                              <div
                                className={`font-semibold mt-0.5 line-clamp-2 ${style.text}`}
                              >
                                {ev.title}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveEventToEdit(null);
                          setSelectedDateForNewEvent(dateStr);
                          setIsEventDialogOpen(true);
                        }}
                        className="w-full py-1 rounded-lg bg-[#101915] hover:bg-[#10B981]/20 text-[#98A69D] hover:text-[#10B981] border border-[#25352C] text-[10px] font-mono transition-colors"
                      >
                        + Add block
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DAY VIEW */}
          {viewMode === "day" && (
            <div className="glass-card rounded-2xl p-6 border border-[#25352C] bg-[#101915] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
                <div>
                  <h3 className="text-sm font-bold text-[#F3F7F4]">
                    Timeline Schedule
                  </h3>
                  <p className="text-xs text-[#98A69D]">
                    Chronological blocks for {currentDate.toLocaleDateString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveEventToEdit(null);
                    setSelectedDateForNewEvent(
                      currentDate.toISOString().slice(0, 10)
                    );
                    setIsEventDialogOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#10B981] text-[#080D0B] text-xs font-bold hover:bg-[#059669] flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Block
                </button>
              </div>

              {/* Time Slots 08:00 to 20:00 */}
              <div className="space-y-3">
                {filteredEvents
                  .filter((ev) => {
                    const evDateStr = new Date(ev.startDate)
                      .toISOString()
                      .slice(0, 10);
                    const curDateStr = currentDate.toISOString().slice(0, 10);
                    return evDateStr === curDateStr;
                  })
                  .map((ev) => {
                    const style = getCategoryStyles(ev.category);
                    const startTime = new Date(ev.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const endTime = new Date(ev.endDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <div
                        key={ev.id}
                        onClick={() => {
                          setActiveEventToEdit(ev);
                          setIsEventDialogOpen(true);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${style.bg} ${style.border} hover:opacity-90 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#F3F7F4] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                              {startTime} – {endTime}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${style.border} ${style.text}`}
                            >
                              {ev.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#F3F7F4]">
                            {ev.title}
                          </h4>
                          {ev.description && (
                            <p className="text-xs text-[#98A69D] leading-relaxed">
                              {ev.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-[#98A69D]">
                          {ev.location && (
                            <span className="flex items-center gap-1 text-[11px]">
                              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                              {ev.location}
                            </span>
                          )}
                          {ev.isRecurring && (
                            <span className="flex items-center gap-1 text-[11px] text-[#10B981]">
                              <Repeat className="w-3.5 h-3.5" />
                              {ev.recurrence}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* AGENDA VIEW */}
          {viewMode === "agenda" && (
            <div className="glass-card rounded-2xl p-6 border border-[#25352C] bg-[#101915] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
                <div>
                  <h3 className="text-sm font-bold text-[#F3F7F4]">
                    Chronological Agenda
                  </h3>
                  <p className="text-xs text-[#98A69D]">
                    Sequential milestone timeline and scheduled commitments
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {filteredEvents.map((ev) => {
                  const style = getCategoryStyles(ev.category);
                  const dateStr = formatDate(ev.startDate);
                  const startTime = new Date(ev.startDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const endTime = new Date(ev.endDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={ev.id}
                      onClick={() => {
                        setActiveEventToEdit(ev);
                        setIsEventDialogOpen(true);
                      }}
                      className="p-4 rounded-2xl bg-[#142019] border border-[#25352C] hover:border-[#10B981]/40 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-[#10B981]">
                            {dateStr}
                          </span>
                          <span className="text-[11px] font-mono text-[#98A69D]">
                            ({startTime} – {endTime})
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${style.border} ${style.text}`}
                          >
                            {ev.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                          {ev.title}
                        </h4>
                        {ev.description && (
                          <p className="text-xs text-[#98A69D] leading-relaxed">
                            {ev.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#98A69D] shrink-0">
                        {ev.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                            {ev.location}
                          </span>
                        )}
                        {ev.reminderMin !== null && (
                          <span className="flex items-center gap-1 font-mono text-[10px]">
                            <Bell className="w-3 h-3 text-[#10B981]" />
                            {ev.reminderMin}m notice
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Reminders & Deadlines Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-[#25352C] bg-[#101915] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-sm font-bold text-[#F3F7F4]">
                  Reminders & Alerts
                </h3>
              </div>
              <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded-full border border-[#10B981]/30">
                {reminders.filter((r) => !r.isCompleted).length} Active
              </span>
            </div>

            {/* Quick Add Reminder Form */}
            <form onSubmit={handleAddReminder} className="space-y-2">
              <input
                type="text"
                value={newReminderTitle}
                onChange={(e) => setNewReminderTitle(e.target.value)}
                placeholder="Remind me to..."
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              />
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={newReminderDue}
                  onChange={(e) => setNewReminderDue(e.target.value)}
                  className="flex-1 bg-[#142019] border border-[#25352C] rounded-xl px-2.5 py-1 text-[11px] text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                />
                <button
                  type="submit"
                  disabled={!newReminderTitle.trim()}
                  className="px-3 py-1 rounded-xl bg-[#10B981] text-[#080D0B] text-xs font-semibold hover:bg-[#059669] transition-colors disabled:opacity-40"
                >
                  + Add
                </button>
              </div>
            </form>

            {/* Reminders List */}
            <div className="space-y-2 pt-2">
              {reminders.map((rem) => (
                <div
                  key={rem.id}
                  className={`p-3 rounded-xl border transition-all duration-200 group flex items-start justify-between gap-3 ${
                    rem.isCompleted
                      ? "bg-[#101915]/50 border-[#25352C]/60 opacity-60"
                      : "bg-[#142019] border-[#25352C] hover:border-[#10B981]/40"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleToggleReminder(rem)}
                    className="mt-0.5 text-[#98A69D] hover:text-[#10B981] transition-colors shrink-0"
                  >
                    {rem.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#98A69D] hover:text-[#10B981]" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p
                      className={`text-xs font-medium ${
                        rem.isCompleted
                          ? "line-through text-[#98A69D]"
                          : "text-[#F3F7F4]"
                      }`}
                    >
                      {rem.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#98A69D]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#10B981]" />
                        {formatDate(rem.dueDateTime)}
                      </span>
                      {rem.isRecurring && (
                        <span className="flex items-center gap-0.5 text-[#10B981]">
                          <Repeat className="w-2.5 h-2.5" />
                          {rem.recurrence}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteReminder(rem.id)}
                    className="p-1 rounded text-[#98A69D] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Create / Edit Dialog */}
      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={() => {
          setIsEventDialogOpen(false);
          setActiveEventToEdit(null);
        }}
        eventToEdit={activeEventToEdit}
        projects={projects}
        onSaveEvent={handleSaveEvent}
        onDeleteEvent={handleDeleteEvent}
        defaultDate={selectedDateForNewEvent}
      />
    </div>
  );
}
