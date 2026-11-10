"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ModuleHeader } from "@/components/layout/module-header";
import {
  User,
  ShieldCheck,
  Mail,
  Briefcase,
  Lock,
  KeyRound,
  Fingerprint,
  Laptop,
  Smartphone,
  LogOut,
  Check,
  AlertCircle,
  Clock,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import {
  logoutAction,
  getActiveSessionsAction,
  revokeSessionAction,
  configurePinAction,
  getUserSecurityStatusAction,
} from "@/server/actions/auth";

interface SessionItem {
  id: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  isCurrent: boolean;
  lastActiveAt: string;
}

export default function ProfilePage() {
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "sessions">("profile");
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [pinLength, setPinLength] = useState<4 | 6>(4);
  const [userEmail, setUserEmail] = useState("xasan@os.local");
  const [userDisplayName, setUserDisplayName] = useState("Xasan Mukhammadiev");

  const [savingPin, setSavingPin] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const sec = await getUserSecurityStatusAction();
      setPinEnabled(sec.isPinEnabled);
      setUserEmail(sec.email);
      setUserDisplayName(sec.displayName);

      const sess = await getActiveSessionsAction();
      setSessions(sess);
    }
    loadData();
  }, []);

  const handleSavePinConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPin(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      if (pinEnabled && newPin) {
        if (newPin.length !== pinLength || !/^\d+$/.test(newPin)) {
          throw new Error(`PIN must be exactly ${pinLength} numeric digits.`);
        }
      }

      const res = await configurePinAction(pinEnabled, newPin || undefined, pinLength);
      if (!res.success) throw new Error(res.error || "Failed to update PIN config");

      setStatusMessage("Passcode security settings updated successfully!");
      setNewPin("");
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error saving configuration");
    } finally {
      setSavingPin(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSessionAction(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setStatusMessage("Session revoked successfully.");
  };

  const handleLogout = async () => {
    await logoutAction();
    router.push("/login");
    router.refresh();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <ModuleHeader
          icon={User}
          badge="IDENTITY & SECURITY"
          title="Architect Profile & Security Engine"
          description="Manage credentials, configure App Passcode / PIN lock, monitor active device sessions, and handle secure logout."
        >
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444] hover:text-[#080D0B] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Logout</span>
          </button>
        </ModuleHeader>

        {/* Tab Controls */}
        <div className="flex p-1 bg-[#101915] rounded-xl border border-[#25352C] max-w-md">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "profile"
                ? "bg-[#142019] text-[#10B981] border border-[#25352C] shadow"
                : "text-[#98A69D] hover:text-[#F3F7F4]"
            }`}
          >
            Identity & Bio
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "security"
                ? "bg-[#142019] text-[#10B981] border border-[#25352C] shadow"
                : "text-[#98A69D] hover:text-[#F3F7F4]"
            }`}
          >
            PIN & Biometrics
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "sessions"
                ? "bg-[#142019] text-[#10B981] border border-[#25352C] shadow"
                : "text-[#98A69D] hover:text-[#F3F7F4]"
            }`}
          >
            Active Sessions ({sessions.length})
          </button>
        </div>

        {/* Success / Error Alerts */}
        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: Identity Profile */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 border border-[#25352C] flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#10B981] to-[#3B82F6] flex items-center justify-center text-3xl font-black text-[#080D0B] shadow-lg shadow-[#10B981]/25 mb-4">
                XM
              </div>
              <h2 className="text-xl font-bold text-[#F3F7F4]">
                {userDisplayName}
              </h2>
              <p className="text-xs text-[#10B981] font-mono mt-0.5 font-semibold">
                Senior Software Architect & Creator
              </p>

              <div className="w-full mt-6 space-y-3 text-xs text-left border-t border-[#25352C] pt-6">
                <div className="flex items-center gap-2.5 text-[#98A69D]">
                  <Mail className="w-4 h-4 text-[#10B981]" />
                  <span>{userEmail}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#98A69D]">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>System Authority: ROOT_ADMIN</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#98A69D]">
                  <Briefcase className="w-4 h-4 text-[#10B981]" />
                  <span>Focus: Aurelius IELTS, LinguaHub, Ravon Avto</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
                <h3 className="text-base font-semibold text-[#F3F7F4] mb-3">
                  Account Metadata & User Provisioning
                </h3>
                <p className="text-xs text-[#98A69D] leading-relaxed mb-4">
                  Authenticated via Firebase Auth with automatic PostgreSQL sync through Prisma ORM.
                  Every query is strictly isolated by foreign key constraints against your unique UUID.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#25352C]">
                  <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C]">
                    <span className="text-[10px] text-[#98A69D] font-mono">AUTH PROVIDER</span>
                    <h4 className="text-xs font-bold text-[#10B981] mt-1">Firebase + Google</h4>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C]">
                    <span className="text-[10px] text-[#98A69D] font-mono">DATA ISOLATION</span>
                    <h4 className="text-xs font-bold text-[#3B82F6] mt-1">UUID Cascading</h4>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#101915] border border-[#25352C]">
                    <span className="text-[10px] text-[#98A69D] font-mono">SESSION STATUS</span>
                    <h4 className="text-xs font-bold text-[#10B981] mt-1">Authenticated (7d)</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Security & App Passcode (PIN) */}
        {activeTab === "security" && (
          <div className="glass-card rounded-2xl p-6 border border-[#25352C] max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#101915] border border-[#25352C] flex items-center justify-center text-[#10B981]">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#F3F7F4]">
                  App Passcode / PIN Lock Engine
                </h3>
                <p className="text-xs text-[#98A69D]">
                  Hardware-like application lock requiring PIN entry or biometrics.
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePinConfig} className="space-y-5 pt-3 border-t border-[#25352C]">
              {/* Toggle PIN */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#101915] border border-[#25352C]">
                <div>
                  <h4 className="text-xs font-bold text-[#F3F7F4]">
                    Require Passcode on Inactivity / Session Start
                  </h4>
                  <p className="text-[11px] text-[#98A69D] mt-0.5">
                    Redirects to `/lock` when app is opened or unlocked session expires.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pinEnabled}
                    onChange={(e) => setPinEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#25352C] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]" />
                </label>
              </div>

              {/* PIN Length & Code */}
              {pinEnabled && (
                <div className="space-y-4 p-4 rounded-xl bg-[#101915] border border-[#25352C]">
                  <div>
                    <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                      Passcode Length
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setPinLength(4)}
                        className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold border transition-all ${
                          pinLength === 4
                            ? "bg-[#142019] text-[#10B981] border-[#10B981]"
                            : "bg-[#101915] text-[#98A69D] border-[#25352C]"
                        }`}
                      >
                        4 Digits (Standard)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPinLength(6)}
                        className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold border transition-all ${
                          pinLength === 6
                            ? "bg-[#142019] text-[#10B981] border-[#10B981]"
                            : "bg-[#101915] text-[#98A69D] border-[#25352C]"
                        }`}
                      >
                        6 Digits (High Security)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#98A69D] mb-1.5">
                      New Passcode (Leave empty to keep current / default &quot;1234&quot;)
                    </label>
                    <input
                      type="password"
                      maxLength={pinLength}
                      placeholder={`Enter ${pinLength}-digit numeric code`}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#142019] border border-[#25352C] rounded-xl text-xs font-mono text-[#F3F7F4] placeholder-[#98A69D]/50 focus:outline-none focus:border-[#10B981] transition-colors"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-[#142019] border border-[#25352C] text-[11px] text-[#98A69D] space-y-1 font-mono">
                    <div className="flex items-center gap-1.5 text-[#10B981]">
                      <Fingerprint className="w-3.5 h-3.5" />
                      <span>Biometric TouchID / FaceID Simulator: ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#F59E0B]">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Lockout Threshold: 3 failed attempts triggers 30s lockout</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={savingPin}
                className="px-5 py-2.5 rounded-xl bg-[#10B981] text-[#080D0B] font-bold text-xs hover:bg-[#059669] transition-all shadow-md shadow-[#10B981]/25 disabled:opacity-50 cursor-pointer"
              >
                {savingPin ? "Saving..." : "Save Security Policy"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Active Sessions Viewer */}
        {activeTab === "sessions" && (
          <div className="glass-card rounded-2xl p-6 border border-[#25352C]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[#F3F7F4]">
                  Active Devices & Security Sessions
                </h3>
                <p className="text-xs text-[#98A69D]">
                  Inspect recognized logins across your workstations and mobile nodes.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-xl bg-[#101915] border border-[#25352C] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#142019] border border-[#25352C] flex items-center justify-center text-[#10B981] shrink-0 mt-0.5">
                      {sess.device.toLowerCase().includes("iphone") ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Laptop className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-[#F3F7F4]">
                          {sess.device}
                        </h4>
                        {sess.isCurrent && (
                          <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-semibold">
                            THIS DEVICE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#98A69D] mt-0.5">
                        {sess.browser} • {sess.os} • {sess.ipAddress}
                      </p>
                      <span className="text-[10px] text-[#98A69D]/70 font-mono mt-1 block">
                        Last Active: {new Date(sess.lastActiveAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(sess.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#142019] border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444] hover:text-[#080D0B] text-xs font-medium transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Revoke</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
