"use client";

import React, { useState, useEffect } from "react";
import { CalendarEventSummary, ProjectSummary } from "@/types";
import { X, Calendar, Clock, MapPin, Tag, Plus, Trash2, Repeat, Bell } from "lucide-react";
import { useTranslation } from "@/stores/language-store";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: CalendarEventSummary | null;
  projects?: ProjectSummary[];
  onSaveEvent: (data: any) => Promise<void>;
  onDeleteEvent?: (id: string) => Promise<void>;
  defaultDate?: string;
}

export function EventDialog({
  isOpen,
  onClose,
  eventToEdit,
  projects = [],
  onSaveEvent,
  onDeleteEvent,
  defaultDate,
}: EventDialogProps) {
  const { dict, isUz } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("WORK");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:00");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState("WEEKLY");
  const [reminderMin, setReminderMin] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDescription(eventToEdit.description || "");
      setCategory(eventToEdit.category || "WORK");
      const s = new Date(eventToEdit.startDate);
      const e = new Date(eventToEdit.endDate);
      setStartDate(s.toISOString().slice(0, 10));
      setStartTime(s.toTimeString().slice(0, 5));
      setEndDate(e.toISOString().slice(0, 10));
      setEndTime(e.toTimeString().slice(0, 5));
      setAllDay(eventToEdit.allDay || false);
      setLocation(eventToEdit.location || "");
      setProjectId(eventToEdit.projectId || "");
      setIsRecurring(eventToEdit.isRecurring || false);
      setRecurrence(eventToEdit.recurrence || "WEEKLY");
      setReminderMin(eventToEdit.reminderMin || 15);
    } else {
      const today = defaultDate || new Date().toISOString().slice(0, 10);
      setTitle("");
      setDescription("");
      setCategory("WORK");
      setStartDate(today);
      setStartTime("10:00");
      setEndDate(today);
      setEndTime("11:30");
      setAllDay(false);
      setLocation("");
      setProjectId("");
      setIsRecurring(false);
      setRecurrence("WEEKLY");
      setReminderMin(15);
    }
  }, [eventToEdit, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    setIsSubmitting(true);
    try {
      const startDateTime = allDay
        ? new Date(`${startDate}T00:00:00`).toISOString()
        : new Date(`${startDate}T${startTime}:00`).toISOString();

      const endDateTime = allDay
        ? new Date(`${endDate || startDate}T23:59:59`).toISOString()
        : new Date(`${endDate || startDate}T${endTime}:00`).toISOString();

      await onSaveEvent({
        id: eventToEdit?.id,
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        startDate: startDateTime,
        endDate: endDateTime,
        allDay,
        location: location.trim() || undefined,
        projectId: projectId || undefined,
        isRecurring,
        recurrence: isRecurring ? recurrence : undefined,
        reminderMin: Number(reminderMin),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToEdit?.id || !onDeleteEvent) return;
    if (!confirm(isUz ? "Haqiqatan ham ushbu tadbirni o‘chirmoqchimisiz?" : "Are you sure you want to delete this event?")) return;
    await onDeleteEvent(eventToEdit.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl w-full max-w-lg border border-[#25352C] bg-[#101915] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#25352C]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F3F7F4]">
                {eventToEdit
                  ? isUz
                    ? "Tadbirni tahrirlash"
                    : "Edit Calendar Block"
                  : isUz
                  ? "Yangi tadbir rejalashtirish"
                  : "Schedule New Event"}
              </h3>
              <p className="text-xs text-[#98A69D]">
                {isUz
                  ? "Vaqt bloki va muhim muddatlar"
                  : "Time architecture block & milestone deadlines"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
              {isUz ? "Tadbir nomi" : "Event Title"} <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isUz ? "Masalan: Whisper modeli tahlili yoki Deep Work" : "e.g. Whisper Model Architecture Review"}
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3.5 py-2 text-sm text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                {isUz ? "Kategoriya" : "Category"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value="WORK">{isUz ? "Ish / Faoliyat" : "WORK"}</option>
                <option value="EDUCATION">{isUz ? "Ta'lim / IELTS" : "EDUCATION / IELTS"}</option>
                <option value="PROJECT">{isUz ? "Dasturlash / Loyiha" : "PROJECT DEV"}</option>
                <option value="PERSONAL">{isUz ? "Shaxsiy / Salomatlik" : "PERSONAL / HEALTH"}</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
                {isUz ? "Tegishli loyiha (Ixtiyoriy)" : "Project (Optional)"}
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-2 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              >
                <option value="">{isUz ? "Loyihasiz" : "No Project"}</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* All day toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allDayCheckbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="w-4 h-4 rounded border-[#25352C] bg-[#142019] text-[#10B981] focus:ring-0 accent-[#10B981]"
            />
            <label
              htmlFor="allDayCheckbox"
              className="text-xs text-[#F3F7F4] cursor-pointer"
            >
              {isUz ? "Butun kunlik tadbir" : "All-Day Event"}
            </label>
          </div>

          {/* Dates & Times */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block">
                {isUz ? "Boshlanish vaqti" : "Start Time"}
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              />
              {!allDay && (
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block">
                {isUz ? "Tugash vaqti" : "End Time"}
              </label>
              <input
                type="date"
                value={endDate || startDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              />
              {!allDay && (
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                />
              )}
            </div>
          </div>

          {/* Location & Reminder notice */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#10B981]" /> {isUz ? "Manzil / Havola" : "Location / Link"}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={isUz ? "Google Meet yoki xona raqami" : "Google Meet or Lab Room"}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1 flex items-center gap-1">
                <Bell className="w-3 h-3 text-[#10B981]" /> {isUz ? "Eslatma bildirishnomasi" : "Reminder Alert"}
              </label>
              <select
                value={reminderMin}
                onChange={(e) => setReminderMin(Number(e.target.value))}
                className="w-full bg-[#142019] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
              >
                <option value={0}>{isUz ? "Tadbir vaqtida" : "At time of event"}</option>
                <option value={5}>{isUz ? "5 daqiqa oldin" : "5 minutes before"}</option>
                <option value={10}>{isUz ? "10 daqiqa oldin" : "10 minutes before"}</option>
                <option value={15}>{isUz ? "15 daqiqa oldin" : "15 minutes before"}</option>
                <option value={30}>{isUz ? "30 daqiqa oldin" : "30 minutes before"}</option>
                <option value={60}>{isUz ? "1 soat oldin" : "1 hour before"}</option>
              </select>
            </div>
          </div>

          {/* Recurrence */}
          <div className="p-3 rounded-xl bg-[#142019] border border-[#25352C] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#F3F7F4] flex items-center gap-1.5 font-medium">
                <Repeat className="w-3.5 h-3.5 text-[#10B981]" /> {isUz ? "Takrorlanuvchi tadbir" : "Recurring Event"}
              </span>
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded border-[#25352C] bg-[#101915] text-[#10B981] focus:ring-0 accent-[#10B981]"
              />
            </div>

            {isRecurring && (
              <div className="pt-2">
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value)}
                  className="w-full bg-[#101915] border border-[#25352C] rounded-lg px-2.5 py-1.5 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] font-mono"
                >
                  <option value="DAILY">{isUz ? "Har kuni" : "Daily"}</option>
                  <option value="WEEKLY">{isUz ? "Har hafta" : "Weekly"}</option>
                  <option value="MONTHLY">{isUz ? "Har oy" : "Monthly"}</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#98A69D] uppercase block mb-1">
              {isUz ? "Tavsif / Kun tartibi qaydlari" : "Description / Agenda Notes"}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isUz ? "Uchrashuv maqsadi, asosiy mavzular yoki tayyorgarlik..." : "Meeting agenda, key talking points, or prep notes..."}
              className="w-full bg-[#142019] border border-[#25352C] rounded-xl p-3 text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981] resize-none"
            />
          </div>

          <div className="flex justify-between items-center gap-2 pt-3 border-t border-[#25352C]">
            {eventToEdit && onDeleteEvent ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 rounded-xl bg-[#142019] hover:bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {dict.common.delete || (isUz ? "O‘chirish" : "Delete")}
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#142019] hover:bg-[#142019]/80 text-[#98A69D] border border-[#25352C] text-xs font-medium transition-colors"
              >
                {dict.common.cancel || (isUz ? "Bekor qilish" : "Cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#080D0B] font-bold text-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-[#10B981]/20"
              >
                {isSubmitting
                  ? (isUz ? "Saqlanmoqda..." : "Saving...")
                  : eventToEdit
                  ? (isUz ? "O‘zgarishlarni saqlash" : "Update Block")
                  : (isUz ? "Tadbirni rejalashtirish" : "Schedule Event")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}