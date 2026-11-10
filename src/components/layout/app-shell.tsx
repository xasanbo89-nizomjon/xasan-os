"use client";

import React, { useState } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { CommandPalette } from "./command-palette";
import { QuickCreateDialog } from "./quick-create-dialog";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [quickCreateType, setQuickCreateType] = useState<string>("task");

  const handleOpenQuickCreate = (type?: string) => {
    if (type) setQuickCreateType(type);
    setQuickCreateOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080D0B] text-[#F3F7F4] flex">
      {/* Collapsible Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Layout */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out",
          collapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Top Navbar */}
        <Navbar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenQuickCreate={handleOpenQuickCreate}
          onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

      {/* Global Interactive Command Palette (Ctrl/Cmd + K) */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onOpenQuickCreate={handleOpenQuickCreate}
      />

      {/* Global Quick-Create Dialog */}
      <QuickCreateDialog
        open={quickCreateOpen}
        onOpenChange={setQuickCreateOpen}
        initialType={quickCreateType}
      />
    </div>
  );
}
