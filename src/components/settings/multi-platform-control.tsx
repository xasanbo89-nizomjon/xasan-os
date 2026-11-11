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
import { useTranslation } from "@/stores/language-store";

export function MultiPlatformControl() {
  const { dict, isUz } = useTranslation();
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
    if (confirm(isUz ? "Barcha navbatdagi oflayn amallarni tozalamoqchimisiz?" : "Clear all pending offline mutations?")) {
      clearPendingQueue();
      setPendingCount(0);
      triggerHaptic("LIGHT");
    }
  };

  const handleTestNotification = async () => {
    await sendDesktopNotification(
      isUz ? "XASAN OS Bildirishnomasi" : "XASAN OS Sovereign Telemetry",
      isUz ? "Ko‘p platformali bildirishnoma kanali faol va soz holatda." : "Desktop & Mobile multi-platform notification channel operational."
    );
    triggerHaptic("LIGHT");
  };

  const handleTestBiometrics = async () => {
    const res = await authenticateWithDeviceBiometrics();
    if (res.success) {
      alert(isUz ? `Biometrik tasdiqlandi: Platforma autentifikatori (${res.biometryType}) faol.` : `Biometric Verified: Platform Authenticator (${res.biometryType}) active.`);
      triggerHaptic("SUCCESS");
    } else {
      alert(isUz ? `Biometrik xatolik: ${res.error}` : `Biometric Error: ${res.error}`);
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
      setImportStatus(dict.toast.backup_exported);
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
          setImportStatus(dict.toast.backup_restored);
          triggerHaptic("SUCCESS");
        } else {
          setImportStatus(`${isUz ? "Tekshiruv xatosi" : "Verification Failed"}: ${res.error}`);
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
        isUz
          ? "DIQQAT: Brauzer xotirasidagi BARCHA mahalliy ma'lumotlarni butunlay o‘chirib tashlamoqchimisiz? Barcha vazifalar, qaydlar, odatlar, loyihalar va moliya jurnallari o‘chib ketadi."
          : "DANGER: Are you sure you want to permanently erase ALL local data from browser localStorage? All tasks, notes, habits, projects and finance logs will be deleted immediately."
      )
    ) {
      clearAllLocalData();
      setImportStatus(dict.toast.storage_cleared);
      triggerHaptic("HEAVY");
    }
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        isUz
          ? "Barcha 12 modulni dastlabki PRD standart ma'lumotlariga qaytarmoqchimisiz? Barcha yangi yozuvlar tiklanadi."
          : "Reset all 12 modules to default PRD seed data? Any custom local records will be restored to initial state."
      )
    ) {
      resetAllLocalData();
      setImportStatus(dict.toast.storage_reset);
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
                {dict.settings.multi_platform.title}
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                {isUz
                  ? "Veb PWA, Ish stoli Tauri va Mobil Capacitor bo‘ylab yagona tizim tajribasi."
                  : "Unified sovereign experience across Web PWA, Desktop Tauri, and Mobile Capacitor."}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
            {isUz ? "BARCHA DVIGATELLAR FAOL" : "ALL ENGINES CONFIGURED"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* PWA Card */}
          <div className="p-4 rounded-xl bg-[#101915] border border-[#25352C] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F3F7F4] flex items-center gap-1.5 font-bold">
                <Globe className="w-4 h-4 text-[#10B981]" />
                {dict.settings.multi_platform.pwa_engine}
              </span>
              <span className="text-[10px] text-[#10B981] px-1.5 py-0.5 rounded bg-[#142019] border border-[#10B981]/20">
                {isUz ? "FAOL" : "ACTIVE"}
              </span>
            </div>
            <p className="text-[11px] text-[#98A69D] leading-relaxed">
              {isUz
                ? "Service Worker keshlanishi, veb manifest, fonda sinxronlash va oflayn rejim."
                : "Service Worker pre-caching, web manifest, background synchronization & offline fallback."}
            </p>
          </div>

          {/* Desktop Tauri Card */}
          <div className="p-4 rounded-xl bg-[#101915] border border-[#25352C] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F3F7F4] flex items-center gap-1.5 font-bold">
                <Monitor className="w-4 h-4 text-[#3B82F6]" />
                {dict.settings.multi_platform.tauri_engine}
              </span>
              <span className="text-[10px] text-[#3B82F6] px-1.5 py-0.5 rounded bg-[#142019] border border-[#3B82F6]/20">
                {isDesktop ? (isUz ? "MAHALLIY RUNTIME" : "NATIVE RUNTIME") : (isUz ? "SOZLANGAN" : "CONFIGURED")}
              </span>
            </div>
            <p className="text-[11px] text-[#98A69D] leading-relaxed">
              {isUz
                ? "Windows, macOS va Linux ilovasi, Tray belgisi, ish stoli bildirishnomalari va global tugmalar."
                : "Windows, macOS & Linux wrappers, System Tray icon, desktop notifications, global shortcuts."}
            </p>
            <button
              onClick={handleTestNotification}
              className="text-[10px] font-mono text-[#10B981] hover:underline flex items-center gap-1 pt-1"
            >
              <Bell className="w-3 h-3" />
              <span>{isUz ? "Ish stoli bildirishnomasini sinash" : "Test Desktop Notification"}</span>
            </button>
          </div>

          {/* Mobile Capacitor Card */}
          <div className="p-4 rounded-xl bg-[#101915] border border-[#25352C] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#F3F7F4] flex items-center gap-1.5 font-bold">
                <Smartphone className="w-4 h-4 text-purple-400" />
                {dict.settings.multi_platform.capacitor_engine}
              </span>
              <span className="text-[10px] text-purple-400 px-1.5 py-0.5 rounded bg-[#142019] border border-purple-400/20">
                {isMobile ? (isUz ? "MAHALLIY QURILMA" : "NATIVE DEVICE") : (isUz ? "SOZLANGAN" : "CONFIGURED")}
              </span>
            </div>
            <p className="text-[11px] text-[#98A69D] leading-relaxed">
              {isUz
                ? "Android va iOS ilovalari, apparat biometriyasi, haptik javoblar va push-bildirishnomalar."
                : "Android & iOS binaries, hardware biometrics, dark status bar, haptic pulses & push notifications."}
            </p>
            <button
              onClick={handleTestBiometrics}
              className="text-[10px] font-mono text-purple-400 hover:underline flex items-center gap-1 pt-1"
            >
              <Fingerprint className="w-3 h-3" />
              <span>{isUz ? "Biometrik tekshiruvni sinash" : "Test Biometric Authentication"}</span>
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
                {isUz ? "Oflayn-Birinchi Arxitektura va Konfliktlarni Hal Qilish" : "Offline-First Architecture & Conflict Resolution"}
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                {isUz ? "Server-Authoritative sinxronlash " : "Server-Authoritative sync tracking "}
                <code className="text-[#10B981]">updatedAt</code>
                {isUz ? " va versiya shtamplari orqali amalga oshiriladi." : " and version stamps."}
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
              <span>{isUz ? "Hozir Sinxronlash" : "Force Sync Now"}</span>
            </button>

            {pendingCount > 0 && (
              <button
                onClick={handleClearQueue}
                className="px-3 py-1.5 rounded-xl bg-[#142019] hover:bg-[#25352C] text-[#EF4444] text-xs font-medium border border-[#25352C]"
              >
                {isUz ? "Navbatni tozalash" : "Clear Queue"}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
            <span className="text-[#98A69D] text-[10px]">
              {isUz ? "NAVBTDAGI AMALLAR" : "PENDING MUTATIONS QUEUE"}
            </span>
            <div className="text-xl font-bold text-[#F3F7F4] mt-1">
              {pendingCount}{" "}
              <span className="text-xs text-[#98A69D] font-normal">
                {isUz ? "ta amal" : "operations"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
            <span className="text-[#98A69D] text-[10px]">
              {isUz ? "ZIDDIYATLARNI HAL QILISH" : "CONFLICT RESOLUTION PROTOCOL"}
            </span>
            <div className="text-xs font-bold text-[#10B981] mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Server-Authoritative (LWW)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#101915] border border-[#25352C]">
            <span className="text-[#98A69D] text-[10px]">
              {isUz ? "MAHALLIY XOTIRA QATLAMI" : "LOCAL PERSISTENCE LAYER"}
            </span>
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
                {isUz ? "Avariyadan Tiklash va Shifrlangan Zaxira" : "Disaster Recovery & Cryptographic Backup"}
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                {isUz
                  ? "Barcha 12 modul uchun SHA-256 yaxlitlik tekshiruviga ega to‘liq JSON zaxira nusxasi."
                  : "Export complete JSON snapshot with SHA-256 integrity verification across all 12 modules."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#142019] hover:bg-[#101915] text-[#10B981] border border-[#10B981]/40 text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? (isUz ? "Tayyorlanmoqda..." : "Packaging...") : dict.settings.storage_card.export_backup}</span>
            </button>

            <label className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#142019] hover:bg-[#25352C] text-[#F3F7F4] border border-[#25352C] text-xs font-medium cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{dict.settings.storage_card.restore_backup}</span>
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
                {dict.settings.storage_card.title}
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                {dict.settings.storage_card.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#142019] hover:bg-[#25352C] text-[#F3F7F4] hover:text-[#10B981] border border-[#25352C] text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{dict.settings.storage_card.reset_defaults}</span>
            </button>

            <button
              onClick={handlePurgeAllLocalData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 text-xs font-mono font-medium transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{dict.settings.storage_card.purge_storage}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Full System Integrity Audit Diagnostic */}
      <div className="glass-card rounded-2xl p-6 border border-[#25352C] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F3F7F4]">
                {isUz ? "Tizim Butunligi Auditi (Barcha 12 Modul)" : "Subsystem Integrity Audit (All 12 Modules)"}
              </h3>
              <p className="text-[11px] text-[#98A69D]">
                {isUz
                  ? "Barcha modullar o‘rtasidagi bog‘liqlik, kechikish va xatoliksiz ishlash ko‘rsatkichlari tekshiruvi."
                  : "Empirical verification of foreign key invariants, latency, and zero unhandled errors."}
              </p>
            </div>
          </div>

          <button
            onClick={handleRunIntegrityAudit}
            disabled={isRunningAudit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#142019] hover:bg-[#101915] text-[#F3F7F4] hover:text-[#10B981] border border-[#25352C] text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunningAudit ? "animate-spin" : ""}`} />
            <span>{isUz ? "Auditni Boshlash" : "Run Integrity Audit"}</span>
          </button>
        </div>

        {auditReport && (
          <div className="p-4 rounded-xl bg-[#080D0B] border border-[#25352C] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#25352C] text-[11px]">
              <span className="text-[#10B981] font-bold">
                {isUz ? "12/12 Quyi tizimlar Faol va Tasdiqlangan" : "12/12 Subsystems Online & Verified"}
              </span>
              <span className="text-[#98A69D]">
                {isUz ? "Tekshirildi:" : "Audited:"} {new Date(auditReport.verifiedAt).toLocaleTimeString()}
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
