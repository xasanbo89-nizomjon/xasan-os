"use client";

import React, { useState, useMemo } from "react";
import {
  Code2,
  Plus,
  Search,
  ExternalLink,
  GitBranch,
  Calendar,
  Layers,
  Edit2,
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
  X,
  CheckCircle2,
  GraduationCap,
  Car,
  Languages,
  School,
  Terminal,
} from "lucide-react";
import { ProjectSummary, ProjectStatus, Priority } from "@/types";
import { useDeveloperStore } from "@/stores/developer-store";

interface ProjectManagementProps {
  initialProjects: ProjectSummary[];
}

export function ProjectManagement({ initialProjects }: ProjectManagementProps) {
  const storeProjects = useDeveloperStore((s) => s.projects);
  const addProject = useDeveloperStore((s) => s.addProject);
  const updateProject = useDeveloperStore((s) => s.updateProject);
  const deleteProject = useDeveloperStore((s) => s.deleteProject);
  const isHydrated = useDeveloperStore((s) => s.isHydrated);

  const projects = isHydrated ? storeProjects : initialProjects;
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<ProjectSummary | null>(null);

  // Form State for Create / Edit
  interface ProjectFormData {
    name: string;
    description: string;
    status: ProjectStatus;
    priority: Priority;
    techStack: string;
    repositoryUrl: string;
    liveUrl: string;
    progress: number;
    startDate: string;
    targetDate: string;
    color: string;
  }

  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: ProjectStatus.ACTIVE,
    priority: Priority.HIGH,
    techStack: "Next.js, TypeScript, Tailwind CSS",
    repositoryUrl: "",
    liveUrl: "",
    progress: 50,
    startDate: "",
    targetDate: "",
    color: "#10B981",
  });

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [projects, statusFilter, searchQuery]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      name: "",
      description: "",
      status: ProjectStatus.ACTIVE,
      priority: Priority.HIGH,
      techStack: "Next.js 16, TypeScript, Tailwind CSS",
      repositoryUrl: "",
      liveUrl: "",
      progress: 0,
      startDate: new Date().toISOString().split("T")[0],
      targetDate: new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
      color: "#10B981",
    });
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (p: ProjectSummary) => {
    setEditingProject(p);
    setFormData({
      name: p.name,
      description: p.description || "",
      status: p.status,
      priority: p.priority,
      techStack: p.techStack.join(", "),
      repositoryUrl: p.repositoryUrl || "",
      liveUrl: p.liveUrl || "",
      progress: p.progress,
      startDate: p.startDate ? new Date(p.startDate).toISOString().split("T")[0] : "",
      targetDate: p.targetDate ? new Date(p.targetDate).toISOString().split("T")[0] : "",
      color: p.color || "#10B981",
    });
    setIsCreateModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const techArray = formData.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProject) {
      updateProject(editingProject.id, {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        techStack: techArray,
        repositoryUrl: formData.repositoryUrl,
        liveUrl: formData.liveUrl,
        progress: Number(formData.progress),
        color: formData.color,
        startDate: formData.startDate,
        targetDate: formData.targetDate,
      });
    } else {
      addProject({
        name: formData.name,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        techStack: techArray,
        repositoryUrl: formData.repositoryUrl,
        liveUrl: formData.liveUrl,
        color: formData.color,
      });
    }

    setIsCreateModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project and its related data?")) {
      deleteProject(id);
      if (editingProject?.id === id) {
        setIsCreateModalOpen(false);
        setEditingProject(null);
      }
    }
  };

  // Icon mapper helper
  const renderProjectIcon = (name: string, color: string = "#10B981") => {
    const n = name.toLowerCase();
    if (n.includes("ielts")) return <GraduationCap className="w-5 h-5" style={{ color }} />;
    if (n.includes("lingua")) return <Languages className="w-5 h-5" style={{ color }} />;
    if (n.includes("ravon") || n.includes("tuning")) return <Car className="w-5 h-5" style={{ color }} />;
    if (n.includes("school") || n.includes("lms")) return <School className="w-5 h-5" style={{ color }} />;
    return <Code2 className="w-5 h-5" style={{ color }} />;
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return "bg-emerald-500/15 text-[#10B981] border-[#10B981]/30";
      case ProjectStatus.PLANNING:
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case ProjectStatus.PAUSED:
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      case ProjectStatus.COMPLETED:
        return "bg-blue-500/15 text-blue-400 border-blue-500/30";
      case ProjectStatus.ARCHIVED:
        return "bg-neutral-500/15 text-neutral-400 border-neutral-500/30";
      default:
        return "bg-emerald-500/15 text-[#10B981] border-[#10B981]/30";
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case Priority.HIGH:
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case Priority.NORMAL:
        return "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
      case Priority.LOW:
        return "text-[#98A69D] bg-[#101915] border-[#25352C]";
      default:
        return "text-[#98A69D] bg-[#101915] border-[#25352C]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter & Action Toolbar */}
      <div className="glass-card rounded-2xl p-4 border border-[#25352C] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#98A69D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, stack, or domain..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#101915] border border-[#25352C] text-xs text-[#F3F7F4] placeholder-[#98A69D] focus:outline-none focus:border-[#10B981]"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["ALL", "ACTIVE", "PLANNING", "PAUSED", "COMPLETED", "ARCHIVED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all shrink-0 ${
                statusFilter === st
                  ? "bg-[#10B981] text-[#080D0B] font-bold shadow-md shadow-[#10B981]/20"
                  : "bg-[#101915] text-[#98A69D] hover:text-[#F3F7F4] border border-[#25352C]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* New Project Button */}
        <button
          onClick={handleOpenCreate}
          className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-lg shadow-[#10B981]/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((proj) => {
          const daysRemaining = proj.targetDate
            ? Math.ceil((new Date(proj.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null;

          return (
            <div
              key={proj.id}
              className="glass-card rounded-3xl p-6 border border-[#25352C] hover:border-[#10B981]/40 transition-all flex flex-col justify-between group bg-gradient-to-b from-[#142019] to-[#101915]"
            >
              <div>
                {/* Header: Icon, Name, Status, Actions */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#101915] border border-[#25352C] flex items-center justify-center group-hover:border-[#10B981]/50 transition-colors shadow-inner">
                      {renderProjectIcon(proj.name, proj.color || "#10B981")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#F3F7F4] group-hover:text-[#10B981] transition-colors">
                          {proj.name}
                        </h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getPriorityBadge(proj.priority)}`}>
                          {proj.priority}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#98A69D]">/{proj.slug}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg border ${getStatusBadge(proj.status)}`}>
                      {proj.status}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="p-1.5 rounded-lg bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-[#10B981] transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-1.5 rounded-lg bg-[#101915] border border-[#25352C] text-[#98A69D] hover:text-red-400 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#98A69D] leading-relaxed mb-4 min-h-[36px]">
                  {proj.description || "No project overview provided."}
                </p>

                {/* Tech Stack */}
                <div className="space-y-1.5 mb-5">
                  <div className="text-[10px] uppercase font-mono text-[#98A69D] tracking-wider">
                    Tech Stack Architecture
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#101915] text-[#98A69D] border border-[#25352C]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress & Timeline */}
              <div className="space-y-4 pt-4 border-t border-[#25352C]">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#98A69D] mb-1.5">
                    <span>Progress Roadmap</span>
                    <span className="text-[#10B981] font-bold">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#101915] rounded-full overflow-hidden border border-[#25352C]">
                    <div
                      className="h-full bg-gradient-to-r from-[#10B981] to-[#059669] rounded-full transition-all duration-300"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Dates & Timeline info */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>
                      {proj.startDate ? new Date(proj.startDate).toLocaleDateString([], { month: "short", day: "numeric" }) : "Started"}
                      {" → "}
                      {proj.targetDate ? new Date(proj.targetDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "Ongoing"}
                    </span>
                  </div>

                  {daysRemaining !== null && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span className={daysRemaining < 0 ? "text-red-400 font-bold" : "text-amber-400"}>
                        {daysRemaining < 0 ? `${Math.abs(daysRemaining)}d overdue` : `${daysRemaining}d left`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Repository and Live URLs */}
                <div className="flex items-center justify-between pt-2 border-t border-[#25352C]/60 text-xs">
                  {proj.repositoryUrl ? (
                    <a
                      href={proj.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#98A69D] hover:text-[#10B981] transition-colors font-mono text-[11px]"
                    >
                      <GitBranch className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{proj.repositoryUrl.replace("https://github.com/", "")}</span>
                    </a>
                  ) : (
                    <span className="text-[#98A69D]/50 text-[11px] font-mono">Private Repo</span>
                  )}

                  {proj.liveUrl ? (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#10B981] hover:underline font-mono text-[11px]"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[#98A69D]/50 text-[11px] font-mono">Staging only</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="glass-card rounded-2xl p-10 border border-[#25352C] text-center space-y-3">
          <Terminal className="w-8 h-8 text-[#98A69D] mx-auto" />
          <h4 className="text-sm font-semibold text-[#F3F7F4]">No projects matching criteria</h4>
          <p className="text-xs text-[#98A69D]">Adjust filters or create a new project above.</p>
        </div>
      )}

      {/* ===================== CREATE / EDIT PROJECT MODAL ===================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl border border-[#25352C] p-6 max-w-lg w-full bg-[#101915] space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#25352C]">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-[#10B981]" />
                <h3 className="text-sm font-semibold text-[#F3F7F4]">
                  {editingProject ? "Edit Project Details" : "Create New Project"}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-[#142019] text-[#98A69D] hover:text-[#F3F7F4]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Aurelius IELTS, Ravon Auto Tuning"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Description / Core Purpose
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly state architecture scope and target value proposition..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value={ProjectStatus.ACTIVE}>Active</option>
                    <option value={ProjectStatus.PLANNING}>Planning</option>
                    <option value={ProjectStatus.PAUSED}>Paused</option>
                    <option value={ProjectStatus.COMPLETED}>Completed</option>
                    <option value={ProjectStatus.ARCHIVED}>Archived</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value={Priority.URGENT}>Urgent</option>
                    <option value={Priority.HIGH}>High</option>
                    <option value={Priority.NORMAL}>Normal</option>
                    <option value={Priority.LOW}>Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="e.g. Next.js 16, TypeScript, Whisper, PostgreSQL"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Repository URL
                  </label>
                  <input
                    type="url"
                    value={formData.repositoryUrl}
                    onChange={(e) => setFormData({ ...formData, repositoryUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Live Site URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://app..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#98A69D] block mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#142019] border border-[#25352C] text-xs text-[#F3F7F4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#98A69D] mb-1">
                  <span>Progress Completion</span>
                  <span className="text-[#10B981] font-bold">{formData.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full accent-[#10B981]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#25352C]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#98A69D] hover:text-[#F3F7F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#10B981] text-[#080D0B] hover:bg-[#059669] transition-all"
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
