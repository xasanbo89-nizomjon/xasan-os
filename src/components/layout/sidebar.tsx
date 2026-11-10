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
} from "lucide-react";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { DynamicIcon } from "../icons";
import { cn } from "@/lib/utils";

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

  // Group items by section
  const sections = ["Core", "Growth & Focus", "Intelligence", "System"] as const;

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
          "fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#101915] border-r border-[#25352C] transition-all duration-300 ease-in-out select-none",
          collapsed ? "w-20" : "w-64",
          // Mobile state
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand / Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#25352C] shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 overflow-hidden group"
            onClick={onCloseMobile}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-[#080D0B] font-black text-lg tracking-wider shadow-lg shadow-[#10B981]/25 group-hover:scale-105 transition-transform shrink-0">
              X
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wide text-[#F3F7F4] flex items-center gap-1.5">
                  XASAN OS
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#10B981]/15 text-[#10B981] font-mono font-semibold rounded border border-[#10B981]/30">
                    ULTIMATE
                  </span>
                </span>
                <span className="text-[10px] text-[#98A69D] tracking-tight">
                  Personal Executive System
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Toggle Button */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-[#142019] border border-[#25352C] items-center justify-center text-[#98A69D] hover:text-[#10B981] hover:border-[#10B981]/50 transition-colors cursor-pointer"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-4">
          {sections.map((section) => {
            const items = NAVIGATION_ITEMS.filter(
              (item) => item.section === section
            );
            if (items.length === 0) return null;

            return (
              <div key={section} className="space-y-1">
                {!collapsed && (
                  <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-[#98A69D]/70 font-mono">
                    {section}
                  </div>
                )}
                {items.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onCloseMobile}
                      title={collapsed ? `${item.name} — ${item.description}` : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150",
                        isActive
                          ? "bg-[#142019] text-[#10B981] border border-[#25352C] font-semibold emerald-glow-sm shadow-sm"
                          : "text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019]/60",
                        collapsed ? "justify-center px-0" : ""
                      )}
                    >
                      {/* Active Left Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#10B981] rounded-r-full shadow-sm shadow-[#10B981]" />
                      )}

                      <div
                        className={cn(
                          "transition-transform group-hover:scale-110",
                          isActive
                            ? "text-[#10B981]"
                            : "text-[#98A69D] group-hover:text-[#F3F7F4]"
                        )}
                      >
                        <DynamicIcon name={item.icon} className="w-4 h-4" />
                      </div>

                      {!collapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium leading-none ml-2 shrink-0 border",
                                item.badgeType === "emerald"
                                  ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                                  : item.badgeType === "warning"
                                  ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                                  : item.badgeType === "urgent"
                                  ? "bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30"
                                  : "bg-[#142019] text-[#98A69D] border-[#25352C]"
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
            );
          })}
        </div>

        {/* User Status / Bottom Footer */}
        <div className="p-3 border-t border-[#25352C] bg-[#080D0B]/40 shrink-0">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl bg-[#142019] border border-[#25352C]",
              collapsed ? "justify-center p-2" : ""
            )}
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#25352C] border border-[#10B981]/40 flex items-center justify-center text-xs font-bold text-[#10B981]">
                XM
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#10B981] border-2 border-[#101915] rounded-full animate-pulse" />
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-[#F3F7F4] truncate">
                    Xasan M.
                  </p>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-[#98A69D] font-mono">
                    ONLINE
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#10B981]" />
                  <span className="text-[9px] text-[#10B981] font-mono">
                    v1.0
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
