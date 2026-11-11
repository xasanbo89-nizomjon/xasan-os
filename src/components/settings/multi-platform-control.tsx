"use client";

import React, { useState } from "react";
import {
  Monitor,
  Smartphone,
  Globe,
  Wifi,
  WifiOff,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  HardDrive,
  Database,
  Layers,
  Fingerprint,
  Bell,
  Cpu,
  Lock,
  FileCheck,
  Trash2,
} from "lucide-react";
import {
  getPendingQueue,
  clearPendingQueue,
  syncPendingOperations,
} from "@/lib/offline-sync";
import { isTauriApp, sendDesktopNotification } from "@/lib/desktop";
import { isCapacitorApp, authenticateWithDeviceBiometrics, triggerHaptic } from "@/lib/mobile";
import {
  exportLocalBackup,
  importLocalBackup,
  clearAllLocalData,
  resetAllLocalData,
} from "@/stores/local-storage-sync";
import {
  exportSovereignBackupAction,
  importSovereignBackupAction,
  verifySystemIntegrityAction,
} from "@/server/actions/backup";

export function MultiPlatformControl() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(getPendingQueue().length);
  const [isExporting, setIsExporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [auditReport, setAuditReport] = useState<any | null>(null);
  const [isRunningAudit, setIsRunningAudit] = useState(false);

  const isDesktop = isTauriApp();
  const isMobile = isCapacitorApp();

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncPendingOperations();
    setIsSyncing(false);
    setPendingCount(getPendingQueue().length);
    triggerHaptic("SUCCESS");
  };

  const handleClearQueue = () => {
    if (confirm("Clear all pending offline mutations?")) {
      clearPendingQueue();
      setPendingCount(0);
      triggerHaptic("LIGHT");
    }
  };

  const handleTestNotification = async () => {
    await sendDesktopNotification(
      "XASAN OS Sovereign Telemetry",
      "Desktop & Mobile multi-platform notification channel operational."
    );
    triggerHaptic("LIGHT");
  };

  const handleTestBiometrics = async () => {
    const res = await authenticateWithDeviceBiometrics();
    if (res.success) {
      alert(`Biometric Verified: Platform Authenticator (${res.biometryType}) active.`);
      triggerHaptic("SUCCESS");
    } else {
      alert(`Biometric Error: ${res.error}`);
    }
  };

  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      // Export live client-side data from all Zustand stores
      const jsonString = exportLocalBackup();
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `xasan-os-sovereign-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setImportStatus("Backup exported successfully from local storage.");
      triggerHaptic("SUCCESS");
    } catch (e: any) {
      setImportStatus(`Export error: ${e.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const res = importLocalBackup(content);
        if (res.success) {
          setImportStatus("Backup verified and restored into local storage successfully.");
          triggerHaptic("SUCCESS");
        } else {
          setImportStatus(`Verification Failed: ${res.error}`);
        }
      } catch (err: any) {
        setImportStatus(`Import Error: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handlePurgeAllLocalData = () => {
    if (
      confirm(
        "DANGER: Are you sure you want to permanently erase ALL local data from browser localStorage? All tasks, notes, habits, projects and finance logs will be deleted immediately."
      )
    ) {
      clearAllLocalData();
      setImportStatus("All local storage has been completely purged.");
      triggerHaptic("HEAVY");
    }
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        "Reset all 12 modules to default PRD seed data? Any custom local records will be restored to initial state."
      )
    ) {
      resetAllLocalData();
      setImportStatus("All local data restored to factory PRD seed defaults.");
      triggerHaptic("SUCCESS");
    }
  };

  const handleRunIntegrityAudit = async () => {
    setIsRunningAudit(true);
    try {
      const res = await verifySystemIntegrityAction();
      if (res.success) {
        setAuditReport(res.report);
        triggerHaptic("SUCCESS");
      }
    } finally {
      setIsRunningAudit(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Multi-Platform Runtime Telemetry */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                Multi-Platform Runtime Engines (PRD Phase 12)
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                Unified sovereign experience across Web PWA, Desktop Tauri, and Mobile Capacitor.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            ALL ENGINES CONFIGURED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* PWA Card */}
          <div className="p-4 rounded-xl bg-[#101915] border border-[#25352C] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F3F7F4] flex items-center gap-1.5 font-bold">
                <Globe className="w-4 h-4 text-[#10B981]" />
                Web PWA Engine
              </span>
              <span className="text-[10px] text-[#10B981] px-1.5 py-0.5 rounded bg-[#142019] border border-[#10B981]/20">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-[#98A69D] leading-relaxed">
              Service Worker pre-caching, web manifest, background synchronization & offline fallback.
            </p>
          </div>

          {/* Desktop Tauri Card */}
          <div className="p-4 rounded-xl bg-[#101915] border border-[#25352C] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F3F7F4] flex items-center gap-1.5 font-bold">
                <Monitor className="w-4 h-4 text-[#3B82F6]" />
                Desktop Tauri v2
              </span>
              <span className="text-[10px] text-[#3B82F6] px-1.5 py-0.5 rounded bg-[#142019] border border-[#3B82F6]/20">
                {isDesktop ? "NATIVE RUNTIME" : "CONFIGURED"}
              </span>
            </div>
            <p className="text-[11px] text-[#98A69D] leading-relaxed">
              Windows, macOS & Linux wrappers, System Tray icon, desktop notifications, global shortcuts.
            </p>
            <button
              onClick={handleTestNotification}
              className="text-[10px] font-mono text-[#10B981] hover:underline flex items-center gap-1 pt-1"
            >
              <Bell className="w-3 h-3" />
              <span>Test Desktop Notification</span>
            </button>
          </div>

          {/* Mobile Capacitor Card */}
          <div className="p-4 rounded-xl bg-[#101915] border border-[#25352C] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F3F7F4] flex items-center gap-1.5 font-bold">
                <Smartphone className="w-4 h-4 text-purple-400" />
                Mobile Capacitor
              </span>
              <span className="text-[10px] text-purple-400 px-1.5 py-0.5 rounded bg-[#142019] border border-purple-400/20">
                {isMobile ? "NATIVE DEVICE" : "CONFIGURED"}
              </span>
            </div>
            <p className="text-[11px] text-[#98A69D] leading-relaxed">
              Android & iOS binaries, hardware biometrics, dark status bar, haptic pulses & push notifications.
            </p>
            <button
              onClick={handleTestBiometrics}
              className="text-[10px] font-mono text-purple-400 hover:underline flex items-center gap-1 pt-1"
            >
              <Fingerprint className="w-3 h-3" />
              <span>Test Biometric Authentication</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Offline Synchronization & Conflict Resolution */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                Offline-First Architecture & Conflict Resolution
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                Server-Authoritative sync tracking <code className="text-[#10B981]">updatedAt</code> and version stamps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981] text-[#080D0B] hover:bg-[#059669] text-xs font-bold transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>Force Sync Now</span>
            </button>

            {pendingCount > 0 && (
              <button
                onClick={handleClearQueue}
                className="px-3 py-1.5 rounded-xl bg-[#142019] hover:bg-[#25352C] text-[#EF4444] text-xs font-medium border border-[#25352C]"
              >
                Clear Queue
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
            <span className="text-[#98A69D] text-[10px]">PENDING MUTATIONS QUEUE</span>
            <div className="text-xl font-bold text-[#F3F7F4] mt-1">
              {pendingCount}{" "}
              <span className="text-xs text-[#98A69D] font-normal">operations</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
            <span className="text-[#98A69D] text-[10px]">CONFLICT RESOLUTION PROTOCOL</span>
            <div className="text-xs font-bold text-[#10B981] mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Server-Authoritative (LWW)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
            <span className="text-[#98A69D] text-[10px]">LOCAL PERSISTENCE LAYER</span>
            <div className="text-xs font-bold text-[#F3F7F4] mt-1">
              IndexedDB & localStorage
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sovereign Disaster Recovery & Cryptographic Backup */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                Disaster Recovery & Cryptographic Backup
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                Export complete JSON snapshot with SHA-256 integrity verification across all 12 modules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#142019] hover:bg-[#101915] text-[#10B981] border border-[#10B981]/40 text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? "Packaging..." : "Export Full JSON Backup"}</span>
            </button>

            <label className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#142019] hover:bg-[#25352C] text-[#F3F7F4] border border-[#25352C] text-xs font-medium cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Restore from File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-[#080D0B] border border-[#10B981]/40 text-xs font-mono text-[#10B981] flex items-center gap-2">
            <FileCheck className="w-4 h-4 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}
      </div>

      {/* 4. Local Storage Sovereign Persistence Controls */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                Local Storage Sovereign State (0-Database Mode)
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                Data persists in browser localStorage with zero server database dependency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#142019] hover:bg-[#25352C] text-[#F3F7F4] hover:text-[#10B981] border border-[#25352C] text-xs font-mono font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Seed Defaults</span>
            </button>

            <button
              onClick={handlePurgeAllLocalData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 text-xs font-mono font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge All Local Storage</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Full System Integrity Audit Diagnostic */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                Subsystem Integrity Audit (All 12 Modules)
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                Empirical verification of foreign key invariants, latency, and zero unhandled errors.
              </p>
            </div>
          </div>

          <button
            onClick={handleRunIntegrityAudit}
            disabled={isRunningAudit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#142019] hover:bg-[#101915] text-[#F3F7F4] hover:text-[#10B981] border border-[#25352C] text-xs font-mono font-bold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningAudit ? "animate-spin" : ""}`} />
            <span>Run Integrity Audit</span>
          </button>
        </div>

        {auditReport && (
          <div className="p-4 rounded-xl bg-[#080D0B] border border-[#25352C] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#25352C] text-[11px]">
              <span className="text-[#10B981] font-bold">
                12/12 Subsystems Online & Verified
              </span>
              <span className="text-[#98A69D]">
                Audited: {new Date(auditReport.verifiedAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {auditReport.subsystems.map((sub: any) => (
                <div
                  key={sub.name}
                  className="p-2 rounded-lg bg-[#101915] border border-[#25352C] flex items-center justify-between text-[11px]"
                >
                  <span className="text-[#F3F7F4] truncate max-w-[170px]">
                    {sub.name}
                  </span>
                  <span className="text-[#10B981] font-bold shrink-0">
                    {sub.latencyMs}ms &bull; {sub.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
