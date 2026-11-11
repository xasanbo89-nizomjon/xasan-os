"use client";

import React, { useState } from "react";
import {
  Terminal,
  Code2,
  Bug,
  GitBranch,
  Triangle,
  RefreshCw,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Info,
} from "lucide-react";
import { ModuleHeader } from "@/components/layout/module-header";
import { ProjectManagement } from "@/components/developer/project-management";
import { DeveloperTools } from "@/components/developer/developer-tools";
import { GitHubIntegration } from "@/components/developer/github-integration";
import { VercelIntegration } from "@/components/developer/vercel-integration";
import {
  ProjectSummary,
  DevBugSummary,
  DevFeatureSummary,
  DevDocSummary,
  DevDeploymentSummary,
  DevReleaseSummary,
  DevIntegrationSettingSummary,
  GitHubRepoMetadata,
  GitHubCommitSummary,
  GitHubPullRequestSummary,
  GitHubIssueSummary,
  VercelProjectSummary,
  VercelDeploymentSummary,
  DeveloperHubMetrics,
} from "@/types";
import { triggerLiveSyncAction } from "@/server/actions/developer";
import { useTranslation } from "@/stores/language-store";

interface DeveloperHubExperienceProps {
  metrics: DeveloperHubMetrics;
  projects: ProjectSummary[];
  bugs: DevBugSummary[];
  features: DevFeatureSummary[];
  docs: DevDocSummary[];
  deployments: DevDeploymentSummary[];
  releases: DevReleaseSummary[];
  integration: DevIntegrationSettingSummary;
  githubRepos: GitHubRepoMetadata[];
  githubCommits: GitHubCommitSummary[];
  githubPRs: GitHubPullRequestSummary[];
  githubIssues: GitHubIssueSummary[];
  vercelProjects: VercelProjectSummary[];
  vercelDeployments: VercelDeploymentSummary[];
}

export function DeveloperHubExperience({
  metrics,
  projects,
  bugs,
  features,
  docs,
  deployments,
  releases,
  integration,
  githubRepos,
  githubCommits,
  githubPRs,
  githubIssues,
  vercelProjects,
  vercelDeployments,
}: DeveloperHubExperienceProps) {
  const { isUz, dict } = useTranslation();
  const [activeTab, setActiveTab] = useState<"PROJECTS" | "DEV_TOOLS" | "GITHUB" | "VERCEL">("PROJECTS");
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);
  const [currentMetrics, setCurrentMetrics] = useState<DeveloperHubMetrics>(metrics);

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      const res = await triggerLiveSyncAction("ALL");
      if (res.success && res.syncedAt) {
        setCurrentMetrics((prev) => ({
          ...prev,
          githubSyncedAt: res.syncedAt,
          vercelSyncedAt: res.syncedAt,
        }));
      }
    } finally {
      setIsSyncingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <ModuleHeader
        icon={Terminal}
        badge="SOFTWARE ARCHITECTURE & DEV ENGINE"
        title="Developer Hub"
        description="Ecosystem management for core ventures: Aurelius IELTS, LinguaHub, Ravon Auto Tuning, and 36-School LMS."
      >
        <button
          onClick={handleSyncAll}
          disabled={isSyncingAll}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#142019] border border-[#25352C] hover:border-[#10B981]/50 text-[#F3F7F4] flex items-center gap-2 transition-all shadow-sm cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#10B981] ${isSyncingAll ? "animate-spin" : ""}`} />
          <span>
            {isSyncingAll
              ? (isUz ? "Sinxronlanmoqda..." : "Syncing Telemetry...")
              : (isUz ? "Barcha telemetriyani yangilash" : "Sync All Telemetry")}
          </span>
        </button>
      </ModuleHeader>

      {/* Visual distinction between Live Monitoring, Last Synchronized Information, and Manual Project Data */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#98A69D]">
          <Info className="w-4 h-4 text-[#10B981] shrink-0" />
          <span className="font-semibold text-[#F3F7F4]">
            {isUz ? "Monitoring va Sinxronizatsiya izohi:" : "Telemetry & Sync Legend:"}
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap text-xs font-mono">
          {/* Live Monitoring Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">{isUz ? "Jonli monitoring" : "Live Monitoring"}</span>
            <span className="text-[10px] text-emerald-400/80">
              ({isUz ? "Vercel va GitHub Webhooks" : "Vercel & GitHub Webhooks"})
            </span>
          </div>

          {/* Last Synced Info Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">{isUz ? "Oxirgi sinxronizatsiya" : "Last Synced"}</span>
            <span className="text-[10px] text-amber-300/80">
              {currentMetrics.githubSyncedAt
                ? `${new Date(currentMetrics.githubSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : (isUz ? "Hozirgina" : "Just now")}
            </span>
          </div>

          {/* Manually Entered Project Data Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">{isUz ? "Lokal loyiha ma'lumotlari" : "Manual Project Data"}</span>
            <span className="text-[10px] text-cyan-300/80">
              ({isUz ? "Mahalliy xotira" : "Local DB Isolated"})
            </span>
          </div>
        </div>
      </div>

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>{isUz ? "FAOL LOYIHALAR" : "ACTIVE VENTURES"}</span>
            <Code2 className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F3F7F4]">
            {currentMetrics.activeProjects}{" "}
            <span className="text-xs text-[#98A69D] font-normal">/ {currentMetrics.totalProjects}</span>
          </div>
          <div className="text-[10px] text-[#10B981] font-mono mt-0.5">
            {isUz ? "Asosiy portfellar" : "Core Portfolios"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>{isUz ? "OCHIQ XATOLIKLAR" : "OPEN BUGS"}</span>
            <Bug className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {currentMetrics.openBugs}
          </div>
          <div className="text-[10px] text-red-400 font-mono mt-0.5">
            {currentMetrics.criticalBugs} {isUz ? "Kritik anomaliyalar" : "Critical Anomaly"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>{isUz ? "REJADAGI FUNKSIYALAR" : "BACKLOG QUEUE"}</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F3F7F4]">
            {currentMetrics.backlogFeatures}
          </div>
          <div className="text-[10px] text-[#98A69D] font-mono mt-0.5">
            {isUz ? "Rejalashtirilgan yangiliklar" : "Planned Features"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>{isUz ? "OYLIK DEPLOYLAR" : "MONTHLY DEPLOYS"}</span>
            <Activity className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#10B981]">
            {currentMetrics.deploymentsThisMonth}
          </div>
          <div className="text-[10px] text-[#98A69D] font-mono mt-0.5">
            {isUz ? "Avtomatlashtirilgan buildlar" : "Automated Builds"}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-[#25352C] bg-[#101915]/80 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-[11px] text-[#98A69D] font-mono mb-1">
            <span>{isUz ? "MUVAFFAQIYAT FOIZI" : "SUCCESS RATE"}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#10B981]">
            {currentMetrics.deploymentSuccessRate}%
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
            {isUz ? "Ishonchlilik SLA" : "Production SLA"}
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="glass-card rounded-2xl p-2 border border-[#25352C] flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("PROJECTS")}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "PROJECTS"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>{isUz ? "Loyihalar boshqaruvi" : "Project Management"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {projects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("DEV_TOOLS")}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "DEV_TOOLS"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>{isUz ? "Muhandislik asboblari va Hujjatlar" : "Dev Tools & Docs"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {bugs.length + features.length + docs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("GITHUB")}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "GITHUB"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>{isUz ? "GitHub integratsiyasi" : "GitHub Integration"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {githubRepos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("VERCEL")}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === "VERCEL"
              ? "bg-[#10B981] text-[#080D0B] shadow-lg shadow-[#10B981]/20 font-bold"
              : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-transparent hover:border-[#25352C]"
          }`}
        >
          <Triangle className="w-4 h-4 fill-current" />
          <span>{isUz ? "Vercel platformasi" : "Vercel Platform"}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
            {vercelProjects.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "PROJECTS" && (
        <ProjectManagement initialProjects={projects} />
      )}

      {activeTab === "DEV_TOOLS" && (
        <DeveloperTools
          projects={projects}
          initialBugs={bugs}
          initialFeatures={features}
          initialDocs={docs}
          initialDeployments={deployments}
          initialReleases={releases}
        />
      )}

      {activeTab === "GITHUB" && (
        <GitHubIntegration
          initialSetting={integration}
          initialRepos={githubRepos}
          initialCommits={githubCommits}
          initialPRs={githubPRs}
          initialIssues={githubIssues}
        />
      )}

      {activeTab === "VERCEL" && (
        <VercelIntegration
          initialSetting={integration}
          initialProjects={vercelProjects}
          initialDeployments={vercelDeployments}
        />
      )}
    </div>
  );
}