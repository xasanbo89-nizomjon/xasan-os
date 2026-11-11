"use client";

import React, { useState, useEffect } from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Cloud,
  Layers,
  X,
} from "lucide-react";
import {
  getPendingQueue,
  syncPendingOperations,
  getLastSyncedAt,
  PendingOperation,
  SyncStatus,
} from "@/lib/offline-sync";
import { formatDate } from "@/lib/utils";

export function PwaManager() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingOps, setPendingOps] = useState<PendingOperation[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [showQueueDetails, setShowQueueDetails] = useState<boolean>(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Sovereign Service Worker active, scope:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    }

    // 2. Initial state
    setIsOnline(navigator.onLine);
    setPendingOps(getPendingQueue());
    setLastSync(getLastSyncedAt());

    // 3. Listen to sync status events
    const handleSyncStatus = (event: Event) => {
      const customEvent = event as CustomEvent<SyncStatus>;
      if (customEvent.detail) {
        setIsOnline(customEvent.detail.isOnline);
        setIsSyncing(customEvent.detail.isSyncing);
        setPendingOps(getPendingQueue());
        setLastSync(customEvent.detail.lastSyncedAt);
      }
    };

    window.addEventListener("xasan:sync-status", handleSyncStatus);
    window.addEventListener("online", () => setIsOnline(true));
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      window.removeEventListener("xasan:sync-status", handleSyncStatus);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncPendingOperations();
    setIsSyncing(false);
    setPendingOps(getPendingQueue());
    setLastSync(getLastSyncedAt());
  };

  // Only render banner/pill if offline or there are pending items or syncing
  if (isOnline && pendingOps.length === 0 && !isSyncing && !showQueueDetails) {
    return null;
  }

  return (
    <>
      {/* Floating Status Badge in Bottom-Right */}
      <div className="fixed bottom-4 right-4 z-40 animate-in fade-in slide-in-from-bottom duration-300">
        <div
          className={`glass-card p-2.5 px-3.5 rounded-2xl border shadow-2xl flex items-center gap-3 text-xs font-mono backdrop-blur-xl ${
            !isOnline
              ? "bg-[#142019]/95 border-amber-500/60 text-amber-400"
              : isSyncing
              ? "bg-[#101915]/95 border-[#10B981] text-[#10B981]"
              : "bg-[#101915]/95 border-[#25352C] text-[#98A69D]"
          }`}
        >
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : isSyncing ? (
              <RefreshCw className="w-4 h-4 text-[#10B981] animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            )}

            <div className="flex flex-col">
              <span className="font-bold leading-tight">
                {!isOnline
                  ? "Offline Mode"
                  : isSyncing
                  ? "Reconciling State..."
                  : "Sovereign Cache Synchronized"}
              </span>
              <span className="text-[10px] opacity-80 leading-tight">
                {pendingOps.length > 0
                  ? `${pendingOps.length} pending mutation${pendingOps.length > 1 ? "s" : ""} queued`
                  : lastSync
                  ? `Synced at ${new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : "All records local & safe"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 border-l border-[#25352C] pl-2.5">
            {pendingOps.length > 0 && (
              <button
                onClick={() => setShowQueueDetails(true)}
                className="text-[10px] text-[#F3F7F4] hover:text-[#10B981] underline"
              >
                Queue
              </button>
            )}

            {isOnline && (
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="p-1 rounded-md text-[#98A69D] hover:text-[#10B981] hover:bg-[#142019] transition-colors"
                title="Force Sync with Sovereign Database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Queue Modal Details if open */}
      {showQueueDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#101915] border border-[#25352C] rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-sm font-bold text-[#F3F7F4] font-mono">
                  Offline Pending Operations ({pendingOps.length})
                </h3>
              </div>
              <button
                onClick={() => setShowQueueDetails(false)}
                className="text-[#98A69D] hover:text-[#F3F7F4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#98A69D]">
              Mutations recorded locally will automatically reconcile with the PostgreSQL server upon reconnecting.
            </p>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {pendingOps.map((op) => (
                <div
                  key={op.id}
                  className="p-2.5 rounded-xl bg-[#080D0B] border border-[#25352C] text-xs font-mono space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#10B981] font-bold">{op.entity}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#142019] text-[#98A69D]">
                      {op.action}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#F3F7F4] truncate">
                    {op.payload.title || op.payload.name || JSON.stringify(op.payload)}
                  </p>
                  <div className="text-[10px] text-[#98A69D] flex justify-between">
                    <span>Retries: {op.retryCount}</span>
                    <span>{new Date(op.clientTimestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#25352C] flex items-center justify-between">
              <button
                onClick={handleManualSync}
                disabled={!isOnline || isSyncing}
                className="px-3 py-1.5 bg-[#10B981] text-[#080D0B] font-bold text-xs rounded-xl hover:bg-[#059669] transition-colors disabled:opacity-40"
              >
                Sync All Now
              </button>

              <button
                onClick={() => setShowQueueDetails(false)}
                className="px-3 py-1.5 bg-[#142019] text-[#F3F7F4] text-xs rounded-xl border border-[#25352C]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
