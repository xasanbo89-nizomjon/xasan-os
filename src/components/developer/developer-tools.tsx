"use client";

import React, { useState, useMemo } from "react";
import {
  Bug,
  ListTodo,
  FileText,
  Rocket,
  History,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles,
  Terminal,
  Code,
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  Tag,
  AlertCircle,
} from "lucide-react";
import {
  DevBugSummary,
  DevFeatureSummary,
  DevDocSummary,
  DevDeploymentSummary,
  DevReleaseSummary,
  ProjectSummary,
} from "@/types";
import {
  createDevBugAction,
  updateDevBugStatusAction,
  deleteDevBugAction,
  createDevFeatureAction,
  updateDevFeatureStatusAction,
  deleteDevFeatureAction,
  createDevDocAction,
  deleteDevDocAction,
  createDevDeploymentAction,
  createDevReleaseAction,
} from "@/server/actions/developer";

interface DeveloperToolsProps {
  projects: ProjectSummary[];
  initialBugs: DevBugSummary[];
  initialFeatures: DevFeatureSummary[];
  initialDocs: DevDocSummary[];
  initialDeployments: DevDeploymentSummary[];
  initialReleases: DevReleaseSummary[];
}

export function DeveloperTools({
  projects,
  initialBugs,
  initialFeatures,
  initialDocs,
  initialDeployments,
  initialReleases,
}: DeveloperToolsProps) {
  const [activeSubTab, setActiveSubTab] = useState<"BUGS" | "FEATURES" | "DOCS" | "DEPLOYMENTS" | "RELEASES">("BUGS");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");

  // State collections
  const [bugs, setBugs] = useState<DevBugSummary[]>(initialBugs);
  const [features, setFeatures] = useState<DevFeatureSummary[]>(initialFeatures);
  const [docs, setDocs] = useState<DevDocSummary[]>(initialDocs);
  const [deployments, setDeployments] = useState<DevDeploymentSummary[]>(initialDeployments);
  const [releases, setReleases] = useState<DevReleaseSummary[]>(initialReleases);

  // Modals
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isDepModalOpen, setIsDepModalOpen] = useState(false);
  const [isRelModalOpen, setIsRelModalOpen] = useState(false);

  // Forms
  const [bugForm, setBugForm] = useState({
    projectId: projects[0]?.id || "",
    title: "",
    description: "",
    severity: "HIGH",
    module: "",
    reproSteps: "",
  });

  const [featForm, setFeatForm] = useState({
    projectId: projects[0]?.id || "",
    title: "",
    description: "",
    priority: "P1",
    targetVersion: "v2.0.0",
  });

  const [docForm, setDocForm] = useState({
    projectId: projects[0]?.id || "",
    title: "",
    category: "API",
    endpoint: "",
    method: "POST",
    content: "",
    requestPayload: "",
    responsePayload: "",
  });

  const [depForm, setDepForm] = useState({
    projectId: projects[0]?.id || "",
    environment: "PRODUCTION",
    commitSha: "",
    commitMessage: "",
    branch: "main",
    status: "SUCCESS",
    deploymentUrl: "",
    buildDurationSec: 45,
    logSnippet: "",
    source: "MANUAL",
  });

  const [relForm, setRelForm] = useState({
    projectId: projects[0]?.id || "",
    version: "v1.0.0",
    title: "",
    changelog: "",
  });

  // Filtered queries
  const filteredBugs = useMemo(() => {
    return bugs.filter((b) => (selectedProjectId === "ALL" ? true : b.projectId === selectedProjectId));
  }, [bugs, selectedProjectId]);

  const filteredFeatures = useMemo(() => {
    return features.filter((f) => (selectedProjectId === "ALL" ? true : f.projectId === selectedProjectId));
  }, [features, selectedProjectId]);

  const filteredDocs = useMemo(() => {
    return docs.filter((d) => (selectedProjectId === "ALL" ? true : d.projectId === selectedProjectId));
  }, [docs, selectedProjectId]);

  const filteredDeployments = useMemo(() => {
    return deployments.filter((d) => (selectedProjectId === "ALL" ? true : d.projectId === selectedProjectId));
  }, [deployments, selectedProjectId]);

  const filteredReleases = useMemo(() => {
    return releases.filter((r) => (selectedProjectId === "ALL" ? true : r.projectId === selectedProjectId));
  }, [releases, selectedProjectId]);

  // Handlers for BUGS
  const handleCreateBug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugForm.title.trim()) return;

    const res = await createDevBugAction({
      projectId: bugForm.projectId || projects[0]?.id || "proj-1",
      title: bugForm.title,
      description: bugForm.description,
      severity: bugForm.severity,
      module: bugForm.module,
      reproSteps: bugForm.reproSteps,
    });

    if (res.success && res.bug) {
      const newBug: DevBugSummary = {
        id: res.bug.id,
        projectId: res.bug.projectId,
        userId: res.bug.userId,
        title: res.bug.title,
        description: res.bug.description,
        severity: res.bug.severity as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
        status: res.bug.status as "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED",
        module: res.bug.module,
        reproSteps: res.bug.reproSteps,
        projectName: (res.bug as any).project?.name || (res.bug as any).projectName || "Project",
        createdAt: typeof res.bug.createdAt === "string" ? res.bug.createdAt : new Date(res.bug.createdAt).toISOString(),
        updatedAt: typeof res.bug.updatedAt === "string" ? res.bug.updatedAt : new Date(res.bug.updatedAt).toISOString(),
      };
      setBugs((prev) => [newBug, ...prev]);
      setIsBugModalOpen(false);
      setBugForm({
        projectId: projects[0]?.id || "",
        title: "",
        description: "",
        severity: "HIGH",
        module: "",
        reproSteps: "",
      });
    }
  };

  const handleToggleBugStatus = async (id: string, current: string) => {
    const nextStatus = current === "OPEN" ? "INVESTIGATING" : current === "INVESTIGATING" ? "RESOLVED" : "OPEN";
    await updateDevBugStatusAction(id, nextStatus as any);
    setBugs((prev) => prev.map((b) => (b.id === id ? { ...b, status: nextStatus as any } : b)));
  };

  const handleDeleteBug = async (id: string) => {
    if (confirm("Delete this bug report?")) {
      const res = await deleteDevBugAction(id);
      if (res.success) setBugs((prev) => prev.filter((b) => b.id !== id));
    }
  };

  // Handlers for FEATURES
  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!featForm.title.trim()) return;

    const res = await createDevFeatureAction({
      projectId: featForm.projectId || projects[0]?.id || "proj-1",
      title: featForm.title,
      description: featForm.description,
      priority: featForm.priority,
      targetVersion: featForm.targetVersion,
    });

    if (res.success && res.feature) {
      const newFeat: DevFeatureSummary = {
        id: res.feature.id,
        projectId: res.feature.projectId,
        userId: res.feature.userId,
        title: res.feature.title,
        description: res.feature.description,
        priority: res.feature.priority as "P0" | "P1" | "P2" | "P3",
        status: res.feature.status as "BACKLOG" | "PLANNED" | "IN_DEVELOPMENT" | "SHIPPED",
        targetVersion: res.feature.targetVersion,
        projectName: (res.feature as any).project?.name || (res.feature as any).projectName || "Project",
        createdAt: typeof res.feature.createdAt === "string" ? res.feature.createdAt : new Date(res.feature.createdAt).toISOString(),
        updatedAt: typeof res.feature.updatedAt === "string" ? res.feature.updatedAt : new Date(res.feature.updatedAt).toISOString(),
      };
      setFeatures((prev) => [newFeat, ...prev]);
      setIsFeatureModalOpen(false);
      setFeatForm({
        projectId: projects[0]?.id || "",
        title: "",
        description: "",
        priority: "P1",
        targetVersion: "v2.0.0",
      });
    }
  };

  const handleToggleFeatureStatus = async (id: string, current: string) => {
    const nextStatus = current === "BACKLOG" ? "PLANNED" : current === "PLANNED" ? "IN_DEVELOPMENT" : current === "IN_DEVELOPMENT" ? "SHIPPED" : "BACKLOG";
    await updateDevFeatureStatusAction(id, nextStatus as any);
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, status: nextStatus as any } : f)));
  };

  const handleDeleteFeature = async (id: string) => {
    if (confirm("Delete this backlog item?")) {
      const res = await deleteDevFeatureAction(id);
      if (res.success) setFeatures((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // Handlers for DOCS
  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim()) return;

    const res = await createDevDocAction({
      projectId: docForm.projectId || projects[0]?.id || "proj-1",
      title: docForm.title,
      category: docForm.category,
      endpoint: docForm.endpoint || undefined,
      method: docForm.method || undefined,
      content: docForm.content,
      requestPayload: docForm.requestPayload || undefined,
      responsePayload: docForm.responsePayload || undefined,
    });

    if (res.success && res.doc) {
      const newDoc: DevDocSummary = {
        ...res.doc,
        createdAt: typeof res.doc.createdAt === "string" ? res.doc.createdAt : new Date(res.doc.createdAt).toISOString(),
        updatedAt: typeof res.doc.updatedAt === "string" ? res.doc.updatedAt : new Date(res.doc.updatedAt).toISOString(),
      };
      setDocs((prev) => [newDoc, ...prev]);
      setIsDocModalOpen(false);
      setDocForm({
        projectId: projects[0]?.id || "",
        title: "",
        category: "API",
        endpoint: "",
        method: "POST",
        content: "",
        requestPayload: "",
        responsePayload: "",
      });
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (confirm("Delete this documentation item?")) {
      const res = await deleteDevDocAction(id);
      if (res.success) setDocs((prev) => prev.filter((d) => d.id !== id));
    }
  };

  // Handlers for DEPLOYMENTS
  const handleCreateDeployment = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createDevDeploymentAction({
      projectId: depForm.projectId || projects[0]?.id || "proj-1",
      environment: depForm.environment,
      commitSha: depForm.commitSha || "manual-sha",
      commitMessage: depForm.commitMessage || "Manual deployment logged",
      branch: depForm.branch || "main",
      status: depForm.status,
      deploymentUrl: depForm.deploymentUrl || undefined,
      buildDurationSec: Number(depForm.buildDurationSec) || 40,
      logSnippet: depForm.logSnippet || undefined,
      source: "MANUAL",
    });

    if (res.success && res.deployment) {
      const newDep: DevDeploymentSummary = {
        ...res.deployment,
        deployedAt: typeof res.deployment.deployedAt === "string" ? res.deployment.deployedAt : new Date(res.deployment.deployedAt).toISOString(),
      };
      setDeployments((prev) => [newDep, ...prev]);
      setIsDepModalOpen(false);
    }
  };

  // Handlers for RELEASES
  const handleCreateRelease = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relForm.title.trim()) return;

    const res = await createDevReleaseAction({
      projectId: relForm.projectId || projects[0]?.id || "proj-1",
      version: relForm.version,
      title: relForm.title,
      changelog: relForm.changelog,
    });

    if (res.success && res.release) {
      const newRel: DevReleaseSummary = {
        ...res.release,
        releaseDate: typeof res.release.releaseDate === "string" ? res.release.releaseDate : new Date(res.release.releaseDate).toISOString(),
        createdAt: typeof res.release.createdAt === "string" ? res.release.createdAt : new Date(res.release.createdAt).toISOString(),
      };
      setReleases((prev) => [newRel, ...prev]);
      setIsRelModalOpen(false);
      setRelForm({
        projectId: projects[0]?.id || "",
        version: "v1.0.0",
        title: "",
        changelog: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation & Project Scope Filter */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveSubTab("BUGS")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === "BUGS"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Bug Tracker</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
              {bugs.filter((b) => b.status === "OPEN" || b.status === "INVESTIGATING").length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("FEATURES")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === "FEATURES"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Feature Backlog</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
              {features.filter((f) => f.status !== "SHIPPED").length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("DOCS")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === "DOCS"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>API & Docs</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
              {docs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("DEPLOYMENTS")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === "DEPLOYMENTS"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Deployments</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
              {deployments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab("RELEASES")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0 ${
              activeSubTab === "RELEASES"
                ? "bg-[#10B981] text-[#080D0B] shadow-md shadow-[#10B981]/20 font-bold"
                : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Releases</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 font-mono">
              {releases.length}
            </span>
          </button>
        </div>

        {/* Project Scope Filter & Action */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-[#101915] border border-[#25352C] rounded-xl px-3 py-1.5 text-xs text-[#98A69D]">
            <Filter className="w-3.5 h-3.5 text-[#10B981]" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-transparent text-xs text-[#F3F7F4] font-semibold focus:outline-none"
            >
              <option value="ALL" className="bg-[#101915] text-[#F3F7F4]">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#101915] text-[#F3F7F4]">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {activeSubTab === "BUGS" && (
            <button
              onClick={() => setIsBugModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Bug</span>
            </button>
          )}

          {activeSubTab === "FEATURES" && (
            <button
              onClick={() => setIsFeatureModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Feature</span>
            </button>
          )}

          {activeSubTab === "DOCS" && (
            <button
              onClick={() => setIsDocModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Doc / API</span>
            </button>
          )}

          {activeSubTab === "DEPLOYMENTS" && (
            <button
              onClick={() => setIsDepModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Deployment</span>
            </button>
          )}

          {activeSubTab === "RELEASES" && (
            <button
              onClick={() => setIsRelModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Release</span>
            </button>
          )}
        </div>
      </div>

      {/* ===================== VIEW 1: BUG TRACKER ===================== */}
      {activeSubTab === "BUGS" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBugs.map((bug) => (
              <div
                key={bug.id}
                className="glass-card rounded-2xl p-5 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex flex-col justify-between group space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] text-[#10B981]">
                      {bug.projectName || "Venture"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          bug.severity === "CRITICAL"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : bug.severity === "HIGH"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-[#101915] text-[#98A69D] border border-[#25352C]"
                        }`}
                      >
                        {bug.severity}
                      </span>
                      <button
                        onClick={() => handleToggleBugStatus(bug.id, bug.status)}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border transition-colors ${
                          bug.status === "RESOLVED"
                            ? "bg-emerald-500/20 text-[#10B981] border-[#10B981]/30"
                            : bug.status === "INVESTIGATING"
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                            : "bg-red-500/10 text-red-300 border-red-500/20"
                        }`}
                        title="Click to advance status"
                      >
                        {bug.status}
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                    {bug.title}
                  </h4>
                  {bug.module && (
                    <div className="text-[11px] font-mono text-[#98A69D] mt-0.5">
                      Module: <span className="text-[#F3F7F4]">{bug.module}</span>
                    </div>
                  )}

                  {bug.description && (
                    <p className="text-xs text-[#98A69D] leading-relaxed mt-2">
                      {bug.description}
                    </p>
                  )}

                  {bug.reproSteps && (
                    <div className="mt-3 p-3 rounded-xl bg-[#080D0B] border border-[#25352C] text-[11px] font-mono text-[#98A69D] whitespace-pre-line">
                      <span className="text-[#10B981] block mb-1">Reproduction:</span>
                      {bug.reproSteps}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#25352C] flex items-center justify-between text-[10px] font-mono text-[#98A69D]">
                  <span>Reported {new Date(bug.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDeleteBug(bug.id)}
                    className="p-1 rounded text-red-400/60 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBugs.length === 0 && (
            <div className="glass-card rounded-2xl p-8 border border-[#25352C] text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
              <p className="text-xs font-semibold text-[#F3F7F4]">Zero active bugs for this project!</p>
              <p className="text-xs text-[#98A69D]">All reported issues have been resolved or closed.</p>
            </div>
          )}
        </div>
      )}

      {/* ===================== VIEW 2: FEATURE BACKLOG ===================== */}
      {activeSubTab === "FEATURES" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeatures.map((feat) => (
              <div
                key={feat.id}
                className="glass-card rounded-2xl p-5 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex flex-col justify-between group space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] text-[#10B981]">
                      {feat.projectName || "Venture"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        {feat.priority}
                      </span>
                      {feat.targetVersion && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] text-[#98A69D] border border-[#25352C]">
                          {feat.targetVersion}
                        </span>
                      )}
                      <button
                        onClick={() => handleToggleFeatureStatus(feat.id, feat.status)}
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border transition-colors ${
                          feat.status === "SHIPPED"
                            ? "bg-emerald-500/20 text-[#10B981] border-[#10B981]/30"
                            : feat.status === "IN_DEVELOPMENT"
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                            : "bg-[#101915] text-[#98A69D] border-[#25352C]"
                        }`}
                        title="Click to advance status"
                      >
                        {feat.status.replace("_", " ")}
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                    {feat.title}
                  </h4>
                  {feat.description && (
                    <p className="text-xs text-[#98A69D] leading-relaxed mt-2">
                      {feat.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#25352C] flex items-center justify-between text-[10px] font-mono text-[#98A69D]">
                  <span>Added {new Date(feat.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDeleteFeature(feat.id)}
                    className="p-1 rounded text-red-400/60 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredFeatures.length === 0 && (
            <div className="glass-card rounded-2xl p-8 border border-[#25352C] text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[#98A69D] mx-auto" />
              <p className="text-xs font-semibold text-[#F3F7F4]">Feature backlog is empty</p>
              <p className="text-xs text-[#98A69D]">Add items to plan the next engineering release.</p>
            </div>
          )}
        </div>
      )}

      {/* ===================== VIEW 3: API & TECHNICAL DOCS ===================== */}
      {activeSubTab === "DOCS" && (
        <div className="space-y-4">
          <div className="space-y-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="glass-card rounded-2xl p-6 border border-[#25352C] hover:border-[#10B981]/40 transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#101915] border border-[#25352C] text-[#10B981]">
                      {doc.projectName || "Venture"}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                      {doc.category}
                    </span>
                    {doc.method && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-[#10B981] border border-emerald-500/30">
                        {doc.method}
                      </span>
                    )}
                    {doc.endpoint && (
                      <span className="text-xs font-mono font-semibold text-[#F3F7F4]">
                        {doc.endpoint}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-1 rounded text-red-400/60 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors mb-2">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-[#98A69D] leading-relaxed">
                    {doc.content}
                  </p>
                </div>

                {(doc.requestPayload || doc.responsePayload) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {doc.requestPayload && (
                      <div className="p-3.5 rounded-xl bg-[#080D0B] border border-[#25352C] space-y-1.5 font-mono text-[11px]">
                        <div className="text-[10px] text-[#10B981] uppercase tracking-wider font-bold">
                          Request Payload
                        </div>
                        <pre className="text-[#98A69D] overflow-x-auto whitespace-pre-wrap">
                          {doc.requestPayload}
                        </pre>
                      </div>
                    )}

                    {doc.responsePayload && (
                      <div className="p-3.5 rounded-xl bg-[#080D0B] border border-[#25352C] space-y-1.5 font-mono text-[11px]">
                        <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                          Response Schema / Output
                        </div>
                        <pre className="text-[#98A69D] overflow-x-auto whitespace-pre-wrap">
                          {doc.responsePayload}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredDocs.length === 0 && (
            <div className="glass-card rounded-2xl p-8 border border-[#25352C] text-center space-y-2">
              <FileText className="w-8 h-8 text-[#98A69D] mx-auto" />
              <p className="text-xs font-semibold text-[#F3F7F4]">No technical documentation logged</p>
              <p className="text-xs text-[#98A69D]">Document endpoints, system architecture schemas, or environment variables.</p>
            </div>
          )}
        </div>
      )}

      {/* ===================== VIEW 4: DEPLOYMENT HISTORY ===================== */}
      {activeSubTab === "DEPLOYMENTS" && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl border border-[#25352C] overflow-hidden">
            <div className="p-4 border-b border-[#25352C] bg-[#101915] flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#F3F7F4]">
                DEPLOYMENT PIPELINE RECORDS
              </span>
              <span className="text-[11px] font-mono text-[#98A69D]">
                Showing {filteredDeployments.length} latest events
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#25352C] bg-[#142019]/60 text-[#98A69D] font-mono text-[11px]">
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Env</th>
                    <th className="py-3 px-4">Commit / Branch</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4">Duration</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4 text-right">URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#25352C]">
                  {filteredDeployments.map((d) => (
                    <tr key={d.id} className="hover:bg-[#101915]/50 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#F3F7F4]">
                        {d.projectName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#101915] border border-[#25352C] text-[#10B981]">
                          {d.environment}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#98A69D]">
                        <span className="text-[#10B981]">{d.commitSha || "SHA"}</span> on {d.branch}
                      </td>
                      <td className="py-3.5 px-4 text-[#F3F7F4] max-w-xs truncate">
                        {d.commitMessage || "—"}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#98A69D]">
                        {d.buildDurationSec ? `${d.buildDurationSec}s` : "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            d.status === "SUCCESS"
                              ? "bg-emerald-500/20 text-[#10B981] border border-emerald-500/30"
                              : d.status === "FAILED"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#98A69D]">
                        {new Date(d.deployedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {d.deploymentUrl ? (
                          <a
                            href={d.deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#10B981] hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                          >
                            <span>Live</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-[#98A69D]/40">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW 5: VERSION HISTORY & RELEASES ===================== */}
      {activeSubTab === "RELEASES" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReleases.map((rel) => (
              <div
                key={rel.id}
                className="glass-card rounded-2xl p-6 border border-[#25352C] hover:border-[#10B981]/40 transition-all space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-[#10B981] px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      {rel.version}
                    </span>
                    <span className="text-xs font-semibold text-[#F3F7F4]">{rel.projectName}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#98A69D]">
                    {new Date(rel.releaseDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#F3F7F4] mb-2">{rel.title}</h4>
                  <div className="p-3 rounded-xl bg-[#080D0B] border border-[#25352C] text-xs font-mono text-[#98A69D] whitespace-pre-line leading-relaxed">
                    {rel.changelog}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredReleases.length === 0 && (
            <div className="glass-card rounded-2xl p-8 border border-[#25352C] text-center space-y-2">
              <History className="w-8 h-8 text-[#98A69D] mx-auto" />
              <p className="text-xs font-semibold text-[#F3F7F4]">No releases tagged yet</p>
              <p className="text-xs text-[#98A69D]">Create a release record with semantic versioning and changelog notes.</p>
            </div>
          )}
        </div>
      )}

      {/* ===================== MODALS ===================== */}
      {/* 1. Bug Modal */}
      {isBugModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-md w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">Report Bug / Anomaly</h3>
              </div>
              <button onClick={() => setIsBugModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBug} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Target Project</label>
                <select
                  value={bugForm.projectId}
                  onChange={(e) => setBugForm({ ...bugForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Bug Summary *</label>
                <input
                  type="text"
                  required
                  value={bugForm.title}
                  onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                  placeholder="e.g. Memory leak during continuous speech scoring"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Severity</label>
                  <select
                    value={bugForm.severity}
                    onChange={(e) => setBugForm({ ...bugForm, severity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Module / Component</label>
                  <input
                    type="text"
                    value={bugForm.module}
                    onChange={(e) => setBugForm({ ...bugForm, module: e.target.value })}
                    placeholder="e.g. Whisper Pipeline"
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Reproduction Steps</label>
                <textarea
                  rows={2}
                  value={bugForm.reproSteps}
                  onChange={(e) => setBugForm({ ...bugForm, reproSteps: e.target.value })}
                  placeholder="1. Open speaking session&#10;2. Start speech stream"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsBugModalOpen(false)} className="text-xs text-[#98A69D]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B]">Log Bug</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Feature Modal */}
      {isFeatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-md w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">New Backlog Feature</h3>
              </div>
              <button onClick={() => setIsFeatureModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFeature} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Target Project</label>
                <select
                  value={featForm.projectId}
                  onChange={(e) => setFeatForm({ ...featForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Feature Title *</label>
                <input
                  type="text"
                  required
                  value={featForm.title}
                  onChange={(e) => setFeatForm({ ...featForm, title: e.target.value })}
                  placeholder="e.g. WebRTC zero-latency audio fallback"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Priority</label>
                  <select
                    value={featForm.priority}
                    onChange={(e) => setFeatForm({ ...featForm, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="P0">P0 (Blocker)</option>
                    <option value="P1">P1 (High)</option>
                    <option value="P2">P2 (Medium)</option>
                    <option value="P3">P3 (Nice-to-have)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Target Version</label>
                  <input
                    type="text"
                    value={featForm.targetVersion}
                    onChange={(e) => setFeatForm({ ...featForm, targetVersion: e.target.value })}
                    placeholder="v2.1.0"
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Description / Spec</label>
                <textarea
                  rows={2}
                  value={featForm.description}
                  onChange={(e) => setFeatForm({ ...featForm, description: e.target.value })}
                  placeholder="Scope details and user benefit..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsFeatureModalOpen(false)} className="text-xs text-[#98A69D]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B]">Add Feature</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Doc Modal */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-lg w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">New Technical Note / API Doc</h3>
              </div>
              <button onClick={() => setIsDocModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Target Project</label>
                <select
                  value={docForm.projectId}
                  onChange={(e) => setDocForm({ ...docForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Doc Title *</label>
                <input
                  type="text"
                  required
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  placeholder="e.g. Speech Evaluation Inference API"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Category</label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="API">API</option>
                    <option value="ARCHITECTURE">Architecture</option>
                    <option value="ENVIRONMENT">Environment</option>
                    <option value="GUIDE">Guide</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Method</label>
                  <select
                    value={docForm.method}
                    onChange={(e) => setDocForm({ ...docForm, method: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Endpoint Path</label>
                  <input
                    type="text"
                    value={docForm.endpoint}
                    onChange={(e) => setDocForm({ ...docForm, endpoint: e.target.value })}
                    placeholder="/api/v1/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Content / Specification</label>
                <textarea
                  rows={3}
                  required
                  value={docForm.content}
                  onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
                  placeholder="Explain latency requirements, authentication schemas, or operational constraints..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsDocModalOpen(false)} className="text-xs text-[#98A69D]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B]">Save Document</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Deployment Modal */}
      {isDepModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-md w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">Log Deployment Event</h3>
              </div>
              <button onClick={() => setIsDepModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeployment} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Target Project</label>
                <select
                  value={depForm.projectId}
                  onChange={(e) => setDepForm({ ...depForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Environment</label>
                  <select
                    value={depForm.environment}
                    onChange={(e) => setDepForm({ ...depForm, environment: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="PRODUCTION">Production</option>
                    <option value="PREVIEW">Preview</option>
                    <option value="STAGING">Staging</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Status</label>
                  <select
                    value={depForm.status}
                    onChange={(e) => setDepForm({ ...depForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="SUCCESS">Success</option>
                    <option value="FAILED">Failed</option>
                    <option value="BUILDING">Building</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Commit Message</label>
                <input
                  type="text"
                  value={depForm.commitMessage}
                  onChange={(e) => setDepForm({ ...depForm, commitMessage: e.target.value })}
                  placeholder="feat: optimized database queries"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Commit SHA</label>
                  <input
                    type="text"
                    value={depForm.commitSha}
                    onChange={(e) => setDepForm({ ...depForm, commitSha: e.target.value })}
                    placeholder="7e92ab1"
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Branch</label>
                  <input
                    type="text"
                    value={depForm.branch}
                    onChange={(e) => setDepForm({ ...depForm, branch: e.target.value })}
                    placeholder="main"
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Deployment URL</label>
                <input
                  type="url"
                  value={depForm.deploymentUrl}
                  onChange={(e) => setDepForm({ ...depForm, deploymentUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsDepModalOpen(false)} className="text-xs text-[#98A69D]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B]">Log Deployment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Release Modal */}
      {isRelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-2xl border border-[#25352C] p-6 max-w-md w-full bg-[#101915] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">Publish New Release</h3>
              </div>
              <button onClick={() => setIsRelModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRelease} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Target Project</label>
                <select
                  value={relForm.projectId}
                  onChange={(e) => setRelForm({ ...relForm, projectId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">SemVer Version *</label>
                  <input
                    type="text"
                    required
                    value={relForm.version}
                    onChange={(e) => setRelForm({ ...relForm, version: e.target.value })}
                    placeholder="v2.1.0"
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Release Title *</label>
                  <input
                    type="text"
                    required
                    value={relForm.title}
                    onChange={(e) => setRelForm({ ...relForm, title: e.target.value })}
                    placeholder="Speech Coherence v2"
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Changelog Bullets</label>
                <textarea
                  rows={4}
                  required
                  value={relForm.changelog}
                  onChange={(e) => setRelForm({ ...relForm, changelog: e.target.value })}
                  placeholder="• Fixed audio stream latency&#10;• Added CEFR B2/C1 vocabulary deck"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsRelModalOpen(false)} className="text-xs text-[#98A69D]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B]">Publish Release</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
