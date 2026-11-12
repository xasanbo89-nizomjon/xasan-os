"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { CommandPalette } from "./command-palette";
import { QuickCreateDialog } from "./quick-create-dialog";
import { FloatingActionButton } from "./floating-action-button";
import { FocusSessionModal } from "../dashboard/focus-session-modal";
import { GlobalSearchDialog } from "./global-search-dialog";
import { PwaManager } from "./pwa-manager";
import { getGlobalSearchDataAction } from "@/server/actions/os";
import { TaskSummary, ProjectSummary, KnowledgeNoteSummary, TransactionSummary } from "@/types";
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
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  // Search dataset
  const [searchData, setSearchData] = useState<{
    tasks: TaskSummary[];
    projects: ProjectSummary[];
    notes: KnowledgeNoteSummary[];
    transactions: TransactionSummary[];
  }>({
    tasks: [],
    projects: [],
    notes: [],
    transactions: [],
  });

  useEffect(() => {
    async function loadSearch() {
      const data = await getGlobalSearchDataAction();
      setSearchData(data);
    }
    loadSearch();
  }, []);

  const handleOpenQuickCreate = (type?: string) => {
    if (type) setQuickCreateType(type);
    setQuickCreateOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080D0B] text-[#F3F7F4] flex relative overflow-x-hidden aurora-bg">
      {/* Ethereal Emerald Aurora Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-center primary aurora glow */}
        <div className="absolute -top-[20%] left-[15%] w-[850px] h-[550px] bg-gradient-to-br from-[#10B981]/15 via-[#059669]/8 to-transparent rounded-full blur-[140px] animate-aurora pointer-events-none" />
        {/* Secondary right aurora glow */}
        <div className="absolute top-[30%] -right-[15%] w-[650px] h-[650px] bg-gradient-to-bl from-[#10B981]/10 via-[#047857]/5 to-transparent rounded-full blur-[150px] animate-aurora [animation-delay:4s] pointer-events-none" />
        {/* Subtle bottom-left aurora glow */}
        <div className="absolute -bottom-[15%] -left-[10%] w-[600px] h-[500px] bg-gradient-to-tr from-[#10B981]/10 via-[#059669]/4 to-transparent rounded-full blur-[130px] animate-aurora [animation-delay:8s] pointer-events-none" />
      </div>

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
          "flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out relative z-10",
          collapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Top Navbar */}
        <Navbar
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenSearch={() => setSearchDialogOpen(true)}
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

      {/* Global Cross-Module Search Dialog */}
      <GlobalSearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        tasks={searchData.tasks}
        projects={searchData.projects}
        notes={searchData.notes}
        transactions={searchData.transactions}
      />

      {/* Global Quick-Create Dialog */}
      <QuickCreateDialog
        open={quickCreateOpen}
        onOpenChange={setQuickCreateOpen}
        initialType={quickCreateType}
      />

      {/* Floating Action Button (Quick Add) */}
      <FloatingActionButton onOpenQuickCreate={handleOpenQuickCreate} />

      {/* Floating Focus Session Timer */}
      <FocusSessionModal />

      {/* Progressive Web App & Offline Sync Telemetry Manager */}
      <PwaManager />
    </div>
  );
}
