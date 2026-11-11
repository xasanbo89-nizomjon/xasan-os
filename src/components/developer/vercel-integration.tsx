"use client";

import React, { useState } from "react";
import {
  Triangle,
  ExternalLink,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Clock,
  Layers,
  ShieldCheck,
  Lock,
  X,
  FileCode2,
  Terminal,
} from "lucide-react";
import {
  DevIntegrationSettingSummary,
  VercelProjectSummary,
  VercelDeploymentSummary,
} from "@/types";
import {
  connectVercelAction,
  disconnectVercelAction,
  triggerLiveSyncAction,
} from "@/server/actions/developer";
import { useTranslation } from "@/stores/language-store";

interface VercelIntegrationProps {
  initialSetting: DevIntegrationSettingSummary;
  initialProjects: VercelProjectSummary[];
  initialDeployments: VercelDeploymentSummary[];
}

export function VercelIntegration({
  initialSetting,
  initialProjects,
  initialDeployments,
}: VercelIntegrationProps) {
  const { isUz } = useTranslation();
  const [setting, setSetting] = useState<DevIntegrationSettingSummary>(initialSetting);
  const [projects] = useState<VercelProjectSummary[]>(initialProjects);
  const [deployments] = useState<VercelDeploymentSummary[]>(initialDeployments);

  const [activeTab, setActiveTab] = useState<"PROJECTS" | "DEPLOYMENTS" | "FAILURES">("PROJECTS");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [connectForm, setConnectForm] = useState({
    username: "xasan-dev-team",
    token: "vcl_secure_access_token_v1",
  });

  const failedDeployments = deployments.filter((d) => d.state === "ERROR");

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await triggerLiveSyncAction("VERCEL");
      if (res.success && res.syncedAt) {
        setSetting((prev) => ({ ...prev, vercelLastSync: res.syncedAt }));
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await connectVercelAction(connectForm.username, connectForm.token);
    if (res.success) {
      setSetting((prev) => ({
        ...prev,
        vercelConnected: true,
        vercelUsername: connectForm.username,
        vercelLastSync: new Date().toISOString(),
      }));
      setIsConnectModalOpen(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmMsg = isUz
      ? "Vercel hisobini XASAN OS dan uzmoqchimisiz?"
      : "Disconnect Vercel account from XASAN OS?";
    if (confirm(confirmMsg)) {
      const res = await disconnectVercelAction();
      if (res.success) {
        setSetting((prev) => ({
          ...prev,
          vercelConnected: false,
          vercelUsername: null,
          vercelLastSync: null,
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Vercel Account Card */}
      <div className="glass-card rounded-3xl p-6 border border-[#25352C] flex flex-col md:flex-row items-center justify-between gap-5 bg-gradient-to-b from-[#142019] to-[#101915]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#080D0B] border border-[#25352C] flex items-center justify-center text-[#F3F7F4] shadow-inner">
            <Triangle className="w-7 h-7 text-[#10B981] fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#F3F7F4]">
                {isUz ? "Vercel Edge Platformasi" : "Vercel Edge Platform"}
              </h3>
              {setting.vercelConnected ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-[#10B981] border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isUz ? "ULANGAN" : "CONNECTED"}</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-[#98A69D] bg-[#101915] border border-[#25352C]">
                  {isUz ? "ULANMAGAN" : "NOT CONNECTED"}
                </span>
              )}
            </div>
            <p className="text-xs text-[#98A69D] mt-0.5">
              {setting.vercelConnected ? (
                <span>
                  {isUz ? (
                    <>
                      Jamoa sohasi <strong className="text-[#F3F7F4]">{setting.vercelUsername}</strong> • Tezkor qaytarishga ega korporativ Edge tarmog‘i.
                    </>
                  ) : (
                    <>
                      Team scope <strong className="text-[#F3F7F4]">{setting.vercelUsername}</strong> • Enterprise Edge Network with instant rollbacks.
                    </>
                  )}
                </span>
              ) : (
                <span>
                  {isUz
                    ? "Doimiy deploylar, ko‘rinish havolalari va build xatoliklarini kuzatish uchun Vercel tokeningizni ulang."
                    : "Connect your Vercel Token to stream continuous deployments, preview URLs, and build failure logs."}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {setting.vercelConnected ? (
            <>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[#F3F7F4] transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#10B981] ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? (isUz ? "Sinxronlanmoqda..." : "Syncing...") : (isUz ? "Sinxronlash" : "Sync Vercel")}</span>
              </button>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
              >
                {isUz ? "Uzish" : "Disconnect"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all shadow-lg shadow-[#10B981]/20 flex items-center gap-2 font-bold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isUz ? "Vercel-ni ulash" : "Connect Vercel"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-card rounded-2xl p-2 border border-[#25352C] flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("PROJECTS")}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "PROJECTS"
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isUz ? "Vercel Loyihalari" : "Vercel Projects"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {projects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("DEPLOYMENTS")}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "DEPLOYMENTS"
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{isUz ? "Deploylar tarixi" : "Deployment History"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {deployments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("FAILURES")}
          className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "FAILURES"
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
          <span>{isUz ? "Diagnostika va Xatolar" : "Diagnostics & Errors"}</span>
          {failedDeployments.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500/20 text-red-400 font-mono">
              {failedDeployments.length}
            </span>
          )}
        </button>
      </div>

      {/* ===================== VIEW 1: VERCEL PROJECTS ===================== */}
      {activeTab === "PROJECTS" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="glass-card rounded-2xl p-5 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#080D0B] border border-[#25352C] flex items-center justify-center text-[#F3F7F4]">
                    <Triangle className="w-4 h-4 fill-current text-[#10B981]" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-[#10B981] border border-emerald-500/30">
                    {proj.latestDeploymentStatus}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                  {proj.name}
                </h4>
                <div className="text-[11px] font-mono text-[#98A69D] mt-0.5">
                  {isUz ? "Freymvork:" : "Framework:"} <span className="text-[#F3F7F4]">{proj.framework}</span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="text-[10px] font-mono text-[#98A69D] uppercase">
                    {isUz ? "Biriktirilgan domenlar:" : "Assigned Domains:"}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proj.domains.map((dom) => (
                      <span
                        key={dom}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] text-[#98A69D]"
                      >
                        {dom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#25352C] flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-[#98A69D]">
                  {new Date(proj.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                </span>
                <a
                  href={proj.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#10B981] hover:underline font-mono text-[11px]"
                >
                  <span>{isUz ? "Asosiy havola" : "Production URL"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== VIEW 2: DEPLOYMENTS FEED ===================== */}
      {activeTab === "DEPLOYMENTS" && (
        <div className="glass-card rounded-2xl border border-[#25352C] overflow-hidden">
          <div className="p-4 border-b border-[#25352C] bg-[#101915] flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-[#F3F7F4]">
              {isUz ? "VERCEL EDGE DEPLOYLAR TARIXI" : "VERCEL EDGE DEPLOYMENT HISTORY"}
            </span>
            <span className="text-[11px] font-mono text-[#98A69D]">
              {isUz ? "Jonli Vercel vebhuk integratsiyasi" : "Live Vercel webhook integration"}
            </span>
          </div>

          <div className="divide-y divide-[#25352C]">
            {deployments.map((d) => (
              <div
                key={d.id}
                className="p-4 hover:bg-[#101915]/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        d.state === "READY"
                          ? "bg-emerald-400"
                          : d.state === "ERROR"
                          ? "bg-red-400"
                          : "bg-amber-400"
                      }`}
                    />
                    <span className="font-bold text-[#F3F7F4]">{d.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] text-[#98A69D]">
                      {d.target}
                    </span>
                    <span className="text-[11px] font-mono text-[#10B981]">{d.branch}</span>
                  </div>
                  <p className="text-[11px] text-[#98A69D]">
                    {d.commitMessage || (isUz ? "Kommit xabari yo‘q" : "No commit message")}
                  </p>
                  <div className="text-[10px] font-mono text-[#98A69D]">
                    {isUz ? "Deploy muallifi: " : "Deployed by "}{d.creator} • {d.durationMs ? `${Math.round(d.durationMs / 1000)}${isUz ? " soniya qurish" : "s build"}` : "—"}
                  </div>
                </div>

                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[#98A69D] hover:text-[#10B981] transition-all font-mono text-[11px] flex items-center gap-1 shrink-0"
                >
                  <span>{isUz ? "Tekshirish" : "Inspect"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== VIEW 3: DIAGNOSTICS & BUILD FAILURES ===================== */}
      {activeTab === "FAILURES" && (
        <div className="space-y-4">
          {failedDeployments.map((fail) => (
            <div
              key={fail.id}
              className="glass-card rounded-2xl p-6 border border-red-500/30 bg-red-500/5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-5 h-5 text-red-400" />
                  <h4 className="text-sm font-bold text-[#F3F7F4]">
                    {fail.name} - {isUz ? "Qurishdagi xatolik" : "Build Failure"}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                    {isUz ? "TARMOQ: " : "BRANCH: "}{fail.branch}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#98A69D]">
                  {new Date(fail.createdAt).toLocaleString()}
                </span>
              </div>

              <div>
                <p className="text-xs text-red-300 font-semibold mb-2">
                  {fail.errorMessage || (isUz ? "Build bosqichidagi xatolik tufayli deploy to‘xtatildi." : "Deployment terminated due to build step failure.")}
                </p>
                {fail.buildLogSnippet && (
                  <div className="p-4 rounded-xl bg-[#080D0B] border border-red-500/20 font-mono text-xs text-red-400/90 whitespace-pre-wrap leading-relaxed">
                    {fail.buildLogSnippet}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#25352C] text-xs">
                <span className="text-[11px] font-mono text-[#98A69D]">
                  {isUz ? "Sababchi kommit: " : "Trigger Commit: "}{fail.commitMessage}
                </span>
                <a
                  href={fail.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>{isUz ? "Build loglarini ochish" : "Open Build Logs"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}

          {failedDeployments.length === 0 && (
            <div className="glass-card rounded-2xl p-8 border border-[#25352C] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
              <p className="text-xs font-semibold text-[#F3F7F4]">
                {isUz ? "Barcha Vercel deploylari muvaffaqiyatli" : "All Vercel deployments passing"}
              </p>
              <p className="text-xs text-[#98A69D]">
                {isUz
                  ? "Production va preview tarmoqlarida hech qanday xatolik aniqlanmadi."
                  : "Zero build failures detected across edge production and preview branches."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Connect Vercel Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-md w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <Triangle className="w-5 h-5 text-[#10B981] fill-current" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {isUz ? "Vercel Jamoasini Ulash" : "Connect Vercel Team"}
                </h3>
              </div>
              <button onClick={() => setIsConnectModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Vercel jamoa / hisob nomi" : "Vercel Team / Account"}
                </label>
                <input
                  type="text"
                  required
                  value={connectForm.username}
                  onChange={(e) => setConnectForm({ ...connectForm, username: e.target.value })}
                  placeholder="e.g. xasan-dev-team"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Vercel shaxsiy kirish tokeni" : "Vercel Personal Access Token"}
                </label>
                <input
                  type="password"
                  required
                  value={connectForm.token}
                  onChange={(e) => setConnectForm({ ...connectForm, token: e.target.value })}
                  placeholder="vcl_••••••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsConnectModalOpen(false)} className="text-xs text-[#98A69D]">
                  {isUz ? "Bekor qilish" : "Cancel"}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  {isUz ? "Platformani ulash" : "Connect Platform"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
