"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Bell,
  Menu,
  Clock,
  Sparkles,
  Lock,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { logoutAction } from "@/server/actions/auth";
import { useTranslation } from "@/stores/language-store";
import { LanguageSwitcher } from "./language-switcher";

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenSearch?: () => void;
  onOpenQuickCreate: (type?: string) => void;
  onToggleMobileSidebar: () => void;
}

export function Navbar({
  onOpenCommandPalette,
  onOpenSearch,
  onOpenQuickCreate,
  onToggleMobileSidebar,
}: NavbarProps) {
  const router = useRouter();
  const { dict, isUz } = useTranslation();
  const [time, setTime] = useState<string>("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Live system clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  const handleLockApp = () => {
    setProfileMenuOpen(false);
    router.push("/lock");
  };

  return (
    <header className="h-16 bg-[#0D1527]/85 backdrop-blur-xl border-b border-[#1E2D4D] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left Area: Mobile hamburger + Search pill */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#101B33] transition-colors border border-[#1E2D4D]"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Pill matching image */}
        <button
          onClick={onOpenSearch || onOpenCommandPalette}
          className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-[#070B14] border border-[#1E2D4D] text-[#94A3B8] text-xs hover:border-[#38BDF8]/50 hover:text-[#F1F5F9] transition-all duration-150 group cursor-pointer shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#94A3B8] group-hover:text-[#38BDF8] transition-colors" />
            <span className="font-normal truncate">
              Qidiruv... (Ctrl + K)
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[10px] bg-[#0D1527] px-2 py-0.5 rounded-full border border-[#1E2D4D] group-hover:border-[#38BDF8]/30 text-[#94A3B8]">
            <span>Ctrl + K</span>
          </div>
        </button>
      </div>

      {/* Right Area: Theme toggle, Language, Notifications & Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Theme mode toggle indicator */}
        <button
          type="button"
          title="Mavzu rejimi"
          className="p-2 rounded-xl text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#101B33] border border-[#1E2D4D] transition-colors cursor-pointer"
        >
          <span className="text-xs">☀️ 🌙</span>
        </button>

        {/* Language Switcher (UZ dropdown) */}
        <LanguageSwitcher />

        {/* Quick Lock Button */}
        <button
          onClick={handleLockApp}
          title={dict.navbar.lock_app_title}
          className="p-2 rounded-xl text-[#94A3B8] hover:text-[#38BDF8] hover:bg-[#101B33] border border-[#1E2D4D] transition-colors cursor-pointer hidden sm:flex"
        >
          <Lock className="w-4 h-4" />
        </button>

        {/* Notifications Popover Trigger with exact RED badge '3' */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label={dict.navbar.notifications_title}
            className="relative p-2 rounded-xl text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#101B33] border border-[#1E2D4D] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[10px] font-black flex items-center justify-center font-mono shadow-sm">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 glass-dropdown rounded-2xl shadow-2xl z-40 p-3 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#25352C]">
                  <h4 className="text-xs font-semibold text-[#F3F7F4] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                    {dict.navbar.notifications_title}
                  </h4>
                  <Link
                    href="/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] text-[#10B981] hover:underline"
                  >
                    {dict.navbar.notifications_view_all}
                  </Link>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#142019] border border-[#25352C]">
                    <div className="flex items-center justify-between text-[#10B981] font-semibold text-[11px] mb-1">
                      <span>{isUz ? "Odatlar Barqarorligi" : "Habit Streak Milestone"}</span>
                      <span className="text-[10px] text-[#98A69D]">{isUz ? "20 daq oldin" : "20m ago"}</span>
                    </div>
                    <p className="text-[#98A69D]">
                      {isUz ? "Dasturlash va arxitektura bo‘yicha 21 kunlik davomiylik!" : "21-day streak achieved in Deep Architecture & Coding!"}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#142019] border border-[#25352C]">
                    <div className="flex items-center justify-between text-[#F59E0B] font-semibold text-[11px] mb-1">
                      <span>{isUz ? "Loyiha Muddati" : "Project Deadline Notice"}</span>
                      <span className="text-[10px] text-[#98A69D]">{isUz ? "1 soat oldin" : "1h ago"}</span>
                    </div>
                    <p className="text-[#98A69D]">
                      {isUz ? "Aurelius IELTS Whisper API integratsiyasi ertaga rejalashtirilgan." : "Aurelius IELTS Whisper API integration due tomorrow."}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#38BDF8]/40 transition-all cursor-pointer"
          >
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#38BDF8] to-[#2563EB] flex items-center justify-center text-xs font-bold text-white shadow-md border border-[#38BDF8]/40">
              XM
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-[#0D1527]" />
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl shadow-2xl z-40 p-2 animate-in fade-in zoom-in-95 duration-150 border border-[#1E2D4D] bg-[#0D1527]">
                <div className="px-3 py-2 border-b border-[#1E2D4D] mb-1">
                  <div className="text-xs font-bold text-[#F1F5F9]">
                    Xasan Mukhammadiev
                  </div>
                  <div className="text-[10px] text-[#94A3B8] truncate">
                    xasan@os.local
                  </div>
                  <div className="text-[9px] font-mono text-[#38BDF8] mt-0.5">
                    {dict.navbar.profile_menu.owner}
                  </div>
                </div>

                <div className="space-y-0.5 text-xs">
                  <Link
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#F1F5F9] hover:bg-[#101B33] hover:text-[#38BDF8] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#94A3B8]" />
                    <span>{dict.navbar.profile_menu.profile}</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#F1F5F9] hover:bg-[#101B33] hover:text-[#38BDF8] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#94A3B8]" />
                    <span>{dict.navbar.profile_menu.settings}</span>
                  </Link>

                  <button
                    onClick={handleLockApp}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#F1F5F9] hover:bg-[#101B33] hover:text-[#38BDF8] transition-colors text-left cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#38BDF8]" />
                    <span>{dict.navbar.profile_menu.lock}</span>
                  </button>

                  <div className="border-t border-[#1E2D4D] my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors text-left cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4 text-[#EF4444]" />
                    <span>{dict.navbar.profile_menu.logout}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
