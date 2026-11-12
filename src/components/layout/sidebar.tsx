"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Rocket,
} from "lucide-react";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { DynamicIcon } from "../icons";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/stores/language-store";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const { dict, isUz } = useTranslation();

  // Group items by section
  const sections = ["Core", "Growth & Focus", "Intelligence", "System"] as const;

  const getSectionTitle = (sec: string) => {
    switch (sec) {
      case "Core":
        return dict.nav.sections.core;
      case "Growth & Focus":
        return dict.nav.sections.growth_focus;
      case "Intelligence":
        return dict.nav.sections.intelligence;
      case "System":
        return dict.nav.sections.system;
      default:
        return sec;
    }
  };

  const getItemLocalized = (itemId: string, fallbackName: string, fallbackDesc: string) => {
    switch (itemId) {
      case "overview":
        return { name: dict.nav.overview, desc: dict.nav.overview_desc };
      case "my-day":
        return { name: dict.nav.my_day, desc: dict.nav.my_day_desc };
      case "tasks":
        return { name: dict.nav.tasks, desc: dict.nav.tasks_desc };
      case "calendar":
        return { name: dict.nav.calendar, desc: dict.nav.calendar_desc };
      case "life-tracker":
        return { name: dict.nav.life_tracker, desc: dict.nav.life_tracker_desc };
      case "study-center":
        return { name: dict.nav.study_center, desc: dict.nav.study_center_desc };
      case "developer-hub":
        return { name: dict.nav.developer_hub, desc: dict.nav.developer_hub_desc };
      case "finance":
        return { name: dict.nav.finance, desc: dict.nav.finance_desc };
      case "xasan-ai":
        return { name: dict.nav.xasan_ai, desc: dict.nav.xasan_ai_desc };
      case "knowledge-base":
        return { name: dict.nav.knowledge_base, desc: dict.nav.knowledge_base_desc };
      case "goals":
        return { name: dict.nav.goals, desc: dict.nav.goals_desc };
      case "analytics":
        return { name: dict.nav.analytics, desc: dict.nav.analytics_desc };
      case "notifications":
        return { name: dict.nav.notifications, desc: dict.nav.notifications_desc };
      case "profile":
        return { name: dict.nav.profile, desc: dict.nav.profile_desc };
      case "settings":
        return { name: dict.nav.settings, desc: dict.nav.settings_desc };
      default:
        return { name: fallbackName, desc: fallbackDesc };
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#080D0B]/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#0D1527] border-r border-[#1E2D4D] transition-all duration-300 ease-in-out select-none",
          collapsed ? "w-20" : "w-64",
          // Mobile state
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand / Logo Header */}
        <div className="h-20 flex flex-col items-center justify-center border-b border-[#1E2D4D] px-4 shrink-0 relative">
          <Link
            href="/"
            className="flex flex-col items-center justify-center text-center group"
            onClick={onCloseMobile}
          >
            {/* Glowing X Logo */}
            <div className="relative mb-1">
              <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#0EA5E9] bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]">
                ✕
              </span>
            </div>
            {!collapsed && (
              <div className="flex flex-col items-center">
                <span className="font-extrabold text-sm tracking-wider text-[#F1F5F9] uppercase">
                  XASAN OS
                </span>
                <span className="text-[10px] text-[#94A3B8] font-mono tracking-widest uppercase">
                  Ultimate
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex absolute top-3 right-3 w-6 h-6 rounded-lg bg-[#101B33] border border-[#1E2D4D] items-center justify-center text-[#94A3B8] hover:text-[#38BDF8] hover:border-[#38BDF8]/50 transition-colors cursor-pointer"
          >
            {collapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const loc = getItemLocalized(item.id, item.name, item.description);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                title={collapsed ? `${loc.name} — ${loc.desc}` : undefined}
                className={cn(
                  "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40 font-semibold sapphire-glow-sm shadow-sm"
                    : "text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#101B33]/60",
                  collapsed ? "justify-center px-0" : ""
                )}
              >
                {/* Active Left Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#38BDF8] rounded-r-full shadow-sm shadow-[#38BDF8]" />
                )}

                <div
                  className={cn(
                    "transition-transform group-hover:scale-110",
                    isActive
                      ? "text-[#38BDF8]"
                      : "text-[#94A3B8] group-hover:text-[#F1F5F9]"
                  )}
                >
                  <DynamicIcon name={item.icon} className="w-4 h-4" />
                </div>

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{loc.name}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold leading-none ml-2 shrink-0 border",
                          item.badgeType === "emerald"
                            ? "bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40"
                            : item.badgeType === "urgent"
                            ? "bg-[#EF4444] text-white border-[#EF4444] rounded-full px-1.5"
                            : item.badgeType === "warning"
                            ? "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/40"
                            : "bg-[#101B33] text-[#94A3B8] border-[#1E2D4D]"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sidebar Bottom Banner from image: Rocket card */}
        <div className="p-3 border-t border-[#1E2D4D] bg-[#070B14]/40 shrink-0">
          <div
            className={cn(
              "flex items-center gap-3 p-3 rounded-2xl bg-[#101B33] border border-[#1E2D4D] hover:border-[#38BDF8]/40 transition-colors group cursor-pointer",
              collapsed ? "justify-center p-2" : ""
            )}
          >
            <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] group-hover:scale-110 transition-transform shrink-0">
              <Rocket className="w-4 h-4" />
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#F1F5F9] leading-tight">
                  Control Your Time.
                </p>
                <p className="text-[10px] text-[#94A3B8] font-medium leading-tight mt-0.5">
                  Build Your Future.
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
