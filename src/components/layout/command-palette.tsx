"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Search,
  Sparkles,
  PlusCircle,
  ArrowRight,
  X,
  Keyboard,
  Layers,
  Clock,
  LayoutDashboard,
  Activity,
  CalendarRange,
  CalendarDays,
  Lock,
} from "lucide-react";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { DynamicIcon } from "../icons";
import { useDashboardStore, DashboardViewType } from "@/stores/dashboard-store";
import { useTranslation } from "@/stores/language-store";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenQuickCreate: (type?: string) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onOpenQuickCreate,
}: CommandPaletteProps) {
  const router = useRouter();
  const { dict, isUz } = useTranslation();
  const [search, setSearch] = useState("");
  const { setView, startFocusSession } = useDashboardStore();

  const getItemLocalized = (itemId: string, fallbackName: string, fallbackDesc: string) => {
    switch (itemId) {
      case "overview": return { name: dict.nav.overview, desc: dict.nav.overview_desc };
      case "my-day": return { name: dict.nav.my_day, desc: dict.nav.my_day_desc };
      case "tasks": return { name: dict.nav.tasks, desc: dict.nav.tasks_desc };
      case "calendar": return { name: dict.nav.calendar, desc: dict.nav.calendar_desc };
      case "life-tracker": return { name: dict.nav.life_tracker, desc: dict.nav.life_tracker_desc };
      case "study-center": return { name: dict.nav.study_center, desc: dict.nav.study_center_desc };
      case "developer-hub": return { name: dict.nav.developer_hub, desc: dict.nav.developer_hub_desc };
      case "finance": return { name: dict.nav.finance, desc: dict.nav.finance_desc };
      case "xasan-ai": return { name: dict.nav.xasan_ai, desc: dict.nav.xasan_ai_desc };
      case "knowledge-base": return { name: dict.nav.knowledge_base, desc: dict.nav.knowledge_base_desc };
      case "goals": return { name: dict.nav.goals, desc: dict.nav.goals_desc };
      case "analytics": return { name: dict.nav.analytics, desc: dict.nav.analytics_desc };
      case "notifications": return { name: dict.nav.notifications, desc: dict.nav.notifications_desc };
      case "profile": return { name: dict.nav.profile, desc: dict.nav.profile_desc };
      case "settings": return { name: dict.nav.settings, desc: dict.nav.settings_desc };
      default: return { name: fallbackName, desc: fallbackDesc };
    }
  };

  // Global Ctrl+K / Cmd+K handler
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  const navigateTo = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const handleQuickAction = (actionType: string) => {
    onOpenChange(false);
    onOpenQuickCreate(actionType);
  };

  const handleSwitchView = (view: DashboardViewType) => {
    onOpenChange(false);
    setView(view);
    router.push("/");
  };

  const handleStartFocus = () => {
    onOpenChange(false);
    startFocusSession(50);
  };

  const handleLock = () => {
    onOpenChange(false);
    router.push("/lock");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080D0B]/80 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-[#101915] border border-[#25352C] rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 emerald-glow">
        <Command
          value={search}
          onValueChange={setSearch}
          className="flex flex-col w-full"
        >
          {/* Search Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-[#25352C] gap-3">
            <Search className="w-5 h-5 text-[#10B981] shrink-0" />
            <Command.Input
              autoFocus
              placeholder={isUz ? "Buyruq kiriting yoki bo‘limlarni qidiring... (masalan: Diqqat, Vazifalar, IELTS)" : "Type a command or search sections... (e.g. Focus, Tasks, Weekly, IELTS)"}
              className="w-full bg-transparent text-[#F3F7F4] placeholder-[#98A69D] text-sm focus:outline-none"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <kbd className="px-2 py-0.5 text-[11px] font-mono bg-[#142019] text-[#98A69D] rounded border border-[#25352C]">
                ESC
              </kbd>
              <button
                onClick={() => onOpenChange(false)}
                className="text-[#98A69D] hover:text-[#F3F7F4] p-1 rounded-md hover:bg-[#142019]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List Results */}
          <Command.List className="max-h-[380px] overflow-y-auto p-2 space-y-1 focus:outline-none">
            <Command.Empty className="py-8 text-center text-sm text-[#98A69D]">
              {isUz ? `"${search}" bo‘yicha natija topilmadi.` : `No results found for "${search}".`}
            </Command.Empty>

            {/* Quick Actions Group */}
            <Command.Group
              heading={isUz ? "Tezkor Tizim Amallari" : "Quick System Actions"}
              className="text-[11px] font-semibold text-[#98A69D] uppercase tracking-wider px-3 py-2"
            >
              <Command.Item
                onSelect={() => navigateTo("/focus")}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981] group-hover:border-[#10B981]/40">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{isUz ? "Pomodoro va Diqqat laboratoriyasini ochish" : "Open Focus & Pomodoro Lab"}</span>
                </div>
                <span className="text-xs text-[#98A69D] flex items-center gap-1 font-mono">
                  {isUz ? "O‘tish" : "Navigate"} <ArrowRight className="w-3 h-3" />
                </span>
              </Command.Item>

              <Command.Item
                onSelect={handleStartFocus}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981] group-hover:border-[#10B981]/40">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{isUz ? "50 daqiqalik chuqur ishlash sessiyasini boshlash" : "Start 50-Minute Deep Work Session"}</span>
                </div>
                <span className="text-xs text-[#98A69D] flex items-center gap-1 font-mono">
                  {isUz ? "Boshlash" : "Trigger"}
                </span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleQuickAction("task")}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981] group-hover:border-[#10B981]/40">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{isUz ? "Yangi vazifa yaratish" : "Create New Task"}</span>
                </div>
                <span className="text-xs text-[#98A69D] flex items-center gap-1">
                  {isUz ? "Amal" : "Action"} <ArrowRight className="w-3 h-3" />
                </span>
              </Command.Item>

              <Command.Item
                onSelect={handleLock}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981] group-hover:border-[#10B981]/40">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{isUz ? "Ilovani PIN-kod bilan bloklash" : "Lock Application (PIN Passcode)"}</span>
                </div>
                <span className="text-xs text-[#98A69D] flex items-center gap-1">
                  {isUz ? "Xavfsizlik" : "Security"} <ArrowRight className="w-3 h-3" />
                </span>
              </Command.Item>
            </Command.Group>

            {/* Dashboard Views */}
            <Command.Group
              heading={isUz ? "Boshqaruv Paneli Ko‘rinishi" : "Switch Dashboard Views"}
              className="text-[11px] font-semibold text-[#98A69D] uppercase tracking-wider px-3 py-2 border-t border-[#25352C]/60 mt-1"
            >
              <Command.Item
                onSelect={() => handleSwitchView("overview")}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{isUz ? "Umumiy ko‘rinish (Asosiy vidjetlar)" : "Overview (Main Widgets)"}</span>
                </div>
                <span className="text-[10px] text-[#98A69D] font-mono">{isUz ? "Ko‘rish" : "View"}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSwitchView("activity")}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{isUz ? "Mening faoliyatlar oqimim" : "My Activity Stream"}</span>
                </div>
                <span className="text-[10px] text-[#98A69D] font-mono">{isUz ? "Ko‘rish" : "View"}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSwitchView("weekly")}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarRange className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{isUz ? "Haftalik velositi va matrisa" : "Weekly Velocity & Matrix"}</span>
                </div>
                <span className="text-[10px] text-[#98A69D] font-mono">{isUz ? "Ko‘rish" : "View"}</span>
              </Command.Item>

              <Command.Item
                onSelect={() => handleSwitchView("monthly")}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{isUz ? "Oylik OKR va faollik xaritasi" : "Monthly OKRs & Heatmap"}</span>
                </div>
                <span className="text-[10px] text-[#98A69D] font-mono">{isUz ? "Ko‘rish" : "View"}</span>
              </Command.Item>
            </Command.Group>

            {/* Navigation Routes */}
            <Command.Group
              heading={isUz ? "Operatsion Tizim Modullari" : "Operating System Modules"}
              className="text-[11px] font-semibold text-[#98A69D] uppercase tracking-wider px-3 py-2 border-t border-[#25352C]/60 mt-1"
            >
              {NAVIGATION_ITEMS.map((item) => {
                const loc = getItemLocalized(item.id, item.name, item.description);
                return (
                  <Command.Item
                    key={item.id}
                    value={`${loc.name} ${loc.desc} ${item.section}`}
                    onSelect={() => navigateTo(item.href)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#98A69D] group-hover:text-[#10B981] group-hover:border-[#10B981]/40 transition-colors">
                        <DynamicIcon name={item.icon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium leading-none mb-1 text-[#F3F7F4] group-hover:text-[#10B981]">
                          {loc.name}
                        </div>
                        <div className="text-[11px] text-[#98A69D] line-clamp-1">
                          {loc.desc}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-[#25352C] group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Command.Item>
                );
              })}
            </Command.Group>
          </Command.List>

          {/* Footer Shortcuts Info */}
          <div className="px-4 py-2.5 border-t border-[#25352C] bg-[#080D0B]/60 flex items-center justify-between text-xs text-[#98A69D]">
            <div className="flex items-center gap-2">
              <Keyboard className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{isUz ? "Yo‘nalish tugmalari bilan harakatlaning" : "Navigate with arrow keys"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>
                <kbd className="px-1.5 py-0.5 text-[10px] bg-[#142019] rounded border border-[#25352C]">
                  ↵
                </kbd>{" "}
                {isUz ? "Tanlash" : "Select"}
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 text-[10px] bg-[#142019] rounded border border-[#25352C]">
                  ESC
                </kbd>{" "}
                {isUz ? "Yopish" : "Close"}
              </span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
}
