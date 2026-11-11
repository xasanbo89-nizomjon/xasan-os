"use client";

import React, { useState } from "react";
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  AlertCircle,
  Star,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Lock,
  Unlock,
  ShieldCheck,
  Tag,
  Clock,
  Layers,
  X,
  Sparkles,
} from "lucide-react";
import {
  DevIntegrationSettingSummary,
  GitHubRepoMetadata,
  GitHubCommitSummary,
  GitHubPullRequestSummary,
  GitHubIssueSummary,
} from "@/types";
import {
  connectGitHubAction,
  disconnectGitHubAction,
  triggerLiveSyncAction,
} from "@/server/actions/developer";
import { useTranslation } from "@/stores/language-store";

interface GitHubIntegrationProps {
  initialSetting: DevIntegrationSettingSummary;
  initialRepos: GitHubRepoMetadata[];
  initialCommits: GitHubCommitSummary[];
  initialPRs: GitHubPullRequestSummary[];
  initialIssues: GitHubIssueSummary[];
}

export function GitHubIntegration({
  initialSetting,
  initialRepos,
  initialCommits,
  initialPRs,
  initialIssues,
}: GitHubIntegrationProps) {
  const { isUz } = useTranslation();
  const [setting, setSetting] = useState<DevIntegrationSettingSummary>(initialSetting);
  const [repos] = useState<GitHubRepoMetadata[]>(initialRepos);
  const [commits] = useState<GitHubCommitSummary[]>(initialCommits);
  const [prs] = useState<GitHubPullRequestSummary[]>(initialPRs);
  const [issues] = useState<GitHubIssueSummary[]>(initialIssues);

  const [activeTab, setActiveTab] = useState<"REPOS" | "COMMITS" | "PRS" | "ISSUES">("REPOS");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [connectForm, setConnectForm] = useState({
    username: "xasan-architect",
    token: "ghp_secure_personal_access_token_v2",
  });

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await triggerLiveSyncAction("GITHUB");
      if (res.success && res.syncedAt) {
        setSetting((prev) => ({ ...prev, githubLastSync: res.syncedAt }));
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await connectGitHubAction(connectForm.username, connectForm.token);
    if (res.success) {
      setSetting((prev) => ({
        ...prev,
        githubConnected: true,
        githubUsername: connectForm.username,
        githubLastSync: new Date().toISOString(),
      }));
      setIsConnectModalOpen(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmMsg = isUz
      ? "GitHub hisobini XASAN OS dan uzmoqchimisiz?"
      : "Disconnect GitHub account from XASAN OS?";
    if (confirm(confirmMsg)) {
      const res = await disconnectGitHubAction();
      if (res.success) {
        setSetting((prev) => ({
          ...prev,
          githubConnected: false,
          githubUsername: null,
          githubLastSync: null,
        }));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* GitHub Account Connection Card */}
      <div className="glass-card rounded-3xl p-6 border border-[#25352C] flex flex-col md:flex-row items-center justify-between gap-5 bg-gradient-to-b from-[#142019] to-[#101915]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#080D0B] border border-[#25352C] flex items-center justify-center text-[#F3F7F4] shadow-inner">
            <GitBranch className="w-7 h-7 text-[#10B981]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#F3F7F4]">
                {isUz ? "GitHub Integratsiyasi" : "GitHub OAuth Integration"}
              </h3>
              {setting.githubConnected ? (
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
              {setting.githubConnected ? (
                <span>
                  {isUz ? (
                    <>
                      <strong className="text-[#F3F7F4]">@{setting.githubUsername}</strong> sifatida autentifikatsiyadan o‘tgan, barcha ombor telemetriyasi faol.
                    </>
                  ) : (
                    <>
                      Authenticated as <strong className="text-[#F3F7F4]">@{setting.githubUsername}</strong> with full repository telemetry.
                    </>
                  )}
                </span>
              ) : (
                <span>
                  {isUz
                    ? "Kommitlar, masalalar va PR holatlarini kuzatish uchun GitHub hisobingizni ulang."
                    : "Connect your GitHub token or OAuth account to stream commit activity, issues, and PR statuses."}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {setting.githubConnected ? (
            <>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[#F3F7F4] transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#10B981] ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? (isUz ? "Sinxronlanmoqda..." : "Syncing API...") : (isUz ? "Sinxronlash" : "Sync Now")}</span>
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
              <span>{isUz ? "GitHub-ni ulash" : "Connect GitHub"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="glass-card rounded-2xl p-2 border border-[#25352C] flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("REPOS")}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "REPOS"
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>{isUz ? "Omborlar" : "Repositories"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {repos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("COMMITS")}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "COMMITS"
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <GitCommit className="w-3.5 h-3.5" />
          <span>{isUz ? "So‘nggi kommitlar" : "Recent Commits"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {commits.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("PRS")}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "PRS"
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>{isUz ? "Pull Requestlar" : "Pull Requests"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {prs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ISSUES")}
          className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "ISSUES"
              ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4]"
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{isUz ? "Masalalar" : "Issues"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {issues.length}
          </span>
        </button>
      </div>

      {/* ===================== VIEW 1: REPOSITORIES ===================== */}
      {activeTab === "REPOS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="glass-card rounded-2xl p-5 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex flex-col justify-between group space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                    {repo.fullName}
                  </span>
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded text-[#98A69D] hover:text-[#10B981]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="text-xs text-[#98A69D] leading-relaxed">
                  {repo.description || (isUz ? "Ombor tavsifi mavjud emas." : "No repository description provided.")}
                </p>
              </div>

              <div className="pt-3 border-t border-[#25352C] flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>{repo.language || "TypeScript"}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" />
                    <span>{repo.starsCount}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3 text-[#10B981]" />
                    <span>{repo.defaultBranch}</span>
                  </span>
                </div>

                <span>{repo.openIssuesCount} {isUz ? "ta masala" : "issues"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================== VIEW 2: RECENT COMMITS ===================== */}
      {activeTab === "COMMITS" && (
        <div className="glass-card rounded-2xl border border-[#25352C] overflow-hidden">
          <div className="p-4 border-b border-[#25352C] bg-[#101915] flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-[#F3F7F4]">
              {isUz ? "SO‘NGGI KOMMITLAR OQIMI" : "RECENT COMMIT STREAM"}
            </span>
            <span className="text-[11px] font-mono text-[#10B981]">
              {isUz ? "Jonli tasdiqlangan imzolar" : "Live verified signatures"}
            </span>
          </div>

          <div className="divide-y divide-[#25352C]">
            {commits.map((c) => (
              <div
                key={c.sha}
                className="p-4 hover:bg-[#101915]/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#10B981]">
                      {c.shortSha}
                    </span>
                    <span className="font-semibold text-[#F3F7F4]">{c.message}</span>
                    {c.verified && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-[#10B981] border border-emerald-500/30">
                        {isUz ? "Tasdiqlangan" : "Verified"}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-[#98A69D] flex items-center gap-2">
                    <span>{isUz ? "muallif: " : "by "}{c.author}</span>
                    <span>•</span>
                    <span>{new Date(c.date).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                  </div>
                </div>

                <a
                  href={c.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#101915] border border-[#25352C] hover:border-[#10B981] text-[#98A69D] hover:text-[#10B981] transition-all font-mono text-[11px] flex items-center gap-1 shrink-0"
                >
                  <span>{isUz ? "Diffni ko‘rish" : "View Diff"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== VIEW 3: PULL REQUESTS ===================== */}
      {activeTab === "PRS" && (
        <div className="space-y-3">
          {prs.map((pr) => (
            <div
              key={pr.number}
              className="glass-card rounded-2xl p-4 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex items-center justify-between text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#98A69D]">#{pr.number}</span>
                  <h4 className="font-bold text-[#F3F7F4]">{pr.title}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      pr.status === "OPEN"
                        ? "bg-emerald-500/20 text-[#10B981]"
                        : pr.status === "MERGED"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {isUz
                      ? pr.status === "OPEN"
                        ? "OCHIQ"
                        : pr.status === "MERGED"
                        ? "BIRIKTIRILGAN"
                        : "YOPILGAN"
                      : pr.status}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#98A69D]">
                  {isUz ? "Tarmoq: " : "Branch: "}
                  <span className="text-[#10B981]">{pr.branch}</span> • {isUz ? "Muallif: " : "Author: "}{pr.author}
                </div>
              </div>

              <a
                href={pr.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-[#10B981]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ===================== VIEW 4: ISSUES ===================== */}
      {activeTab === "ISSUES" && (
        <div className="space-y-3">
          {issues.map((iss) => (
            <div
              key={iss.number}
              className="glass-card rounded-2xl p-4 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex items-center justify-between text-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#98A69D]">#{iss.number}</span>
                  <h4 className="font-bold text-[#F3F7F4]">{iss.title}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      iss.status === "OPEN" ? "bg-emerald-500/20 text-[#10B981]" : "bg-neutral-500/20 text-neutral-400"
                    }`}
                  >
                    {isUz ? (iss.status === "OPEN" ? "OCHIQ" : "YOPILGAN") : iss.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {iss.labels.map((lbl) => (
                    <span
                      key={lbl}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] text-[#98A69D]"
                    >
                      {lbl}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={iss.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-[#10B981]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Connect GitHub Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-md w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {isUz ? "GitHub Ish Maydonini Ulash" : "Connect GitHub Account"}
                </h3>
              </div>
              <button onClick={() => setIsConnectModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConnect} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "GitHub foydalanuvchi nomi" : "GitHub Username"}
                </label>
                <input
                  type="text"
                  required
                  value={connectForm.username}
                  onChange={(e) => setConnectForm({ ...connectForm, username: e.target.value })}
                  placeholder="e.g. xasan-architect"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Shaxsiy kirish tokeni (PAT) / Kalit" : "Personal Access Token (PAT) / Key"}
                </label>
                <input
                  type="password"
                  required
                  value={connectForm.token}
                  onChange={(e) => setConnectForm({ ...connectForm, token: e.target.value })}
                  placeholder="ghp_••••••••••••••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
                <span className="text-[10px] text-[#98A69D] mt-1 block">
                  {isUz
                    ? "Shifrlangan holda xavfsiz saqlanadi."
                    : "Encrypted and securely held in user settings."}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsConnectModalOpen(false)} className="text-xs text-[#98A69D]">
                  {isUz ? "Bekor qilish" : "Cancel"}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  {isUz ? "Hisobni ulash" : "Authorize & Connect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
