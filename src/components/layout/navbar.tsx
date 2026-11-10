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

interface NavbarProps {
  onOpenCommandPalette: () => void;
  onOpenQuickCreate: (type?: string) => void;
  onToggleMobileSidebar: () => void;
}

export function Navbar({
  onOpenCommandPalette,
  onOpenQuickCreate,
  onToggleMobileSidebar,
}: NavbarProps) {
  const router = useRouter();
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
    <header className="h-16 bg-[#101915]/80 backdrop-blur-xl border-b border-[#25352C] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left Area: Mobile hamburger + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] transition-colors border border-[#25352C]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Breadcrumbs />
      </div>

      {/* Middle Area: Global Search / Command Bar Trigger */}
      <div className="hidden md:flex flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-[#98A69D] text-xs hover:border-[#10B981]/50 hover:text-[#F3F7F4] transition-all duration-150 group cursor-pointer shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#98A69D] group-hover:text-[#10B981] transition-colors" />
            <span className="font-normal">
              Search modules, tasks, IELTS or actions...
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono text-[11px] bg-[#101915] px-2 py-0.5 rounded border border-[#25352C] group-hover:border-[#10B981]/30">
            <span className="text-[10px]">⌘</span>
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Area: Status clock, Quick Create, Notifications, Quick Lock & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Live System Time */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#142019] border border-[#25352C] text-xs font-mono text-[#98A69D]">
          <Clock className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{time || "22:12:00"}</span>
        </div>

        {/* Quick-Create Action Button */}
        <div className="relative">
          <button
            onClick={() => onOpenQuickCreate()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#10B981] text-[#080D0B] font-semibold text-xs hover:bg-[#059669] transition-all shadow-md shadow-[#10B981]/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </button>
        </div>

        {/* Quick Lock Button */}
        <button
          onClick={handleLockApp}
          title="Lock Application (PIN Lock)"
          className="p-2 rounded-xl text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019] border border-[#25352C] transition-colors cursor-pointer"
        >
          <Lock className="w-4 h-4" />
        </button>

        {/* Search button on small screens */}
        <button
          onClick={onOpenCommandPalette}
          aria-label="Search"
          className="md:hidden p-2 rounded-xl text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] border border-[#25352C]"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl text-[#98A69D] hover:text-[#F3F7F4] hover:bg-[#142019] border border-[#25352C] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981]" />
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
                    System Notifications
                  </h4>
                  <Link
                    href="/notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] text-[#10B981] hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#142019] border border-[#25352C]">
                    <div className="flex items-center justify-between text-[#10B981] font-semibold text-[11px] mb-1">
                      <span>Habit Streak Milestone</span>
                      <span className="text-[10px] text-[#98A69D]">20m ago</span>
                    </div>
                    <p className="text-[#98A69D]">
                      21-day streak achieved in Deep Architecture & Coding!
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#142019] border border-[#25352C]">
                    <div className="flex items-center justify-between text-[#F59E0B] font-semibold text-[11px] mb-1">
                      <span>Project Deadline Notice</span>
                      <span className="text-[10px] text-[#98A69D]">1h ago</span>
                    </div>
                    <p className="text-[#98A69D]">
                      Aurelius IELTS Whisper API integration due tomorrow.
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
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 transition-colors group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#10B981] to-[#3B82F6] flex items-center justify-center text-xs font-bold text-[#080D0B] shadow-sm">
              XM
            </div>
            <span className="hidden sm:inline text-xs font-medium text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
              Xasan
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#98A69D]" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 glass-dropdown rounded-2xl shadow-2xl z-40 p-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#25352C] mb-1">
                  <div className="text-xs font-bold text-[#F3F7F4]">
                    Xasan Mukhammadiev
                  </div>
                  <div className="text-[10px] text-[#98A69D] truncate">
                    xasan@os.local
                  </div>
                  <div className="text-[9px] font-mono text-[#10B981] mt-0.5">
                    ROOT AUTHORITY
                  </div>
                </div>

                <div className="space-y-0.5 text-xs">
                  <Link
                    href="/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#98A69D]" />
                    <span>Profile & Security</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#98A69D]" />
                    <span>Settings</span>
                  </Link>

                  <button
                    onClick={handleLockApp}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#F3F7F4] hover:bg-[#142019] hover:text-[#10B981] transition-colors text-left cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-[#10B981]" />
                    <span>Lock App (PIN)</span>
                  </button>

                  <div className="border-t border-[#25352C] my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#EF4444] hover:bg-[#EF4444]/15 transition-colors text-left cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4 text-[#EF4444]" />
                    <span>Sign Out</span>
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
