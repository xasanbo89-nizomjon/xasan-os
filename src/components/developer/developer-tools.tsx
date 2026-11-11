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
import { useDeveloperStore } from "@/stores/developer-store";
import { useTranslation } from "@/stores/language-store";

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
  const { isUz } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState<"BUGS" | "FEATURES" | "DOCS" | "DEPLOYMENTS" | "RELEASES">("BUGS");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("ALL");

  // Zustand persistent store bindings
  const storeBugs = useDeveloperStore((s) => s.bugs);
  const storeFeatures = useDeveloperStore((s) => s.features);
  const storeDocs = useDeveloperStore((s) => s.docs);
  const storeDeployments = useDeveloperStore((s) => s.deployments);
  const storeReleases = useDeveloperStore((s) => s.releases);

  const addBug = useDeveloperStore((s) => s.addBug);
  const updateBug = useDeveloperStore((s) => s.updateBug);
  const deleteBug = useDeveloperStore((s) => s.deleteBug);

  const addFeature = useDeveloperStore((s) => s.addFeature);
  const updateFeature = useDeveloperStore((s) => s.updateFeature);
  const deleteFeature = useDeveloperStore((s) => s.deleteFeature);

  const addDoc = useDeveloperStore((s) => s.addDoc);
  const deleteDoc = useDeveloperStore((s) => s.deleteDoc);

  const addDeployment = useDeveloperStore((s) => s.addDeployment);
  const addRelease = useDeveloperStore((s) => s.addRelease);

  const isHydrated = useDeveloperStore((s) => s.isHydrated);

  const bugs = isHydrated ? storeBugs : initialBugs;
  const features = isHydrated ? storeFeatures : initialFeatures;
  const docs = isHydrated ? storeDocs : initialDocs;
  const deployments = isHydrated ? storeDeployments : initialDeployments;
  const releases = isHydrated ? storeReleases : initialReleases;

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
  const handleCreateBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugForm.title.trim()) return;

    const targetProject = projects.find((p) => p.id === (bugForm.projectId || projects[0]?.id));
    addBug({
      projectId: bugForm.projectId || projects[0]?.id || "proj-1",
      title: bugForm.title,
      description: bugForm.description,
      severity: bugForm.severity,
      module: bugForm.module,
      reproSteps: bugForm.reproSteps,
      projectName: targetProject?.name || (isUz ? "Loyiha" : "Project"),
    });

    setIsBugModalOpen(false);
    setBugForm({
      projectId: projects[0]?.id || "",
      title: "",
      description: "",
      severity: "HIGH",
      module: "",
      reproSteps: "",
    });
  };

  const handleToggleBugStatus = (id: string, current: string) => {
    const nextStatus = current === "OPEN" ? "INVESTIGATING" : current === "INVESTIGATING" ? "RESOLVED" : "OPEN";
    updateBug(id, { status: nextStatus as any });
  };

  const handleDeleteBug = (id: string) => {
    const confirmMsg = isUz ? "Ushbu xatolik qaydini o‘chirishni xohlaysizmi?" : "Delete this bug report?";
    if (confirm(confirmMsg)) {
      deleteBug(id);
    }
  };

  // Handlers for FEATURES
  const handleCreateFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featForm.title.trim()) return;

    const targetProject = projects.find((p) => p.id === (featForm.projectId || projects[0]?.id));
    addFeature({
      projectId: featForm.projectId || projects[0]?.id || "proj-1",
      title: featForm.title,
      description: featForm.description,
      priority: featForm.priority,
      targetVersion: featForm.targetVersion,
      projectName: targetProject?.name || (isUz ? "Loyiha" : "Project"),
    });

    setIsFeatureModalOpen(false);
    setFeatForm({
      projectId: projects[0]?.id || "",
      title: "",
      description: "",
      priority: "P1",
      targetVersion: "v2.0.0",
    });
  };

  const handleToggleFeatureStatus = (id: string, current: string) => {
    const nextStatus = current === "BACKLOG" ? "PLANNED" : current === "PLANNED" ? "IN_DEVELOPMENT" : current === "IN_DEVELOPMENT" ? "SHIPPED" : "BACKLOG";
    updateFeature(id, { status: nextStatus as any });
  };

  const handleDeleteFeature = (id: string) => {
    const confirmMsg = isUz ? "Ushbu reja elementini o‘chirmoqchimisiz?" : "Delete this backlog item?";
    if (confirm(confirmMsg)) {
      deleteFeature(id);
    }
  };

  // Handlers for DOCS
  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim()) return;

    const targetProject = projects.find((p) => p.id === (docForm.projectId || projects[0]?.id));
    addDoc({
      projectId: docForm.projectId || projects[0]?.id || "proj-1",
      title: docForm.title,
      category: docForm.category,
      endpoint: docForm.endpoint || undefined,
      method: docForm.method || undefined,
      content: docForm.content,
      requestPayload: docForm.requestPayload || undefined,
      responsePayload: docForm.responsePayload || undefined,
      projectName: targetProject?.name || (isUz ? "Loyiha" : "Project"),
    });

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
  };

  const handleDeleteDoc = (id: string) => {
    const confirmMsg = isUz ? "Ushbu hujjatni o‘chirmoqchimisiz?" : "Delete this documentation item?";
    if (confirm(confirmMsg)) {
      deleteDoc(id);
    }
  };

  // Handlers for DEPLOYMENTS
  const handleCreateDeployment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProject = projects.find((p) => p.id === (depForm.projectId || projects[0]?.id));
    addDeployment({
      projectId: depForm.projectId || projects[0]?.id || "proj-1",
      environment: depForm.environment,
      commitSha: depForm.commitSha || "manual-sha",
      commitMessage: depForm.commitMessage || (isUz ? "Qo‘lda kiritilgan deploy" : "Manual deployment logged"),
      branch: depForm.branch || "main",
      status: depForm.status,
      deploymentUrl: depForm.deploymentUrl || undefined,
      buildDurationSec: Number(depForm.buildDurationSec) || 40,
      logSnippet: depForm.logSnippet || undefined,
      source: "MANUAL",
      projectName: targetProject?.name || (isUz ? "Loyiha" : "Project"),
    });

    setIsDepModalOpen(false);
  };

  // Handlers for RELEASES
  const handleCreateRelease = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relForm.title.trim()) return;

    const targetProject = projects.find((p) => p.id === (relForm.projectId || projects[0]?.id));
    addRelease({
      projectId: relForm.projectId || projects[0]?.id || "proj-1",
      version: relForm.version,
      title: relForm.title,
      changelog: relForm.changelog,
      projectName: targetProject?.name || (isUz ? "Loyiha" : "Project"),
    });

    setIsRelModalOpen(false);
    setRelForm({
      projectId: projects[0]?.id || "",
      version: "v1.0.0",
      title: "",
      changelog: "",
    });
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
            <span>{isUz ? "Xatolar nazorati" : "Bug Tracker"}</span>
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
            <span>{isUz ? "Funksiyalar rejasi" : "Feature Backlog"}</span>
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
            <span>{isUz ? "API va Hujjatlar" : "API & Docs"}</span>
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
            <span>{isUz ? "Deploylar" : "Deployments"}</span>
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
            <span>{isUz ? "Relizlar" : "Releases"}</span>
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
              <option value="ALL" className="bg-[#101915] text-[#F3F7F4]">
                {isUz ? "Barcha loyihalar" : "All Projects"}
              </option>
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
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-1.5 shrink-0 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isUz ? "Xatolik kiritish" : "Report Bug"}</span>
            </button>
          )}

          {activeSubTab === "FEATURES" && (
            <button
              onClick={() => setIsFeatureModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-1.5 shrink-0 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isUz ? "Yangi funksiya" : "New Feature"}</span>
            </button>
          )}

          {activeSubTab === "DOCS" && (
            <button
              onClick={() => setIsDocModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-1.5 shrink-0 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isUz ? "Yangi Hujjat / API" : "New Doc / API"}</span>
            </button>
          )}

          {activeSubTab === "DEPLOYMENTS" && (
            <button
              onClick={() => setIsDepModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-1.5 shrink-0 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isUz ? "Deploy qayd etish" : "Log Deployment"}</span>
            </button>
          )}

          {activeSubTab === "RELEASES" && (
            <button
              onClick={() => setIsRelModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] flex items-center gap-1.5 shrink-0 font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isUz ? "Yangi reliz" : "New Release"}</span>
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
                      {bug.projectName || (isUz ? "Loyiha" : "Venture")}
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
                        title={isUz ? "Holatni o‘zgartirish uchun bosing" : "Click to advance status"}
                      >
                        {isUz
                          ? bug.status === "RESOLVED"
                            ? "Hal qilindi"
                            : bug.status === "INVESTIGATING"
                            ? "O‘rganilmoqda"
                            : "Ochiq"
                          : bug.status}
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                    {bug.title}
                  </h4>
                  {bug.module && (
                    <div className="text-[11px] font-mono text-[#98A69D] mt-0.5">
                      {isUz ? "Modul:" : "Module:"} <span className="text-[#F3F7F4]">{bug.module}</span>
                    </div>
                  )}

                  {bug.description && (
                    <p className="text-xs text-[#98A69D] leading-relaxed mt-2">
                      {bug.description}
                    </p>
                  )}

                  {bug.reproSteps && (
                    <div className="mt-3 p-3 rounded-xl bg-[#080D0B] border border-[#25352C] text-[11px] font-mono text-[#98A69D] whitespace-pre-line">
                      <span className="text-[#10B981] block mb-1">
                        {isUz ? "Qayta yuzaga keltirish:" : "Reproduction:"}
                      </span>
                      {bug.reproSteps}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#25352C] flex items-center justify-between text-[10px] font-mono text-[#98A69D]">
                  <span>
                    {isUz ? "Kiritildi: " : "Reported "}
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </span>
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
              <p className="text-xs font-semibold text-[#F3F7F4]">
                {isUz ? "Ushbu loyihada faol xatoliklar yo‘q!" : "Zero active bugs for this project!"}
              </p>
              <p className="text-xs text-[#98A69D]">
                {isUz ? "Barcha qayd etilgan muammolar hal qilingan yoki yopilgan." : "All reported issues have been resolved or closed."}
              </p>
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
                      {feat.projectName || (isUz ? "Loyiha" : "Venture")}
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
                        title={isUz ? "Holatni o‘zgartirish uchun bosing" : "Click to advance status"}
                      >
                        {isUz
                          ? feat.status === "SHIPPED"
                            ? "Chiqarildi"
                            : feat.status === "IN_DEVELOPMENT"
                            ? "Jarayonda"
                            : feat.status === "PLANNED"
                            ? "Rejalashtirilgan"
                            : "Rejada"
                          : feat.status.replace("_", " ")}
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
                  <span>
                    {isUz ? "Qo‘shildi: " : "Added "}
                    {new Date(feat.createdAt).toLocaleDateString()}
                  </span>
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
              <p className="text-xs font-semibold text-[#F3F7F4]">
                {isUz ? "Funksiyalar rejasi bo‘sh" : "Feature backlog is empty"}
              </p>
              <p className="text-xs text-[#98A69D]">
                {isUz ? "Navbatdagi muhandislik relizi uchun yangi vazifalar qo‘shing." : "Add items to plan the next engineering release."}
              </p>
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
                      {doc.projectName || (isUz ? "Loyiha" : "Venture")}
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
                          {isUz ? "So‘rov Tanasi (Request Payload)" : "Request Payload"}
                        </div>
                        <pre className="text-[#98A69D] overflow-x-auto whitespace-pre-wrap">
                          {doc.requestPayload}
                        </pre>
                      </div>
                    )}

                    {doc.responsePayload && (
                      <div className="p-3.5 rounded-xl bg-[#080D0B] border border-[#25352C] space-y-1.5 font-mono text-[11px]">
                        <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">
                          {isUz ? "Javob Sxemasi (Response Schema)" : "Response Schema / Output"}
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
              <p className="text-xs font-semibold text-[#F3F7F4]">
                {isUz ? "Texnik hujjatlar mavjud emas" : "No technical documentation logged"}
              </p>
              <p className="text-xs text-[#98A69D]">
                {isUz
                  ? "API endpointlari, tizim arxitekturasi yoki muhit o‘zgaruvchilarini hujjatlashtiring."
                  : "Document endpoints, system architecture schemas, or environment variables."}
              </p>
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
                {isUz ? "DEPLOY JARAYONLARI HISOBOTI" : "DEPLOYMENT PIPELINE RECORDS"}
              </span>
              <span className="text-[11px] font-mono text-[#98A69D]">
                {isUz
                  ? `${filteredDeployments.length} ta so‘nggi jarayon ko‘rsatilmoqda`
                  : `Showing ${filteredDeployments.length} latest events`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#25352C] bg-[#142019]/60 text-[#98A69D] font-mono text-[11px]">
                    <th className="py-3 px-4">{isUz ? "Loyiha" : "Project"}</th>
                    <th className="py-3 px-4">{isUz ? "Muhit" : "Env"}</th>
                    <th className="py-3 px-4">{isUz ? "Kommit / Tarmoq" : "Commit / Branch"}</th>
                    <th className="py-3 px-4">{isUz ? "Xabar" : "Message"}</th>
                    <th className="py-3 px-4">{isUz ? "Davomiylik" : "Duration"}</th>
                    <th className="py-3 px-4">{isUz ? "Holat" : "Status"}</th>
                    <th className="py-3 px-4">{isUz ? "Vaqt" : "Timestamp"}</th>
                    <th className="py-3 px-4 text-right">{isUz ? "Havola" : "URL"}</th>
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
              <p className="text-xs font-semibold text-[#F3F7F4]">
                {isUz ? "Hali rasmiy relizlar yaratilmagan" : "No releases tagged yet"}
              </p>
              <p className="text-xs text-[#98A69D]">
                {isUz
                  ? "Semantik versiyalash va o‘zgarishlar jurnali bilan yangi reliz yarating."
                  : "Create a release record with semantic versioning and changelog notes."}
              </p>
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
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {isUz ? "Xatolik / Anomaliya kiritish" : "Report Bug / Anomaly"}
                </h3>
              </div>
              <button onClick={() => setIsBugModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBug} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Tegishli loyiha *" : "Target Project *"}
                </label>
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
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Xatolik sarlavhasi *" : "Bug Summary *"}
                </label>
                <input
                  type="text"
                  required
                  value={bugForm.title}
                  onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                  placeholder={isUz ? "Masalan: Nutq baholashda xotira to‘lib ketishi" : "e.g. Memory leak during continuous speech scoring"}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Jiddiylik darajasi" : "Severity"}
                  </label>
                  <select
                    value={bugForm.severity}
                    onChange={(e) => setBugForm({ ...bugForm, severity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="CRITICAL">{isUz ? "O‘ta muhim (Critical)" : "Critical"}</option>
                    <option value="HIGH">{isUz ? "Yuqori (High)" : "High"}</option>
                    <option value="MEDIUM">{isUz ? "O‘rta (Medium)" : "Medium"}</option>
                    <option value="LOW">{isUz ? "Past (Low)" : "Low"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Modul / Qism" : "Module / Component"}
                  </label>
                  <input
                    type="text"
                    value={bugForm.module}
                    onChange={(e) => setBugForm({ ...bugForm, module: e.target.value })}
                    placeholder={isUz ? "Masalan: Whisper Quvuri" : "e.g. Whisper Pipeline"}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Qayta yuzaga keltirish qadamlari" : "Reproduction Steps"}
                </label>
                <textarea
                  rows={2}
                  value={bugForm.reproSteps}
                  onChange={(e) => setBugForm({ ...bugForm, reproSteps: e.target.value })}
                  placeholder={isUz ? "1. Sessiyani boshlang&#10;2. Ovozli yozuvni yuboring" : "1. Open speaking session&#10;2. Start speech stream"}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsBugModalOpen(false)} className="text-xs text-[#98A69D]">
                  {isUz ? "Bekor qilish" : "Cancel"}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  {isUz ? "Xatolikni saqlash" : "Log Bug"}
                </button>
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
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {isUz ? "Rejaga yangi funksiya qo‘shish" : "New Backlog Feature"}
                </h3>
              </div>
              <button onClick={() => setIsFeatureModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFeature} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Tegishli loyiha *" : "Target Project *"}
                </label>
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
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Funksiya nomi *" : "Feature Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={featForm.title}
                  onChange={(e) => setFeatForm({ ...featForm, title: e.target.value })}
                  placeholder={isUz ? "Masalan: WebRTC audio kechikishini pasaytirish" : "e.g. WebRTC zero-latency audio fallback"}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Ustuvorlik" : "Priority"}
                  </label>
                  <select
                    value={featForm.priority}
                    onChange={(e) => setFeatForm({ ...featForm, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="P0">P0 ({isUz ? "Bloklovchi" : "Blocker"})</option>
                    <option value="P1">P1 ({isUz ? "Yuqori" : "High"})</option>
                    <option value="P2">P2 ({isUz ? "O‘rta" : "Medium"})</option>
                    <option value="P3">P3 ({isUz ? "Past" : "Nice-to-have"})</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Reliz versiyasi" : "Target Version"}
                  </label>
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
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Tavsif / Xususiyatlar" : "Description / Spec"}
                </label>
                <textarea
                  rows={2}
                  value={featForm.description}
                  onChange={(e) => setFeatForm({ ...featForm, description: e.target.value })}
                  placeholder={isUz ? "Funksiya maqsadi va foydalanuvchiga qiymati..." : "Scope details and user benefit..."}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsFeatureModalOpen(false)} className="text-xs text-[#98A69D]">
                  {isUz ? "Bekor qilish" : "Cancel"}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  {isUz ? "Funksiyani saqlash" : "Add Feature"}
                </button>
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
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {isUz ? "Yangi Texnik Hujjat / API" : "New Technical Note / API Doc"}
                </h3>
              </div>
              <button onClick={() => setIsDocModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Tegishli loyiha *" : "Target Project *"}
                </label>
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
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Hujjat sarlavhasi *" : "Doc Title *"}
                </label>
                <input
                  type="text"
                  required
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  placeholder={isUz ? "Masalan: Nutqni baholash Inference API" : "e.g. Speech Evaluation Inference API"}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Kategoriya" : "Category"}
                  </label>
                  <select
                    value={docForm.category}
                    onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="API">API</option>
                    <option value="ARCHITECTURE">{isUz ? "Arxitektura" : "Architecture"}</option>
                    <option value="ENVIRONMENT">{isUz ? "Muhit" : "Environment"}</option>
                    <option value="GUIDE">{isUz ? "Qo‘llanma" : "Guide"}</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "HTTP Metod" : "Method"}
                  </label>
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
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Endpoint</label>
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
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Hujjat / Tavsif" : "Content / Specification"}
                </label>
                <textarea
                  rows={3}
                  required
                  value={docForm.content}
                  onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
                  placeholder={
                    isUz
                      ? "Kechikish talablari, autentifikatsiya va tizim qoidalarini yozing..."
                      : "Explain latency requirements, authentication schemas, or operational constraints..."
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsDocModalOpen(false)} className="text-xs text-[#98A69D]">
                  {isUz ? "Bekor qilish" : "Cancel"}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  {isUz ? "Hujjatni saqlash" : "Save Document"}
                </button>
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
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {isUz ? "Deploy jarayonini qayd etish" : "Log Deployment Event"}
                </h3>
              </div>
              <button onClick={() => setIsDepModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeployment} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Tegishli loyiha" : "Target Project"}
                </label>
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
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Muhit" : "Environment"}
                  </label>
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
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Holat" : "Status"}
                  </label>
                  <select
                    value={depForm.status}
                    onChange={(e) => setDepForm({ ...depForm, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  >
                    <option value="SUCCESS">{isUz ? "Muvaffaqiyatli" : "Success"}</option>
                    <option value="FAILED">{isUz ? "Xatolik" : "Failed"}</option>
                    <option value="BUILDING">{isUz ? "Qurilmoqda" : "Building"}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Kommit xabari" : "Commit Message"}
                </label>
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
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Tarmoq" : "Branch"}
                  </label>
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
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Deploy havolasi" : "Deployment URL"}
                </label>
                <input
                  type="url"
                  value={depForm.deploymentUrl}
                  onChange={(e) => setDepForm({ ...depForm, deploymentUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsDepModalOpen(false)} className="text-xs text-[#98A69D]">
                  {isUz ? "Bekor qilish" : "Cancel"}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  {isUz ? "Deployni saqlash" : "Log Deployment"}
                </button>
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
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {isUz ? "Dasturiy Relizni E’lon Qilish" : "Publish New Release"}
                </h3>
              </div>
              <button onClick={() => setIsRelModalOpen(false)} className="text-[#98A69D] hover:text-[#F3F7F4]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRelease} className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "Tegishli loyiha *" : "Target Project *"}
                </label>
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
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Versiya tegi *" : "SemVer Version *"}
                  </label>
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
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    {isUz ? "Reliz nomi *" : "Release Title *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={relForm.title}
                    onChange={(e) => setRelForm({ ...relForm, title: e.target.value })}
                    placeholder={isUz ? "Masalan: Nutq moduli v2" : "Speech Coherence v2"}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  {isUz ? "O‘zgarishlar jurnali (Changelog)" : "Changelog Bullets"}
                </label>
                <textarea
                  rows={4}
                  required
                  value={relForm.changelog}
                  onChange={(e) => setRelForm({ ...relForm, changelog: e.target.value })}
                  placeholder={isUz ? "• Audio oqim kechikishi tuzatildi&#10;• Yangi lug‘at to‘plami qo‘shildi" : "• Fixed audio stream latency&#10;• Added CEFR B2/C1 vocabulary deck"}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button type="button" onClick={() => setIsRelModalOpen(false)} className="text-xs text-[#98A69D]">
                  {isUz ? "Bekor qilish" : "Cancel"}
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] font-bold">
                  {isUz ? "Relizni chop etish" : "Publish Release"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
